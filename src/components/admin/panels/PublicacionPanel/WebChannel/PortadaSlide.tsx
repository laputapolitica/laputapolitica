"use client";

import { useState, useEffect } from "react";
import { IconBajar, IconEditar } from "@/components/admin/icons";
import { IconButton, TextField } from "@/components/admin/shared";
import { guardarTituloEdicion } from "@/app/(admin)/admin/ediciones/[fecha]/actions";

export function PortadaSlide({
  edicionId,
  titulo: tituloInicial,
  portadaUrl,
}: {
  edicionId?: string;
  titulo?: string;
  portadaUrl?: string | null;
}) {
  const [titulo, setTitulo] = useState(tituloInicial ?? "Equilibrio ciego");
  const [isEditingTitulo, setIsEditingTitulo] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    setTitulo(tituloInicial ?? "Equilibrio ciego");
  }, [tituloInicial]);

  async function handleSaveTitulo(value: string) {
    setTitulo(value);
    setError(undefined);
    if (!edicionId) return;
    const res = await guardarTituloEdicion(edicionId, value);
    if (res.error) setError(res.error);
  }

  async function handleDescargar() {
    if (!portadaUrl) return;

    try {
      const res = await fetch(portadaUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `portada-${edicionId ?? "edicion"}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Error al descargar la portada:", e);
    }
  }

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
        {error ? (
          <p className="font-ui text-sm text-state-required">{error}</p>
        ) : null}
      </section>

      {/* PORTADA */}
      <section className="flex flex-col gap-2">
        <span className="font-ui text-xs font-semibold tracking-wider text-text-secondary">
          PORTADA
        </span>
        <div className="flex items-start gap-4">
          <div className="h-[200px] w-[200px] shrink-0 overflow-hidden rounded-lg border border-admin-ink bg-gray-200">
            {portadaUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={portadaUrl}
                alt="Portada vigente"
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          <div className="flex flex-col items-start gap-2">
            <IconButton onClick={handleDescargar}>
              <IconBajar width={11} height={11} />
              Descargar
            </IconButton>
          </div>
        </div>
      </section>
    </div>
  );
}
