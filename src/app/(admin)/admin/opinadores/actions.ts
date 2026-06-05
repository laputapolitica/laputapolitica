"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Postulacion } from "@/types/admin";

type PostulacionRow = {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  provincia: string;
  edad: number;
  motivacion: string;
  estado: string;
  created_at: string;
};

function mapEstado(estado: string): Postulacion["estado"] {
  return estado === "rejected" ? "rechazado" : "pendiente";
}

function formatFecha(iso: string): string {
  const meses = [
    "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
    "JUL", "AGO", "SEP", "OCT", "NOV", "DIC",
  ];
  const d = new Date(iso);
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${dd} ${meses[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function mapPostulacion(row: PostulacionRow): Postulacion {
  return {
    id: row.id,
    nombre: row.nombre,
    email: row.email,
    telefono: row.telefono ?? "",
    ciudad: row.provincia,
    edad: row.edad,
    fechaPostulacion: formatFecha(row.created_at),
    motivacion: row.motivacion,
    estado: mapEstado(row.estado),
  };
}

export async function getPostulaciones(): Promise<{
  pendientes: Postulacion[];
  rechazados: Postulacion[];
}> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("postulaciones")
    .select("id, nombre, email, telefono, provincia, edad, motivacion, estado, created_at")
    .in("estado", ["pending", "rejected"])
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error leyendo postulaciones:", error.message);
    return { pendientes: [], rechazados: [] };
  }

  const rows = (data ?? []) as PostulacionRow[];
  const mapped = rows.map(mapPostulacion);

  return {
    pendientes: mapped.filter((p) => p.estado === "pendiente"),
    rechazados: mapped.filter((p) => p.estado === "rechazado"),
  };
}

export type RechazarResult = {
  error?: string;
  success?: boolean;
};

export async function rechazarPostulacion(
  id: string,
): Promise<RechazarResult> {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) {
    return { error: "Tu sesión expiró. Volvé a iniciar sesión." };
  }

  const { error } = await supabase
    .from("postulaciones")
    .update({
      estado: "rejected",
      revisada_por: user.id,
      revisada_en: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error rechazando postulación:", error.message);
    return { error: "No pudimos rechazar la postulación. Intentá de nuevo." };
  }

  return { success: true };
}

export type AprobarResult = {
  error?: string;
  success?: boolean;
  passwordTemporal?: string;
  numeroUsuario?: number;
};

function generarPasswordTemporal(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = new Uint8Array(14);
  crypto.getRandomValues(bytes);
  let out = "";
  for (const b of bytes) {
    out += chars[b % chars.length];
  }
  return out;
}

export async function aprobarPostulacion(id: string): Promise<AprobarResult> {
  const supabase = await createClient();

  // 1. Verificar staff con sesión.
  const { data: userData } = await supabase.auth.getUser();
  const reviewer = userData.user;
  if (!reviewer) {
    return { error: "Tu sesión expiró. Volvé a iniciar sesión." };
  }

  // 2. Leer la postulación.
  const { data: post, error: postError } = await supabase
    .from("postulaciones")
    .select("id, nombre, email, telefono, provincia, edad, pais, estado")
    .eq("id", id)
    .maybeSingle();

  if (postError || !post) {
    return { error: "No se encontró la postulación." };
  }
  if (post.estado === "approved") {
    return { error: "Esta postulación ya fue aprobada." };
  }

  const admin = createAdminClient();

  // 3. Generar contraseña temporal.
  const passwordTemporal = generarPasswordTemporal();

  // 4. Crear el usuario de auth (auto-confirmado).
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: post.email,
    password: passwordTemporal,
    email_confirm: true,
  });

  if (createError || !created.user) {
    const msg = createError?.message ?? "";
    if (msg.toLowerCase().includes("already") || msg.toLowerCase().includes("registered")) {
      return { error: "Ya existe un usuario con ese email. Revisá si esta persona ya es opinador." };
    }
    console.error("Error creando usuario de auth:", msg);
    return { error: "No pudimos crear el usuario. Intentá de nuevo." };
  }

  const nuevoUserId = created.user.id;

  // 5. Calcular numero_usuario (máximo actual + 1).
  const { data: maxRows } = await admin
    .from("opinadores")
    .select("numero_usuario")
    .order("numero_usuario", { ascending: false })
    .limit(1);

  const numeroUsuario =
    maxRows && maxRows.length > 0 ? maxRows[0].numero_usuario + 1 : 1;

  // 6. Insertar la fila en opinadores (hereda pais de la postulación).
  const { error: insertError } = await admin.from("opinadores").insert({
    id: nuevoUserId,
    postulacion_id: post.id,
    numero_usuario: numeroUsuario,
    nombre: post.nombre,
    email: post.email,
    telefono: post.telefono ?? "",
    edad: post.edad,
    provincia: post.provincia,
    pais: post.pais,
  });

  if (insertError) {
    // Rollback: borrar el usuario de auth recién creado para no dejar basura.
    await admin.auth.admin.deleteUser(nuevoUserId);
    console.error("Error insertando opinador:", insertError.message);
    return { error: "No pudimos crear el opinador. Intentá de nuevo." };
  }

  // 7. Marcar la postulación como aprobada.
  const { error: updateError } = await admin
    .from("postulaciones")
    .update({
      estado: "approved",
      revisada_por: reviewer.id,
      revisada_en: new Date().toISOString(),
    })
    .eq("id", id);

  if (updateError) {
    console.error("Error actualizando postulación (opinador ya creado):", updateError.message);
    // El opinador ya existe; informamos pero no revertimos esa creación.
    return {
      error: "El opinador se creó, pero no se pudo actualizar la postulación. Avisá al equipo.",
    };
  }

  // 8. Devolver la contraseña temporal para mostrarla una vez.
  return { success: true, passwordTemporal, numeroUsuario };
}
