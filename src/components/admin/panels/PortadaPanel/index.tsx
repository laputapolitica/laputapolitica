"use client";

import { useEffect, useState } from "react";
import type {
  EstiloBanco,
  OpcionRehacer,
  PortadaHistorial,
  PortadaVigente,
} from "@/app/(admin)/admin/actions";
import { LoadingTextGrid, PanelLayout } from "@/components/admin/shared";
import { PortadaContent } from "./PortadaContent";

interface PortadaPanelProps {
  status: "loading" | "ready";
  edicionId?: string;
  portada?: PortadaVigente;
  onSaveTitulo?: (titulo: string) => Promise<void> | void;
  onSubirImagen?: (file: File) => void;
  subiendoImagen?: boolean;
  onRehacerTitulo?: () => void;
  rehaciendoTitulo?: boolean;
  onRehacerPortada?: (opcion: OpcionRehacer) => void;
  rehaciendoPortada?: boolean;
  estilosBanco?: EstiloBanco[];
  onAbrirGaleriaEstilos?: () => void;
  historial?: PortadaHistorial[];
  onRestaurar?: (portadaId: string) => void;
  onVersionTextoRestored?: () => Promise<void> | void;
}

export function PortadaPanel({
  status,
  edicionId,
  portada,
  onSaveTitulo,
  onSubirImagen,
  subiendoImagen,
  onRehacerTitulo,
  rehaciendoTitulo,
  onRehacerPortada,
  rehaciendoPortada,
  estilosBanco,
  onAbrirGaleriaEstilos,
  historial,
  onRestaurar,
  onVersionTextoRestored,
}: PortadaPanelProps) {
  const [titulo, setTitulo] = useState(portada?.titulo ?? "");
  const [versionesRefresh, setVersionesRefresh] = useState(0);

  useEffect(() => {
    if (portada?.titulo) setTitulo(portada.titulo);
  }, [portada?.titulo]);

  async function handleSaveTitulo(value: string) {
    setTitulo(value);
    await onSaveTitulo?.(value);
    setVersionesRefresh((current) => current + 1);
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
          edicionId={edicionId}
          titulo={titulo}
          onSaveTitulo={handleSaveTitulo}
          imagenUrl={portada?.imagenUrl}
          onSubirImagen={onSubirImagen}
          subiendoImagen={subiendoImagen}
          onRehacerTitulo={onRehacerTitulo}
          rehaciendoTitulo={rehaciendoTitulo}
          onRehacerPortada={onRehacerPortada}
          rehaciendoPortada={rehaciendoPortada}
          estilosBanco={estilosBanco}
          onAbrirGaleriaEstilos={onAbrirGaleriaEstilos}
          historial={historial}
          onRestaurar={onRestaurar}
          onVersionTextoRestored={onVersionTextoRestored}
          versionTextoRefreshKey={String(versionesRefresh)}
        />
      }
    />
  );
}

export type { PortadaPanelProps };
