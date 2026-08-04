"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Usuario, RolAdmin } from "@/types/admin";

const ROL_DB_A_UI: Record<string, RolAdmin> = {
  admin: "Admin",
  editor: "Editor",
  director: "Director",
};
const ROL_UI_A_DB: Record<RolAdmin, string> = {
  Admin: "admin",
  Editor: "editor",
  Director: "director",
};

// created_at es ISO (timestamptz) → dd/mm/yyyy (UTC), igual que opinadores/actions.ts
function formatFechaDesde(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getUTCFullYear()}`;
}

type ProfileRow = {
  id: string;
  nombre: string;
  email: string;
  role: string;
  created_at: string;
  activo: boolean;
};

export async function getUsuarios(): Promise<Usuario[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, nombre, email, role, created_at, activo")
    .eq("activo", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error leyendo usuarios:", error.message);
    return [];
  }

  return ((data ?? []) as ProfileRow[]).map((r) => ({
    id: r.id,
    nombre: r.nombre,
    email: r.email,
    fechaDesde: formatFechaDesde(r.created_at),
    rol: ROL_DB_A_UI[r.role] ?? "Editor",
  }));
}

export type UsuarioResult = { error?: string; success?: boolean };

export async function cambiarRolUsuario(
  id: string,
  nuevoRol: RolAdmin,
): Promise<UsuarioResult> {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { error: "Tu sesión expiró. Volvé a iniciar sesión." };
  }
  if (userData.user.id === id) {
    return { error: "No podés cambiar tu propio rol." };
  }

  const roleDb = ROL_UI_A_DB[nuevoRol];
  if (!roleDb) {
    return { error: "Rol no válido." };
  }

  // No permitir tocar a un Admin (consistente con la UI).
  const { data: target } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", id)
    .maybeSingle();
  if (target?.role === "admin") {
    return { error: "No se puede cambiar el rol de un Admin." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role: roleDb })
    .eq("id", id);

  if (error) {
    console.error("Error cambiando rol:", error.message);
    return { error: "No se pudo cambiar el rol. Intentá de nuevo." };
  }

  return { success: true };
}

export async function eliminarUsuario(id: string): Promise<UsuarioResult> {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { error: "Tu sesión expiró. Volvé a iniciar sesión." };
  }
  if (userData.user.id === id) {
    return { error: "No podés eliminarte a vos mismo." };
  }

  const admin = createAdminClient();

  const { data: target, error: findError } = await admin
    .from("profiles")
    .select("role")
    .eq("id", id)
    .maybeSingle();
  if (findError || !target) {
    return { error: "No se encontró el usuario." };
  }
  if (target.role === "admin") {
    return { error: "No se puede eliminar a un Admin." };
  }

  // Soft-delete: preserva historial. (mismo criterio que desactivarOpinador)
  const { error: upError } = await admin
    .from("profiles")
    .update({ activo: false })
    .eq("id", id);
  if (upError) {
    console.error("Error desactivando usuario:", upError.message);
    return { error: "No se pudo eliminar. Intentá de nuevo." };
  }

  // Banear el auth user para que no pueda loguear.
  const { error: banError } = await admin.auth.admin.updateUserById(id, {
    ban_duration: "876000h",
  });
  if (banError) {
    console.error("Usuario desactivado, pero falló el baneo de auth:", banError.message);
    return { success: true };
  }

  return { success: true };
}

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

export type InvitarResult = {
  error?: string;
  success?: boolean;
  email?: string;
  passwordTemporal?: string;
};

export async function invitarUsuario(
  nombre: string,
  email: string,
  rol: RolAdmin,
): Promise<InvitarResult> {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const caller = userData.user;
  if (!caller) {
    return { error: "Tu sesión expiró. Volvé a iniciar sesión." };
  }

  // Solo un Admin puede invitar staff.
  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role, pais")
    .eq("id", caller.id)
    .maybeSingle();
  if (!callerProfile || callerProfile.role !== "admin") {
    return { error: "Solo un Admin puede invitar usuarios." };
  }

  const nombreLimpio = nombre.trim();
  const emailLimpio = email.trim().toLowerCase();
  if (!nombreLimpio || !emailLimpio) {
    return { error: "Completá nombre y email." };
  }

  const roleDb = ROL_UI_A_DB[rol];
  if (!roleDb) {
    return { error: "Rol no válido." };
  }

  const admin = createAdminClient();
  const passwordTemporal = generarPasswordTemporal();

  // 1. Crear el usuario de auth (auto-confirmado).
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: emailLimpio,
    password: passwordTemporal,
    email_confirm: true,
  });

  if (createError || !created.user) {
    const msg = createError?.message ?? "";
    if (msg.toLowerCase().includes("already") || msg.toLowerCase().includes("registered")) {
      return { error: "Ya existe un usuario con ese email." };
    }
    console.error("Error creando usuario de auth:", msg);
    return { error: "No se pudo crear el usuario. Intentá de nuevo." };
  }

  const nuevoUserId = created.user.id;

  // 2. Insertar la fila en profiles (hereda el pais del admin).
  const { error: insertError } = await admin.from("profiles").insert({
    id: nuevoUserId,
    email: emailLimpio,
    nombre: nombreLimpio,
    role: roleDb,
    activo: true,
    pais: callerProfile.pais ?? "AR",
    es_global: false,
  });

  if (insertError) {
    // Rollback: borrar el usuario de auth recién creado para no dejar basura.
    await admin.auth.admin.deleteUser(nuevoUserId);
    console.error("Error insertando profile:", insertError.message);
    return { error: "No se pudo crear el usuario. Intentá de nuevo." };
  }

  return { success: true, email: emailLimpio, passwordTemporal };
}
