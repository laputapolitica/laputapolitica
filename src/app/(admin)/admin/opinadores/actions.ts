"use server";

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
