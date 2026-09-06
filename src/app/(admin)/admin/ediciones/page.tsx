import { PipelineDiagram } from "@/components/admin";
import { PanelLayout } from "@/components/admin/shared";
import { EdicionesList } from "@/components/admin/sections/ediciones";
import { getPipelineEnCursoDeHoy } from "@/app/(admin)/admin/actions";
import { createClient } from "@/lib/supabase/server";
import type { Edicion, EstadoEdicion } from "@/types/admin";

const MESES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

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

  const [{ data, error }, enCurso] = await Promise.all([
    supabase
      .from("ediciones")
      .select("id, fecha, titulo, estado, publicada_en")
      .eq("estado", "published"),
    getPipelineEnCursoDeHoy(),
  ]);

  if (error) {
    console.error("Error leyendo ediciones desde Supabase:", error.message);
  }

  const rows = (data ?? []) as EdicionRow[];

  // Participación por edición: opinadores distintos que opinaron en cada edición,
  // sobre el total de opinadores activos.
  const edIds = rows.map((r) => r.id);
  const participaronPorEdicion = new Map<string, number>();
  let totalOpinadores = 0;

  if (edIds.length > 0) {
    const [{ data: ntData }, { count }] = await Promise.all([
      supabase.from("noticias").select("id, edicion_id").in("edicion_id", edIds),
      supabase
        .from("opinadores")
        .select("id", { count: "exact", head: true })
        .eq("activo", true),
    ]);

    totalOpinadores = count ?? 0;

    const noticias = (ntData ?? []) as { id: string; edicion_id: string }[];
    const edicionPorNoticia = new Map(noticias.map((n) => [n.id, n.edicion_id]));
    const ntIds = noticias.map((n) => n.id);

    if (ntIds.length > 0) {
      const { data: opData } = await supabase
        .from("opiniones")
        .select("opinador_id, noticia_id")
        .in("noticia_id", ntIds);

      const opiniones = (opData ?? []) as {
        opinador_id: string;
        noticia_id: string;
      }[];

      const setPorEdicion = new Map<string, Set<string>>();
      for (const o of opiniones) {
        const edId = edicionPorNoticia.get(o.noticia_id);
        if (!edId) continue;
        const set = setPorEdicion.get(edId) ?? new Set<string>();
        set.add(o.opinador_id);
        setPorEdicion.set(edId, set);
      }
      for (const [edId, set] of setPorEdicion) {
        participaronPorEdicion.set(edId, set.size);
      }
    }
  }

  const ediciones: Edicion[] = rows
    .map((row) => {
      const { display, iso } = formatFecha(row.fecha);
      return {
        fecha: display,
        fechaISO: iso,
        titulo: row.titulo,
        opiniones: participaronPorEdicion.get(row.id) ?? 0,
        totalOpinadores,
        horaPublicacion: formatHora(row.publicada_en),
        estado: mapEstado(row.estado),
      } satisfies Edicion;
    })
    .sort((a, b) => b.fechaISO.localeCompare(a.fechaISO));

  return (
    <PanelLayout
      header={
        enCurso ? (
          <PipelineDiagram pipelineState={enCurso.state} diagramOnly />
        ) : null
      }
      content={<EdicionesList ediciones={ediciones} />}
    />
  );
}
