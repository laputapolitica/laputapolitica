"use client";

import { useEffect, useState } from "react";
import { IconCopiar, IconEditar } from "@/components/admin/icons";
import { IconButton, TextArea, TextField } from "@/components/admin/shared";
import { noticias } from "../mocks";

function copyToClipboard(value: string) {
  void navigator.clipboard.writeText(value);
}

function Hilo1() {
  const [titulo, setTitulo] = useState("Equilibrio ciego");
  const [isEditing, setIsEditing] = useState(false);

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
        <div className="h-[150px] w-[150px] shrink-0 rounded-lg border border-admin-ink bg-gray-200" />
        <IconButton onClick={() => {}}>
          <IconCopiar width={12} height={12} />
          Copiar
        </IconButton>
      </div>
    </div>
  );
}

function Hilo12() {
  const [texto, setTexto] = useState("La edición completa en laputapolitica.com");
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <TextField
        value={texto}
        onSave={setTexto}
        isEditing={isEditing}
        onEditingChange={setIsEditing}
      />
      {!isEditing && (
        <>
          <IconButton onClick={() => setIsEditing(true)}>
            <IconEditar width={12} height={12} />
            Editar
          </IconButton>
          <IconButton onClick={() => copyToClipboard(texto)}>
            <IconCopiar width={12} height={12} />
            Copiar
          </IconButton>
        </>
      )}
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

export function TwitterSlideContent({ activeSlide }: { activeSlide: number }) {
  if (activeSlide === 1) {
    return <Hilo1 />;
  }

  if (activeSlide === 12) {
    return <Hilo12 />;
  }

  const pulsoSlides = [3, 5, 7, 9, 11];
  const noticiaIndex = pulsoSlides.includes(activeSlide)
    ? (activeSlide - 3) / 2
    : (activeSlide - 2) / 2;
  const noticia = noticias[noticiaIndex % noticias.length];
  const texto = pulsoSlides.includes(activeSlide)
    ? noticia.pulsoTwitter
    : `${noticia.titulo}.\n${noticia.resumen}`;

  return <HiloTextArea key={activeSlide} texto={texto} />;
}
