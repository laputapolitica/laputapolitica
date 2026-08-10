"use server";

import { cargarEdicion, toDbSlug, type EdicionData } from "@/lib/edicion";

export async function obtenerEdicion(fecha: string): Promise<EdicionData | null> {
  return cargarEdicion(toDbSlug(fecha));
}
