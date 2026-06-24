"use client";

import { useEffect, useState } from "react";
import { IconCopiar, IconEditar } from "@/components/admin/icons";
import { IconButton, TextArea, TextField } from "@/components/admin/shared";
import { copyImageToClipboard } from "@/lib/clipboard";
import { formatFechaLarga } from "@/lib/fecha";
import type { HiloTwitter } from "@/app/(admin)/admin/actions";

function copyToClipboard(value: string) {
  void navigator.clipboard.writeText(value);
}

function stringFromPayload(
  payload: Record<string, unknown>,
  key: string,
): string {
  const value = payload[key];
  return typeof value === "string" ? value : "";
}

function HiloTapa({ hilo }: { hilo: HiloTwitter }) {
  const fecha = stringFromPayload(hilo.payload, "fecha");
  const tituloEdicion = stringFromPayload(hilo.payload, "titulo_edicion");
  const initialTitle =
    fecha && tituloEdicion
      ? `Edición del ${formatFechaLarga(fecha)} — ${tituloEdicion}`
      : tituloEdicion || hilo.texto || "";
  const [titulo, setTitulo] = useState(initialTitle);
  const [isEditing, setIsEditing] = useState(false);
  const handleCopyImage = async () => {
    if (!hilo.imagenUrl) return;

    try {
      await copyImageToClipboard(hilo.imagenUrl);
    } catch {
      alert("No se pudo copiar la imagen.");
    }
  };

  useEffect(() => {
    setTitulo(initialTitle);
    setIsEditing(false);
  }, [initialTitle]);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <TextField
          value={titulo}
          onSave={setTitulo}
          isEditing={isEditing}
          onEditingChange={setIsEditing}
        />
        {!isEditing && (
          <>
            <IconButton onClick={() => setIsEditing(true)}>
              <IconEditar width={12} height={12} />
              Editar
            </IconButton>
            <IconButton onClick={() => copyToClipboard(titulo)}>
              <IconCopiar width={12} height={12} />
              Copiar
            </IconButton>
          </>
        )}
      </div>

      <div className="flex items-start gap-3">
        <div className="h-[150px] w-[150px] shrink-0 overflow-hidden rounded-lg border border-admin-ink bg-gray-200">
          {hilo.imagenUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hilo.imagenUrl}
              alt="Tapa de X"
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <IconButton onClick={handleCopyImage}>
          <IconCopiar width={12} height={12} />
          Copiar
        </IconButton>
      </div>
    </div>
  );
}

function HiloTextArea({ texto }: { texto: string }) {
  const [value, setValue] = useState(texto);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setValue(texto);
    setIsEditing(false);
  }, [texto]);

  return (
    <div className="flex items-start gap-2">
      <TextArea
        value={value}
        onSave={setValue}
        isEditing={isEditing}
        onEditingChange={setIsEditing}
        className="whitespace-pre-line"
      />
      {!isEditing && (
        <div className="flex shrink-0 flex-col gap-1.5">
          <IconButton onClick={() => setIsEditing(true)}>
            <IconEditar width={12} height={12} />
            Editar
          </IconButton>
          <IconButton onClick={() => copyToClipboard(value)}>
            <IconCopiar width={12} height={12} />
            Copiar
          </IconButton>
        </div>
      )}
    </div>
  );
}

export function TwitterSlideContent({
  activeSlide,
  twitter,
}: {
  activeSlide: number;
  twitter: HiloTwitter[];
}) {
  if (twitter.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="font-ui text-sm font-medium text-text-secondary">
          Sin contenido de X
        </span>
      </div>
    );
  }

  const hilo = twitter.find((item) => item.orden === activeSlide);
  if (!hilo) {
    return null;
  }

  if (hilo.orden === 1) {
    return <HiloTapa hilo={hilo} />;
  }

  return <HiloTextArea key={hilo.orden} texto={hilo.texto ?? ""} />;
}
