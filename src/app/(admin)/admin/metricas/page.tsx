"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getMetricasDB, type MetricasDB } from "./actions";
import { CHART_COLORS } from "@/lib/constants";
import { DataPill, SectionPanel } from "@/components/admin/shared";
import type { KPI, ParticipacionDia } from "@/types/admin";

function KPICard({ label, valor, descripcion }: { label: string; valor: string; descripcion: string }) {
  return (
    <SectionPanel className="flex flex-col items-start gap-2">
      <DataPill>{label}</DataPill>
      <span className="font-ui text-2xl font-semibold leading-none text-admin-ink">
        {valor}
      </span>
      <DataPill variant="subtle">{descripcion}</DataPill>
    </SectionPanel>
  );
}

function GraficoParticipacion({ data }: { data: ParticipacionDia[] }) {
  return (
    <SectionPanel className="flex h-full min-h-0 flex-col gap-1.5">
      <DataPill className="w-fit">Participación por edición</DataPill>
      <DataPill variant="subtle" className="w-fit">Opinadores que opinaron sobre el total — últimos 20 días</DataPill>

      <div className="flex items-center gap-2">
        <DataPill variant="subtle">
          <span className="h-[10px] w-[10px] rounded-[2px] shrink-0" style={{ backgroundColor: CHART_COLORS.positiva }} />
          Participaron
        </DataPill>
        <DataPill variant="subtle">
          <span className="h-[10px] w-[10px] rounded-[2px] shrink-0" style={{ backgroundColor: CHART_COLORS.negativa }} />
          No Participaron
        </DataPill>
      </div>

      <div className="min-h-[120px] flex-1 rounded-lg border border-admin-ink bg-white p-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
            barSize={13}
            barCategoryGap="22%"
          >
            <CartesianGrid strokeDasharray="0" stroke="#E5E3DD" vertical={false} syncWithTicks />
            <Tooltip
              contentStyle={{
                fontFamily: "var(--font-ui)",
                fontSize: 11,
                border: "1px solid #111111",
                borderRadius: "4px",
                backgroundColor: "#FAF9F5",
              }}
              formatter={(value, name) => [
                value,
                name === "participaron" ? "Participaron" : "No Participaron",
              ]}
            />
            <XAxis
              dataKey="fecha"
              tick={{ fontFamily: "var(--font-ui)", fontSize: 10, fill: "#9A968D" }}
              axisLine={false}
              tickLine={false}
              padding={{ left: 12, right: 12 }}
              interval={1}
            />
            <YAxis
              domain={[0, 25]}
              ticks={[0, 5, 10, 15, 20, 25]}
              interval={0}
              tick={{ fontFamily: "var(--font-ui)", fontSize: 11, fill: "#9A968D" }}
              axisLine={false}
              tickLine={false}
              width={24}
            />
            <Bar dataKey="participaron" stackId="a" fill={CHART_COLORS.positiva} radius={0} />
            <Bar dataKey="noParticiparon" stackId="a" fill={CHART_COLORS.negativa} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionPanel>
  );
}

function PlaceholderAnalytics({ titulo, subtitulo }: { titulo: string; subtitulo?: string }) {
  return (
    <SectionPanel className="flex h-full min-h-0 flex-col gap-1.5">
      <DataPill className="w-fit">{titulo}</DataPill>
      {subtitulo ? (
        <DataPill variant="subtle" className="w-fit">{subtitulo}</DataPill>
      ) : null}
      <div className="flex min-h-[120px] flex-1 items-center justify-center rounded-lg border border-dashed border-admin-ink/40 bg-white p-2">
        <span className="font-ui text-sm text-text-secondary">Pendiente de analytics (PostHog)</span>
      </div>
    </SectionPanel>
  );
}

export default function AdminMetricasPage() {
  const [data, setData] = useState<MetricasDB | null>(null);

  useEffect(() => {
    getMetricasDB().then(setData);
  }, []);

  const kpis: KPI[] = data?.kpis ?? [];
  const participacion: ParticipacionDia[] = data?.participacion ?? [];

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="shrink-0 grid grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} label={kpi.label} valor={kpi.valor} descripcion={kpi.descripcion} />
        ))}
        <KPICard label="Visitas totales" valor="—" descripcion="pendiente analytics" />
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-2 gap-3">
        <GraficoParticipacion data={participacion} />
        <PlaceholderAnalytics titulo="Visitas por edición" subtitulo="Últimas 15 ediciones" />
      </div>

      <div className="shrink-0">
        <PlaceholderAnalytics titulo="Ediciones más vistas" />
      </div>
    </div>
  );
}
