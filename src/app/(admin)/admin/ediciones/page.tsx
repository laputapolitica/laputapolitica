import { PipelineDiagram, mockState } from "@/components/admin";
import { POINT_COLORS } from "@/lib/constants";
import { mockEdiciones } from "@/lib/mock-ediciones";

function getOpinionesColor(opiniones: number, total: number): string {
  const pct = (opiniones / total) * 100;
  if (pct < 33) return POINT_COLORS.low;
  if (pct < 66) return POINT_COLORS.medium;
  return POINT_COLORS.high;
}

export default function AdminEdicionesPage() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {/* Pipeline de la edición en curso — fijo arriba */}
      <div className="shrink-0">
        <PipelineDiagram pipelineState={mockState} />
      </div>

      {/* Listado de ediciones — scrolleable */}
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
        {mockEdiciones.map((edicion) => (
          <div
            key={edicion.fechaISO}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-admin-ink px-3 py-2 transition-colors hover:bg-[#F0EDE6]"
          >
            {/* Fecha */}
            <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium text-admin-ink whitespace-nowrap">
                {edicion.fecha}
              </span>
            </div>

            {/* Título */}
            <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium text-admin-ink whitespace-nowrap">
                {edicion.titulo}
              </span>
            </div>

            {/* Opiniones */}
            <div className="inline-flex h-[24px] items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span
                className="h-[8px] w-[8px] rounded-full shrink-0"
                style={{ backgroundColor: getOpinionesColor(edicion.opiniones, edicion.totalOpinadores) }}
              />
              <span className="font-ui text-xs font-medium text-admin-ink whitespace-nowrap">
                {edicion.opiniones}/{edicion.totalOpinadores} opiniones
              </span>
            </div>

            {/* Espacio flexible */}
            <div className="flex-1" />

            {/* Hora de publicación */}
            <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium text-admin-ink whitespace-nowrap">
                {edicion.horaPublicacion}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
