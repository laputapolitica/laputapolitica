import { PipelineDiagram, mockState } from "@/components/admin";
import { PanelLayout } from "@/components/admin/shared";
import { EdicionesList } from "@/components/admin/sections/ediciones";
import { edicionDelDia } from "@/lib/mock-ediciones";
import { createClient } from "@/lib/supabase/server";
import type { Edicion, EstadoEdicion } from "@/types/admin";

const MESES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

// En la base, ediciones.fecha es un slug "dd-mm-yyyy".
function formatFecha(slug: string): { display: string; iso: string } {
  const [dd, mm, yyyy] = slug.split("-");
  const mesIdx = Number(mm) - 1;
  const display = `${dd} ${MESES[mesIdx] ?? mm} ${yyyy}`;
  const iso = `${yyyy}-${mm}-${dd}`;
  return { display, iso };
}

function formatHora(publicadaEn: string | null): string {
  if (!publicadaEn) return "—";
  return new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date(publicadaEn));
}

function mapEstado(estado: string): EstadoEdicion {
  return {
    nodo: "publicacion",
    status: estado === "published" ? "done" : "pending",
  };
}

type EdicionRow = {
  id: string;
  fecha: string;
  titulo: string;
  estado: string;
  publicada_en: string | null;
};

export default async function AdminEdicionesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ediciones")
    .select("id, fecha, titulo, estado, publicada_en");

  if (error) {
    console.error("Error leyendo ediciones desde Supabase:", error.message);
  }

  const rows = (data ?? []) as EdicionRow[];

  const ediciones: Edicion[] = rows
    .map((row) => {
      const { display, iso } = formatFecha(row.fecha);
      return {
        fecha: display,
        fechaISO: iso,
        titulo: row.titulo,
        opiniones: 0,
        totalOpinadores: 0,
        horaPublicacion: formatHora(row.publicada_en),
        estado: mapEstado(row.estado),
      } satisfies Edicion;
    })
    .sort((a, b) => b.fechaISO.localeCompare(a.fechaISO));

  return (
    <PanelLayout
      header={
        edicionDelDia.enCurso ? (
          <PipelineDiagram pipelineState={mockState} diagramOnly />
        ) : null
      }
      content={<EdicionesList ediciones={ediciones} />}
    />
  );
}
