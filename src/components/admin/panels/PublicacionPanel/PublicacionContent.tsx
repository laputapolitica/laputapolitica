"use client";

import type { Canal, NoticiaPublicacion } from "./types";
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
import type {
  HiloTwitter,
  OpinadorEdicion,
  SlideInstagram,
} from "@/app/(admin)/admin/actions";

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
  twitter?: HiloTwitter[];
  elPulso?: {
    opinadores: OpinadorEdicion[];
    totalOpinadores: number;
  };
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
  twitter,
}: {
  activeCanal: Canal;
  activeSlide: number;
  edicionId?: string;
  titulo?: string;
  noticias: NoticiaPublicacion[];
  portadaUrl?: string | null;
  clima: ClimaCiudadData[];
  instagram: SlideInstagram[];
  twitter: HiloTwitter[];
}) {
  if (activeCanal === "instagram") {
    return <InstagramSlideContent activeSlide={activeSlide} instagram={instagram} />;
  }

  if (activeCanal === "twitter") {
    return <TwitterSlideContent activeSlide={activeSlide} twitter={twitter} />;
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
    return <ClimaSlide clima={clima} edicionId={edicionId} />;
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
  twitter,
  elPulso,
}: PublicacionContentProps) {
  const { activeCanal, activeSlide, selectedOpinador, noticiaIndex } = state;
  const noticiasData = noticias ?? [];
  const climaData = clima ?? [];
  const instagramData = instagram ?? [];
  const twitterData = twitter ?? [];
  const opinadores = elPulso?.opinadores ?? [];

  function setSelectedOpinador(opinador: OpinadorEdicion | null) {
    onChange({ ...state, selectedOpinador: opinador, noticiaIndex: 0 });
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
            opinadores={opinadores}
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
          twitter={twitterData}
        />
      )}
    </div>
  );
}
