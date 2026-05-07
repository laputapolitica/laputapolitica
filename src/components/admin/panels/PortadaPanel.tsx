"use client";

import { useState } from "react";

import {
  IconBajar,
  IconEditar,
  IconR,
  IconRehacer,
  IconSubir,
} from "@/components/admin/icons";
import { LoadingTextGrid } from "@/components/admin/shared";

interface PortadaPanelProps {
  status: "loading" | "ready";
  onAutorizar?: () => void;
}

function PanelButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="flex h-[22px] items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-2.5 font-ui text-xs font-medium text-admin-ink"
    >
      {children}
    </button>
  );
}

function ImageButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex h-[22px] items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-2.5 font-ui text-xs font-medium text-admin-ink"
    >
      {children}
    </button>
  );
}

export function PortadaPanel({ status, onAutorizar }: PortadaPanelProps) {
  const [titulo, setTitulo] = useState("Equilibrio ciego");

  if (status === "loading") {
    return (
      <LoadingTextGrid
        messages={[
          "Creando portada",
          "Ventana de opinion de El Pulso abierta",
        ]}
      />
    );
  }

  return (
    <div className="w-full font-ui">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconR width={20} height={20} color="#FF5C60" />
          <div className="flex h-[22px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
            <span className="font-ui text-[11px] font-medium leading-none text-admin-ink whitespace-nowrap">
              Portada
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onAutorizar}
          className="flex h-[28px] items-center rounded-[5px] border-2 border-admin-success bg-white px-3 font-ui text-sm font-semibold text-admin-ink"
        >
          Autorizar
        </button>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-ui text-xs font-semibold tracking-wider text-text-secondary">
            TÍTULO
          </span>
          <div className="flex items-center gap-2">
            <PanelButton>
              <IconEditar width={12} height={12} />
              <span className="font-ui text-xs font-medium text-admin-ink">
                Editar
              </span>
            </PanelButton>
            <PanelButton>
              <IconRehacer width={12} height={12} />
              <span className="font-ui text-xs font-medium text-admin-ink">
                Rehacer
              </span>
            </PanelButton>
          </div>
        </div>

        <input
          type="text"
          value={titulo}
          onChange={(event) => setTitulo(event.target.value)}
          className="w-full rounded-[4px] border border-admin-ink bg-white px-3 py-2 font-ui text-sm font-medium text-admin-ink outline-none"
        />
      </div>

      <p className="mb-2 font-ui text-xs font-semibold tracking-wider text-text-secondary">
        PORTADA
      </p>

      <div className="mt-4 flex flex-row items-start gap-4">
        <div className="h-[300px] w-[300px] shrink-0 rounded-lg border border-admin-ink bg-gray-200" />
        <div className="flex flex-col gap-2 items-start">
          <ImageButton>
            <IconRehacer width={12} height={12} />
            <span className="font-ui text-xs font-medium text-admin-ink">
              Rehacer
            </span>
          </ImageButton>
          <ImageButton>
            <IconBajar width={12} height={12} />
            <span className="font-ui text-xs font-medium text-admin-ink">
              Descargar
            </span>
          </ImageButton>
          <ImageButton>
            <IconSubir width={12} height={12} />
            <span className="font-ui text-xs font-medium text-admin-ink">
              Subir portada
            </span>
          </ImageButton>
        </div>
      </div>
    </div>
  );
}

export type { PortadaPanelProps };
