"use client";

import { useState } from "react";
import { IconBajar, IconEditar } from "@/components/admin/icons";
import { IconButton, TextField } from "@/components/admin/shared";

export function PortadaSlide() {
  const [titulo, setTitulo] = useState("Equilibrio ciego");
  const [isEditingTitulo, setIsEditingTitulo] = useState(false);

  return (
    <div className="flex flex-col gap-6 font-ui">
      {/* TÍTULO */}
      <section className="flex flex-col gap-2">
        <span className="font-ui text-xs font-semibold tracking-wider text-text-secondary">
          TÍTULO
        </span>
        <div className="flex items-center gap-2">
          <TextField
            value={titulo}
            onSave={setTitulo}
            isEditing={isEditingTitulo}
            onEditingChange={setIsEditingTitulo}
          />
          <IconButton onClick={() => setIsEditingTitulo(true)}>
            <IconEditar width={11} height={11} />
            Editar
          </IconButton>
        </div>
      </section>

      {/* PORTADA */}
      <section className="flex flex-col gap-2">
        <span className="font-ui text-xs font-semibold tracking-wider text-text-secondary">
          PORTADA
        </span>
        <div className="flex items-start gap-4">
          <div className="h-[200px] w-[200px] shrink-0 rounded-lg border border-admin-ink bg-gray-200" />
          <div className="flex flex-col items-start gap-2">
            <IconButton onClick={() => {}}>
              <IconBajar width={11} height={11} />
              Descargar
            </IconButton>
          </div>
        </div>
      </section>
    </div>
  );
}
