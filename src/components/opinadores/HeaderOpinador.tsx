"use client";

import { Clock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export interface HeaderOpinadorProps {
  nombre: string;
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

function getBuenosAiresDateParts(): { day: number; month: number; year: number } {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Argentina/Buenos_Aires",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const parts = formatter.formatToParts(new Date());
  const day = Number(parts.find((part) => part.type === "day")?.value ?? "1");
  const month = Number(parts.find((part) => part.type === "month")?.value ?? "1");
  const year = Number(parts.find((part) => part.type === "year")?.value ?? "2026");

  return { day, month, year };
}

function formatDisplayDate(): string {
  const { day, month, year } = getBuenosAiresDateParts();

  return `${day} ${monthLabels[month - 1]} ${year}`;
}

function getRemainingUntilClose(): number {
  const { day, month, year } = getBuenosAiresDateParts();
  const closeTimestamp = Date.UTC(year, month - 1, day, 22, 0, 0);

  return Math.max(0, closeTimestamp - Date.now());
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
}: HeaderOpinadorProps): React.ReactElement {
  const displayDate = useMemo((): string => formatDisplayDate(), []);
  const [remaining, setRemaining] = useState<number>(0);

  useEffect(() => {
    setRemaining(getRemainingUntilClose());

    const intervalId = window.setInterval((): void => {
      setRemaining(getRemainingUntilClose());
    }, 1000);

    return (): void => window.clearInterval(intervalId);
  }, []);

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
