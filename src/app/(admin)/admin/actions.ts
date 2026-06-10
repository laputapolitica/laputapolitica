"use server";

import { createClient } from "@/lib/supabase/server";
import type { PipelineState, GateStatus, NodeStatus } from "@/components/admin/PipelineDiagram";

type PipelineRow = {
  relevamiento_status: string;
  titulos_status: string;
  portada_status: string;
  ventana_opinion_status: string;
  el_pulso_status: string;
  web_status: string;
  instagram_status: string;
  twitter_status: string;
  publicacion_status: string;
  relevamiento_aprobado_en: string | null;
  titulos_aprobado_en: string | null;
  portada_aprobado_en: string | null;
};

function asNode(value: string): NodeStatus {
  if (value === "running" || value === "done") return value;
  return "pending";
}

function asGate(aprobadoEn: string | null): GateStatus {
  return aprobadoEn ? "approved" : "pending";
}

export type PipelineEnCurso = {
  edicionId: string;
  fecha: string;
  titulo: string;
  state: PipelineState;
} | null;

export async function getPipelineEnCurso(): Promise<PipelineEnCurso> {
  const supabase = await createClient();

  // La edición en curso = la no publicada más reciente.
  const { data: ed, error: edError } = await supabase
    .from("ediciones")
    .select("id, fecha, titulo")
    .neq("estado", "published")
    .order("fecha", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (edError) {
    console.error("Error leyendo edición en curso:", edError.message);
  }
  if (!ed) {
    return null;
  }

  const { data: ps, error: psError } = await supabase
    .from("pipeline_state")
    .select(
      "relevamiento_status, titulos_status, portada_status, ventana_opinion_status, el_pulso_status, web_status, instagram_status, twitter_status, publicacion_status, relevamiento_aprobado_en, titulos_aprobado_en, portada_aprobado_en",
    )
    .eq("edicion_id", ed.id)
    .maybeSingle();

  if (psError) {
    console.error("Error leyendo pipeline_state:", psError.message);
  }
  if (!ps) {
    return null;
  }

  const row = ps as PipelineRow;

  const state: PipelineState = {
    relevamiento: asNode(row.relevamiento_status),
    relevamientoGate: asGate(row.relevamiento_aprobado_en),
    titulosResumenes: asNode(row.titulos_status),
    titulosGate: asGate(row.titulos_aprobado_en),
    portada: asNode(row.portada_status),
    portadaGate: asGate(row.portada_aprobado_en),
    ventanaOpinion: asNode(row.ventana_opinion_status),
    elPulso: asNode(row.el_pulso_status),
    web: asNode(row.web_status),
    instagram: asNode(row.instagram_status),
    twitter: asNode(row.twitter_status),
    publicacion: asNode(row.publicacion_status),
  };

  return { edicionId: ed.id, fecha: ed.fecha, titulo: ed.titulo, state };
}

export type AutorizarEtapa = "relevamiento" | "titulosResumenes" | "portada" | "publicacion";

export type AutorizarResult = {
  error?: string;
  success?: boolean;
};

// Mapea el nodeId del diagrama al prefijo de columna en pipeline_state.
const COLUMNA_APROBACION: Record<AutorizarEtapa, string> = {
  relevamiento: "relevamiento",
  titulosResumenes: "titulos",
  portada: "portada",
  publicacion: "publicacion",
};

export async function autorizarEtapa(
  edicionId: string,
  etapa: AutorizarEtapa,
): Promise<AutorizarResult> {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) {
    return { error: "Tu sesión expiró. Volvé a iniciar sesión." };
  }

  const prefijo = COLUMNA_APROBACION[etapa];
  const update = {
    [`${prefijo}_aprobado_por`]: user.id,
    [`${prefijo}_aprobado_en`]: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("pipeline_state")
    .update(update)
    .eq("edicion_id", edicionId);

  if (error) {
    console.error(`Error autorizando ${etapa}:`, error.message);
    return { error: "No se pudo autorizar. Intentá de nuevo." };
  }

  return { success: true };
}

// ---- Candidatas del relevamiento ----

export type CandidataRelevamiento = {
  id: string;
  titulo: string;
  ranking: number;
  fuente_url: string | null;
};

export type NoticiasRelevamiento = {
  activas: CandidataRelevamiento[];
  descartadas: CandidataRelevamiento[];
};

type CandidataRow = {
  id: string;
  titulo: string;
  ranking: number;
  fuente_url: string | null;
  activa: boolean;
};

export async function getCandidatasRelevamiento(
  edicionId: string,
): Promise<NoticiasRelevamiento> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("relevamiento_candidatas")
    .select("id, titulo, ranking, fuente_url, activa")
    .eq("edicion_id", edicionId)
    .order("ranking", { ascending: true });

  if (error) {
    console.error("Error leyendo candidatas del relevamiento:", error.message);
    return { activas: [], descartadas: [] };
  }

  const rows = (data ?? []) as CandidataRow[];

  const activas: CandidataRelevamiento[] = [];
  const descartadas: CandidataRelevamiento[] = [];

  for (const row of rows) {
    const candidata: CandidataRelevamiento = {
      id: row.id,
      titulo: row.titulo,
      ranking: row.ranking,
      fuente_url: row.fuente_url,
    };
    if (row.activa) {
      activas.push(candidata);
    } else {
      descartadas.push(candidata);
    }
  }

  return { activas, descartadas };
}

