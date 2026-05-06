import type { MockOpinador } from "../types";
import { mockOpinadores } from "../mocks";
import { getStatusColor } from "@/lib/colors";

export function ElPulsoListView({ onSelect }: { onSelect: (opinador: MockOpinador) => void }) {
  const opinadoresOrdenados = [...mockOpinadores].sort((a, b) =>
    b.ultimaRespuesta.localeCompare(a.ultimaRespuesta),
  );

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {opinadoresOrdenados.map((op) => (
          <div
            key={op.id}
            onClick={() => onSelect(op)}
            className="flex cursor-pointer items-center justify-between rounded-lg border border-admin-ink px-3 py-2 transition-colors hover:bg-[#F0EDE6]"
          >
            <div className="flex items-center gap-2">
              <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
                <span className="font-ui text-xs font-medium text-admin-ink">
                  {op.nombre}
                </span>
              </div>
              <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
                <span className="font-ui text-xs font-medium text-admin-ink">
                  {op.email}
                </span>
              </div>
              <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
                <span className="font-ui text-xs font-medium text-admin-ink">
                  {op.ciudad}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex h-[24px] items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-2">
                {op.votos.map((color, i) => (
                  <span
                    key={i}
                    className="h-[8px] w-[8px] rounded-full"
                    style={{ backgroundColor: color ?? "#E5E3DD" }}
                  />
                ))}
              </div>
              <div className="inline-flex h-[24px] items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-2">
                <span className="font-ui text-xs font-semibold text-admin-ink">
                  {op.completadas}/5
                </span>
                <span
                  className="h-[8px] w-[8px] rounded-full"
                  style={{ backgroundColor: getStatusColor(op.completadas, 5) }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
