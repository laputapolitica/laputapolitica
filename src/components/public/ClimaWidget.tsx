import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

import type { Clima, ClimaDia } from "@/lib/mock-data";

type ClimaWidgetProps = {
  clima: Clima;
};

export function ClimaWidget({ clima }: ClimaWidgetProps) {
  return (
    <section className="mx-auto w-full max-w-[360px]">
      <div className="grid grid-cols-[40px_1fr_40px] items-center">
        <button
          type="button"
          aria-label="Provincia anterior"
          className="inline-flex h-10 w-10 items-center justify-center text-text-primary"
        >
          <ChevronLeft aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
        </button>

        <h3 className="font-display text-xl font-normal text-text-primary">
          {clima.provincia}
        </h3>

        <button
          type="button"
          aria-label="Provincia siguiente"
          className="inline-flex h-10 w-10 items-center justify-center text-text-primary"
        >
          <ChevronRight aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
        </button>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4">
        {clima.dias.map((dia) => (
          <article key={dia.dia} className="text-center">
            <ClimaIcon dia={dia} />
            <div className="mt-3 font-ui text-sm text-text-primary">
              <span className="text-text-secondary">{dia.temp_min}°</span>
              <span>/</span>
              <span className="text-state-required">{dia.temp_max}°</span>
            </div>
            <div className="mt-2 font-ui text-sm text-text-secondary">{dia.dia}</div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ClimaIcon({ dia }: { dia: ClimaDia }) {
  return (
    <Image
      alt={`Clima ${dia.condicion}`}
      className="mx-auto h-12 w-12 object-contain"
      height={48}
      src="/placeholder.svg"
      width={48}
    />
  );
}

export type { ClimaWidgetProps };
