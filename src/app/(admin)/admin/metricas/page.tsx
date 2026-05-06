"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  mockKPIs,
  mockParticipacion,
  mockVisitas,
  mockEdicionesMasVistas,
} from "@/lib/mock-metricas";
import { VOTE_COLORS } from "@/lib/constants";

function KPICard({ label, valor, descripcion }: { label: string; valor: string; descripcion: string }) {
  return (
    <div className="flex flex-col items-start gap-1.5 rounded-lg border-2 border-admin-ink bg-bg-base px-3 py-2">
      <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
        <span className="font-ui text-xs font-medium text-admin-ink whitespace-nowrap">{label}</span>
      </div>
      <span className="font-ui text-2xl font-semibold leading-none text-admin-ink">
        {valor}
      </span>
      <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
        <span className="font-ui text-xs font-medium text-admin-ink whitespace-nowrap">{descripcion}</span>
      </div>
    </div>
  );
}

function GraficoParticipacion() {
  return (
    <div className="flex flex-col gap-1.5 rounded-lg border-2 border-admin-ink bg-bg-base px-3 py-2">
      <div className="inline-flex h-[28px] w-fit items-center rounded-[6px] border border-admin-ink bg-white px-2">
        <span className="font-ui text-sm font-medium text-admin-ink">Participación por edición</span>
      </div>
      <div className="inline-flex h-[28px] w-fit items-center rounded-[6px] border border-admin-ink bg-white px-2">
        <span className="font-ui text-sm font-medium text-admin-ink">Opinadores que opinaron sobre el total — últimos 20 días</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="inline-flex h-[28px] items-center gap-2 rounded-[6px] border border-admin-ink bg-white px-2">
          <span className="h-[10px] w-[10px] rounded-sm" style={{ backgroundColor: "#A8D5BA" }} />
          <span className="font-ui text-sm font-medium text-admin-ink">Participaron</span>
        </div>
        <div className="inline-flex h-[28px] items-center gap-2 rounded-[6px] border border-admin-ink bg-white px-2">
          <span className="h-[10px] w-[10px] rounded-sm" style={{ backgroundColor: "#E6A8A1" }} />
          <span className="font-ui text-sm font-medium text-admin-ink">No Participaron</span>
        </div>
      </div>

      <div className="rounded-lg border border-admin-ink bg-white p-3">
        <ResponsiveContainer width="100%" height={120}>
          <BarChart
            data={mockParticipacion}
            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
            barSize={13}
            barCategoryGap="22%"
          >
            <CartesianGrid strokeDasharray="0" stroke="#E5E3DD" vertical={false} />
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
              tick={{ fontFamily: "var(--font-ui)", fontSize: 11, fill: "#9A968D" }}
              axisLine={false}
              tickLine={false}
              width={24}
            />
            <Bar dataKey="participaron" stackId="a" fill="#A8D5BA" radius={0} />
            <Bar dataKey="noParticiparon" stackId="a" fill="#E6A8A1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function GraficoVisitas() {
  return (
    <div className="flex flex-col gap-1.5 rounded-lg border-2 border-admin-ink bg-bg-base px-3 py-2">
      <div className="inline-flex h-[28px] w-fit items-center rounded-[6px] border border-admin-ink bg-white px-2">
        <span className="font-ui text-sm font-medium text-admin-ink">Visitas por edición</span>
      </div>
      <div className="inline-flex h-[28px] w-fit items-center rounded-[6px] border border-admin-ink bg-white px-2">
        <span className="font-ui text-sm font-medium text-admin-ink">Últimas 15 ediciones</span>
      </div>

      <div className="rounded-lg border border-admin-ink bg-white p-3">
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart
            data={mockVisitas}
            margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="visitasGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1A1A1A" stopOpacity={0.08} />
                <stop offset="100%" stopColor="#1A1A1A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" stroke="#E5E3DD" vertical={false} />
            <XAxis
              dataKey="fecha"
              tick={{ fontFamily: "var(--font-ui)", fontSize: 10, fill: "#9A968D" }}
              axisLine={false}
              tickLine={false}
              angle={-25}
              textAnchor="end"
              height={32}
              interval={1}
              padding={{ left: 12, right: 12 }}
            />
            <YAxis
              domain={[150, 320]}
              ticks={[160, 180, 200, 220, 240, 260, 280, 300, 320]}
              tick={{ fontFamily: "var(--font-ui)", fontSize: 11, fill: "#9A968D" }}
              axisLine={false}
              tickLine={false}
              width={32}
            />
            <Tooltip
              contentStyle={{
                fontFamily: "var(--font-ui)",
                fontSize: 11,
                border: "1px solid #111111",
                borderRadius: "4px",
                backgroundColor: "#FAF9F5",
              }}
              formatter={(value) => [value, "Visitas"]}
            />
            <Area
              type="monotone"
              dataKey="visitas"
              stroke="#111111"
              strokeWidth={2}
              fill="url(#visitasGradient)"
              dot={{ fill: "#111111", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#111111" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function getPulsoColor(sentimiento: "positivo" | "negativo" | "incierto"): string {
  if (sentimiento === "positivo") return VOTE_COLORS.positiva;
  if (sentimiento === "negativo") return VOTE_COLORS.negativa;
  return VOTE_COLORS.incierta;
}

function TablaEdicionesMasVistas() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 rounded-lg border border-admin-ink bg-bg-base px-3 py-2.5">
      <div className="shrink-0 inline-flex h-[24px] w-fit items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
        <span className="font-ui text-xs font-medium text-admin-ink">Ediciones más vistas</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto flex flex-col gap-2">
        {mockEdicionesMasVistas.map((ed) => (
          <div
            key={ed.ranking}
            className="flex items-center gap-2"
          >
            <div className="inline-flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-[3.5px] border border-admin-ink bg-white">
              <span className="font-ui text-xs font-medium text-admin-ink">{ed.ranking}</span>
            </div>
            <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium text-admin-ink whitespace-nowrap">{ed.fecha}</span>
            </div>
            <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium text-admin-ink whitespace-nowrap">{ed.titulo}</span>
            </div>
            <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium text-admin-ink whitespace-nowrap">
                {ed.opiniones}/{ed.totalOpinadores} opiniones
              </span>
            </div>
            <div className="inline-flex h-[24px] items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium text-admin-ink">El Pulso</span>
              <span
                className="h-[8px] w-[8px] rounded-full shrink-0"
                style={{ backgroundColor: getPulsoColor(ed.pulsoSentimiento) }}
              />
            </div>
            <div className="flex-1" />
            <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium text-admin-ink whitespace-nowrap">
                {ed.visitas} visitas
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminMetricasPage() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <div className="shrink-0 grid grid-cols-4 gap-3">
        {mockKPIs.map((kpi) => (
          <KPICard
            key={kpi.label}
            label={kpi.label}
            valor={kpi.valor}
            descripcion={kpi.descripcion}
          />
        ))}
      </div>

      <div className="shrink-0 grid grid-cols-2 gap-3">
        <GraficoParticipacion />
        <GraficoVisitas />
      </div>

      <TablaEdicionesMasVistas />
    </div>
  );
}