export type DireccionMover = "subir" | "bajar";

export async function moverCandidata(
  edicionId: string,
  candidataId: string,
  direccion: DireccionMover,
): Promise<AutorizarResult> {
  const supabase = await createClient();

  // 1. Traer todas las candidatas ACTIVAS de la edición, ordenadas por ranking.
  const { data, error } = await supabase
    .from("relevamiento_candidatas")
    .select("id, ranking")
    .eq("edicion_id", edicionId)
    .eq("activa", true)
    .order("ranking", { ascending: true });

  if (error || !data) {
    console.error("Error leyendo candidatas para mover:", error?.message);
    return { error: "No se pudo reordenar. Intentá de nuevo." };
  }

  const activas = data as { id: string; ranking: number }[];

  // 2. Encontrar la candidata actual y su vecina.
  const idx = activas.findIndex((c) => c.id === candidataId);
  if (idx === -1) {
    return { error: "Candidata no encontrada." };
  }

  const vecinoIdx = direccion === "subir" ? idx - 1 : idx + 1;

  // Si no hay vecino (ya es la primera o la última), no hacer nada (éxito silencioso).
  if (vecinoIdx < 0 || vecinoIdx >= activas.length) {
    return { success: true };
  }

  const actual = activas[idx];
  const vecino = activas[vecinoIdx];

  // 3. Swap de rankings en 3 pasos para no violar unique(edicion_id, ranking).
  // Usamos un ranking temporal negativo que no colisiona con ninguno real.
  const TEMP = -1;

  // 3a. actual -> TEMP
  let res = await supabase
    .from("relevamiento_candidatas")
    .update({ ranking: TEMP })
    .eq("id", actual.id);
  if (res.error) {
    console.error("Error swap paso 1:", res.error.message);
    return { error: "No se pudo reordenar. Intentá de nuevo." };
  }

  // 3b. vecino -> ranking de actual
  res = await supabase
    .from("relevamiento_candidatas")
    .update({ ranking: actual.ranking })
    .eq("id", vecino.id);
  if (res.error) {
    console.error("Error swap paso 2:", res.error.message);
    return { error: "No se pudo reordenar. Intentá de nuevo." };
  }

  // 3c. actual (en TEMP) -> ranking del vecino
  res = await supabase
    .from("relevamiento_candidatas")
    .update({ ranking: vecino.ranking })
    .eq("id", actual.id);
  if (res.error) {
    console.error("Error swap paso 3:", res.error.message);
    return { error: "No se pudo reordenar. Intentá de nuevo." };
  }

  return { success: true };
}
