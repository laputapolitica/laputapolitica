"use client";

import type { Canal, MockOpinador } from "./types";
import { canales, mockOpiniones } from "./mocks";
import { TabPrimary, TabSecondary } from "@/components/admin/shared";
import { CanalIcon } from "./shared/CanalIcon";
import { IconAtras } from "@/components/admin/icons";
import { getStatusColor } from "@/lib/colors";
import { ElPulsoLogo } from "@/components/shared/ElPulsoLogo";

export type PublicacionState = {
  activeCanal: Canal;
  activeSlide: number;
  selectedOpinador: MockOpinador | null;
  noticiaIndex: number;
};

type PublicacionHeaderProps = {
  state: PublicacionState;
  onChange: (state: PublicacionState) => void;
  readOnly?: boolean;
};

export function PublicacionHeader({ state, onChange, readOnly = false }: PublicacionHeaderProps) {
  const { activeCanal, activeSlide, selectedOpinador, noticiaIndex } = state;
  const slideCount = activeCanal === "twitter" ? 12 : activeCanal === "instagram" ? 4 : 7;

  function setActiveCanal(canal: Canal) {
    onChange({ ...state, activeCanal: canal, activeSlide: 1 });
  }

  function setActiveSlide(slide: number) {
    onChange({ ...state, activeSlide: slide });
  }

  function setSelectedOpinador(opinador: MockOpinador | null) {
    onChange({ ...state, selectedOpinador: opinador });
  }

  function setNoticiaIndex(updater: (prev: number) => number) {
    onChange({ ...state, noticiaIndex: updater(noticiaIndex) });
  }

  return (
    <div className="flex flex-col gap-2 pb-4">
      {/* Tabs canales + logo El Pulso */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {canales.map((canal: { id: Canal; label: string }) => (
            <TabPrimary
              key={canal.id}
              isActive={activeCanal === canal.id}
              onClick={() => setActiveCanal(canal.id)}
            >
              <CanalIcon canal={canal.id} />
              {canal.label}
            </TabPrimary>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setActiveCanal("elpulso")}
          className={`flex cursor-pointer items-center ${activeCanal === "elpulso" ? "opacity-100" : "opacity-30"}`}
        >
          <ElPulsoLogo width={82} height={20} />
        </button>
      </div>

      {/* Sub-controles según el canal */}
      {activeCanal === "elpulso" && (
        <div className="mt-2 flex items-center justify-between">
          {selectedOpinador ? (
            <>
              <div className="flex items-center gap-2">
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => setSelectedOpinador(null)}
                    className="inline-flex h-[24px] cursor-pointer items-center gap-1.5 rounded-[4px] border-2 border-admin-ink bg-white px-2 font-ui text-xs font-semibold text-admin-ink"
                  >
                    <IconAtras width={10} height={10} />
                    Atras
                  </button>
                )}
                <div className="inline-flex h-[24px] items-center rounded-[4px] border-2 border-admin-ink bg-white px-2 font-ui text-xs font-semibold text-admin-ink">
                  {selectedOpinador.nombre}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setNoticiaIndex((i) => Math.max(0, i - 1))}
                  disabled={noticiaIndex === 0}
                  className={`cursor-pointer inline-flex h-[24px] items-center rounded-[4px] border border-admin-ink bg-white px-3 font-ui text-sm font-medium text-admin-ink ${noticiaIndex === 0 ? "opacity-30" : ""}`}
                >
                  <span style={{ paddingBottom: "1px" }}>←</span>
                </button>
                <div className="inline-flex h-[24px] items-center rounded-[4px] border-2 border-admin-ink bg-white px-2 font-ui text-xs font-semibold text-admin-ink">
                  Noticia {noticiaIndex + 1}/{mockOpiniones.length}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setNoticiaIndex((i) => Math.min(mockOpiniones.length - 1, i + 1))
                  }
                  disabled={noticiaIndex === mockOpiniones.length - 1}
                  className={`cursor-pointer inline-flex h-[24px] items-center rounded-[4px] border border-admin-ink bg-white px-3 font-ui text-sm font-medium text-admin-ink ${noticiaIndex === mockOpiniones.length - 1 ? "opacity-30" : ""}`}
                >
                  <span style={{ paddingBottom: "1px" }}>→</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex h-[24px] items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-2">
                  {selectedOpinador.votos.map((color, i) => (
                    <span
                      key={i}
                      className="h-[8px] w-[8px] rounded-full"
                      style={{ backgroundColor: color ?? "#E5E3DD" }}
                    />
                  ))}
                </div>
                <div className="inline-flex h-[24px] items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-2">
                  <span className="font-ui text-xs font-semibold text-admin-ink">
                    {selectedOpinador.completadas}/5
                  </span>
                  <span
                    className="h-[8px] w-[8px] rounded-full"
                    style={{
                      backgroundColor: getStatusColor(selectedOpinador.completadas, 5),
                    }}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="inline-flex h-[24px] items-center rounded-[4px] border-2 border-admin-ink bg-white px-2 font-ui text-xs font-semibold text-admin-ink">
              14/25 opiniones
            </div>
          )}
        </div>
      )}

      {/* Tabs de slides (solo si NO es elpulso) */}
      {activeCanal !== "elpulso" && (
        <div className="flex gap-2">
          {Array.from({ length: slideCount }, (_, index) => index + 1).map((slide) => (
            <TabSecondary
              key={slide}
              isActive={activeSlide === slide}
              onClick={() => setActiveSlide(slide)}
            >
              {activeCanal === "twitter"
                ? `Hilo ${String(slide).padStart(2, "0")}`
                : `Slide ${String(slide).padStart(2, "0")}`}
            </TabSecondary>
          ))}
        </div>
      )}
    </div>
  );
}
