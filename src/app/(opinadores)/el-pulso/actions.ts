"use server";

import { createClient } from "@/lib/supabase/server";

export type CrearPostulacionState = {
  error?: string;
  success?: boolean;
};

export async function crearPostulacion(
  _previousState: CrearPostulacionState,
  formData: FormData,
): Promise<CrearPostulacionState> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const apellido = String(formData.get("apellido") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim();
  const edadRaw = String(formData.get("edad") ?? "").trim();
  const provincia = String(formData.get("provincia") ?? "").trim();
  const motivacion = String(formData.get("motivacion") ?? "").trim();

  if (!nombre || !apellido || !email || !telefono || !edadRaw || !provincia || !motivacion) {
    return { error: "Todos los campos son obligatorios" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Ingresá un email válido" };
  }

  const edad = Number.parseInt(edadRaw, 10);
  if (Number.isNaN(edad) || edad < 13) {
    return { error: "Ingresá una edad válida (mínimo 13 años)" };
  }

  const supabase = await createClient();

  // pais cae en 'AR' por default; estado en 'pending' por default
  // (requerido por la policy de inserción pública).
  const { error } = await supabase.from("postulaciones").insert({
    nombre,
    apellido,
    email,
    telefono,
    edad,
    provincia,
    motivacion,
  });

  if (error) {
    console.error("Error insertando postulación:", error.message);
    return { error: "No pudimos enviar tu postulación. Intentá de nuevo." };
  }

  return { success: true };
}
