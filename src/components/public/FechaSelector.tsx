"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

interface FechaSelectorProps {
  fechaActual: string;
  isOpen: boolean;
  onClose: () => void;
}

type DrumOption = {
  label: string;
  value: number;
};

type DrumRowProps = {
  ariaLabel: string;
  options: DrumOption[];
  selectedValue: number;
  onSelectedValueChange: (value: number) => void;
};

const FECHAS_DISPONIBLES = [
  "2026-05-01",
  "2026-03-21",
  "2026-03-20",
  "2026-03-19",
  "2026-03-18",
  "2026-03-17",
];

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const DAYS = Array.from({ length: 31 }, (_, index) => ({
  label: String(index + 1).padStart(2, "0"),
  value: index + 1,
}));

const MONTH_OPTIONS = MONTHS.map((month, index) => ({
  label: month,
  value: index + 1,
}));

const YEARS = [2024, 2025, 2026, 2027, 2028].map((year) => ({
  label: String(year),
  value: year,
}));

function parseFecha(fecha: string) {
  const parts = fecha.split("-");

  if (parts.length !== 3) {
    return {
      day: 21,
      month: 3,
      year: 2026,
    };
  }

  const [first, second, third] = parts;
  const isIsoDate = first.length === 4;

  return {
    day: Number(isIsoDate ? third : first),
    month: Number(second),
    year: Number(isIsoDate ? first : third),
  };
}

function formatFecha(year: number, month: number, day: number) {
  return [
    String(year),
    String(month).padStart(2, "0"),
    String(day).padStart(2, "0"),
  ].join("-");
}

function getTextClass(distance: number) {
  if (distance === 0) {
    return "font-bold text-xl text-text-primary";
  }

  if (distance === 1) {
    return "text-base text-text-secondary";
  }

  return "text-sm text-[#CCCCCC]";
}

export function FechaSelector({ fechaActual, isOpen, onClose }: FechaSelectorProps) {
  const router = useRouter();
  const initialDate = useMemo(() => parseFecha(fechaActual), [fechaActual]);
  const [selectedDay, setSelectedDay] = useState(initialDate.day);
  const [selectedMonth, setSelectedMonth] = useState(initialDate.month);
  const [selectedYear, setSelectedYear] = useState(initialDate.year);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setSelectedDay(initialDate.day);
    setSelectedMonth(initialDate.month);
    setSelectedYear(initialDate.year);
    setShowError(false);
  }, [initialDate.day, initialDate.month, initialDate.year, isOpen]);

  const handleConfirm = useCallback(() => {
    const selectedFecha = formatFecha(selectedYear, selectedMonth, selectedDay);

    if (!FECHAS_DISPONIBLES.includes(selectedFecha)) {
      setShowError(true);
      return;
    }

    router.push(`/edicion/${selectedFecha}`, { scroll: false });
    onClose();
  }, [onClose, router, selectedDay, selectedMonth, selectedYear]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar selector de fecha"
        className="fixed inset-0 z-40 bg-[#FAF9F5]/60 backdrop-blur-[16px]"
        onClick={onClose}
      />

      <div className="fixed inset-x-0 bottom-0 z-50 bg-[#FAF9F5] pb-8 pt-4">
        <div className="mx-auto max-w-[480px]">
          {showError ? (
            <div className="mb-4 flex justify-center px-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-black bg-[#FAF9F5] px-3 py-2 font-ui text-sm text-text-primary">
                <span aria-hidden="true" className="text-state-required">
                  ⊗
                </span>
                No hay edición disponible para esta fecha
              </div>
            </div>
          ) : null}

          <button
            type="button"
            aria-label="Confirmar fecha"
            onClick={handleConfirm}
            className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-black bg-[#FAF9F5] text-text-primary"
          >
            <Check aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
          </button>

          <div className="space-y-4 px-6">
            <DrumRow
              ariaLabel="Seleccionar día"
              options={DAYS}
              selectedValue={selectedDay}
              onSelectedValueChange={(value) => {
                setSelectedDay(value);
                setShowError(false);
              }}
            />
            <DrumRow
              ariaLabel="Seleccionar mes"
              options={MONTH_OPTIONS}
              selectedValue={selectedMonth}
              onSelectedValueChange={(value) => {
                setSelectedMonth(value);
                setShowError(false);
              }}
            />
            <DrumRow
              ariaLabel="Seleccionar año"
              options={YEARS}
              selectedValue={selectedYear}
              onSelectedValueChange={(value) => {
                setSelectedYear(value);
                setShowError(false);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function DrumRow({
  ariaLabel,
  options,
  selectedValue,
  onSelectedValueChange,
}: DrumRowProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const isProgrammaticScrollRef = useRef(false);

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === selectedValue),
  );

  const updateSelectedFromScroll = useCallback(() => {
    if (isProgrammaticScrollRef.current) {
      return;
    }

    const scrollElement = scrollRef.current;

    if (!scrollElement) {
      return;
    }

    const scrollRect = scrollElement.getBoundingClientRect();
    const centerX = scrollRect.left + scrollRect.width / 2;
    let closestIndex = selectedIndex;
    let closestDistance = Number.POSITIVE_INFINITY;

    optionRefs.current.forEach((element, index) => {
      if (!element) {
        return;
      }

      const itemRect = element.getBoundingClientRect();
      const itemCenter = itemRect.left + itemRect.width / 2;
      const distance = Math.abs(itemCenter - centerX);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    const nextValue = options[closestIndex]?.value;

    if (nextValue !== undefined && nextValue !== selectedValue) {
      onSelectedValueChange(nextValue);
    }
  }, [onSelectedValueChange, options, selectedIndex, selectedValue]);

  useLayoutEffect(() => {
    const scrollElement = scrollRef.current;
    const selectedElement = optionRefs.current[selectedIndex];

    if (!scrollElement || !selectedElement) {
      return;
    }

    isProgrammaticScrollRef.current = true;

    const frame = window.requestAnimationFrame(() => {
      selectedElement.scrollIntoView({
        behavior: "auto",
        block: "nearest",
        inline: "center",
      });

      window.requestAnimationFrame(() => {
        isProgrammaticScrollRef.current = false;
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [selectedIndex]);

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 top-1/2 z-10 h-12 -translate-y-1/2 border-y border-black"
      />

      <div
        ref={scrollRef}
        role="listbox"
        aria-label={ariaLabel}
        tabIndex={0}
        onScroll={updateSelectedFromScroll}
        className="flex h-16 snap-x snap-mandatory items-center overflow-x-auto scroll-smooth px-[calc(50%_-_40px)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {options.map((option, index) => {
          const distance = Math.abs(index - selectedIndex);

          return (
            <button
              key={option.value}
              ref={(node) => {
                optionRefs.current[index] = node;
              }}
              type="button"
              role="option"
              aria-selected={option.value === selectedValue}
              onClick={() => onSelectedValueChange(option.value)}
              className={cn(
                "flex h-12 min-w-20 snap-center items-center justify-center whitespace-nowrap px-3 font-ui transition-colors",
                getTextClass(distance),
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export type { FechaSelectorProps };
