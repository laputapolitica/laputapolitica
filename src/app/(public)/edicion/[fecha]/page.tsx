import { notFound } from "next/navigation";

import { getClimaMock } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/server";
import type { Edicion, Noticia } from "@/lib/mock-data";

import { EdicionClient } from "./EdicionClient";

type EdicionPageProps = {
  params: Promise<{
    fecha: string;
  }>;
};

// En la base, ediciones.fecha es un slug "dd-mm-yyyy".
// Aceptamos tambien "yyyy-mm-dd" en la URL y lo normalizamos.
function toDbSlug(fecha: string): string {
  const parts = fecha.split("-");
  if (parts.length !== 3) {
    return fecha;
  }
  const [a, b, c] = parts;
  if (a.length === 4) {
    return `${c}-${b}-${a}`;
  }
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

export default async function EdicionPage({ params }: EdicionPageProps) {
  const { fecha } = await params;
  const slug = toDbSlug(fecha);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ediciones")
    .select(
      "id, fecha, titulo, portada_url, estado, noticias(id, orden, titulo, cuerpo, fuentes_urls, el_pulso_noticia(texto_resumen, pct_positiva, pct_negativa, pct_incierta))",
    )
    .eq("fecha", slug)
    .eq("estado", "published")
    .maybeSingle();

  if (error) {
    console.error("Error leyendo edicion publica desde Supabase:", error.message);
  }

  if (!data) {
    notFound();
  }

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

  const clima = getClimaMock();

  return <EdicionClient clima={clima} edicion={edicion} />;
}
