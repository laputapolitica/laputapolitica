"use client";

import { useState } from "react";

import { LoadingTextGrid, PanelLayout } from "@/components/admin/shared";
import type { Canal, MockOpinador, NoticiaPublicacion } from "./types";
import { PublicacionHeader, type PublicacionState } from "./PublicacionHeader";
import { PublicacionContent } from "./PublicacionContent";
import type { ClimaCiudadData } from "@/lib/clima";

interface PublicacionPanelProps {
  status: "loading" | "ready";
  edicionId?: string;
  titulo?: string;
  noticias?: NoticiaPublicacion[];
  portadaUrl?: string | null;
  clima?: ClimaCiudadData[];
}

const initialState: PublicacionState = {
  activeCanal: "web" satisfies Canal,
  activeSlide: 1,
  selectedOpinador: null as MockOpinador | null,
  noticiaIndex: 0,
};

export function PublicacionPanel({
  status,
  edicionId,
  titulo,
  noticias,
  portadaUrl,
  clima,
}: PublicacionPanelProps) {
  const [state, setState] = useState<PublicacionState>(initialState);

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
    <PanelLayout
      header={<PublicacionHeader state={state} onChange={setState} />}
      content={
        <PublicacionContent
          state={state}
          onChange={setState}
          edicionId={edicionId}
          titulo={titulo}
          noticias={noticias}
          portadaUrl={portadaUrl}
          clima={clima}
        />
      }
    />
  );
}

export type { PublicacionPanelProps };
