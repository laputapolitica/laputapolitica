"use server";

import { Buffer } from "node:buffer";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
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
  el_pulso_aprobado_en: string | null;
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
      "relevamiento_status, titulos_status, portada_status, ventana_opinion_status, el_pulso_status, web_status, instagram_status, twitter_status, publicacion_status, relevamiento_aprobado_en, titulos_aprobado_en, portada_aprobado_en, el_pulso_aprobado_en",
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
    elPulsoGate: asGate(row.el_pulso_aprobado_en),
    web: asNode(row.web_status),
    instagram: asNode(row.instagram_status),
    twitter: asNode(row.twitter_status),
    publicacion: asNode(row.publicacion_status),
  };

  return { edicionId: ed.id, fecha: ed.fecha, titulo: ed.titulo, state };
}

export type AutorizarEtapa = "relevamiento" | "titulosResumenes" | "portada" | "publicacion" | "elPulso";

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
  elPulso: "el_pulso",
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
  const ahora = new Date();
  const update: Record<string, string> = {
    [`${prefijo}_aprobado_por`]: user.id,
    [`${prefijo}_aprobado_en`]: ahora.toISOString(),
  };

  // Al autorizar Títulos y Resúmenes se abre la Ventana de Opinión (en paralelo
  // con Portada). Dura 1.5 horas (90 minutos) desde la apertura.
  if (etapa === "titulosResumenes") {
    const cierra = new Date(ahora.getTime() + 90 * 60 * 1000);
    update.ventana_opinion_status = "running";
    update.ventana_opinion_abierta_en = ahora.toISOString();
    update.ventana_opinion_cierra_en = cierra.toISOString();
  }

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

export type NoticiaTituloResumen = {
  id: string;
  titulo: string;
  resumen: string;
  fuentes: { nombre: string; url: string }[];
};

function nombreFuenteDesdeUrl(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    // ej. "infobae.com" -> "Infobae"; "lanacion.com.ar" -> "Lanacion"
    const base = host.split(".")[0];
    return base.charAt(0).toUpperCase() + base.slice(1);
  } catch {
    return "Fuente";
  }
}

export async function getNoticiasTitulosResumenes(
  edicionId: string,
): Promise<NoticiaTituloResumen[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("noticias")
    .select("id, titulo, cuerpo, fuentes_urls, orden")
    .eq("edicion_id", edicionId)
    .order("orden", { ascending: true });

  if (error) {
    console.error("Error leyendo noticias para títulos/resúmenes:", error.message);
    return [];
  }

  type NoticiaRow = {
    id: string;
    titulo: string;
    cuerpo: string;
    fuentes_urls: string[] | null;
    orden: number;
  };

  const rows = (data ?? []) as NoticiaRow[];

  return rows.map((r) => ({
    id: r.id,
    titulo: r.titulo,
    resumen: r.cuerpo ?? "",
    fuentes: (r.fuentes_urls ?? []).map((url) => ({
      nombre: nombreFuenteDesdeUrl(url),
      url,
    })),
  }));
}

export async function guardarTituloResumen(
  noticiaId: string,
  campo: "titulo" | "resumen",
  valor: string,
): Promise<AutorizarResult> {
  const supabase = await createClient();

  // El panel usa "resumen", pero en la base la columna se llama "cuerpo".
  const columna = campo === "resumen" ? "cuerpo" : "titulo";

  const { error } = await supabase
    .from("noticias")
    .update({ [columna]: valor })
    .eq("id", noticiaId);

  if (error) {
    console.error("Error guardando título/resumen:", error.message);
    return { error: "No se pudo guardar. Intentá de nuevo." };
  }

  return { success: true };
}

type RehacerResult = {
  error?: string;
  valor?: string;
};

type GroqChatCompletionResponse = {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
};

