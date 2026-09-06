import { createClient } from "@/lib/supabase/server";
import { getFechaHoyArgentina } from "@/lib/fecha";
import type { OpinionSentiment } from "./actions";
import type { Edicion, Noticia } from "@/types/edicion";

import { DiaClient } from "./DiaClient";

type NoticiaRow = {
  id: string;
  orden: number;
  titulo: string;
  cuerpo: string;
  fuentes_urls: string[] | null;
};

type EdicionRow = {
  id: string;
  fecha: string;
  titulo: string;
  portada_url: string | null;
  noticias: NoticiaRow[] | null;
};

export default async function DiaPage(): Promise<React.ReactElement> {
  const supabase = await createClient();
  const fechaHoy = getFechaHoyArgentina();

  // Nombre del opinador logueado, para el saludo del header.
  let nombreOpinador = "";
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (user) {
    const { data: opinador } = await supabase
      .from("opinadores")
      .select("nombre")
      .eq("id", user.id)
      .maybeSingle();
    if (opinador?.nombre) {
      nombreOpinador = opinador.nombre.split(" ")[0] ?? opinador.nombre;
    }
  }

  // RLS deja ver al opinador solo la edición en transcurso de su país
  // cuya ventana de opinión está abierta.
  const { data, error } = await supabase
    .from("ediciones")
    .select(
      "id, fecha, titulo, portada_url, noticias(id, orden, titulo, cuerpo, fuentes_urls)",
    )
    .eq("fecha", fechaHoy)
    .neq("estado", "published")
    .maybeSingle();

  if (error) {
    console.error("Error leyendo edición del día:", error.message);
  }

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg-base px-6 text-center">
        <p className="max-w-sm font-editorial text-base leading-relaxed text-text-secondary">
          No hay una edición abierta para opinar en este momento. Volvé cuando
          se abra la ventana de opinión.
        </p>
      </main>
    );
  }

  const row = data as unknown as EdicionRow;

  const noticias: Noticia[] = (row.noticias ?? [])
    .map((n) => ({
      id: n.id,
      orden: n.orden,
      titulo: n.titulo,
      cuerpo: n.cuerpo,
      fuentes_urls: n.fuentes_urls ?? [],
      el_pulso: {
        texto_resumen: "",
        pct_positiva: 0,
        pct_negativa: 0,
        pct_incierta: 0,
      },
    }))
    .sort((a, b) => a.orden - b.orden);

  const edicion: Edicion = {
    id: row.id,
    fecha: row.fecha,
    titulo: row.titulo,
    portada_illustracion_url: row.portada_url ?? "/placeholder.svg",
    noticias,
  };

  const noticiaIds = noticias.map((noticia): string => noticia.id);

  const opinionesPrevias: Record<
    string,
    { texto: string; sentiment: OpinionSentiment }
  > = {};

  if (user && noticiaIds.length > 0) {
    const { data: opinionesData } = await supabase
      .from("opiniones")
      .select("noticia_id, texto, sentiment")
      .eq("opinador_id", user.id)
      .in("noticia_id", noticiaIds);

    const filas = (opinionesData ?? []) as Array<{
      noticia_id: string;
      texto: string;
      sentiment: string;
    }>;

    for (const fila of filas) {
      opinionesPrevias[fila.noticia_id] = {
        texto: fila.texto,
        sentiment: fila.sentiment as OpinionSentiment,
      };
    }
  }

  return (
    <DiaClient
      edicion={edicion}
      nombre={nombreOpinador}
      opinionesPrevias={opinionesPrevias}
    />
  );
}
