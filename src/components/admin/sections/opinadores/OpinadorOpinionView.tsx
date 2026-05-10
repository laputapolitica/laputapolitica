"use client";

import type { MockOpinador } from "@/components/admin/panels/PublicacionPanel/types";
import { mockOpiniones } from "@/components/admin/panels/PublicacionPanel/mocks";
import { IconAtras } from "@/components/admin/icons";
import { getStatusColor } from "@/lib/colors";

type OpinadorOpinionViewProps = {
  opinador: MockOpinador;
  noticiaIndex: number;
  onNoticiaIndexChange: (index: number) => void;
  totalNoticias?: number;
  onBack?: () => void;
};

export function OpinadorOpinionView({
  opinador,
  noticiaIndex,
  onNoticiaIndexChange,
  totalNoticias = 5,
  onBack,
}: OpinadorOpinionViewProps) {
  const opinion = mockOpiniones[noticiaIndex];

  return (
    <div className="flex h-full min-h-0 flex-col font-ui">
      {/* Header interno fijo */}
      <div className="shrink-0 mb-4 flex items-center justify-between">
        {/* Izquierda: Atrás + Nombre */}
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-[24px] cursor-pointer items-center gap-1.5 rounded-[4px] border-2 border-admin-ink bg-white px-2 font-ui text-xs font-semibold text-admin-ink"
            >
              <IconAtras width={10} height={10} />
              Atras
            </button>
          )}
          <div className="inline-flex h-[24px] items-center rounded-[4px] border-2 border-admin-ink bg-white px-2 font-ui text-xs font-semibold text-admin-ink">
            {opinador.nombre}
          </div>
        </div>

        {/* Centro: navegación de noticias */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNoticiaIndexChange(Math.max(0, noticiaIndex - 1))}
            disabled={noticiaIndex === 0}
            className={`cursor-pointer inline-flex h-[24px] items-center rounded-[4px] border border-admin-ink bg-white px-3 font-ui text-sm font-medium text-admin-ink ${noticiaIndex === 0 ? "opacity-30" : ""}`}
          >
            <span style={{ paddingBottom: "1px" }}>←</span>
          </button>
          <div className="inline-flex h-[24px] items-center rounded-[4px] border-2 border-admin-ink bg-white px-2 font-ui text-xs font-semibold text-admin-ink">
            Noticia {noticiaIndex + 1}/{totalNoticias}
          </div>
          <button
            type="button"
            onClick={() => onNoticiaIndexChange(Math.min(totalNoticias - 1, noticiaIndex + 1))}
            disabled={noticiaIndex === totalNoticias - 1}
            className={`cursor-pointer inline-flex h-[24px] items-center rounded-[4px] border border-admin-ink bg-white px-3 font-ui text-sm font-medium text-admin-ink ${noticiaIndex === totalNoticias - 1 ? "opacity-30" : ""}`}
          >
            <span style={{ paddingBottom: "1px" }}>→</span>
          </button>
        </div>

        {/* Derecha: votos + completadas */}
        <div className="flex items-center gap-2">
          <div className="inline-flex h-[24px] items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-2">
            {opinador.votos.map((color, i) => (
              <span
                key={i}
                className="h-[8px] w-[8px] rounded-full"
                style={{ backgroundColor: color ?? "#E5E3DD" }}
              />
            ))}
          </div>
          <div className="inline-flex h-[24px] items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-2">
            <span className="font-ui text-xs font-semibold text-admin-ink">
              {opinador.completadas}/{totalNoticias}
            </span>
            <span
              className="h-[8px] w-[8px] rounded-full"
              style={{ backgroundColor: getStatusColor(opinador.completadas, totalNoticias) }}
            />
          </div>
        </div>
      </div>

      {/* Content scrolleable */}
      <div className="min-h-0 flex-1 overflow-y-auto space-y-4">
        <div className="inline-flex items-center rounded-[3.5px] border border-admin-ink px-2 py-1">
          <span className="font-ui text-sm font-medium text-admin-ink">{opinion.noticia}</span>
        </div>

        <div className="flex items-start rounded-[3.5px] border border-admin-ink bg-white px-2 py-1" style={{ maxWidth: '480px' }}>
          <span className="font-ui text-sm font-medium text-admin-ink">{opinion.texto}</span>
        </div>

        <div className="inline-flex flex-col gap-2">
          <div className="inline-flex items-center rounded-[3.5px] border border-admin-ink px-2 py-1">
            <span className="font-ui text-sm font-medium text-admin-ink">Interpretación</span>
          </div>
          <div className="inline-flex h-[28px] w-fit items-center gap-2 rounded-[3.5px] border border-admin-ink bg-white px-2">
            <span className="font-ui text-sm font-medium text-admin-ink">{opinion.interpretacion}</span>
            <span className="h-[8px] w-[8px] rounded-full" style={{ backgroundColor: opinion.color }} />
          </div>
        </div>
      </div>
    </div>
  );
}