export async function rehacerCampo(
  noticiaId: string,
  campo: "titulo" | "resumen",
): Promise<RehacerResult> {
  const supabase = await createClient();

  // 1. Leer el texto de la(s) fuente(s) de la noticia.
  const { data, error } = await supabase
    .from("noticias")
    .select("textos_fuentes")
    .eq("id", noticiaId)
    .maybeSingle();

  if (error || !data) {
    console.error("Error leyendo textos_fuentes:", error?.message);
    return { error: "No se pudo leer la fuente. Intentá de nuevo." };
  }

  type FuenteTexto = { url: string; texto: string };
  const fuentes = (data.textos_fuentes ?? []) as FuenteTexto[];

  if (fuentes.length === 0 || !fuentes.some((f) => f.texto)) {
    return { error: "Esta noticia no tiene el texto de la fuente guardado. No se puede rehacer." };
  }

  // Concatenar los textos de todas las fuentes (preparado para multi-fuente).
  const textoFuentes = fuentes
    .filter((f) => f.texto)
    .map((f) => f.texto)
    .join("\n\n---\n\n");

  // 2. Armar el prompt según el campo a regenerar.
  const instruccionCampo =
    campo === "titulo"
      ? 'Generá UN nuevo TÍTULO editorial (una sola línea, máximo 12 palabras, informativo y con carácter, sin clickbait). Devolvé SOLAMENTE un objeto JSON con la forma {"valor": "..."} y nada más.'
      : 'Generá UN nuevo CUERPO/RESUMEN: un solo párrafo de 3 a 5 oraciones (entre 60 y 90 palabras) que cubra lo esencial de la nota. Devolvé SOLAMENTE un objeto JSON con la forma {"valor": "..."} y nada más.';

  const prompt =
    "Sos editor de un medio de noticias políticas argentino para jóvenes, con un estilo editorial serio pero con carácter (estilo The Economist).\n\n" +
    instruccionCampo +
    "\n\nIgnorá cualquier texto promocional del diario que no sea parte de la noticia.\n\nTexto de la nota:\n" +
    textoFuentes;

  // 3. Llamar a Groq.
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("Falta GROQ_API_KEY en el entorno.");
    return { error: "Configuración incompleta del servidor." };
  }

  try {
    const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });

    if (!resp.ok) {
      console.error("Groq respondió con error:", resp.status);
      return { error: "La IA no respondió bien. Probá de nuevo en unos segundos." };
    }

    const json = (await resp.json()) as GroqChatCompletionResponse;
    const content = json.choices?.[0]?.message?.content;
    if (!content) {
      return { error: "La IA devolvió una respuesta vacía. Probá de nuevo." };
    }

    const parsed = JSON.parse(content) as { valor?: string };
    if (!parsed.valor) {
      return { error: "La IA no devolvió el campo esperado. Probá de nuevo." };
    }

    return { valor: parsed.valor };
  } catch (e) {
    console.error("Error llamando a Groq:", e);
    return { error: "Hubo un problema al regenerar. Probá de nuevo." };
  }
}

export type PortadaVigente = {
  id: string;
  imagenUrl: string;
  titulo: string;
} | null;

export async function getPortadaVigente(
  edicionId: string,
): Promise<PortadaVigente> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("portadas")
    .select("id, imagen_url, titulo")
    .eq("edicion_id", edicionId)
    .eq("vigente", true)
    .maybeSingle();

  if (error) {
    console.error("Error leyendo portada vigente:", error.message);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id,
    imagenUrl: data.imagen_url,
    titulo: data.titulo,
  };
}

export async function guardarTituloPortada(
  portadaId: string,
  titulo: string,
): Promise<AutorizarResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("portadas")
    .update({ titulo })
    .eq("id", portadaId);

  if (error) {
    console.error("Error guardando título de portada:", error.message);
    return { error: "No se pudo guardar el título. Intentá de nuevo." };
  }

  return { success: true };
}

