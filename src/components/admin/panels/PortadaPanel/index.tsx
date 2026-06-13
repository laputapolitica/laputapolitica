"use client";

import { useEffect, useState } from "react";
import type { PortadaVigente } from "@/app/(admin)/admin/actions";
import { LoadingTextGrid, PanelLayout } from "@/components/admin/shared";
import { PortadaContent } from "./PortadaContent";

interface PortadaPanelProps {
  status: "loading" | "ready";
  portada?: PortadaVigente;
}

export function PortadaPanel({ status, portada }: PortadaPanelProps) {
  const [titulo, setTitulo] = useState(portada?.titulo ?? "Equilibrio ciego");

  useEffect(() => {
    if (portada?.titulo) setTitulo(portada.titulo);
  }, [portada?.titulo]);

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
          onSaveTitulo={setTitulo}
          imagenUrl={portada?.imagenUrl}
        />
      }
    />
  );
}

export type { PortadaPanelProps };
