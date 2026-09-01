"use client";

import { useState, useEffect } from "react";
import type { NoticiaTituloResumen } from "@/app/(admin)/admin/actions";
import { IconEditar, IconRehacer } from "@/components/admin/icons";
import {
  IconButton,
  TextArea,
  TextField,
  VersionesTextoControl,
} from "@/components/admin/shared";

type ContentProps = {
  noticia: NoticiaTituloResumen;
  onSaveTitulo: (value: string) => void;
  onSaveResumen: (value: string) => void;
  onRehacerTitulo: () => void;
  onRehacerResumen: () => void;
  onVersionRestored?: () => Promise<void> | void;
  versionRefreshKey?: string;
  rehaciendoTitulo?: boolean;
  rehaciendoResumen?: boolean;
};

export function TitulosResumenesContent({
  noticia,
  onSaveTitulo,
  onSaveResumen,
  onRehacerTitulo,
  onRehacerResumen,
  onVersionRestored,
  versionRefreshKey,
  rehaciendoTitulo = false,
  rehaciendoResumen = false,
}: ContentProps) {
  const [isEditingTitulo, setIsEditingTitulo] = useState(false);
  const [isEditingResumen, setIsEditingResumen] = useState(false);

  // Reset edición cuando cambia la noticia
  useEffect(() => {
    setIsEditingTitulo(false);
    setIsEditingResumen(false);
  }, [noticia.id]);

  return (
    <div className="flex h-full min-w-0 flex-col gap-4 font-ui">
      {/* TÍTULO */}
      <section className="flex min-w-0 flex-col gap-2">
        <span className="font-ui text-xs font-semibold tracking-wider text-text-secondary">
          TÍTULO
        </span>
        <div className="flex min-w-0 items-center gap-2">
          <TextField
            value={noticia.titulo}
            onSave={onSaveTitulo}
            isEditing={isEditingTitulo}
            onEditingChange={setIsEditingTitulo}
          />
          {!isEditingTitulo && (
            <>
              <IconButton onClick={() => setIsEditingTitulo(true)}>
                <IconEditar width={11} height={11} />
                Editar
              </IconButton>
              <IconButton
                onClick={onRehacerTitulo}
                disabled={rehaciendoTitulo}
              >
                <IconRehacer width={11} height={11} />
                {rehaciendoTitulo ? "Rehaciendo..." : "Rehacer"}
              </IconButton>
              <VersionesTextoControl
                entidadTipo="noticia"
                entidadId={noticia.id}
                campo="titulo"
                refreshKey={`${noticia.titulo}:${versionRefreshKey ?? ""}`}
                onRestored={onVersionRestored}
              />
            </>
          )}
        </div>
      </section>

      {/* RESUMEN */}
      <section className="flex flex-col gap-2">
        <span className="font-ui text-xs font-semibold tracking-wider text-text-secondary">
          RESUMEN
        </span>
        <div className="flex items-start gap-2">
          <TextArea
            value={noticia.resumen}
            onSave={onSaveResumen}
            isEditing={isEditingResumen}
            onEditingChange={setIsEditingResumen}
            className="h-[160px]"
          />
          {!isEditingResumen && (
            <div className="flex w-fit flex-col items-start gap-1.5">
              <IconButton onClick={() => setIsEditingResumen(true)}>
                <IconEditar width={11} height={11} />
                Editar
              </IconButton>
              <IconButton
                onClick={onRehacerResumen}
                disabled={rehaciendoResumen}
              >
                <IconRehacer width={11} height={11} />
                {rehaciendoResumen ? "Rehaciendo..." : "Rehacer"}
              </IconButton>
              <VersionesTextoControl
                entidadTipo="noticia"
                entidadId={noticia.id}
                campo="cuerpo"
                refreshKey={`${noticia.resumen}:${versionRefreshKey ?? ""}`}
                onRestored={onVersionRestored}
              />
            </div>
          )}
        </div>
      </section>

      {/* FUENTES */}
      <section className="mt-auto flex flex-wrap gap-2 pt-4">
        {noticia.fuentes.map((fuente, index) => (
          <a
            key={`${index}-${fuente.nombre}`}
            href={fuente.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-[24px] cursor-pointer items-center rounded-[3.5px] border border-admin-ink bg-white px-2 font-ui text-xs font-medium text-admin-ink transition-colors hover:bg-[#F0EDE6]"
          >
            {fuente.nombre}
          </a>
        ))}
      </section>
    </div>
  );
}
