"use server";

import { createClient } from "@/lib/supabase/server";
import type { KPI, ParticipacionDia } from "@/types/admin";

export type MetricasDB = {
  kpis: KPI[];
  participacion: ParticipacionDia[];
};

export async function getMetricasDB(): Promise<MetricasDB> {
  const supabase = await createClient();

  const { count: activosCount } = await supabase
    .from("opinadores")
    .select("id", { count: "exact", head: true })
    .eq("activo", true);
  const totalActivos = activosCount ?? 0;

  const { data: edData } = await supabase
    .from("ediciones")
    .select("id, fecha, publicada_en")
    .eq("estado", "published");
  const ediciones = (edData ?? []) as {
    id: string;
    fecha: string;
    publicada_en: string | null;
  }[];
  const totalEdiciones = ediciones.length;

  const edIds = ediciones.map((e) => e.id);
  const participaronPorEdicion = new Map<string, number>();
  if (edIds.length > 0) {
    const { data: ntData } = await supabase
      .from("noticias")
      .select("id, edicion_id")
      .in("edicion_id", edIds);
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

  const hace30 = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const edicionesUlt30 = ediciones.filter(
    (e) => e.publicada_en && new Date(e.publicada_en).getTime() >= hace30,
  );
  const pcts = edicionesUlt30.map((e) =>
    totalActivos > 0 ? (participaronPorEdicion.get(e.id) ?? 0) / totalActivos : 0,
  );
  const pctProm =
    pcts.length > 0
      ? Math.round((pcts.reduce((a, b) => a + b, 0) / pcts.length) * 100)
      : 0;

  const ordenadas = [...ediciones].sort((a, b) =>
    (a.publicada_en ?? "").localeCompare(b.publicada_en ?? ""),
  );
  const participacion: ParticipacionDia[] = ordenadas.slice(-20).map((e) => {
    const p = participaronPorEdicion.get(e.id) ?? 0;
    const [dd, mm] = e.fecha.split("-");
    return {
      fecha: `${dd}/${mm}`,
      participaron: p,
      noParticiparon: Math.max(0, totalActivos - p),
    };
  });

  const kpis: KPI[] = [
    { label: "Opinadores", valor: String(totalActivos), descripcion: "verificados activos" },
    { label: "Participación promedio", valor: `${pctProm}%`, descripcion: "últimos 30 días" },
    { label: "Ediciones publicadas", valor: String(totalEdiciones), descripcion: "desde el lanzamiento" },
  ];

  return { kpis, participacion };
}
