"use client";

import { useEffect, useState } from "react";

import type { NoticiaElPulso } from "@/app/(admin)/admin/actions";
import { LoadingText, PanelLayout } from "@/components/admin/shared";

import { ElPulsoContent } from "./Content";
import { ElPulsoHeader } from "./Header";

interface ElPulsoPanelProps {
  status: "running" | "ready";
  noticias?: NoticiaElPulso[];
  onSaveResumen?: (noticiaId: string, value: string) => void;
  onRehacer?: (noticiaId: string) => Promise<void> | void;
}

export function ElPulsoPanel({
  status,
  noticias: noticiasProp,
  onSaveResumen,
  onRehacer,
}: ElPulsoPanelProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [noticias, setNoticias] = useState<NoticiaElPulso[]>(noticiasProp ?? []);
  const [rehaciendoResumen, setRehaciendoResumen] = useState(false);

  useEffect(() => {
    if (noticiasProp) setNoticias(noticiasProp);
  }, [noticiasProp]);

  if (status === "running") {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg border-2 border-admin-ink bg-bg-base">
        <LoadingText text="Creando El Pulso" />
      </div>
    );
  }

  const activeNoticia = noticias[activeIndex];
  if (!activeNoticia) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg border-2 border-admin-ink bg-bg-base">
        <LoadingText text="Sin datos de El Pulso" />
      </div>
    );
  }

  function updateActiveResumen(value: string) {
    const id = noticias[activeIndex]?.id;
    setNoticias((curr) =>
      curr.map((n, i) => (i === activeIndex ? { ...n, resumen: value } : n)),
    );
    if (id) onSaveResumen?.(id, value);
  }

  async function handleRehacer() {
    if (!activeNoticia) return;
    setRehaciendoResumen(true);
    try {
      await onRehacer?.(activeNoticia.id);
    } finally {
      setRehaciendoResumen(false);
    }
  }

  return (
    <PanelLayout
      header={
        <ElPulsoHeader
          noticias={noticias}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />
      }
      content={
        <ElPulsoContent
          noticia={activeNoticia}
          onSaveResumen={updateActiveResumen}
          onRehacerResumen={handleRehacer}
          rehaciendoResumen={rehaciendoResumen}
        />
      }
    />
  );
}

export type { ElPulsoPanelProps };
