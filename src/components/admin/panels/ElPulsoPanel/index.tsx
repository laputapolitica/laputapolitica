"use client";

import { useEffect, useState } from "react";

import type { NoticiaElPulso } from "@/app/(admin)/admin/actions";
import { LoadingText, PanelLayout } from "@/components/admin/shared";

import { ElPulsoContent } from "./Content";
import { ElPulsoHeader } from "./Header";

interface ElPulsoPanelProps {
  status: "running" | "ready";
  noticias?: NoticiaElPulso[];
  onSaveResumen?: (noticiaId: string, value: string) => Promise<void> | void;
  onRehacer?: (noticiaId: string) => Promise<void> | void;
  onVersionRestored?: () => Promise<void> | void;
}

export function ElPulsoPanel({
  status,
  noticias: noticiasProp,
  onSaveResumen,
  onRehacer,
  onVersionRestored,
}: ElPulsoPanelProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [noticias, setNoticias] = useState<NoticiaElPulso[]>(noticiasProp ?? []);
  const [rehaciendoResumen, setRehaciendoResumen] = useState(false);
  const [versionesRefresh, setVersionesRefresh] = useState(0);

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

  async function updateActiveResumen(value: string) {
    const id = noticias[activeIndex]?.id;
    setNoticias((curr) =>
      curr.map((n, i) => (i === activeIndex ? { ...n, resumen: value } : n)),
    );
    if (id) {
      await onSaveResumen?.(id, value);
      setVersionesRefresh((current) => current + 1);
    }
  }

  async function handleRehacer() {
    if (!activeNoticia) return;
    setRehaciendoResumen(true);
    try {
      await onRehacer?.(activeNoticia.id);
    } finally {
      setVersionesRefresh((current) => current + 1);
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
          onVersionRestored={onVersionRestored}
          versionRefreshKey={String(versionesRefresh)}
          rehaciendoResumen={rehaciendoResumen}
        />
      }
    />
  );
}

export type { ElPulsoPanelProps };
