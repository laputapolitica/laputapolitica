import { headers } from "next/headers";

import {
  DEFAULT_CITY_ID,
  findNearestCity,
  getClimaEdicion,
  type ClimaCiudadData,
} from "@/lib/clima";
import { createClient } from "@/lib/supabase/server";
import type { Edicion, EdicionResumen, Noticia } from "@/types/edicion";

// En la base, ediciones.fecha es un slug "dd-mm-yyyy". Aceptamos también
// "yyyy-mm-dd" en la URL y lo normalizamos.
export function toDbSlug(fecha: string): string {
  const parts = fecha.split("-");
  if (parts.length !== 3) return fecha;
  const [a, b, c] = parts;
  if (a.length === 4) return `${c}-${b}-${a}`;
  return fecha;
}

type ElPulsoRow = {
  texto_resumen: string;
  pct_positiva: number;
  pct_negativa: number;
  pct_incierta: number;
};

type NoticiaRow = {
  id: string;
  orden: number;
  titulo: string;
  cuerpo: string;
  fuentes_urls: string[] | null;
  el_pulso_noticia: ElPulsoRow | ElPulsoRow[] | null;
};

type EdicionRow = {
  id: string;
  fecha: string;
  titulo: string;
  portada_url: string | null;
  noticias: NoticiaRow[] | null;
};

function pickPulso(value: NoticiaRow["el_pulso_noticia"]): Noticia["el_pulso"] {
  const row = Array.isArray(value) ? value[0] : value;
  return {
    texto_resumen: row?.texto_resumen ?? "",
    pct_positiva: row?.pct_positiva ?? 0,
    pct_negativa: row?.pct_negativa ?? 0,
    pct_incierta: row?.pct_incierta ?? 0,
  };
}

function getValidCoordinate(value: string | null): number | null {
  if (!value) return null;
  const coordinate = Number.parseFloat(value);
  return Number.isFinite(coordinate) ? coordinate : null;
}

function getInitialCityId(headersList: Headers): string {
  const country = headersList.get("x-vercel-ip-country");
  const latitude = getValidCoordinate(headersList.get("x-vercel-ip-latitude"));
  const longitude = getValidCoordinate(headersList.get("x-vercel-ip-longitude"));
  if (country !== "AR" || latitude === null || longitude === null) {
    return DEFAULT_CITY_ID;
  }
  return findNearestCity(latitude, longitude)?.id ?? DEFAULT_CITY_ID;
}

export type EdicionData = {
  edicion: Edicion;
  clima: { ciudades: ClimaCiudadData[]; initialCityId: string };
};

// Sin slug → última edición publicada (la "home"). Con slug → esa fecha.
export async function cargarEdicion(slug?: string): Promise<EdicionData | null> {
  const supabase = await createClient();

  const base = supabase
    .from("ediciones")
    .select(
      "id, fecha, titulo, portada_url, noticias(id, orden, titulo, cuerpo, fuentes_urls, el_pulso_noticia(texto_resumen, pct_positiva, pct_negativa, pct_incierta))",
    )
    .eq("estado", "published");

  const filtered = slug
    ? base.eq("fecha", slug)
    : base.order("publicada_en", { ascending: false });

  const { data, error } = await filtered.limit(1).maybeSingle();

  if (error) {
    console.error("Error leyendo edicion publica desde Supabase:", error.message);
  }
  if (!data) return null;

  const row = data as unknown as EdicionRow;

  const noticias: Noticia[] = (row.noticias ?? [])
    .map((n) => ({
      id: n.id,
      orden: n.orden,
      titulo: n.titulo,
      cuerpo: n.cuerpo,
      fuentes_urls: n.fuentes_urls ?? [],
      el_pulso: pickPulso(n.el_pulso_noticia),
    }))
    .sort((a, b) => a.orden - b.orden);

  const edicion: Edicion = {
    id: row.id,
    fecha: row.fecha,
    titulo: row.titulo,
    portada_illustracion_url: row.portada_url ?? "/placeholder.svg",
    noticias,
  };

  const headersList = await headers();
  const initialCityId = getInitialCityId(headersList);
  const ciudades = await getClimaEdicion(supabase, edicion.id);

  return { edicion, clima: { ciudades, initialCityId } };
}

type EdicionResumenRow = {
  fecha: string;
  titulo: string;
  portada_url: string | null;
};

export async function listarEdiciones(): Promise<EdicionResumen[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ediciones")
    .select("fecha, titulo, portada_url, publicada_en")
    .eq("estado", "published")
    .order("publicada_en", { ascending: false });

  if (error) {
    console.error("Error listando ediciones publicas desde Supabase:", error.message);
    return [];
  }

  const rows = (data ?? []) as unknown as EdicionResumenRow[];

  return rows.map((row) => ({
    fecha: row.fecha,
    titulo: row.titulo ?? "",
    portadaUrl: row.portada_url ?? "/placeholder.svg",
  }));
}
