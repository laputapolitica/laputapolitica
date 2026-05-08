"use client";

import { IconBajar, IconEditar, IconRehacer, IconSubir } from "@/components/admin/icons";
import { IconButton, TextField } from "@/components/admin/shared";

type PortadaContentProps = {
  titulo: string;
  onSaveTitulo: (value: string) => void;
};

export function PortadaContent({ titulo, onSaveTitulo }: PortadaContentProps) {
  return (
    <div className="flex flex-col gap-6 font-ui">
      {/* TÍTULO */}
      <section className="flex flex-col gap-2">
        <span className="font-ui text-xs font-semibold tracking-wider text-text-secondary">
          TÍTULO
        </span>
        <div className="flex items-center gap-2">
          <TextField value={titulo} onSave={onSaveTitulo} />
          <IconButton onClick={() => {}}>
            <IconEditar width={11} height={11} />
            Editar
          </IconButton>
          <IconButton onClick={() => {}}>
            <IconRehacer width={11} height={11} />
            Rehacer
          </IconButton>
        </div>
      </section>

      {/* PORTADA */}
      <section className="flex flex-col gap-2">
        <span className="font-ui text-xs font-semibold tracking-wider text-text-secondary">
          PORTADA
        </span>
        <div className="flex items-start gap-4">
          <div className="h-[300px] w-[300px] shrink-0 rounded-lg border border-admin-ink bg-gray-200" />
          <div className="flex flex-col items-start gap-2">
            <IconButton onClick={() => {}}>
              <IconRehacer width={11} height={11} />
              Rehacer
            </IconButton>
            <IconButton onClick={() => {}}>
              <IconBajar width={11} height={11} />
              Descargar
            </IconButton>
            <IconButton onClick={() => {}}>
              <IconSubir width={11} height={11} />
              Subir portada
            </IconButton>
          </div>
        </div>
      </section>
    </div>
  );
}
