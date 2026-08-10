import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { CountrySelector } from "@/components/shared/CountrySelector";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";

import { NavegacionLateral } from "./NavegacionLateral";

type EdicionLayoutProps = {
  children: React.ReactNode;
  fecha: string;
  slideActivo: number;
  onPrev: () => void;
  onNext: () => void;
  onFechaClick: () => void;
  onReadMore?: () => void;
  onShare?: () => void;
  modoLectura?: boolean;
  onCerrar?: () => void;
};

const monthLabels = [
  "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
  "JUL", "AGO", "SEP", "OCT", "NOV", "DIC",
];

function formatFechaParts(fecha: string) {
  const dateParts = fecha.split("-");
  if (dateParts.length !== 3) {
    return null;
  }
  const [first, second, third] = dateParts;
  const isIsoDate = first.length === 4;
  const day = isIsoDate ? third : first;
  const monthLabel = monthLabels[Number(second) - 1];
  const year = isIsoDate ? first : third;
  if (!monthLabel) {
    return null;
  }
  return { day, month: monthLabel, year };
}

const teclaFisica =
  "rounded-[9px] border border-b-4 border-[#B6B0A5] bg-bg-base text-text-primary transition-all duration-100 ease-out active:translate-y-[3px] active:border-b active:bg-[#F1EEE7]";

export function EdicionLayout({
  children,
  fecha,
  slideActivo,
  onPrev,
  onNext,
  onFechaClick,
  onReadMore,
  onShare,
  modoLectura = false,
  onCerrar,
}: EdicionLayoutProps) {
  const fechaParts = formatFechaParts(fecha);

  return (
    <main className="flex h-[100dvh] flex-col bg-bg-base text-text-primary">
      <header className="z-30 w-full shrink-0 bg-bg-base px-5 py-4">
        <div className="relative mx-auto flex max-w-[480px] items-center justify-center">
          <Logo
            className={`h-auto w-[206px] max-w-[calc(100vw-112px)] origin-center transition-transform duration-300 ease-out ${slideActivo === 1 ? "scale-[1.3]" : "scale-100"}`}
            variant="large"
          />
          <div className="absolute right-0">
            <CountrySelector />
          </div>
        </div>
      </header>

      <div className="relative min-h-0 flex-1">
        <NavegacionLateral
          slideActivo={slideActivo}
          className={cn(
            "transition-opacity duration-300 ease-out",
            modoLectura ? "pointer-events-none opacity-0" : "opacity-100",
          )}
        />
        {children}
        {onShare ? (
          <button
            type="button"
            onClick={onShare}
            aria-label="Compartir esta noticia"
            className={cn(
              "absolute bottom-4 left-0 z-30 pl-3 text-text-primary transition-opacity duration-300 ease-out active:scale-90",
              modoLectura ? "pointer-events-none opacity-0" : "opacity-100",
            )}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="square"
              strokeLinejoin="miter"
              className="h-3.5 w-3.5"
            >
              <path d="M6 11v9h12v-9" />
              <path d="M12 15V3" />
              <path d="M8 7l4-4 4 4" />
            </svg>
          </button>
        ) : null}
      </div>

      <footer className="z-30 w-full shrink-0 bg-bg-base px-5 py-5">
        <div className="relative mx-auto flex min-h-[2.5rem] max-w-[480px] items-center justify-between">
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-out",
              modoLectura ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <button
              type="button"
              onClick={onCerrar}
              className="inline-flex items-center font-ui text-[13px] font-bold tracking-[-0.02em] text-text-primary"
            >
              <span className="underline underline-offset-[3px]">Cerrar</span>
              <ArrowDownLeft aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>

          <div
            className={cn(
              "flex w-full items-center justify-between transition-opacity duration-300 ease-out",
              modoLectura ? "pointer-events-none opacity-0" : "opacity-100",
            )}
          >
            <button
              type="button"
              onClick={onFechaClick}
              aria-label="Cambiar de edición"
              style={{ fontFamily: "var(--font-nav)" }}
              className={cn(
                teclaFisica,
                "flex flex-col items-center px-2.5 pb-1 pt-0.5 leading-none",
              )}
            >
              <span className="text-[17px] font-bold">{fechaParts?.day ?? "--"}</span>
              <span className="mt-0.5 text-[8.5px] font-medium tracking-[0.1em] text-text-secondary">
                {fechaParts ? `${fechaParts.month} ${fechaParts.year}` : ""}
              </span>
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
                className={cn(
                  teclaFisica,
                  "inline-flex h-[38px] w-[42px] items-center justify-center disabled:cursor-not-allowed disabled:opacity-35",
                )}
              >
                <ChevronUp aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
              </button>
              <button
                type="button"
                disabled={slideActivo === 7}
                onClick={onNext}
                aria-label="Ir al slide siguiente"
                className={cn(
                  teclaFisica,
                  "inline-flex h-[38px] w-[42px] items-center justify-center disabled:cursor-not-allowed disabled:opacity-35",
                )}
              >
                <ChevronDown aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

export type { EdicionLayoutProps };
