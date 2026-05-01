import { Calendar, ChevronDown, ChevronUp } from "lucide-react";

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
};

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
}: EdicionLayoutProps) {
  return (
    <main className="min-h-screen bg-bg-base text-text-primary">
      <header className="fixed left-0 top-0 z-30 w-full bg-bg-base px-5 py-4">
        <div className="mx-auto flex max-w-[480px] items-center justify-between gap-4">
          <Logo className="h-auto w-[206px] max-w-[calc(100vw-112px)]" variant="large" />
          <CountrySelector />
        </div>
      </header>

      <NavegacionLateral slideActivo={slideActivo} />

      {children}

      <footer className="fixed bottom-0 left-0 z-30 w-full px-5 py-5">
        <div className="mx-auto flex max-w-[480px] items-center justify-between">
          <button
            type="button"
            onClick={onFechaClick}
            className="inline-flex items-center gap-2 rounded-lg border border-black bg-white px-2 py-1.5 font-ui text-sm font-normal text-text-primary"
          >
            <Calendar aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
            {formatFechaLabel(fecha)}
          </button>

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
        </div>
      </footer>
    </main>
  );
}

export type { EdicionLayoutProps };
