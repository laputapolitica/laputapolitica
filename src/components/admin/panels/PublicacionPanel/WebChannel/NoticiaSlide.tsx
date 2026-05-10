"use client";

import { useState } from "react";
import { ElPulsoLogo } from "@/components/shared/ElPulsoLogo";
import { IconEditar, IconRehacer } from "@/components/admin/icons";
import { IconButton, TextArea, TextField } from "@/components/admin/shared";
import { InterpretacionGeneral } from "./InterpretacionGeneral";
import type { NoticiaPublicacion } from "../types";

export function NoticiaSlide({ noticia }: { noticia: NoticiaPublicacion }) {
  const [titulo, setTitulo] = useState(noticia.titulo);
  const [resumen, setResumen] = useState(noticia.resumen);
  const [pulso, setPulso] = useState(noticia.pulso);

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Columna izquierda: noticia */}
      <div className="flex flex-col gap-4">
        {/* TÍTULO NOTICIA */}
        <section className="flex flex-col gap-2">
          <span className="font-ui text-xs font-semibold tracking-wider text-text-secondary">
            TÍTULO NOTICIA
          </span>
          <div className="flex items-center gap-2">
            <TextField value={titulo} onSave={setTitulo} />
            <IconButton onClick={() => {}}>
              <IconEditar width={11} height={11} />
              Editar
            </IconButton>
          </div>
        </section>

        {/* RESUMEN */}
        <section className="flex flex-col gap-2">
          <span className="font-ui text-xs font-semibold tracking-wider text-text-secondary">
            RESUMEN
          </span>
          <div className="flex items-start gap-2">
            <TextArea value={resumen} onSave={setResumen} fullWidth className="h-[130px]" />
            <div className="flex w-fit flex-col items-start gap-1.5">
              <IconButton onClick={() => {}}>
                <IconEditar width={11} height={11} />
                Editar
              </IconButton>
            </div>
          </div>
        </section>
      </div>

      {/* Columna derecha: El Pulso */}
      <div className="flex flex-col gap-4">
        {/* RESUMEN DE EL PULSO */}
        <section className="flex flex-col gap-2">
          <ElPulsoLogo className="block" width={80} height={20} />
          <span className="font-ui text-xs font-semibold tracking-wider text-text-secondary">
            RESUMEN DE EL PULSO
          </span>
          <div className="flex items-start gap-2">
            <TextArea value={pulso} onSave={setPulso} fullWidth className="h-[130px]" />
            <div className="flex w-fit flex-col items-start gap-1.5">
              <IconButton onClick={() => {}}>
                <IconEditar width={11} height={11} />
                Editar
              </IconButton>
              <IconButton onClick={() => {}}>
                <IconRehacer width={11} height={11} />
                Rehacer
              </IconButton>
            </div>
          </div>
        </section>

        {/* INTERPRETACIÓN GENERAL */}
        <InterpretacionGeneral interpretacion={noticia.interpretacion} />
      </div>
    </div>
  );
}
