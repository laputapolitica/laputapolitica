import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getDatosPublicacionWeb } from "@/app/(admin)/admin/actions";
import { DataPill, HeaderPanel, PanelLayout } from "@/components/admin/shared";
import { PublicacionPanel } from "@/components/admin/panels/PublicacionPanel";
import type { NoticiaPublicacion } from "@/components/admin/panels/PublicacionPanel/types";

type EdicionDetallePageProps = {
  params: Promise<{ fecha: string }>;
};

const MESES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

// La URL trae fechaISO (yyyy-mm-dd); en la base la columna fecha es slug dd-mm-yyyy.
function isoToSlug(iso: string): string {
  const parts = iso.split("-");
  if (parts.length !== 3) return iso;
  const [a, b, c] = parts;
  if (a.length === 4) return `${c}-${b}-${a}`;
  return iso;
}

function slugToDisplay(slug: string): string {
  const [dd, mm, yyyy] = slug.split("-");
  const idx = Number(mm) - 1;
  return `${dd} ${MESES[idx] ?? mm} ${yyyy}`;
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
  el_pulso_noticia: ElPulsoRow | ElPulsoRow[] | null;
};

type EdicionRow = {
  id: string;
  fecha: string;
  titulo: string;
  noticias: NoticiaRow[] | null;
};

function pickPulso(value: NoticiaRow["el_pulso_noticia"]) {
  const r = Array.isArray(value) ? value[0] : value;
  return {
    texto: r?.texto_resumen ?? "",
    positiva: r?.pct_positiva ?? 0,
    negativa: r?.pct_negativa ?? 0,
    incierta: r?.pct_incierta ?? 0,
  };
}

export default async function EdicionDetallePage({ params }: EdicionDetallePageProps) {
  const { fecha } = await params;
  const slug = isoToSlug(fecha);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ediciones")
    .select(
      "id, fecha, titulo, noticias(id, orden, titulo, cuerpo, el_pulso_noticia(texto_resumen, pct_positiva, pct_negativa, pct_incierta))",
    )
    .eq("fecha", slug)
    .maybeSingle();

  if (error) {
    console.error("Error leyendo edición (admin):", error.message);
  }

  if (!data) {
    notFound();
  }

  const row = data as unknown as EdicionRow;

  const noticias: NoticiaPublicacion[] = (row.noticias ?? [])
    .slice()
    .sort((a, b) => a.orden - b.orden)
    .map((n) => {
      const p = pickPulso(n.el_pulso_noticia);
      return {
        id: n.id,
        titulo: n.titulo,
        resumen: n.cuerpo,
        pulso: p.texto,
        pulsoTwitter: `EL PULSO\n${p.texto}\n🟢 ${p.positiva}% Positiva\n🔴 ${p.negativa}% Negativa\n🟣 ${p.incierta}% Incierta`,
        interpretacion: {
          positiva: p.positiva,
          negativa: p.negativa,
          incierta: p.incierta,
        },
      };
    });
  const datosWeb = await getDatosPublicacionWeb(row.id);

  return (
    <PanelLayout
      header={
        <HeaderPanel>
          <div className="flex items-center gap-2">
            <DataPill>{slugToDisplay(row.fecha)}</DataPill>
            <DataPill>{row.titulo}</DataPill>
          </div>
        </HeaderPanel>
      }
      content={
        <PublicacionPanel
          status="ready"
          edicionId={row.id}
          titulo={row.titulo}
          noticias={noticias}
          portadaUrl={datosWeb.portadaUrl}
          clima={datosWeb.clima}
        />
      }
    />
  );
}
