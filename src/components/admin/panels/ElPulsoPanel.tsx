"use client";

import { LoadingText } from "@/components/admin/shared";

interface ElPulsoPanelProps {
  status: "loading" | "ready";
}

export function ElPulsoPanel({ status }: ElPulsoPanelProps) {
  if (status === "loading") {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg border-2 border-admin-ink bg-bg-base">
        <LoadingText text="Creando El Pulso" />
      </div>
    );
  }

  return null;
}

export type { ElPulsoPanelProps };
