import {
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import Link from "next/link";

import { CountrySelector } from "@/components/shared/CountrySelector";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";

import { NavegacionLateral } from "./NavegacionLateral";

type Seccion = { n: number; titulo: string };

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
  secciones?: Seccion[];
  onSelectSlide?: (n: number) => void;
  keyboardPressedDirection?: "next" | "prev" | null;
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

function pad(n: number) {
  return String(n).padStart(2, "0");
}

const teclaFisica =
  "rounded-[9px] border border-b-4 border-[#B6B0A5] bg-bg-base text-text-primary transition-all duration-100 ease-out active:translate-y-[3px] active:border-b active:bg-[#F1EEE7]";
const teclaFisicaPressed = "translate-y-[3px] border-b bg-[#F1EEE7]";

const shareGlyph = (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="square" strokeLinejoin="miter" className="h-3.5 w-3.5">
    <path d="M6 11v9h12v-9" />
    <path d="M12 15V3" />
    <path d="M8 7l4-4 4 4" />
  </svg>
);

const REDES: Record<string, { instagram: string; x: string }> = {
  // TODO: reemplazar por las URLs reales de cada cuenta cuando existan.
  ar: {
    instagram: "https://www.instagram.com/",
    x: "https://x.com/",
  },
};

const PAIS_REDES = "ar";

const instagramGlyph = (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
    <rect x="2.5" y="2.5" width="19" height="19" rx="5.2" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

const xGlyph = (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FlechaTeclaArriba = ({ className }: { className?: string }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 4 L18 12 L13.2 12 L13.2 20 L10.8 20 L10.8 12 L6 12 Z" />
  </svg>
);

const FlechaTeclaAbajo = ({ className }: { className?: string }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 20 L6 12 L10.8 12 L10.8 4 L13.2 4 L13.2 12 L18 12 Z" />
  </svg>
);

const informationGlyph = (
  <svg aria-hidden="true" viewBox="0 0 600 600" fill="currentColor" className="h-3.5 w-3.5">
    <path
      fillRule="evenodd"
      d="M300 600C465.685 600 600 465.685 600 300C600 134.315 465.685 0 300 0C134.315 0 0 134.315 0 300C0 465.685 134.315 600 300 600ZM300.015 175.835C328.582 175.835 351.739 152.677 351.739 124.111C351.739 95.5444 328.582 72.3867 300.015 72.3867C271.449 72.3867 248.291 95.5444 248.291 124.111C248.291 152.677 271.449 175.835 300.015 175.835ZM382.754 475.893V496.583C382.754 499.327 381.665 501.958 379.724 503.898C377.784 505.838 375.153 506.928 372.41 506.928H227.582C224.839 506.928 222.207 505.838 220.267 503.898C218.327 501.958 217.237 499.327 217.237 496.583V475.893C217.273 473.473 218.146 471.139 219.707 469.289C221.269 467.439 223.423 466.187 225.803 465.745C235.092 463.797 243.426 458.709 249.403 451.336C255.379 443.963 258.633 434.756 258.617 425.266V300.031C258.617 291.8 255.347 283.906 249.527 278.086C243.707 272.266 235.813 268.997 227.582 268.997C224.839 268.997 222.207 267.907 220.267 265.967C218.327 264.027 217.237 261.395 217.237 258.652V237.962C217.237 235.218 218.327 232.587 220.267 230.647C222.207 228.707 224.839 227.617 227.582 227.617H331.03C333.774 227.617 336.405 228.707 338.345 230.647C340.285 232.587 341.375 235.218 341.375 237.962V425.266C341.373 434.752 344.631 443.952 350.603 451.323C356.575 458.694 364.898 463.789 374.179 465.755C376.559 466.195 378.714 467.445 380.277 469.293C381.84 471.141 382.716 473.473 382.754 475.893Z"
    />
  </svg>
);

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
  secciones = [],
  onSelectSlide,
  keyboardPressedDirection = null,
}: EdicionLayoutProps) {
  const fechaParts = formatFechaParts(fecha);
  const ultimaSlide = secciones.length > 0 ? secciones[secciones.length - 1].n : 7;

  const selloFecha = (
    <button
      type="button"
      onClick={onFechaClick}
      aria-label="Cambiar de edición"
      style={{ fontFamily: "var(--font-nav)" }}
      className={cn(teclaFisica, "flex flex-col items-center px-2.5 pb-1 pt-0.5 leading-none")}
    >
      <span className="text-[17px] font-bold">{fechaParts?.day ?? "--"}</span>
      <span className="mt-0.5 text-[8.5px] font-medium tracking-[0.1em] text-text-secondary">
        {fechaParts ? `${fechaParts.month} ${fechaParts.year}` : ""}
      </span>
    </button>
  );

  return (
    <main className="flex h-[100dvh] flex-col bg-bg-base text-text-primary">
      {/* ===== HEADER MOBILE ===== */}
      <header className="z-30 w-full shrink-0 bg-bg-base px-5 py-4 lg:hidden">
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

      {/* ===== MASTHEAD DESKTOP ===== */}
      <header className="hidden shrink-0 bg-bg-base lg:block">
        <div className="relative mx-auto max-w-[1280px] px-10 pb-3 pt-6 text-center">
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            <CountrySelector />
          </div>
          <Logo variant="large" className="mx-auto h-auto w-[330px]" />
        </div>
        <div className="mx-auto max-w-[1280px]">
          <div className="h-1 border-b border-t-2 border-admin-ink" />
        </div>
      </header>

      {/* ===== BODY ===== */}
      <div className="relative min-h-0 flex-1 lg:mx-auto lg:flex lg:w-full lg:max-w-[1280px]">
        <NavegacionLateral
          slideActivo={slideActivo}
          className={cn(
            "transition-opacity duration-300 ease-out lg:hidden",
            modoLectura ? "pointer-events-none opacity-0" : "opacity-100",
          )}
        />

        <aside className="hidden w-[240px] flex-none border-r border-border-default px-8 py-7 lg:block">
          <ol>
            {secciones.map((s) => {
              const activa = s.n === slideActivo;
              return (
                <li key={s.n}>
                  <button
                    type="button"
                    onClick={() => onSelectSlide?.(s.n)}
                    title={s.titulo}
                    className="flex w-full items-baseline gap-2.5 border-b border-[#EDEAE3] py-2.5 text-left last:border-b-0"
                  >
                    <span
                      className={cn("text-[11px]", activa ? "font-bold text-admin-ink" : "text-[#A7A29A]")}
                      style={{ fontFamily: "var(--font-nav)" }}
                    >
                      {pad(s.n)}
                    </span>
                    <span className={cn("line-clamp-2 font-display text-[13.5px] leading-tight", activa ? "font-semibold text-text-primary" : "text-text-secondary")}>
                      {s.titulo}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>

        {children}

        {onShare ? (
          <button
            type="button"
            onClick={onShare}
            aria-label="Compartir esta noticia"
            className={cn(
              "absolute bottom-4 left-0 z-30 pl-3 text-text-primary transition-opacity duration-300 ease-out active:scale-90 lg:hidden",
              modoLectura ? "pointer-events-none opacity-0" : "opacity-100",
            )}
          >
            {shareGlyph}
          </button>
        ) : null}
      </div>

      {/* ===== FOOTER MOBILE ===== */}
      <footer className="z-30 w-full shrink-0 bg-bg-base px-5 py-5 lg:hidden">
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
            {selloFecha}

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
                  keyboardPressedDirection === "prev" && teclaFisicaPressed,
                )}
              >
                <FlechaTeclaArriba className="h-5 w-5" />
              </button>
              <button
                type="button"
                disabled={slideActivo === 7}
                onClick={onNext}
                aria-label="Ir al slide siguiente"
                className={cn(
                  teclaFisica,
                  "inline-flex h-[38px] w-[42px] items-center justify-center disabled:cursor-not-allowed disabled:opacity-35",
                  keyboardPressedDirection === "next" && teclaFisicaPressed,
                )}
              >
                <FlechaTeclaAbajo className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ===== FOOTER DESKTOP ===== */}
      <footer className="hidden shrink-0 border-t border-border-default bg-bg-base lg:block">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-10 py-4">
          <div className="flex items-center gap-4">
            {selloFecha}
            <div className="flex items-center gap-3 text-text-secondary">
              <a
                href={REDES[PAIS_REDES].instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="transition-colors hover:text-text-primary"
              >
                {instagramGlyph}
              </a>
              <a
                href={REDES[PAIS_REDES].x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="transition-colors hover:text-text-primary"
              >
                {xGlyph}
              </a>
              <span aria-hidden="true" className="text-[14px] leading-none">·</span>
              <Link
                href="/info"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Información sobre La Puta Política"
                className="transition-colors hover:text-text-primary"
              >
                {informationGlyph}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-6 font-ui text-[13px] font-bold text-text-primary">
            {onShare ? (
              <button type="button" onClick={onShare} className="inline-flex items-center gap-1.5">
                {shareGlyph}
                <span className="underline underline-offset-[3px]">Compartir</span>
              </button>
            ) : null}
            {onReadMore ? (
              <button type="button" onClick={onReadMore} className="inline-flex items-center">
                <span className="underline underline-offset-[3px]">Leer más</span>
                <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={slideActivo === 1}
              onClick={onPrev}
              aria-label="Ir al slide anterior"
              className={cn(
                teclaFisica,
                "inline-flex h-[38px] w-[42px] items-center justify-center disabled:cursor-not-allowed disabled:opacity-35",
                keyboardPressedDirection === "prev" && teclaFisicaPressed,
              )}
            >
              <FlechaTeclaArriba className="h-5 w-5" />
            </button>
            <button
              type="button"
              disabled={slideActivo === ultimaSlide}
              onClick={onNext}
              aria-label="Ir al slide siguiente"
              className={cn(
                teclaFisica,
                "inline-flex h-[38px] w-[42px] items-center justify-center disabled:cursor-not-allowed disabled:opacity-35",
                keyboardPressedDirection === "next" && teclaFisicaPressed,
              )}
            >
              <FlechaTeclaAbajo className="h-5 w-5" />
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}

export type { EdicionLayoutProps };
