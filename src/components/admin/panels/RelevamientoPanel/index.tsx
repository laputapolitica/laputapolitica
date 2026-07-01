"use client";

import { LoadingText, PanelLayout } from "@/components/admin/shared";

import { NoticiasList } from "./NoticiasList";

export type CandidataRelevamiento = {
  id: string;
  titulo: string;
  ranking: number;
  orden: number | null;
  fuente_url: string | null;
};

type NoticiasRelevamiento = {
  activas: CandidataRelevamiento[];
  descartadas: CandidataRelevamiento[];
};

export interface RelevamientoPanelProps {
  status: "running" | "ready";
  noticias?: NoticiasRelevamiento;
  onReordenar?: (ordenIds: string[]) => void;
  onEliminar?: (id: string) => void;
  onAgregar?: (id: string) => void;
}

export function RelevamientoPanel({
  status,
  noticias = { activas: [], descartadas: [] },
  onReordenar,
  onEliminar,
  onAgregar,
}: RelevamientoPanelProps) {
  if (status === "running") {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg border-2 border-admin-ink">
        <LoadingText text="Buscando y seleccionando las noticias del dia" />
      </div>
    );
  }

  const hasNoticias = noticias.activas.length > 0 || noticias.descartadas.length > 0;

  return (
    <PanelLayout
      content={
        hasNoticias ? (
          <NoticiasList
            activas={noticias.activas}
            descartadas={noticias.descartadas}
            onReordenar={onReordenar}
            onEliminar={onEliminar}
            onAgregar={onAgregar}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-lg border-2 border-admin-ink">
            <span className="font-ui text-sm text-text-secondary">Sin noticias relevadas todavía.</span>
          </div>
        )
      }
    />
  );
}