export async function subirPortadaManual(
  edicionId: string,
  formData: FormData,
): Promise<AutorizarResult> {
  const file = formData.get("imagen");

  if (!file || !(file instanceof File) || file.size === 0) {
    return { error: "No se recibió ninguna imagen." };
  }

  // Validación básica de tipo.
  if (!file.type.startsWith("image/")) {
    return { error: "El archivo debe ser una imagen." };
  }

  const admin = createAdminClient();

  // 1. Subir la imagen a Storage con un nombre único.
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${edicionId}_${Date.now()}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  const { error: uploadError } = await admin.storage
    .from("portadas")
    .upload(path, bytes, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    console.error("Error subiendo portada manual:", uploadError.message);
    return { error: "No se pudo subir la imagen. Intentá de nuevo." };
  }

  // 2. Armar la URL pública.
  const { data: publicData } = admin.storage
    .from("portadas")
    .getPublicUrl(path);
  const imagenUrl = publicData.publicUrl;

  // 3. Desmarcar la portada vigente anterior (si hay).
  const { error: unsetError } = await admin
    .from("portadas")
    .update({ vigente: false })
    .eq("edicion_id", edicionId)
    .eq("vigente", true);

  if (unsetError) {
    console.error("Error desmarcando portada vigente:", unsetError.message);
    return { error: "No se pudo actualizar la portada. Intentá de nuevo." };
  }

  // 4. Insertar la nueva portada como vigente.
  const { error: insertError } = await admin.from("portadas").insert({
    edicion_id: edicionId,
    imagen_url: imagenUrl,
    prompt: "",
    estilo_id: null,
    origen: "manual",
    vigente: true,
    titulo: "",
  });

  if (insertError) {
    console.error("Error insertando portada manual:", insertError.message);
    return { error: "No se pudo guardar la portada. Intentá de nuevo." };
  }

  return { success: true };
}

export type PortadaHistorial = {
  id: string;
  imagenUrl: string;
  titulo: string;
  origen: string;
  vigente: boolean;
  createdAt: string;
};

export async function getHistorialPortadas(
  edicionId: string,
): Promise<PortadaHistorial[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("portadas")
    .select("id, imagen_url, titulo, origen, vigente, created_at")
    .eq("edicion_id", edicionId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error leyendo historial de portadas:", error.message);
    return [];
  }

  return (data ?? []).map((r) => ({
    id: r.id,
    imagenUrl: r.imagen_url,
    titulo: r.titulo,
    origen: r.origen,
    vigente: r.vigente,
    createdAt: r.created_at,
  }));
}

export async function restaurarPortada(
  edicionId: string,
  portadaId: string,
): Promise<AutorizarResult> {
  const admin = createAdminClient();

  // Desmarcar la vigente actual.
  const { error: unsetError } = await admin
    .from("portadas")
    .update({ vigente: false })
    .eq("edicion_id", edicionId)
    .eq("vigente", true);

  if (unsetError) {
    console.error("Error desmarcando vigente:", unsetError.message);
    return { error: "No se pudo restaurar. Intentá de nuevo." };
  }

  // Marcar la elegida como vigente.
  const { error: setError } = await admin
    .from("portadas")
    .update({ vigente: true })
    .eq("id", portadaId)
    .eq("edicion_id", edicionId);

  if (setError) {
    console.error("Error marcando vigente:", setError.message);
    return { error: "No se pudo restaurar. Intentá de nuevo." };
  }

  return { success: true };
}

type GeminiTextResponse = {
  candidates?: {
    content?: {
      parts?: {
        text?: string;
      }[];
    };
  }[];
};

type GeminiImageResponse = {
  candidates?: {
    content?: {
      parts?: {
        inlineData?: {
          data?: string;
        };
        inline_data?: {
          data?: string;
        };
      }[];
    };
  }[];
};

