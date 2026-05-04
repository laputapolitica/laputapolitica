"use client";

import { useEffect, useState } from "react";

// El panel no recibe props por ahora, pero se deja el contrato exportado.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface VentanaOpinionPanelProps {
  // sin props por ahora
}

function LoadingText({ text }: { text: string }) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") {
          return "";
        }

        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="font-ui text-sm font-medium text-admin-ink">
      {text}
      <span className="inline-block w-[18px] text-left">{dots}</span>
    </span>
  );
}

export function VentanaOpinionPanel({}: VentanaOpinionPanelProps) {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-lg border-2 border-admin-ink bg-bg-base">
      <LoadingText text="Ventana de opinion de El Pulso abierta" />
    </div>
  );
}

export type { VentanaOpinionPanelProps };
