"use server";

import { createClient } from "@/lib/supabase/server";

export type PaisConfig = {
  codigo: string;
  nombre: string;
  pipelineActivo: boolean;
};

export async function getPaisesConfig(): Promise<PaisConfig[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("paises")
    .select("codigo, nombre, pipeline_activo, orden, activo")
    .eq("activo", true)
    .order("orden", { ascending: true });

  if (error) {
    console.error("Error leyendo paises:", error.message);
    return [];
  }

  return ((data ?? []) as {
    codigo: string;
    nombre: string;
    pipeline_activo: boolean;
  }[]).map((p) => ({
    codigo: p.codigo,
    nombre: p.nombre,
    pipelineActivo: p.pipeline_activo,
  }));
}

export type ConfigResult = { error?: string; success?: boolean };

export async function setPipelineActivo(
  codigo: string,
  activo: boolean,
): Promise<ConfigResult> {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const caller = userData.user;
  if (!caller) {
    return { error: "Tu sesión expiró. Volvé a iniciar sesión." };
  }

  // Solo el admin operador (global) puede tocar el interruptor.
  const { data: perfil } = await supabase
    .from("profiles")
    .select("role, es_global")
    .eq("id", caller.id)
    .maybeSingle();
  if (!perfil || perfil.role !== "admin" || !perfil.es_global) {
    return { error: "Solo el admin operador puede cambiar el interruptor." };
  }

  const { error } = await supabase
    .from("paises")
    .update({ pipeline_activo: activo })
    .eq("codigo", codigo);

  if (error) {
    console.error("Error actualizando pipeline_activo:", error.message);
    return { error: "No se pudo actualizar. Intentá de nuevo." };
  }

  return { success: true };
}
