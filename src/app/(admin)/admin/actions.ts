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
