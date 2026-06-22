"use client";

import { useState, useEffect } from "react";
import { ElPulsoLogo } from "@/components/shared/ElPulsoLogo";
import { IconEditar } from "@/components/admin/icons";
import { IconButton, TextArea, TextField } from "@/components/admin/shared";
import {
  guardarTituloNoticia,
  guardarResumenNoticia,
  guardarPulsoNoticia,
} from "@/app/(admin)/admin/ediciones/[fecha]/actions";
import { InterpretacionGeneral } from "./InterpretacionGeneral";
import type { NoticiaPublicacion } from "../types";

export function NoticiaSlide({ noticia }: { noticia: NoticiaPublicacion }) {
  const [titulo, setTitulo] = useState(noticia.titulo);
  const [resumen, setResumen] = useState(noticia.resumen);
  const [pulso, setPulso] = useState(noticia.pulso);

  const [isEditingTitulo, setIsEditingTitulo] = useState(false);
  const [isEditingResumen, setIsEditingResumen] = useState(false);
  const [isEditingPulso, setIsEditingPulso] = useState(false);

  const [error, setError] = useState<string | undefined>();

  // Reset estados al cambiar de noticia
  useEffect(() => {
    setTitulo(noticia.titulo);
    setResumen(noticia.resumen);
    setPulso(noticia.pulso);
    setIsEditingTitulo(false);
    setIsEditingResumen(false);
    setIsEditingPulso(false);
    setError(undefined);
  }, [noticia]);

  async function handleSaveTitulo(value: string) {
    setTitulo(value);
    setError(undefined);
    const res = await guardarTituloNoticia(noticia.id, value);
    if (res.error) setError(res.error);
  }

  async function handleSaveResumen(value: string) {
    setResumen(value);
    setError(undefined);
    const res = await guardarResumenNoticia(noticia.id, value);
    if (res.error) setError(res.error);
  }

  async function handleSavePulso(value: string) {
    setPulso(value);
    setError(undefined);
    const res = await guardarPulsoNoticia(noticia.id, value);
    if (res.error) setError(res.error);
  }

  return (
    <div className="grid min-w-0 grid-cols-2 gap-4">
      {/* Columna izquierda: noticia */}
      <div className="flex min-w-0 flex-col gap-4">
        {/* TÍTULO NOTICIA */}
        <section className="flex min-w-0 flex-col gap-2">
          <span className="font-ui text-xs font-semibold tracking-wider text-text-secondary">
            TÍTULO NOTICIA
          </span>
          <div className="flex items-center gap-2">
            <TextField
              value={titulo}
              onSave={handleSaveTitulo}
              isEditing={isEditingTitulo}
              onEditingChange={setIsEditingTitulo}
            />
            {!isEditingTitulo && (
              <IconButton onClick={() => setIsEditingTitulo(true)}>
                <IconEditar width={11} height={11} />
                Editar
              </IconButton>
            )}
          </div>
        </section>

        {/* RESUMEN */}
        <section className="flex flex-col gap-2">
          <span className="font-ui text-xs font-semibold tracking-wider text-text-secondary">
            RESUMEN
          </span>
          <div className="flex min-w-0 items-start gap-2">
            <TextArea
              value={resumen}
              onSave={handleSaveResumen}
              isEditing={isEditingResumen}
              onEditingChange={setIsEditingResumen}
              fullWidth
              className="h-[130px]"
            />
            {!isEditingResumen && (
              <div className="flex w-fit flex-col items-start gap-1.5">
                <IconButton onClick={() => setIsEditingResumen(true)}>
                  <IconEditar width={11} height={11} />
                  Editar
                </IconButton>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Columna derecha: El Pulso */}
      <div className="flex min-w-0 flex-col gap-4">
        {/* RESUMEN DE EL PULSO */}
        <section className="flex min-w-0 flex-col gap-2">
          <ElPulsoLogo className="block" width={80} height={20} />
          <span className="font-ui text-xs font-semibold tracking-wider text-text-secondary">
            RESUMEN DE EL PULSO
          </span>
          <div className="flex min-w-0 items-start gap-2">
            <TextArea
              value={pulso}
              onSave={handleSavePulso}
              isEditing={isEditingPulso}
              onEditingChange={setIsEditingPulso}
              fullWidth
              className="h-[130px]"
            />
            {!isEditingPulso && (
              <div className="flex w-fit flex-col items-start gap-1.5">
                <IconButton onClick={() => setIsEditingPulso(true)}>
                  <IconEditar width={11} height={11} />
                  Editar
                </IconButton>
              </div>
            )}
          </div>
        </section>

        {/* INTERPRETACIÓN GENERAL */}
        <InterpretacionGeneral interpretacion={noticia.interpretacion} />
      </div>

      {error ? (
        <p className="col-span-2 font-ui text-sm text-state-required">{error}</p>
      ) : null}
    </div>
  );
}
