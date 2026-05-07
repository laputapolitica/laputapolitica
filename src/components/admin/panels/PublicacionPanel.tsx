"use client";

import { useState } from "react";

import { IconAtras } from "@/components/admin/icons";
import type { Canal, MockOpinador } from "./PublicacionPanel/types";
import { canales, mockOpiniones, noticias } from "./PublicacionPanel/mocks";
import { LoadingTextGrid } from "@/components/admin/shared";
import { CanalIcon } from "./PublicacionPanel/shared/CanalIcon";
import { TabButton } from "./PublicacionPanel/shared/TabButton";
import { getStatusColor } from "@/lib/colors";
import { PortadaSlide } from "./PublicacionPanel/WebChannel/PortadaSlide";
import { NoticiaSlide } from "./PublicacionPanel/WebChannel/NoticiaSlide";
import { ClimaSlide } from "./PublicacionPanel/WebChannel/ClimaSlide";
import { InstagramSlideContent } from "./PublicacionPanel/InstagramChannel";
import { TwitterSlideContent } from "./PublicacionPanel/TwitterChannel";
import { ElPulsoChannel } from "./PublicacionPanel/ElPulsoChannel";
import { ElPulsoLogo } from "@/components/shared/ElPulsoLogo";

interface PublicacionPanelProps {
  status: "loading" | "ready";
  onPublicar?: () => void;
}

function SlideContent({
  activeCanal,
  activeSlide,
}: {
  activeCanal: Canal;
  activeSlide: number;
}) {
  if (activeCanal === "instagram") {
    return <InstagramSlideContent activeSlide={activeSlide} />;
  }

  if (activeCanal === "twitter") {
    return <TwitterSlideContent activeSlide={activeSlide} />;
  }

  if (activeSlide === 1) {
    return <PortadaSlide />;
  }

  if (activeSlide === 7) {
    return <ClimaSlide />;
  }

  return <NoticiaSlide noticia={noticias[activeSlide - 2]} />;
}

export function PublicacionPanel({ status, onPublicar }: PublicacionPanelProps) {
  const [activeCanal, setActiveCanal] = useState<Canal>("web");
  const [activeSlide, setActiveSlide] = useState(1);
  const [selectedOpinador, setSelectedOpinador] = useState<MockOpinador | null>(
    null,
  );
  const [noticiaIndex, setNoticiaIndex] = useState(0);
  const slideCount = activeCanal === "twitter" ? 12 : activeCanal === "instagram" ? 4 : 7;

  if (status === "loading") {
    return (
      <LoadingTextGrid
        messages={[
          "Creando contenido para la Web",
          "Creando contenido para Instagram",
          "Creando contenido para X (Twitter)",
        ]}
      />
    );
  }

  return (
    <div className="flex h-full flex-col font-ui">
      <div className="shrink-0 bg-bg-base pb-4">
        <header className="mb-4 flex items-center justify-between">
          <div className="flex h-[22px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
            <span className="font-ui text-[11px] font-medium leading-none text-admin-ink">
              Publicación
            </span>
          </div>
          <button
            type="button"
            onClick={onPublicar}
            className="flex h-[28px] cursor-pointer items-center rounded-[5px] border-2 border-admin-success bg-white px-3 font-ui text-sm font-semibold text-admin-ink"
          >
            Publicar
          </button>
        </header>

        <div className="mb-2 flex items-center justify-between">
          <div className="flex gap-2">
            {canales.map((canal) => (
              <TabButton
                key={canal.id}
                isActive={activeCanal === canal.id}
                onClick={() => {
                  setActiveCanal(canal.id);
                  setActiveSlide(1);
                }}
              >
                <CanalIcon canal={canal.id} />
                {canal.label}
              </TabButton>
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

        {activeCanal === "elpulso" && (
          <div className="mb-2 mt-4 flex items-center justify-between">
            {selectedOpinador ? (
              <>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOpinador(null)}
                    className="inline-flex h-[24px] cursor-pointer items-center gap-1.5 rounded-[4px] border-2 border-admin-ink bg-white px-2 font-ui text-xs font-semibold text-admin-ink"
                  >
                    <IconAtras width={10} height={10} />
                    Atras
                  </button>
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
                      setNoticiaIndex((i) =>
                        Math.min(mockOpiniones.length - 1, i + 1),
                      )
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
                      <span key={i} className="h-[8px] w-[8px] rounded-full" style={{ backgroundColor: color ?? "#E5E3DD" }} />
                    ))}
                  </div>
                  <div className="inline-flex h-[24px] items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-2">
                    <span className="font-ui text-xs font-semibold text-admin-ink">{selectedOpinador.completadas}/5</span>
                    <span className="h-[8px] w-[8px] rounded-full" style={{ backgroundColor: getStatusColor(selectedOpinador.completadas, 5) }} />
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

        {activeCanal !== "elpulso" ? (
          <div className="mb-2 flex gap-2">
            {Array.from({ length: slideCount }, (_, index) => index + 1).map(
              (slide) => (
                <TabButton
                  key={slide}
                  isActive={activeSlide === slide}
                  onClick={() => setActiveSlide(slide)}
                  size="small"
                >
                  {activeCanal === "twitter"
                    ? `Hilo ${String(slide).padStart(2, "0")}`
                    : `Slide ${String(slide).padStart(2, "0")}`}
                </TabButton>
              ),
            )}
          </div>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {activeCanal === "elpulso" ? (
          <ElPulsoChannel
            selectedOpinador={selectedOpinador}
            noticiaIndex={noticiaIndex}
            onSelect={setSelectedOpinador}
          />
        ) : (
          <SlideContent activeCanal={activeCanal} activeSlide={activeSlide} />
        )}
      </div>
    </div>
  );
}

export type { PublicacionPanelProps };
