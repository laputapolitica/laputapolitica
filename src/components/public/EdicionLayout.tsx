import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { CountrySelector } from "@/components/shared/CountrySelector";
import { Logo } from "@/components/shared/Logo";

import { NavegacionLateral } from "./NavegacionLateral";

type EdicionLayoutProps = {
  children: React.ReactNode;
  fecha: string;
  slideActivo: number;
  onPrev: () => void;
  onNext: () => void;
  onFechaClick: () => void;
  onReadMore?: () => void;
  modoLectura?: boolean;
  onCerrar?: () => void;
};

const monthLabels = [
  "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
  "JUL", "AGO", "SEP", "OCT", "NOV", "DIC",
];

function formatFechaLabel(fecha: string) {
  const dateParts = fecha.split("-");
  if (dateParts.length !== 3) {
    return fecha.toUpperCase();
  }
  const [first, second, third] = dateParts;
  const isIsoDate = first.length === 4;
  const day = isIsoDate ? third : first;
  const month = Number(isIsoDate ? second : second);
  const year = isIsoDate ? first : third;
  const monthLabel = monthLabels[month - 1];
  if (!monthLabel) {
    return fecha.toUpperCase();
  }
  return `${day} ${monthLabel} ${year}`;
}

export function EdicionLayout({
  children,
  fecha,
  slideActivo,
  onPrev,
  onNext,
  onFechaClick,
  onReadMore,
  modoLectura = false,
  onCerrar,
}: EdicionLayoutProps) {
  return (
    <main className="flex h-[100dvh] flex-col bg-bg-base text-text-primary">
      <header className="z-30 w-full shrink-0 bg-bg-base px-5 py-4">
        <div className="relative mx-auto flex max-w-[480px] items-center justify-center">
          <Logo className="h-auto w-[206px] max-w-[calc(100vw-112px)]" variant="large" />
          <div className="absolute right-0">
            <CountrySelector />
          </div>
        </div>
      </header>

      <div className="relative min-h-0 flex-1">
        {!modoLectura && <NavegacionLateral slideActivo={slideActivo} />}
        {children}
      </div>

      <footer className="z-30 w-full shrink-0 bg-bg-base px-5 py-5">
        <div className="relative mx-auto flex min-h-[2.5rem] max-w-[480px] items-center justify-between">
          {modoLectura ? (
            <button
              type="button"
              onClick={onCerrar}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center font-ui text-[13px] font-bold tracking-[-0.02em] text-text-primary"
            >
              <span className="underline underline-offset-[3px]">Cerrar</span>
              <ArrowDownLeft aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onFechaClick}
                className="inline-flex items-center gap-2 rounded-lg border border-black bg-white px-2 py-1.5 font-ui text-sm font-normal text-text-primary"
              >
                <Calendar aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
                {formatFechaLabel(fecha)}
              </button>

              {onReadMore ? (
                <button
                  type="button"
                  onClick={onReadMore}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center font-ui text-[13px] font-bold tracking-[-0.02em] text-text-primary"
                >
                  <span className="underline underline-offset-[3px]">Leer más</span>
                  <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              ) : null}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={slideActivo === 1}
                  onClick={onPrev}
                  aria-label="Ir al slide anterior"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black bg-white text-text-primary disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ChevronUp aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
                </button>
                <button
                  type="button"
                  disabled={slideActivo === 7}
                  onClick={onNext}
                  aria-label="Ir al slide siguiente"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black bg-white text-text-primary disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ChevronDown aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
                </button>
              </div>
            </>
          )}
        </div>
      </footer>
    </main>
  );
}

export type { EdicionLayoutProps };
