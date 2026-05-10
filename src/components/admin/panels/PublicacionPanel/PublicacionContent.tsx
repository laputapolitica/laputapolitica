"use client";

import type { Canal, MockOpinador } from "./types";
import { mockOpinadores, noticias } from "./mocks";
import { PortadaSlide } from "./WebChannel/PortadaSlide";
import { NoticiaSlide } from "./WebChannel/NoticiaSlide";
import { ClimaSlide } from "./WebChannel/ClimaSlide";
import { InstagramSlideContent } from "./InstagramChannel";
import { TwitterSlideContent } from "./TwitterChannel";
import {
  OpinadoresEdicionList,
  OpinadorOpinionView,
} from "@/components/admin/sections/opinadores";
import type { PublicacionState } from "./PublicacionHeader";

type PublicacionContentProps = {
  state: PublicacionState;
  onChange: (state: PublicacionState) => void;
  readOnly?: boolean;
};

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

export function PublicacionContent({ state, onChange }: PublicacionContentProps) {
  const { activeCanal, activeSlide, selectedOpinador, noticiaIndex } = state;

  function setSelectedOpinador(opinador: MockOpinador | null) {
    onChange({ ...state, selectedOpinador: opinador });
  }

  function setNoticiaIndex(index: number) {
    onChange({ ...state, noticiaIndex: index });
  }

  return (
    <div className="h-full min-h-0 overflow-y-auto">
      {activeCanal === "elpulso" ? (
        selectedOpinador ? (
          <OpinadorOpinionView
            opinador={selectedOpinador}
            noticiaIndex={noticiaIndex}
            onNoticiaIndexChange={setNoticiaIndex}
            onBack={() => setSelectedOpinador(null)}
          />
        ) : (
          <OpinadoresEdicionList
            opinadores={mockOpinadores}
            onSelect={setSelectedOpinador}
          />
        )
      ) : (
        <SlideContent activeCanal={activeCanal} activeSlide={activeSlide} />
      )}
    </div>
  );
}
