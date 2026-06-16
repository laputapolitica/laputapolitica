"use client";

import { useEffect, useState } from "react";
import type { EstadoVentanaOpinion } from "@/app/(admin)/admin/actions";
import { LoadingText } from "@/components/admin/shared";

interface VentanaOpinionPanelProps {
  estado?: EstadoVentanaOpinion;
}

function formatearRestante(cierraEn: string | null): string {
  if (!cierraEn) return "00:00:00";
  const diff = new Date(cierraEn).getTime() - Date.now();
  if (diff <= 0) return "00:00:00";
  const totalSeg = Math.floor(diff / 1000);
  const h = Math.floor(totalSeg / 3600);
  const m = Math.floor((totalSeg % 3600) / 60);
  const s = totalSeg % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function VentanaOpinionPanel({ estado }: VentanaOpinionPanelProps) {
  const [restante, setRestante] = useState("00:00:00");

  const status = estado?.status ?? "pending";
  const cierraEn = estado?.cierraEn ?? null;
  const participantes = estado?.participantes ?? 0;
  const total = estado?.totalOpinadores ?? 0;

  useEffect(() => {
    if (status !== "running") return;
    setRestante(formatearRestante(cierraEn));
    const interval = setInterval(() => {
      setRestante(formatearRestante(cierraEn));
    }, 1000);
    return () => clearInterval(interval);
  }, [status, cierraEn]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-admin-ink bg-bg-base">
      {status === "pending" && (
        <span className="font-ui text-sm font-medium text-text-secondary">
          La ventana de opinión aún no abrió
        </span>
      )}

      {status === "running" && (
        <>
          <LoadingText text="Ventana de opinión de El Pulso abierta" />
          <span className="font-ui text-sm text-text-secondary">
            Opiniones {participantes}/{total} · Cierran en {restante}
          </span>
        </>
      )}

      {status === "done" && (
        <>
          <span className="font-ui text-sm font-medium text-admin-ink">
            Ventana de opinión cerrada
          </span>
          <span className="font-ui text-sm text-text-secondary">
            {participantes}/{total} opinadores participaron
          </span>
        </>
      )}
    </div>
  );
}

export type { VentanaOpinionPanelProps };
