import { useState } from "react";
import Image from "next/image";

import { climaIconPath, type ClimaCiudadData, type ClimaDiaData } from "@/lib/clima";

type ClimaWidgetProps = {
  clima: { ciudades: ClimaCiudadData[]; initialCityId: string };
};

export function ClimaWidget({ clima }: ClimaWidgetProps) {
  const { ciudades, initialCityId } = clima;
  const [activeCityIndex, setActiveCityIndex] = useState(() => {
    const initialIndex = ciudades.findIndex((ciudad) => ciudad.id === initialCityId);
    return initialIndex >= 0 ? initialIndex : 0;
  });

  if (ciudades.length === 0) {
    return null;
  }

  const activeCity = ciudades[activeCityIndex] ?? ciudades[0];
  const canCycleCities = ciudades.length > 1;

  function goToPrevCity() {
    setActiveCityIndex((currentIndex) =>
      currentIndex === 0 ? ciudades.length - 1 : currentIndex - 1,
    );
  }

  function goToNextCity() {
    setActiveCityIndex((currentIndex) =>
      currentIndex === ciudades.length - 1 ? 0 : currentIndex + 1,
    );
  }

  return (
    <section className="mx-auto w-full max-w-[360px]">
      <div className="flex items-center">
        <button
          type="button"
          aria-label="Provincia anterior"
          className="flex-1 bg-transparent p-0 disabled:pointer-events-none disabled:opacity-0"
          disabled={!canCycleCities}
          onClick={goToPrevCity}
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
          {activeCity.label}
        </h3>

        <button
          type="button"
          aria-label="Provincia siguiente"
          className="flex-1 bg-transparent p-0 disabled:pointer-events-none disabled:opacity-0"
          disabled={!canCycleCities}
          onClick={goToNextCity}
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
        {activeCity.dias.map((dia) => (
          <article key={dia.fecha} className="text-center">
            <ClimaIcon dia={dia} />
            <div className="mt-3 font-ui text-sm text-text-primary">
              <span className="text-text-secondary">
                {formatTemperature(dia.temperaturaMin)}
              </span>
              <span>/</span>
              <span className="text-state-required">
                {formatTemperature(dia.temperaturaMax)}
              </span>
            </div>
            <div className="mt-2 font-ui text-sm text-text-secondary">
              {dia.diaLabel}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function formatTemperature(value: number | null): string {
  return value === null ? "--°" : `${value}°`;
}

function ClimaIcon({ dia }: { dia: ClimaDiaData }) {
  return (
    <Image
      alt={dia.condicion ?? dia.icono}
      className="mx-auto h-12 w-12 object-contain"
      height={48}
      src={climaIconPath(dia.icono)}
      width={48}
    />
  );
}

export type { ClimaWidgetProps };
