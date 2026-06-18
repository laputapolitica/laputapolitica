"use client";

import { useEffect, useState } from "react";

import type { NoticiaTituloResumen } from "@/app/(admin)/admin/actions";
import { LoadingText, PanelLayout } from "@/components/admin/shared";

import { TitulosResumenesContent } from "./Content";
import { TitulosResumenesHeader } from "./Header";

interface TitulosResumenesPanelProps {
  status: "running" | "ready";
  noticias?: NoticiaTituloResumen[];
  onSaveTitulo?: (noticiaId: string, value: string) => void;
  onSaveResumen?: (noticiaId: string, value: string) => void;
  onRehacer?: (noticiaId: string, campo: "titulo" | "resumen") => Promise<void> | void;
  onAutorizar?: () => void;
}

export function TitulosResumenesPanel({
  status,
  noticias: noticiasProp,
  onSaveTitulo,
  onSaveResumen,
  onRehacer,
}: TitulosResumenesPanelProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [noticias, setNoticias] = useState<NoticiaTituloResumen[]>(
    noticiasProp ?? [],
  );
  const [rehaciendoTitulo, setRehaciendoTitulo] = useState(false);
  const [rehaciendoResumen, setRehaciendoResumen] = useState(false);

  useEffect(() => {
    if (noticiasProp) setNoticias(noticiasProp);
  }, [noticiasProp]);

  if (status === "running") {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg border-2 border-admin-ink">
        <LoadingText text="Creando titulos y resumenes de las noticias" />
      </div>
    );
  }

  const activeNoticia = noticias[activeIndex];

  if (!activeNoticia) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg border-2 border-admin-ink">
        <LoadingText text="Cargando" />
      </div>
    );
  }

  function updateActiveNoticia(
    field: keyof Pick<NoticiaTituloResumen, "titulo" | "resumen">,
    value: string,
  ) {
    const activeNoticiaId = noticias[activeIndex]?.id;

    setNoticias((currentNoticias) =>
      currentNoticias.map((noticia, index) =>
        index === activeIndex ? { ...noticia, [field]: value } : noticia,
      ),
    );

    if (!activeNoticiaId) return;
    if (field === "titulo") {
      onSaveTitulo?.(activeNoticiaId, value);
    } else {
      onSaveResumen?.(activeNoticiaId, value);
    }
  }

  async function handleRehacerTitulo() {
    if (!activeNoticia) return;
    setRehaciendoTitulo(true);
    try {
      await onRehacer?.(activeNoticia.id, "titulo");
    } finally {
      setRehaciendoTitulo(false);
    }
  }

  async function handleRehacerResumen() {
    if (!activeNoticia) return;
    setRehaciendoResumen(true);
    try {
      await onRehacer?.(activeNoticia.id, "resumen");
    } finally {
      setRehaciendoResumen(false);
    }
  }

  return (
    <PanelLayout
      header={
        <TitulosResumenesHeader
          noticias={noticias}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />
      }
      content={
        <TitulosResumenesContent
          noticia={activeNoticia}
          onSaveTitulo={(val) => updateActiveNoticia("titulo", val)}
          onSaveResumen={(val) => updateActiveNoticia("resumen", val)}
          onRehacerTitulo={handleRehacerTitulo}
          onRehacerResumen={handleRehacerResumen}
          rehaciendoTitulo={rehaciendoTitulo}
          rehaciendoResumen={rehaciendoResumen}
        />
      }
    />
  );
}

export type { TitulosResumenesPanelProps };