async function generarPortadaCore(
  edicionId: string,
  estiloId: string,
): Promise<AutorizarResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Falta GEMINI_API_KEY.");
    return { error: "Configuración incompleta del servidor." };
  }

  const supabase = await createClient();
  const admin = createAdminClient();

  // 1. Leer noticias de la edición.
  const { data: noticiasData, error: noticiasError } = await supabase
    .from("noticias")
    .select("orden, titulo, cuerpo")
    .eq("edicion_id", edicionId)
    .order("orden", { ascending: true });

  if (noticiasError || !noticiasData || noticiasData.length === 0) {
    console.error("Error leyendo noticias:", noticiasError?.message);
    return { error: "No se pudieron leer las noticias." };
  }

  const textoNoticias = noticiasData
    .map((n, i) => `${i + 1}. ${n.titulo}\n${n.cuerpo}`)
    .join("\n\n");

  // 2. Leer el estilo elegido.
  const { data: estilo, error: estiloError } = await supabase
    .from("estilos_portada")
    .select("id, nombre, imagen_url")
    .eq("id", estiloId)
    .maybeSingle();

  if (estiloError || !estilo) {
    console.error("Error leyendo estilo:", estiloError?.message);
    return { error: "No se encontró el estilo." };
  }

  try {
    // 3. Descargar la imagen de referencia y convertir a base64.
    const refResp = await fetch(estilo.imagen_url);
    if (!refResp.ok) return { error: "No se pudo leer la imagen de referencia." };
    const refBuffer = await refResp.arrayBuffer();
    const refBase64 = Buffer.from(refBuffer).toString("base64");
    const refMime = refResp.headers.get("content-type") || "image/jpeg";

    // 4. Razonadora: Gemini mira la referencia + noticias y arma el prompt.
    const promptRazonadora =
      "Sos director de arte de un medio político argentino. Te muestro una imagen de referencia que define un LENGUAJE VISUAL (técnica, composición, paleta, cómo se representan los objetos). Observá ese lenguaje visual y creá un PROMPT en inglés para un generador de imágenes, que produzca una portada para hoy representando estas noticias argentinas usando ESE mismo lenguaje visual. NO incluyas texto ni palabras dentro de la imagen; que sea puramente visual y simbólica.\n\nNoticias de hoy:\n" +
      textoNoticias +
      "\n\nDevolvé SOLAMENTE el prompt en inglés, sin explicar nada más.";

    const razResp = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: promptRazonadora },
                { inline_data: { mime_type: refMime, data: refBase64 } },
              ],
            },
          ],
        }),
      },
    );

    if (!razResp.ok) {
      console.error("Razonadora falló:", razResp.status);
      return { error: "La IA no pudo analizar el estilo. Probá de nuevo." };
    }

    const razJson = (await razResp.json()) as GeminiTextResponse;
    let promptImagen = razJson.candidates?.[0]?.content?.parts?.[0]?.text || "";
    promptImagen = promptImagen.replace(/\*\*/g, "").trim();
    if (!promptImagen) return { error: "La IA no generó un prompt. Probá de nuevo." };

    // 5. Generadora: Nano Banana genera la imagen.
    const genResp = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptImagen }] }],
        }),
      },
    );

    if (!genResp.ok) {
      console.error("Generadora falló:", genResp.status);
      return { error: "La IA no pudo generar la imagen. Probá de nuevo." };
    }

    const genJson = (await genResp.json()) as GeminiImageResponse;
    const parts = genJson.candidates?.[0]?.content?.parts || [];
    const imgPart = parts.find(
      (p: { inlineData?: { data?: string }; inline_data?: { data?: string } }) =>
        p.inlineData?.data || p.inline_data?.data,
    );
    const imgBase64 = imgPart?.inlineData?.data || imgPart?.inline_data?.data;
    if (!imgBase64) return { error: "La IA no devolvió una imagen. Probá de nuevo." };

    // 6. Subir la imagen a Storage.
    const bytes = Buffer.from(imgBase64, "base64");
    const path = `${edicionId}_${Date.now()}.jpg`;

    const { error: uploadError } = await admin.storage
      .from("portadas")
      .upload(path, bytes, { contentType: "image/jpeg", upsert: true });

    if (uploadError) {
      console.error("Error subiendo portada:", uploadError.message);
      return { error: "No se pudo guardar la imagen. Probá de nuevo." };
    }

    const { data: publicData } = admin.storage.from("portadas").getPublicUrl(path);
    const imagenUrl = publicData.publicUrl;

    // 7. Desmarcar vigente anterior e insertar la nueva.
    await admin
      .from("portadas")
      .update({ vigente: false })
      .eq("edicion_id", edicionId)
      .eq("vigente", true);

    const { error: insertError } = await admin.from("portadas").insert({
      edicion_id: edicionId,
      imagen_url: imagenUrl,
      prompt: promptImagen,
      estilo_id: estiloId,
      origen: "ia",
      vigente: true,
      titulo: "",
    });

    if (insertError) {
      console.error("Error insertando portada:", insertError.message);
      return { error: "No se pudo guardar la portada. Probá de nuevo." };
    }

    return { success: true };
  } catch (e) {
    console.error("Error generando portada:", e);
    return { error: "Hubo un problema al regenerar. Probá de nuevo." };
  }
}

