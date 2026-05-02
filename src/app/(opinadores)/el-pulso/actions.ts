"use server";

export type CrearPostulacionState = {
  error?: string;
  success?: boolean;
};

export async function crearPostulacion(
  _previousState: CrearPostulacionState,
  formData: FormData,
): Promise<CrearPostulacionState> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim();
  const edad = String(formData.get("edad") ?? "").trim();
  const provincia = String(formData.get("provincia") ?? "").trim();
  const motivacion = String(formData.get("motivacion") ?? "").trim();

  if (!nombre || !email || !telefono || !edad || !provincia || !motivacion) {
    return { error: "Todos los campos son obligatorios" };
  }

  // TODO: insertar en tabla postulaciones de Supabase.
  console.log("Nueva postulación:", {
    nombre,
    email,
    telefono,
    edad,
    provincia,
    motivacion,
  });

  return { success: true };
}
