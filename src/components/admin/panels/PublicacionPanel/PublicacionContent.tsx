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
import type { ClimaCiudadData } from "@/lib/clima";
import type { SlideInstagram } from "@/app/(admin)/admin/actions";

type PublicacionContentProps = {
  state: PublicacionState;
  onChange: (state: PublicacionState) => void;
  readOnly?: boolean;
  edicionId?: string;
  titulo?: string;
  noticias?: NoticiaPublicacion[];
  portadaUrl?: string | null;
  clima?: ClimaCiudadData[];
  instagram?: SlideInstagram[];
};

function SlideContent({
  activeCanal,
  activeSlide,
  edicionId,
  titulo,
  noticias,
  portadaUrl,
  clima,
  instagram,
}: {
  activeCanal: Canal;
  activeSlide: number;
  edicionId?: string;
  titulo?: string;
  noticias: NoticiaPublicacion[];
  portadaUrl?: string | null;
  clima: ClimaCiudadData[];
  instagram: SlideInstagram[];
}) {
  if (activeCanal === "instagram") {
    return <InstagramSlideContent activeSlide={activeSlide} instagram={instagram} />;
  }

  if (activeCanal === "twitter") {
    return <TwitterSlideContent activeSlide={activeSlide} />;
  }

  if (activeSlide === 1) {
    return (
      <PortadaSlide
        edicionId={edicionId}
        titulo={titulo}
        portadaUrl={portadaUrl}
      />
    );
  }

  if (activeSlide === 7) {
    return <ClimaSlide clima={clima} />;
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
  edicionId,
  titulo,
  noticias,
  portadaUrl,
  clima,
  instagram,
}: PublicacionContentProps) {
  const { activeCanal, activeSlide, selectedOpinador, noticiaIndex } = state;
  const noticiasData = noticias ?? mockNoticias;
  const climaData = clima ?? [];
  const instagramData = instagram ?? [];

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
          edicionId={edicionId}
          titulo={titulo}
          noticias={noticiasData}
          portadaUrl={portadaUrl}
          clima={climaData}
          instagram={instagramData}
        />
      )}
    </div>
  );
}