export type OpcionRehacer =
  | { tipo: "mismo" }
  | { tipo: "ia_elige" }
  | { tipo: "elegir"; estiloId: string };

export async function rehacerPortada(
  edicionId: string,
  opcion: OpcionRehacer,
): Promise<AutorizarResult> {
  const supabase = await createClient();

  // Estilo de la portada vigente actual (para "mismo" y para excluir en "ia_elige").
  const { data: vigente } = await supabase
    .from("portadas")
    .select("estilo_id")
    .eq("edicion_id", edicionId)
    .eq("vigente", true)
    .maybeSingle();

  const estiloActual = vigente?.estilo_id ?? null;

  let estiloId: string | null = null;

  if (opcion.tipo === "elegir") {
    estiloId = opcion.estiloId;
  } else if (opcion.tipo === "mismo") {
    if (!estiloActual) {
      return { error: "La portada actual no tiene un estilo asociado. Probá 'elegir diseño'." };
    }
    estiloId = estiloActual;
  } else {
    // ia_elige: leer estilos activos y pedirle a Groq que elija uno distinto al actual.
    const { data: estilos, error: estilosError } = await supabase
      .from("estilos_portada")
      .select("id, nombre, descripcion")
      .eq("activo", true);

    if (estilosError || !estilos || estilos.length === 0) {
      return { error: "No hay estilos disponibles en el banco." };
    }

    // Candidatos: excluir el actual si hay más de uno.
    const candidatos =
      estilos.length > 1 && estiloActual
        ? estilos.filter((e) => e.id !== estiloActual)
        : estilos;

    if (candidatos.length === 1) {
      estiloId = candidatos[0].id;
    } else {
      // Leer noticias para que la elección tenga contexto.
      const { data: noticiasData } = await supabase
        .from("noticias")
        .select("orden, titulo, cuerpo")
        .eq("edicion_id", edicionId)
        .order("orden", { ascending: true });

      const textoNoticias = (noticiasData ?? [])
        .map((n, i) => `${i + 1}. ${n.titulo}\n${n.cuerpo}`)
        .join("\n\n");

      const menu = candidatos
        .map((e) => `ID: ${e.id}\nNombre: ${e.nombre}\nCuándo usarlo: ${e.descripcion}`)
        .join("\n\n");

      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) return { error: "Configuración incompleta del servidor." };

      try {
        const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
            messages: [
              {
                role: "user",
                content:
                  "Elegí el estilo de portada que mejor encaje con las noticias de hoy.\n\nESTILOS:\n" +
                  menu +
                  "\n\nNOTICIAS:\n" +
                  textoNoticias +
                  '\n\nDevolvé SOLO un JSON {"estilo_id": "el-id-elegido"} y nada más.',
              },
            ],
          }),
        });

        if (!resp.ok) return { error: "La IA no pudo elegir un estilo. Probá de nuevo." };
        const json = (await resp.json()) as GroqChatCompletionResponse;
        const content = json.choices?.[0]?.message?.content;
        if (!content) return { error: "La IA no pudo elegir un estilo. Probá de nuevo." };
        const parsed = JSON.parse(content) as { estilo_id?: string };
        estiloId = parsed.estilo_id ?? null;
      } catch (e) {
        console.error("Error eligiendo estilo:", e);
        return { error: "La IA no pudo elegir un estilo. Probá de nuevo." };
      }

      // Validar que el id elegido esté entre los candidatos.
      if (!candidatos.some((c) => c.id === estiloId)) {
        estiloId = candidatos[0].id;
      }
    }
  }

  if (!estiloId) {
    return { error: "No se pudo determinar el estilo. Intentá de nuevo." };
  }

  return await generarPortadaCore(edicionId, estiloId);
}

