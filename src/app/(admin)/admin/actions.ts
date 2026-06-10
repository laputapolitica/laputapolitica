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

  if (etapa === "relevamiento") {
    const { data: activasData, error: activasError } = await supabase
      .from("relevamiento_candidatas")
      .select("titulo, fuente_url, ranking, orden")
      .eq("edicion_id", edicionId)
      .eq("activa", true)
      .order("orden", { ascending: true });

    if (activasError) {
      console.error("Error leyendo activas para promover:", activasError.message);
      return { error: "No se pudo autorizar. Intentá de nuevo." };
    }

    const activas = (activasData ?? []) as {
      titulo: string;
      fuente_url: string | null;
      ranking: number;
      orden: number;
    }[];

    if (activas.length === 0) {
      return { error: "No hay noticias activas para autorizar." };
    }

    const { error: delError } = await supabase
      .from("noticias")
      .delete()
      .eq("edicion_id", edicionId);

    if (delError) {
      console.error("Error limpiando noticias previas:", delError.message);
      return { error: "No se pudo autorizar. Intentá de nuevo." };
    }

    const filas = activas.map((c) => ({
      edicion_id: edicionId,
      orden: c.orden,
      titulo: c.titulo,
      cuerpo: "",
      fuentes_urls: c.fuente_url ? [c.fuente_url] : [],
      metadata: { ranking_original: c.ranking },
    }));

    const { error: insError } = await supabase.from("noticias").insert(filas);

    if (insError) {
      console.error("Error promoviendo noticias:", insError.message);
      return { error: "No se pudo autorizar. Intentá de nuevo." };
    }
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
  orden: number | null;
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
  orden: number | null;
  fuente_url: string | null;
  activa: boolean;
};

export async function getCandidatasRelevamiento(
  edicionId: string,
): Promise<NoticiasRelevamiento> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("relevamiento_candidatas")
    .select("id, titulo, ranking, orden, fuente_url, activa")
    .eq("edicion_id", edicionId);

  if (error) {
    console.error("Error leyendo candidatas del relevamiento:", error.message);
    return { activas: [], descartadas: [] };
  }

  const rows = (data ?? []) as CandidataRow[];

  const activasRows = rows
    .filter((r) => r.activa)
    .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
  const descartadasRows = rows
    .filter((r) => !r.activa)
    .sort((a, b) => a.ranking - b.ranking);

  const toCandidata = (r: CandidataRow): CandidataRelevamiento => ({
    id: r.id,
    titulo: r.titulo,
    ranking: r.ranking,
    orden: r.orden,
    fuente_url: r.fuente_url,
  });

  return {
    activas: activasRows.map(toCandidata),
    descartadas: descartadasRows.map(toCandidata),
  };
}

export type DireccionMover = "subir" | "bajar";

export async function moverCandidata(
  edicionId: string,
  candidataId: string,
  direccion: DireccionMover,
): Promise<AutorizarResult> {
  const supabase = await createClient();

  // Traer las ACTIVAS ordenadas por `orden`.
  const { data, error } = await supabase
    .from("relevamiento_candidatas")
    .select("id, orden")
    .eq("edicion_id", edicionId)
    .eq("activa", true)
    .order("orden", { ascending: true });

  if (error || !data) {
    console.error("Error leyendo candidatas para mover:", error?.message);
    return { error: "No se pudo reordenar. Intentá de nuevo." };
  }

  const activas = data as { id: string; orden: number }[];

  const idx = activas.findIndex((c) => c.id === candidataId);
  if (idx === -1) {
    return { error: "Candidata no encontrada." };
  }

  const vecinoIdx = direccion === "subir" ? idx - 1 : idx + 1;
  if (vecinoIdx < 0 || vecinoIdx >= activas.length) {
    return { success: true }; // ya es la primera/última: no hacer nada
  }

  const actual = activas[idx];
  const vecino = activas[vecinoIdx];

  // Swap de `orden` en 3 pasos (orden temporal negativo para no violar el unique parcial).
  const TEMP = -1;

  let res = await supabase
    .from("relevamiento_candidatas")
    .update({ orden: TEMP })
    .eq("id", actual.id);
  if (res.error) {
    console.error("Error swap orden paso 1:", res.error.message);
    return { error: "No se pudo reordenar. Intentá de nuevo." };
  }

  res = await supabase
    .from("relevamiento_candidatas")
    .update({ orden: actual.orden })
    .eq("id", vecino.id);
  if (res.error) {
    console.error("Error swap orden paso 2:", res.error.message);
    return { error: "No se pudo reordenar. Intentá de nuevo." };
  }

  res = await supabase
    .from("relevamiento_candidatas")
    .update({ orden: vecino.orden })
    .eq("id", actual.id);
  if (res.error) {
    console.error("Error swap orden paso 3:", res.error.message);
    return { error: "No se pudo reordenar. Intentá de nuevo." };
  }

  return { success: true };
}

