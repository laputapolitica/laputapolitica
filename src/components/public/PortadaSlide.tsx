import { forwardRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import type { Edicion } from "@/types/edicion";

type PortadaSlideProps = {
  edicion: Edicion;
  onStart?: () => void;
};

function numeroExpediente(fecha: string): string | null {
  const parts = fecha.split("-");
  if (parts.length !== 3) {
    return null;
  }
  const [a, b, c] = parts;
  const iso = a.length === 4;
  const year = Number(iso ? a : c);
  const month = Number(b);
  const day = Number(iso ? c : a);
  if (!year || !month || !day) {
    return null;
  }
  const inicio = Date.UTC(year, 0, 0);
  const actual = Date.UTC(year, month - 1, day);
  const diaDelAno = Math.floor((actual - inicio) / 86400000);
  return `${year}_${String(diaDelAno).padStart(3, "0")}-AR`;
}

function tituloSize(titulo: string): string {
  const len = titulo.trim().length;
  if (len <= 16) return "text-[46px]";
  if (len <= 24) return "text-[40px]";
  if (len <= 34) return "text-[34px]";
  return "text-[30px]";
}

export const PortadaSlide = forwardRef<HTMLElement, PortadaSlideProps>(
  function PortadaSlide({ edicion, onStart }, ref) {
    const expediente = numeroExpediente(edicion.fecha);

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
          <div className="max-w-[440px]">
            {expediente ? (
              <span
                className="text-[11px] font-medium uppercase tracking-[0.16em] text-text-secondary"
                style={{ fontFamily: "var(--font-nav)" }}
              >
                Expediente N.º {expediente}
              </span>
            ) : null}
            <h1
              className={`mt-3.5 font-display font-medium italic leading-[1.02] tracking-[-0.01em] text-text-primary ${tituloSize(edicion.titulo)}`}
            >
              {edicion.titulo}
            </h1>
            {onStart ? (
              <button
                type="button"
                onClick={onStart}
                className="mt-7 inline-flex items-center gap-1.5 font-ui text-[15px] font-bold text-text-primary transition-transform active:scale-95"
              >
                <span className="underline underline-offset-[4px]">Empezar a leer</span>
                <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
              </button>
            ) : null}
          </div>
        </div>
      </section>
    );
  },
);