export async function rehacerTituloPortada(edicionId: string): Promise<AutorizarResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("Falta GROQ_API_KEY.");
    return { error: "Configuración incompleta del servidor." };
  }

  const supabase = await createClient();
  const admin = createAdminClient();

  // Buscar la portada vigente.
  const { data: vigente, error: vigenteError } = await supabase
    .from("portadas")
    .select("id")
    .eq("edicion_id", edicionId)
    .eq("vigente", true)
    .maybeSingle();

  if (vigenteError || !vigente) {
    return { error: "No hay una portada vigente para esta edición." };
  }

  // Leer noticias para el contexto.
  const { data: noticiasData } = await supabase
    .from("noticias")
    .select("orden, titulo, cuerpo")
    .eq("edicion_id", edicionId)
    .order("orden", { ascending: true });

  const textoNoticias = (noticiasData ?? [])
    .map((n, i) => `${i + 1}. ${n.titulo}\n${n.cuerpo}`)
    .join("\n\n");

  // Generar el título con Groq.
  let nuevoTitulo = "";
  try {
    const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 1.3,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "user",
            content:
              "Sos editor de un medio político argentino. Generá 5 títulos de tapa DISTINTOS entre sí, cortos y conceptuales (entre 2 y 6 palabras cada uno), con carácter editorial, que capten el clima del día a partir de estas noticias. No son resúmenes ni listan las noticias: son ganchos conceptuales, como títulos de tapa de revista. Que sean variados: distintos ángulos (tensión, ironía, trasfondo, clima emocional). Sin comillas.\n\nNoticias de hoy:\n" +
              textoNoticias +
              '\n\nDevolvé SOLAMENTE un objeto JSON con la forma {"titulos": ["...", "...", "...", "...", "..."]} y nada más.',
          },
        ],
      }),
    });

    if (!resp.ok) return { error: "La IA no pudo generar el título. Probá de nuevo." };
    const json = await resp.json();
    const parsed = JSON.parse(json.choices[0].message.content);
    const opciones = Array.isArray(parsed.titulos)
      ? parsed.titulos.filter((t: unknown) => typeof t === "string" && t.trim().length > 0)
      : [];
    if (opciones.length === 0) return { error: "La IA no devolvió títulos. Probá de nuevo." };
    nuevoTitulo = opciones[Math.floor(Math.random() * opciones.length)];
  } catch (e) {
    console.error("Error generando título de portada:", e);
    return { error: "La IA no pudo generar el título. Probá de nuevo." };
  }

  if (!nuevoTitulo) return { error: "La IA no devolvió un título. Probá de nuevo." };

  // Guardar el nuevo título en la portada vigente.
  const { error: updateError } = await admin
    .from("portadas")
    .update({ titulo: nuevoTitulo })
    .eq("id", vigente.id);

  if (updateError) {
    console.error("Error guardando título regenerado:", updateError.message);
    return { error: "No se pudo guardar el título. Probá de nuevo." };
  }

  return { success: true };
}

export type EstiloBanco = {
  id: string;
  nombre: string;
  imagenUrl: string;
};

