"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

export interface HeaderOpinadorProps {
  nombre: string;
  fecha: string;
}

const monthLabels = [
  "ENE",
  "FEB",
  "MAR",
  "ABR",
  "MAY",
  "JUN",
  "JUL",
  "AGO",
  "SEP",
  "OCT",
  "NOV",
  "DIC",
] as const;

function parseFechaSlug(
  fecha: string,
): { day: number; month: number; year: number } | null {
  const parts = fecha.split("-");
  if (parts.length !== 3) {
    return null;
  }
  const day = Number(parts[0]);
  const month = Number(parts[1]);
  const year = Number(parts[2]);
  if (!day || !month || !year || month < 1 || month > 12) {
    return null;
  }
  return { day, month, year };
}

function formatRemainingParts(milliseconds: number): {
  horas: string;
  minutos: string;
  segundos: string;
} {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const horas = Math.floor(totalSeconds / 3600);
  const minutos = Math.floor((totalSeconds % 3600) / 60);
  const segundos = totalSeconds % 60;

  const pad = (value: number): string => String(value).padStart(2, "0");

  return { horas: pad(horas), minutos: pad(minutos), segundos: pad(segundos) };
}

function saludoSize(nombre: string): string {
  const len = nombre.trim().length;
  if (len <= 10) return "text-base";
  if (len <= 16) return "text-sm";
  return "text-xs";
}

export function HeaderOpinador({
  nombre,
  fecha,
}: HeaderOpinadorProps): React.ReactElement {
  const partes = parseFechaSlug(fecha);

  const displayDate = partes
    ? `${partes.day} ${monthLabels[partes.month - 1]} ${partes.year}`
    : fecha;

  // Cierre a las 22:00 hora Argentina (UTC-3) del día de la edición.
  const closeTimestamp = partes
    ? Date.UTC(partes.year, partes.month - 1, partes.day, 22 + 3, 0, 0)
    : null;

  const [remaining, setRemaining] = useState<number>(0);

  useEffect(() => {
    if (closeTimestamp === null) {
      setRemaining(0);
      return;
    }

    const tick = (): void => {
      setRemaining(Math.max(0, closeTimestamp - Date.now()));
    };

    tick();
    const intervalId = window.setInterval(tick, 1000);

    return (): void => window.clearInterval(intervalId);
  }, [closeTimestamp]);

  const { horas, minutos, segundos } = formatRemainingParts(remaining);
  const cierreInminente = remaining > 0 && remaining <= 30 * 60 * 1000;

  return (
    <section className="flex h-12 w-full flex-none items-center justify-between border-y border-text-primary bg-bg-base px-4 font-ui text-base">
      <p className={`min-w-0 flex-1 truncate text-text-primary ${saludoSize(nombre)}`}>
        Hola, {nombre}
      </p>
      <p className="shrink-0 px-3 font-semibold tracking-tight text-text-primary">
        {displayDate}
      </p>
      <p
        className={`flex min-w-0 flex-1 items-center justify-end gap-1.5 ${
          cierreInminente ? "text-state-required" : "text-text-primary"
        }`}
      >
        <Clock aria-hidden="true" className="h-[15px] w-[15px] flex-none" strokeWidth={2} />
        <span
          className="min-w-0 truncate text-[15px]"
          style={{ fontFamily: "var(--font-readout)" }}
        >
          {horas}
          <span className={cierreInminente ? "animate-blink-fast" : "animate-blink"}>:</span>
          {minutos}
          <span className={cierreInminente ? "animate-blink-fast" : "animate-blink"}>:</span>
          {segundos}
        </span>
      </p>
    </section>
  );
}
