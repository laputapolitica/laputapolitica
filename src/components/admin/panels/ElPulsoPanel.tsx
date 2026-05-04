"use client";

import { useEffect, useState } from "react";

interface ElPulsoPanelProps {
  status: "loading" | "ready";
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
