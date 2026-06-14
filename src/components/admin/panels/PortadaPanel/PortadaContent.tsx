"use client";

import { useRef, useState, type ChangeEvent } from "react";
import type { PortadaHistorial } from "@/app/(admin)/admin/actions";
import { IconBajar, IconEditar, IconRehacer, IconSubir } from "@/components/admin/icons";
import { IconButton, TextField } from "@/components/admin/shared";

type PortadaContentProps = {
  titulo: string;
  onSaveTitulo: (value: string) => void;
  imagenUrl?: string;
  onSubirImagen?: (file: File) => void;
  subiendoImagen?: boolean;
  onRehacerTitulo?: () => void;
  rehaciendoTitulo?: boolean;
  onRehacerPortada?: (tipo: "mismo" | "ia_elige") => void;
  rehaciendoPortada?: boolean;
  historial?: PortadaHistorial[];
  onRestaurar?: (portadaId: string) => void;
};

export function PortadaContent({
  titulo,
  onSaveTitulo,
  imagenUrl,
  onSubirImagen,
  subiendoImagen,
  onRehacerTitulo,
  rehaciendoTitulo,
  onRehacerPortada,
  rehaciendoPortada,
  historial,
  onRestaurar,
}: PortadaContentProps) {
  const [isEditingTitulo, setIsEditingTitulo] = useState(false);
  const [menuRehacerAbierto, setMenuRehacerAbierto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleClickSubir() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      onSubirImagen?.(file);
    }
    // Resetear el input para poder subir el mismo archivo de nuevo si hace falta.
    e.target.value = "";
  }

  async function handleDescargar() {
    if (!imagenUrl) return;

    try {
      const res = await fetch(imagenUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = "portada.jpg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Error al descargar la portada:", e);
      alert("No se pudo descargar la imagen. Intentá de nuevo.");
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
              <IconButton onClick={onRehacerTitulo} disabled={rehaciendoTitulo}>
                <IconRehacer width={11} height={11} />
                {rehaciendoTitulo ? "Rehaciendo..." : "Rehacer"}
              </IconButton>
            </>
          )}
        </div>
      </section>

      {/* PORTADA */}
      <section className="flex flex-col gap-2">
        <span className="font-ui text-xs font-semibold tracking-wider text-text-secondary">
          PORTADA
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex items-start gap-4">
          {imagenUrl ? (
            <img
              src={imagenUrl}
              alt="Portada de la edición"
              className="h-[300px] w-[300px] shrink-0 rounded-lg border border-admin-ink object-cover"
            />
          ) : (
            <div className="h-[300px] w-[300px] shrink-0 rounded-lg border border-admin-ink bg-gray-200" />
          )}
          <div className="flex flex-col items-start gap-2">
            <div className="relative">
              <IconButton
                onClick={() => setMenuRehacerAbierto((v) => !v)}
                disabled={rehaciendoPortada}
              >
                <IconRehacer width={11} height={11} />
                {rehaciendoPortada ? "Rehaciendo..." : "Rehacer"}
              </IconButton>
              {menuRehacerAbierto && !rehaciendoPortada && (
                <div className="absolute left-0 top-full z-10 mt-1 flex w-52 flex-col overflow-hidden rounded-md border border-admin-ink bg-white shadow-md">
                  <button
                    type="button"
                    className="px-3 py-2 text-left text-xs hover:bg-gray-100"
                    onClick={() => {
                      setMenuRehacerAbierto(false);
                      onRehacerPortada?.("mismo");
                    }}
                  >
                    Con el mismo estilo
                  </button>
                  <button
                    type="button"
                    className="border-t border-admin-ink/10 px-3 py-2 text-left text-xs hover:bg-gray-100"
                    onClick={() => {
                      setMenuRehacerAbierto(false);
                      onRehacerPortada?.("ia_elige");
                    }}
                  >
                    Con otro estilo (elige la IA)
                  </button>
                </div>
              )}
            </div>
            <IconButton onClick={handleDescargar}>
              <IconBajar width={11} height={11} />
              Descargar
            </IconButton>
            <IconButton onClick={handleClickSubir} disabled={subiendoImagen}>
              <IconSubir width={11} height={11} />
              {subiendoImagen ? "Subiendo..." : "Subir portada"}
            </IconButton>
          </div>
        </div>
      </section>

      {historial && historial.length > 1 && (
        <section className="flex flex-col gap-2">
          <span className="font-ui text-xs font-semibold tracking-wider text-text-secondary">
            VERSIONES
          </span>
          <div className="flex flex-wrap gap-2">
            {historial.map((version) => (
              <button
                key={version.id}
                type="button"
                onClick={() => {
                  if (!version.vigente) onRestaurar?.(version.id);
                }}
                title={version.vigente ? "Versión actual" : "Restaurar esta versión"}
                className={`relative h-[64px] w-[64px] shrink-0 overflow-hidden rounded-md border-2 ${
                  version.vigente
                    ? "border-admin-success cursor-default"
                    : "border-admin-ink/30 cursor-pointer hover:border-admin-ink"
                }`}
              >
                <img
                  src={version.imagenUrl}
                  alt={`Versión ${version.origen}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
