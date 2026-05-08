"use client";

import { useState } from "react";
import { LoadingTextGrid, PanelLayout } from "@/components/admin/shared";
import { PortadaContent } from "./PortadaContent";

interface PortadaPanelProps {
  status: "loading" | "ready";
}

export function PortadaPanel({ status }: PortadaPanelProps) {
  const [titulo, setTitulo] = useState("Equilibrio ciego");

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
      content={<PortadaContent titulo={titulo} onSaveTitulo={setTitulo} />}
    />
  );
}

export type { PortadaPanelProps };
