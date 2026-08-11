"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, LayoutGrid, X } from "lucide-react";
import { Drawer } from "vaul";

import { cn } from "@/lib/utils";
import type { EdicionResumen } from "@/types/edicion";

interface FechaSelectorProps {
  fechaActual: string;
  ediciones: EdicionResumen[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (fecha: string) => void;
}

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

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

function pad(value: number) {
  return String(value).padStart(2, "0");
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

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isDesktop;
}

export function FechaSelector({ fechaActual, ediciones, isOpen, onClose, onSelect }: FechaSelectorProps) {
  const isDesktop = useIsDesktop();
  const [view, setView] = useState<"kiosco" | "almanaque">("kiosco");
  const initial = parseParts(fechaActual);
  const [viewYear, setViewYear] = useState(initial.year);
  const [viewMonth, setViewMonth] = useState(initial.month);

  const isoToSlug = useMemo(() => {
    const map = new Map<string, string>();
    for (const e of ediciones) {
      const iso = toIso(e.fecha);
      if (!map.has(iso)) {
        map.set(iso, e.fecha);
      }
    }
    return map;
  }, [ediciones]);

  const monthBounds = useMemo(() => {
    if (ediciones.length === 0) {
      return null;
    }
    const indices = ediciones.map((e) => {
      const { year, month } = parseParts(e.fecha);
      return year * 12 + (month - 1);
    });
    return { min: Math.min(...indices), max: Math.max(...indices) };
  }, [ediciones]);

  useEffect(() => {
    if (isOpen) {
      const parts = parseParts(fechaActual);
      setView("kiosco");
      setViewYear(parts.year);
      setViewMonth(parts.month);
    }
  }, [isOpen, fechaActual]);

  const currentIso = toIso(fechaActual);
  const groups = groupByMonth(ediciones);
  const hasEdiciones = ediciones.length > 0;

  function abrirEdicion(fecha: string) {
    onSelect(fecha);
    onClose();
  }

  const viewIndex = viewYear * 12 + (viewMonth - 1);
  const canPrev = monthBounds ? viewIndex > monthBounds.min : false;
  const canNext = monthBounds ? viewIndex < monthBounds.max : false;

  function shiftMonth(delta: number) {
    const next = viewYear * 12 + (viewMonth - 1) + delta;
    setViewYear(Math.floor(next / 12));
    setViewMonth((next % 12) + 1);
  }

  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
  const firstWeekday = (new Date(viewYear, viewMonth - 1, 1).getDay() + 6) % 7;
  const dayCells = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const toggleButton = hasEdiciones ? (
    <button
      type="button"
      onClick={() => setView((v) => (v === "kiosco" ? "almanaque" : "kiosco"))}
      className="inline-flex items-center gap-1.5 rounded-full border border-border-default px-2.5 py-1 text-[11px] font-medium text-text-primary transition-transform active:scale-95 lg:px-3 lg:py-1.5 lg:text-[12.5px]"
    >
      {view === "kiosco" ? (
        <>
          <Calendar aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.8} />
          Saltar a fecha
        </>
      ) : (
        <>
          <LayoutGrid aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.8} />
          Ver portadas
        </>
      )}
    </button>
  ) : null;

  const content =
    view === "kiosco" ? (
      <>
        {groups.map((group) => (
          <section key={group.key} className="mb-6">
            <h3
              className="sticky top-0 z-10 mb-3 bg-bg-base py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-text-secondary"
              style={{ fontFamily: "var(--font-nav)" }}
            >
              {group.label}
            </h3>
            <div className={cn("grid gap-3", isDesktop ? "grid-cols-5 gap-4" : "grid-cols-3")}>
              {group.ediciones.map((edicion) => {
                const { day, month, year } = parseParts(edicion.fecha);
                const dateLabel = `${pad(day)} ${(MONTHS[month - 1] ?? "").slice(0, 3).toUpperCase()} ${year}`;
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
                      className={cn(
                        "block font-bold tracking-[0.05em] text-text-primary",
                        isDesktop ? "px-2 py-1.5 text-[10px]" : "px-1.5 py-1 text-[8.5px]",
                      )}
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
      </>
    ) : (
      <div className="mx-auto max-w-[420px] pt-1">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            aria-label="Mes anterior"
            disabled={!canPrev}
            onClick={() => shiftMonth(-1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-primary disabled:opacity-30"
          >
            <ChevronLeft aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
          </button>
          <span className="font-display text-lg font-semibold text-text-primary">
            {MONTHS[viewMonth - 1]} {viewYear}
          </span>
          <button
            type="button"
            aria-label="Mes siguiente"
            disabled={!canNext}
            onClick={() => shiftMonth(1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-primary disabled:opacity-30"
          >
            <ChevronRight aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {WEEKDAYS.map((wd, i) => (
            <div
              key={i}
              className="pb-1 text-center text-[9px] font-medium text-text-secondary"
              style={{ fontFamily: "var(--font-nav)" }}
            >
              {wd}
            </div>
          ))}
          {Array.from({ length: firstWeekday }).map((_, i) => (
            <div key={`blank-${i}`} />
          ))}
          {dayCells.map((day) => {
            const iso = `${viewYear}-${pad(viewMonth)}-${pad(day)}`;
            const slug = isoToSlug.get(iso);
            const hasEd = Boolean(slug);
            const isCurrent = iso === currentIso;
            return (
              <button
                key={day}
                type="button"
                disabled={!hasEd}
                onClick={() => {
                  if (slug) {
                    abrirEdicion(slug);
                  }
                }}
                aria-label={hasEd ? `Ir a la edición del ${day} de ${MONTHS[viewMonth - 1]}` : undefined}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-md text-[12px] transition-transform",
                  !hasEd && "text-[#C4BFB4]",
                  hasEd && !isCurrent && "border border-admin-ink font-medium text-text-primary active:scale-90",
                  isCurrent && "bg-admin-ink font-bold text-white active:scale-90",
                )}
                style={{ fontFamily: "var(--font-nav)" }}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );

  if (isDesktop) {
    return (
      <>
        <div
          onClick={onClose}
          aria-hidden="true"
          className={cn(
            "fixed inset-0 z-40 bg-[rgba(20,18,14,0.44)] transition-opacity duration-300 ease-out",
            isOpen ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        />
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-8">
          <div
            className={cn(
              "flex max-h-[82vh] w-full max-w-[900px] flex-col overflow-hidden rounded-[18px] border border-border-default bg-bg-base shadow-[0_30px_80px_rgba(0,0,0,0.35)] transition-all duration-300 ease-out",
              isOpen ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0",
            )}
          >
            <div className="flex flex-none items-center justify-between border-b border-border-default px-8 py-5">
              <p
                className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-secondary"
                style={{ fontFamily: "var(--font-nav)" }}
              >
                Ediciones
              </p>
              <div className="flex items-center gap-3">
                {toggleButton}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border-default bg-bg-base text-text-primary shadow-[-2px_-2px_5px_#ffffff,3px_3px_7px_#E4DFD5] transition active:scale-90"
                >
                  <X aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-8 py-6 no-scrollbar">{content}</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-[#FAF9F5]/60 backdrop-blur-[16px]" />
        <Drawer.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 bottom-0 top-[14%] z-50 flex flex-col rounded-t-[22px] border-t border-border-default bg-bg-base outline-none"
        >
          <div className="flex-none pt-3">
            <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-[#D9D5CC]" />
            <div className="flex items-center justify-between px-6">
              <Drawer.Title asChild>
                <p
                  className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-text-secondary"
                  style={{ fontFamily: "var(--font-nav)" }}
                >
                  Ediciones
                </p>
              </Drawer.Title>
              {toggleButton}
            </div>
          </div>

          <div className="mt-3 flex-1 overflow-y-auto px-5 pb-10 no-scrollbar">
            <div className="mx-auto max-w-[480px]">{content}</div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export type { FechaSelectorProps };