export async function getEstilosBanco(): Promise<EstiloBanco[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("estilos_portada")
    .select("id, nombre, imagen_url")
    .eq("activo", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error leyendo estilos del banco:", error.message);
    return [];
  }

  return (data ?? []).map((e) => ({
    id: e.id,
    nombre: e.nombre,
    imagenUrl: e.imagen_url,
  }));
}

export type EstadoVentanaOpinion = {
  status: "pending" | "running" | "done";
  cierraEn: string | null;
  totalOpinadores: number;
  participantes: number;
};

export async function getEstadoVentanaOpinion(
  edicionId: string,
): Promise<EstadoVentanaOpinion> {
  const supabase = await createClient();

  // Estado de la ventana.
  const { data: ps } = await supabase
    .from("pipeline_state")
    .select("ventana_opinion_status, ventana_opinion_cierra_en")
    .eq("edicion_id", edicionId)
    .maybeSingle();

  const status = (ps?.ventana_opinion_status ?? "pending") as "pending" | "running" | "done";
  const cierraEn = ps?.ventana_opinion_cierra_en ?? null;

  // Total de opinadores activos.
  const { count: totalOpinadores } = await supabase
    .from("opinadores")
    .select("id", { count: "exact", head: true })
    .eq("activo", true);

  // IDs de las noticias de la edición.
  const { data: noticias } = await supabase
    .from("noticias")
    .select("id")
    .eq("edicion_id", edicionId);

  const noticiaIds = (noticias ?? []).map((n) => n.id);

  // Participantes: opinadores distintos con al menos una opinión en esas noticias.
  let participantes = 0;
  if (noticiaIds.length > 0) {
    const { data: ops } = await supabase
      .from("opiniones")
      .select("opinador_id")
      .in("noticia_id", noticiaIds);

    const distintos = new Set((ops ?? []).map((o) => o.opinador_id));
    participantes = distintos.size;
  }

  return {
    status,
    cierraEn,
    totalOpinadores: totalOpinadores ?? 0,
    participantes,
  };
}

export type NoticiaElPulso = {
  id: string;
  orden: number;
  titulo: string;
  resumen: string;
  resumenNoticia: string;
  pctPositiva: number;
  pctNegativa: number;
  pctIncierta: number;
  totalOpiniones: number;
  totalOpinadores: number;
};

export async function getNoticiasElPulso(
  edicionId: string,
): Promise<NoticiaElPulso[]> {
  const supabase = await createClient();

  // Noticias de la edición (ordenadas).
  const { data: noticiasData, error: noticiasError } = await supabase
    .from("noticias")
    .select("id, titulo, orden, cuerpo")
    .eq("edicion_id", edicionId)
    .order("orden", { ascending: true });

  if (noticiasError) {
    console.error("Error leyendo noticias para El Pulso:", noticiasError.message);
    return [];
  }

  type NoticiaRow = { id: string; titulo: string; orden: number; cuerpo: string };
  const noticias = (noticiasData ?? []) as NoticiaRow[];

  if (noticias.length === 0) return [];

  // Filas de el_pulso_noticia de esas noticias.
  const noticiaIds = noticias.map((n) => n.id);
  const { data: pulsoData, error: pulsoError } = await supabase
    .from("el_pulso_noticia")
    .select(
      "noticia_id, texto_resumen, pct_positiva, pct_negativa, pct_incierta, total_opiniones",
    )
    .in("noticia_id", noticiaIds);

  if (pulsoError) {
    console.error("Error leyendo el_pulso_noticia:", pulsoError.message);
  }

  type PulsoRow = {
    noticia_id: string;
    texto_resumen: string | null;
    pct_positiva: number;
    pct_negativa: number;
    pct_incierta: number;
    total_opiniones: number;
  };
  const pulso = (pulsoData ?? []) as PulsoRow[];
  const pulsoPorNoticia = new Map(pulso.map((p) => [p.noticia_id, p]));

  const { count: totalOpinadores } = await supabase
    .from("opinadores")
    .select("id", { count: "exact", head: true })
    .eq("activo", true);

  return noticias.map((n) => {
    const p = pulsoPorNoticia.get(n.id);
    return {
      id: n.id,
      orden: n.orden,
      titulo: n.titulo,
      resumen: p?.texto_resumen ?? "",
      resumenNoticia: n.cuerpo ?? "",
      pctPositiva: p?.pct_positiva ?? 0,
      pctNegativa: p?.pct_negativa ?? 0,
      pctIncierta: p?.pct_incierta ?? 0,
      totalOpiniones: p?.total_opiniones ?? 0,
      totalOpinadores: totalOpinadores ?? 0,
    };
  });
}

