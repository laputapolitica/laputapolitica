"use server";

import { createClient } from "@/lib/supabase/server";
import { LEGAL } from "@/lib/legal";

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

  const edad = Number(edadRaw);
  if (!/^\d+$/.test(edadRaw) || !Number.isSafeInteger(edad) || edad < LEGAL.minimumAge) {
    return { error: `Ingresá una edad válida. Para postularte tenés que tener ${LEGAL.minimumAge} años o más.` };
  }

  if (formData.get("aceptacionLegal") !== "accepted") {
    return { error: "Para postularte tenés que aceptar los Términos y Condiciones y la Política de Privacidad." };
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
    acepto_legales_en: new Date().toISOString(),
    legales_version: LEGAL.lastUpdated,
  });

  if (error) {
    console.error("Error insertando postulación:", error.message);
    return { error: "No pudimos enviar tu postulación. Intentá de nuevo." };
  }

  return { success: true };
}
