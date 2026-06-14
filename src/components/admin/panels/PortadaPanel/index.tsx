"use client";

import { useEffect, useState } from "react";
import type { PortadaHistorial, PortadaVigente } from "@/app/(admin)/admin/actions";
import { LoadingTextGrid, PanelLayout } from "@/components/admin/shared";
import { PortadaContent } from "./PortadaContent";

interface PortadaPanelProps {
  status: "loading" | "ready";
  portada?: PortadaVigente;
  onSaveTitulo?: (titulo: string) => void;
  onSubirImagen?: (file: File) => void;
  subiendoImagen?: boolean;
  onRehacerPortada?: (tipo: "mismo" | "ia_elige") => void;
  rehaciendoPortada?: boolean;
  historial?: PortadaHistorial[];
  onRestaurar?: (portadaId: string) => void;
}

export function PortadaPanel({
  status,
  portada,
  onSaveTitulo,
  onSubirImagen,
  subiendoImagen,
  onRehacerPortada,
  rehaciendoPortada,
  historial,
  onRestaurar,
}: PortadaPanelProps) {
  const [titulo, setTitulo] = useState(portada?.titulo ?? "Equilibrio ciego");

  useEffect(() => {
    if (portada?.titulo) setTitulo(portada.titulo);
  }, [portada?.titulo]);

  function handleSaveTitulo(value: string) {
    setTitulo(value);
    onSaveTitulo?.(value);
  }

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
    <PanelLayout
      content={
        <PortadaContent
          titulo={titulo}
          onSaveTitulo={handleSaveTitulo}
          imagenUrl={portada?.imagenUrl}
          onSubirImagen={onSubirImagen}
          subiendoImagen={subiendoImagen}
          onRehacerPortada={onRehacerPortada}
          rehaciendoPortada={rehaciendoPortada}
          historial={historial}
          onRestaurar={onRestaurar}
        />
      }
    />
  );
}

export type { PortadaPanelProps };
