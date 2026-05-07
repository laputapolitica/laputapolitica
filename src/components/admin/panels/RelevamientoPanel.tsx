"use client";

import { useEffect, useState } from "react";

import {
  IconAgregar,
  IconBajar,
  IconEliminar,
  IconR,
  IconSubir,
} from "@/components/admin/icons";
import { DataPill, EditableField, IconButton } from "@/components/admin/shared";

type NoticiasRelevamiento = {
  activas: string[];
  descartadas: string[];
};

export interface RelevamientoPanelProps {
  status: "running" | "ready";
  noticias?: NoticiasRelevamiento;
  onAutorizar?: () => void;
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

function LoadingText({ text }: { text: string }) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") {
          return "";
        }

        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="font-ui text-sm font-medium text-admin-ink">
      {text}
      <span className="inline-block w-[18px] text-left">{dots}</span>
    </span>
  );
}

export function RelevamientoPanel({
  status,
  noticias = defaultNoticias,
  onAutorizar,
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
    <div className="w-full font-ui">
      <div className="flex items-center gap-2 mb-6">
        <IconR width={20} height={20} />
        <DataPill>Relevamiento</DataPill>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <DataPill size="lg">Lista de Noticias</DataPill>
        <button
          type="button"
          onClick={onAutorizar}
          className="flex h-[28px] items-center rounded-[5px] border-2 border-[#35C759] bg-white px-3 font-ui text-sm font-semibold text-admin-ink"
        >
          Autorizar
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {noticias.activas.map((noticia, index) => (
          <div key={noticia} className="flex items-center gap-2">
            <EditableField value={noticia} />
            <IconButton onClick={() => onSubir?.(index)} className="h-[22px]">
              <IconSubir />
              Subir
            </IconButton>
            <IconButton onClick={() => onBajar?.(index)} className="h-[22px]">
              <IconBajar />
              Bajar
            </IconButton>
            <IconButton onClick={() => onEliminar?.(index)} className="h-[22px]">
              <IconEliminar />
              Eliminar
            </IconButton>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {noticias.descartadas.map((noticia, index) => (
          <div key={noticia} className="flex items-center gap-2">
            <EditableField value={noticia} readOnly className="opacity-40" />
            <IconButton onClick={() => onAgregar?.(index)} className="h-[22px]">
              <IconAgregar />
              Agregar
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
}
