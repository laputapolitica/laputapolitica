"use client";

import { LoadingText, PanelLayout } from "@/components/admin/shared";

import { NoticiasList } from "./NoticiasList";

export type CandidataRelevamiento = {
  id: string;
  titulo: string;
  ranking: number;
  fuente_url: string | null;
};

type NoticiasRelevamiento = {
  activas: CandidataRelevamiento[];
  descartadas: CandidataRelevamiento[];
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
    { id: "mock-1", titulo: "El Senado aprobó el pliego de la jueza que el Gobierno había intentado vetar", ranking: 1, fuente_url: null },
    { id: "mock-2", titulo: "Negociaciones con el FMI", ranking: 2, fuente_url: null },
    { id: "mock-3", titulo: "Primer cimbronazo por la reforma laboral: el Gobierno intimará a empresas y sindicatos para renegociar 150 convenios colectivos", ranking: 3, fuente_url: null },
    { id: "mock-4", titulo: "Conflicto con gobernadores por la coparticipación", ranking: 4, fuente_url: null },
    { id: "mock-5", titulo: "Clima social y protestas", ranking: 5, fuente_url: null },
  ],
  descartadas: [
    { id: "mock-6", titulo: "La inflación vuelve a acelerarse", ranking: 6, fuente_url: null },
    { id: "mock-7", titulo: "Polémica por la reforma de la Ley de Glaciares", ranking: 7, fuente_url: null },
    { id: "mock-8", titulo: "Despidos en el Estado (Servicio Meteorológico)", ranking: 8, fuente_url: null },
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
