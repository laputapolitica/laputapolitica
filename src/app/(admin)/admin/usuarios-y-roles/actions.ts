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
