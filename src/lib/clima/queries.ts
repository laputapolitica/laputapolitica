import type { createClient } from "@/lib/supabase/server";

import { CLIMA_CITIES } from "./cities";
import { CLIMA_CLAVES, type ClimaClave } from "./condiciones";

export type ClimaDiaData = {
  fecha: string;
  diaLabel: string;
  temperaturaMin: number | null;
  temperaturaMax: number | null;
  icono: ClimaClave;
  condicion: string | null;
};

export type ClimaCiudadData = {
  id: string;
  label: string;
  dias: ClimaDiaData[];
};

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

type ClimaDiarioRow = {
  provincia: string;
  fecha: string;
  temperatura_min: number | null;
  temperatura_max: number | null;
  condicion: string | null;
  icono: string | null;
};

const CLIMA_CLAVES_SET = new Set<string>(CLIMA_CLAVES);
const FALLBACK_ICONO: ClimaClave = "parcialmente-nublado";
const DIA_LABELS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
] as const;

function isClimaClave(value: string | null): value is ClimaClave {
  return value !== null && CLIMA_CLAVES_SET.has(value);
}

function getDiaLabel(fecha: string): string {
  const [year, month, day] = fecha.split("-").map((part) => Number.parseInt(part, 10));

  if (!year || !month || !day) {
    return "";
  }

  return DIA_LABELS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
}

export async function getClimaEdicion(
  supabase: SupabaseServerClient,
  edicionId: string,
): Promise<ClimaCiudadData[]> {
  const { data, error } = await supabase
    .from("clima_diario")
    .select("provincia, fecha, temperatura_min, temperatura_max, condicion, icono")
    .eq("edicion_id", edicionId)
    .order("fecha", { ascending: true });

  if (error) {
    console.error("Error leyendo clima de la edicion desde Supabase:", error.message);
    return [];
  }

  const rows = (data ?? []) as ClimaDiarioRow[];
  const rowsByCity = new Map<string, ClimaDiarioRow[]>();

  for (const row of rows) {
    const currentRows = rowsByCity.get(row.provincia) ?? [];
    currentRows.push(row);
    rowsByCity.set(row.provincia, currentRows);
  }

  return CLIMA_CITIES.flatMap((city) => {
    const cityRows = rowsByCity.get(city.id);

    if (!cityRows) {
      return [];
    }

    return [
      {
        id: city.id,
        label: city.label,
        dias: cityRows.map((row) => ({
          fecha: row.fecha,
          diaLabel: getDiaLabel(row.fecha),
          temperaturaMin: row.temperatura_min,
          temperaturaMax: row.temperatura_max,
          icono: isClimaClave(row.icono) ? row.icono : FALLBACK_ICONO,
          condicion: row.condicion,
        })),
      },
    ];
  });
}
