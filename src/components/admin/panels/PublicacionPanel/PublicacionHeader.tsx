"use client";

import type { Canal, MockOpinador } from "./types";
import { canales } from "./mocks";
import { TabPrimary, TabSecondary } from "@/components/admin/shared";
import { CanalIcon } from "./shared/CanalIcon";
import { ElPulsoLogo } from "@/components/shared/ElPulsoLogo";
import type { HiloTwitter } from "@/app/(admin)/admin/actions";

export type PublicacionState = {
  activeCanal: Canal;
  activeSlide: number;
  selectedOpinador: MockOpinador | null;
  noticiaIndex: number;
};

type PublicacionHeaderProps = {
  state: PublicacionState;
  onChange: (state: PublicacionState) => void;
  twitter?: HiloTwitter[];
};

export function PublicacionHeader({ state, onChange, twitter }: PublicacionHeaderProps) {
  const { activeCanal, activeSlide, selectedOpinador } = state;
  const slideCount =
    activeCanal === "twitter" ? (twitter?.length ?? 0) : activeCanal === "instagram" ? 4 : 7;

  function setActiveCanal(canal: Canal) {
    onChange({ ...state, activeCanal: canal, activeSlide: 1 });
  }

  function setActiveSlide(slide: number) {
    onChange({ ...state, activeSlide: slide });
  }

  return (
    <div className="flex flex-col gap-2">
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

      {/* Sub-controles cuando es elpulso y NO hay opinador seleccionado */}
      {activeCanal === "elpulso" && !selectedOpinador && (
        <div className="mt-2 flex items-center justify-between">
          <div className="inline-flex h-[24px] items-center rounded-[4px] border-2 border-admin-ink bg-white px-2 font-ui text-xs font-semibold text-admin-ink">
            14/25 opiniones
          </div>
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
