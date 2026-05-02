"use client";

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

function formatRemaining(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value: number): string => String(value).padStart(2, "0"))
    .join(":");
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

  return (
    <section className="fixed left-0 top-16 z-40 flex w-full items-center justify-between border-y border-border-default bg-bg-base px-4 py-3 font-ui text-base">
      <p className="min-w-0 flex-1 truncate text-text-primary">Hola, {nombre}</p>
      <p className="shrink-0 px-3 font-medium text-text-primary">{displayDate}</p>
      <p className="min-w-0 flex-1 truncate text-right text-state-required">
        Cierre: {formatRemaining(remaining)}
      </p>
    </section>
  );
}
