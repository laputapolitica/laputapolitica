"use client";

import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import type { EdicionResumen } from "@/types/edicion";

interface FechaSelectorProps {
  fechaActual: string;
  ediciones: EdicionResumen[];
  isOpen: boolean;
  onClose: () => void;
}

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function toIso(fecha: string) {
  const parts = fecha.split("-");
  if (parts.length !== 3) {
    return fecha;
  }
  const [first, second, third] = parts;
  return first.length === 4 ? fecha : `${third}-${second}-${first}`;
}

function parseParts(fecha: string) {
  const [year, month, day] = toIso(fecha).split("-");
  return { year: Number(year), month: Number(month), day: Number(day) };
}

type MonthGroup = {
  key: string;
  label: string;
  ediciones: EdicionResumen[];
};

function groupByMonth(ediciones: EdicionResumen[]): MonthGroup[] {
  const groups: MonthGroup[] = [];
  const index = new Map<string, MonthGroup>();

  for (const edicion of ediciones) {
    const { year, month } = parseParts(edicion.fecha);
    const key = `${year}-${month}`;
    let group = index.get(key);
    if (!group) {
      group = { key, label: `${MONTHS[month - 1] ?? ""} ${year}`, ediciones: [] };
      index.set(key, group);
      groups.push(group);
    }
    group.ediciones.push(edicion);
  }

  return groups;
}

export function FechaSelector({ fechaActual, ediciones, isOpen, onClose }: FechaSelectorProps) {
  const router = useRouter();

  if (!isOpen) {
    return null;
  }

  const currentIso = toIso(fechaActual);
  const groups = groupByMonth(ediciones);

  function abrirEdicion(fecha: string) {
    router.push(`/edicion/${fecha}`, { scroll: false });
    onClose();
  }

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar selector de ediciones"
        className="fixed inset-0 z-40 bg-[#FAF9F5]/60 backdrop-blur-[16px]"
        onClick={onClose}
      />

      <div className="fixed inset-x-0 bottom-0 top-[14%] z-50 flex flex-col rounded-t-[22px] border-t border-border-default bg-bg-base">
        <div className="flex-none pt-3">
          <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-[#D9D5CC]" />
          <p className="px-6 font-ui text-[10.5px] font-semibold uppercase tracking-[0.16em] text-text-secondary">
            Ediciones
          </p>
        </div>

        <div className="mt-2 flex-1 overflow-y-auto px-5 pb-10 no-scrollbar">
          <div className="mx-auto max-w-[480px]">
            {groups.map((group) => (
              <section key={group.key} className="mb-6">
                <h3
                  className="sticky top-0 z-10 mb-3 bg-bg-base py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-text-secondary"
                  style={{ fontFamily: "var(--font-nav)" }}
                >
                  {group.label}
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {group.ediciones.map((edicion) => {
                    const { day, month } = parseParts(edicion.fecha);
                    const dateLabel = `${String(day).padStart(2, "0")} ${(MONTHS[month - 1] ?? "").slice(0, 3).toUpperCase()}`;
                    const isCurrent = toIso(edicion.fecha) === currentIso;
                    return (
                      <button
                        key={edicion.fecha}
                        type="button"
                        onClick={() => abrirEdicion(edicion.fecha)}
                        aria-label={`${edicion.titulo} — ${dateLabel}`}
                        className={cn(
                          "overflow-hidden rounded-lg border border-border-default bg-white text-left transition-transform active:scale-95",
                          isCurrent && "outline outline-2 outline-offset-1 outline-admin-ink",
                        )}
                      >
                        <div className="aspect-square w-full bg-[#F0EEE7]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={edicion.portadaUrl}
                            alt={edicion.titulo}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span
                          className="block px-1.5 py-1 text-[8.5px] font-bold tracking-[0.05em] text-text-primary"
                          style={{ fontFamily: "var(--font-nav)" }}
                        >
                          {dateLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}

            {groups.length === 0 ? (
              <p className="py-10 text-center font-ui text-sm text-text-secondary">
                Todavía no hay ediciones publicadas.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export type { FechaSelectorProps };
