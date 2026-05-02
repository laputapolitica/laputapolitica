import Image from "next/image";

import type { Clima, ClimaDia } from "@/lib/mock-data";

type ClimaWidgetProps = {
  clima: Clima;
};

export function ClimaWidget({ clima }: ClimaWidgetProps) {
  return (
    <section className="mx-auto w-full max-w-[360px]">
      <div className="flex items-center">
        <button
          type="button"
          aria-label="Provincia anterior"
          className="flex-1 bg-transparent p-0"
        >
          <svg
            aria-hidden="true"
            width="100%"
            height="6"
            viewBox="0 0 139 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0 2.88672L5 5.77347V-3.26633e-05L0 2.88672ZM139 2.88672V2.38672L4.5 2.38672V2.88672V3.38672L139 3.38672V2.88672Z"
              fill="#444444"
            />
          </svg>
        </button>

        <h3 className="mx-4 shrink-0 whitespace-nowrap font-display text-xl font-normal text-text-primary">
          {clima.provincia}
        </h3>

        <button
          type="button"
          aria-label="Provincia siguiente"
          className="flex-1 bg-transparent p-0"
        >
          <svg
            aria-hidden="true"
            width="100%"
            height="6"
            viewBox="0 0 139 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M139 2.88672L134 -3.26633e-05V5.77347L139 2.88672ZM0 2.88672L0 3.38672L134.5 3.38672V2.88672V2.38672L0 2.38672L0 2.88672Z"
              fill="#444444"
            />
          </svg>
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