export async function guardarResumenElPulso(
  noticiaId: string,
  valor: string,
): Promise<AutorizarResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("el_pulso_noticia")
    .update({ texto_resumen: valor })
    .eq("noticia_id", noticiaId);

  if (error) {
    console.error("Error guardando resumen de El Pulso:", error.message);
    return { error: "No se pudo guardar. Intentá de nuevo." };
  }

  return { success: true };
}

export async function rehacerResumenElPulso(
  noticiaId: string,
): Promise<AutorizarResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("Falta GROQ_API_KEY.");
    return { error: "Configuración incompleta del servidor." };
  }

  const supabase = await createClient();

  // Leer las opiniones de la noticia.
  const { data: opinionesData, error: opinionesError } = await supabase
    .from("opiniones")
    .select("texto, sentiment")
    .eq("noticia_id", noticiaId);

  if (opinionesError) {
    console.error("Error leyendo opiniones para rehacer pulso:", opinionesError.message);
    return { error: "No se pudieron leer las opiniones." };
  }

  type OpinionRow = {
    texto: string;
    sentiment: "positiva" | "negativa" | "incierta";
  };
  const opiniones = (opinionesData ?? []) as OpinionRow[];

  if (opiniones.length === 0) {
    return { error: "Esta noticia no tiene opiniones para resumir." };
  }

  // Consolidar las opiniones en un texto.
  const textoOpiniones = opiniones
    .map((o, i) => `Opinión ${i + 1} (voto: ${o.sentiment}): ${o.texto}`)
    .join("\n\n");

  const prompt =
    "Sos analista de un medio político argentino. A continuación tenés las opiniones que dejó una comunidad de lectores jóvenes sobre una noticia del día, cada una con su voto (positiva, negativa o incierta). Tu tarea es escribir un RESUMEN BREVE (2 a 4 oraciones) que sintetice qué pensó la comunidad: las posturas principales, y si hubo acuerdo o división. Tono neutral y descriptivo, fiel a lo que se opinó. No inventes posturas que no estén. No uses comillas.\n\nOpiniones de la comunidad:\n" +
    textoOpiniones +
    '\n\nDevolvé SOLAMENTE un objeto JSON con la forma {"resumen": "..."} y nada más.';

  let resumen = "";
  try {
    const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!resp.ok) return { error: "No se pudo generar el resumen. Intentá de nuevo." };
    const json = await resp.json();
    const parsed = JSON.parse(json.choices[0].message.content);
    resumen = typeof parsed.resumen === "string" ? parsed.resumen.trim() : "";
  } catch (e) {
    console.error("Error llamando a Groq para rehacer pulso:", e);
    return { error: "No se pudo generar el resumen. Intentá de nuevo." };
  }

  if (!resumen) {
    return { error: "El resumen generado vino vacío. Intentá de nuevo." };
  }

  // Guardar el nuevo resumen en el_pulso_noticia.
  const { error: updateError } = await supabase
    .from("el_pulso_noticia")
    .update({ texto_resumen: resumen })
    .eq("noticia_id", noticiaId);

  if (updateError) {
    console.error("Error guardando resumen de pulso:", updateError.message);
    return { error: "No se pudo guardar el resumen." };
  }

  return { success: true };
}