export async function eliminarCandidata(
  edicionId: string,
  candidataId: string,
): Promise<AutorizarResult> {
  const supabase = await createClient();

  // Traer las ACTIVAS ordenadas por `orden`.
  const { data, error } = await supabase
    .from("relevamiento_candidatas")
    .select("id, orden")
    .eq("edicion_id", edicionId)
    .eq("activa", true)
    .order("orden", { ascending: true });

  if (error || !data) {
    console.error("Error leyendo candidatas para eliminar:", error?.message);
    return { error: "No se pudo eliminar. Intentá de nuevo." };
  }

  const activas = data as { id: string; orden: number }[];

  if (activas.length <= 3) {
    return { error: "Tenés que mantener al menos 3 noticias activas." };
  }

  const objetivo = activas.find((c) => c.id === candidataId);
  if (!objetivo) {
    return { error: "Noticia no encontrada entre las activas." };
  }

  // Las activas que quedan, en su orden actual.
  const restantes = activas.filter((c) => c.id !== candidataId);

  // Paso 1: la objetivo pasa a descartada (activa=false, orden=null). ranking NO se toca.
  let res = await supabase
    .from("relevamiento_candidatas")
    .update({ activa: false, orden: null })
    .eq("id", candidataId);
  if (res.error) {
    console.error("Error eliminar (descartar):", res.error.message);
    return { error: "No se pudo eliminar. Intentá de nuevo." };
  }

  // Paso 2: recompactar `orden` de las restantes a 1..N.
  // Fase A: mandarlas a orden temporal negativo (evita choque con unique parcial).
  for (let i = 0; i < restantes.length; i++) {
    res = await supabase
      .from("relevamiento_candidatas")
      .update({ orden: -(i + 1) })
      .eq("id", restantes[i].id);
    if (res.error) {
      console.error("Error eliminar recompactar fase A:", res.error.message);
      return { error: "No se pudo eliminar. Intentá de nuevo." };
    }
  }
  // Fase B: asignar 1..N definitivo.
  for (let i = 0; i < restantes.length; i++) {
    res = await supabase
      .from("relevamiento_candidatas")
      .update({ orden: i + 1 })
      .eq("id", restantes[i].id);
    if (res.error) {
      console.error("Error eliminar recompactar fase B:", res.error.message);
      return { error: "No se pudo eliminar. Intentá de nuevo." };
    }
  }

  return { success: true };
}

export async function agregarCandidata(
  edicionId: string,
  candidataId: string,
): Promise<AutorizarResult> {
  const supabase = await createClient();

  // Traer las ACTIVAS para contar y saber el último orden.
  const { data, error } = await supabase
    .from("relevamiento_candidatas")
    .select("id, orden")
    .eq("edicion_id", edicionId)
    .eq("activa", true)
    .order("orden", { ascending: true });

  if (error || !data) {
    console.error("Error leyendo candidatas para agregar:", error?.message);
    return { error: "No se pudo agregar. Intentá de nuevo." };
  }

  const activas = data as { id: string; orden: number }[];

  // Validar máximo de 5 activas.
  if (activas.length >= 5) {
    return { error: "Ya tenés 5 noticias activas (el máximo)." };
  }

  // El nuevo orden es el siguiente al último (o 1 si no hay activas).
  const ultimoOrden = activas.length > 0 ? activas[activas.length - 1].orden : 0;
  const nuevoOrden = ultimoOrden + 1;

  // La candidata pasa a activa con ese orden. ranking NO se toca.
  const res = await supabase
    .from("relevamiento_candidatas")
    .update({ activa: true, orden: nuevoOrden })
    .eq("id", candidataId)
    .eq("edicion_id", edicionId);

  if (res.error) {
    console.error("Error agregar candidata:", res.error.message);
    return { error: "No se pudo agregar. Intentá de nuevo." };
  }

  return { success: true };
}
