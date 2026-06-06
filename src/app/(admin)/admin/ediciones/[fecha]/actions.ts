"use server";

import { createClient } from "@/lib/supabase/server";

export type GuardarResult = {
  error?: string;
  success?: boolean;
};

async function requireStaff() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user ? supabase : null;
}

export async function guardarTituloNoticia(
  noticiaId: string,
  titulo: string,
): Promise<GuardarResult> {
  const supabase = await requireStaff();
  if (!supabase) return { error: "Tu sesión expiró." };

  const { error } = await supabase
    .from("noticias")
    .update({ titulo })
    .eq("id", noticiaId);

  if (error) {
    console.error("Error guardando título de noticia:", error.message);
    return { error: "No se pudo guardar el título." };
  }
  return { success: true };
}

export async function guardarResumenNoticia(
  noticiaId: string,
  cuerpo: string,
): Promise<GuardarResult> {
  const supabase = await requireStaff();
  if (!supabase) return { error: "Tu sesión expiró." };

  const { error } = await supabase
    .from("noticias")
    .update({ cuerpo })
    .eq("id", noticiaId);

  if (error) {
    console.error("Error guardando resumen de noticia:", error.message);
    return { error: "No se pudo guardar el resumen." };
  }
  return { success: true };
}

export async function guardarPulsoNoticia(
  noticiaId: string,
  textoResumen: string,
): Promise<GuardarResult> {
  const supabase = await requireStaff();
  if (!supabase) return { error: "Tu sesión expiró." };

  const { error } = await supabase
    .from("el_pulso_noticia")
    .update({ texto_resumen: textoResumen })
    .eq("noticia_id", noticiaId);

  if (error) {
    console.error("Error guardando El Pulso:", error.message);
    return { error: "No se pudo guardar el texto de El Pulso." };
  }
  return { success: true };
}

export async function guardarTituloEdicion(
  edicionId: string,
  titulo: string,
): Promise<GuardarResult> {
  const supabase = await requireStaff();
  if (!supabase) return { error: "Tu sesión expiró." };

  const { error } = await supabase
    .from("ediciones")
    .update({ titulo })
    .eq("id", edicionId);

  if (error) {
    console.error("Error guardando título de edición:", error.message);
    return { error: "No se pudo guardar el título." };
  }
  return { success: true };
}
