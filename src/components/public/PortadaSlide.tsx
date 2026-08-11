import { forwardRef } from "react";
import Image from "next/image";

import type { Edicion } from "@/types/edicion";

type PortadaSlideProps = {
  edicion: Edicion;
  onStart?: () => void;
};

const monthLabels = [
  "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
  "JUL", "AGO", "SEP", "OCT", "NOV", "DIC",
];

function formatFecha(fecha: string) {
  const parts = fecha.split("-");
  if (parts.length !== 3) {
    return null;
  }
  const [first, second, third] = parts;
  const isIso = first.length === 4;
  const day = isIso ? third : first;
  const month = monthLabels[Number(second) - 1];
  const year = isIso ? first : third;
  if (!month) {
    return null;
  }
  return `${day} · ${month} · ${year}`;
}

export const PortadaSlide = forwardRef<HTMLElement, PortadaSlideProps>(
  function PortadaSlide({ edicion, onStart }, ref) {
    const fechaLabel = formatFecha(edicion.fecha);

    return (
      <section
        ref={ref}
        data-slide="1"
        className="relative flex h-full snap-start snap-always flex-col animate-in fade-in duration-200 lg:overflow-hidden"
      >
        {/* MOBILE */}
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-6 lg:hidden">
          <div className="relative aspect-square w-full max-w-[360px]">
            <Image
              priority
              fill
              alt={`Ilustración de portada de ${edicion.titulo}`}
              className="object-contain"
              sizes="(max-width: 480px) 80vw, 360px"
              src={edicion.portada_illustracion_url}
            />
            <h1 className="absolute inset-x-0 top-full mt-4 text-center font-editorial text-base italic text-text-secondary">
              {edicion.titulo}
            </h1>
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden min-h-0 w-full flex-1 items-center justify-center gap-16 px-16 py-8 lg:flex">
          <div className="relative aspect-square w-[420px] max-w-[44%] flex-none">
            <Image
              priority
              fill
              alt={`Ilustración de portada de ${edicion.titulo}`}
              className="object-contain"
              sizes="420px"
              src={edicion.portada_illustracion_url}
            />
          </div>
          <div className="max-w-[400px]">
            {fechaLabel ? (
              <span
                className="text-[11px] font-medium uppercase tracking-[0.16em] text-text-secondary"
                style={{ fontFamily: "var(--font-nav)" }}
              >
                {fechaLabel}
              </span>
            ) : null}
            <h1 className="mt-3.5 font-display text-[60px] font-medium italic leading-[1.02] tracking-[-0.01em] text-text-primary">
              {edicion.titulo}
            </h1>
            <p className="mt-5 max-w-[330px] font-editorial text-[15px] leading-relaxed text-text-secondary">
              Tres temas para entender la jornada política argentina, en claro y sin vueltas.
            </p>
            {onStart ? (
              <button
                type="button"
                onClick={onStart}
                className="mt-8 inline-flex items-center gap-2.5 rounded-[10px] border-b-4 border-black bg-admin-ink px-5 py-3 font-ui text-[14px] font-semibold text-white transition-all duration-100 ease-out active:translate-y-[3px] active:border-b"
              >
                Empezar a leer
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-[15px] w-[15px]"
                >
                  <path d="M5 12h14" />
                  <path d="M13 6l6 6-6 6" />
                </svg>
              </button>
            ) : null}
          </div>
        </div>
      </section>
    );
  },
);
