"use client";

import { LoadingText, PanelLayout } from "@/components/admin/shared";

import { NoticiasList } from "./NoticiasList";

type NoticiasRelevamiento = {
  activas: string[];
  descartadas: string[];
};

export interface RelevamientoPanelProps {
  status: "running" | "ready";
  noticias?: NoticiasRelevamiento;
  onSubir?: (index: number) => void;
  onBajar?: (index: number) => void;
  onEliminar?: (index: number) => void;
  onAgregar?: (index: number) => void;
}

const defaultNoticias: NoticiasRelevamiento = {
  activas: [
    "Ajustes y subsidios al transporte",
    "Negociaciones con el FMI",
    "Conflicto con gobernadores",
    "Reformas legislativas",
    "Clima social y protestas",
  ],
  descartadas: [
    "La inflación vuelve a acelerarse",
    "Polémica por la reforma de la Ley de Glaciares",
    "Escándalo y presión sobre el vocero Manuel Adorni",
    "Despidos en el Estado (Servicio Meteorológico)",
    "Filtraciones de tensiones entre funcionarios y empresarios",
  ],
};

export function RelevamientoPanel({
  status,
  noticias = defaultNoticias,
  onSubir,
  onBajar,
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

  return (
    <PanelLayout
      content={
        <NoticiasList
          activas={noticias.activas}
          descartadas={noticias.descartadas}
          onSubir={onSubir}
          onBajar={onBajar}
          onEliminar={onEliminar}
          onAgregar={onAgregar}
        />
      }
    />
  );
}
