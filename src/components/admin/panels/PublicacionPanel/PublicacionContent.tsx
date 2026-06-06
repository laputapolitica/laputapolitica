"use client";

import type { Canal, MockOpinador, NoticiaPublicacion } from "./types";
import { mockOpinadores, noticias as mockNoticias } from "./mocks";
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
  titulo?: string;
  noticias?: NoticiaPublicacion[];
};

function SlideContent({
  activeCanal,
  activeSlide,
  titulo,
  noticias,
}: {
  activeCanal: Canal;
  activeSlide: number;
  titulo?: string;
  noticias: NoticiaPublicacion[];
}) {
  if (activeCanal === "instagram") {
    return <InstagramSlideContent activeSlide={activeSlide} />;
  }

  if (activeCanal === "twitter") {
    return <TwitterSlideContent activeSlide={activeSlide} />;
  }

  if (activeSlide === 1) {
    return <PortadaSlide titulo={titulo} />;
  }

  if (activeSlide === 7) {
    return <ClimaSlide />;
  }

  const noticia = noticias[activeSlide - 2];
  if (!noticia) {
    return null;
  }
  return <NoticiaSlide noticia={noticia} />;
}

export function PublicacionContent({
  state,
  onChange,
  titulo,
  noticias,
}: PublicacionContentProps) {
  const { activeCanal, activeSlide, selectedOpinador, noticiaIndex } = state;
  const noticiasData = noticias ?? mockNoticias;

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
        <SlideContent
          activeCanal={activeCanal}
          activeSlide={activeSlide}
          titulo={titulo}
          noticias={noticiasData}
        />
      )}
    </div>
  );
}
