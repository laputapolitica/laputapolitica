"use client";

import { LoadingText } from "@/components/admin/shared";

// El panel no recibe props por ahora, pero se deja el contrato exportado.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface VentanaOpinionPanelProps {
  // sin props por ahora
}

export function VentanaOpinionPanel({}: VentanaOpinionPanelProps) {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-lg border-2 border-admin-ink bg-bg-base">
      <LoadingText text="Ventana de opinion de El Pulso abierta" />
    </div>
  );
}

export type { VentanaOpinionPanelProps };
