import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import { climaIconPath, type ClimaCiudadData, type ClimaDiaData } from "@/lib/clima";
import { cn } from "@/lib/utils";

type ClimaWidgetProps = {
  clima: { ciudades: ClimaCiudadData[]; initialCityId: string };
};

const AUTOPLAY_DELAY = 6000;

function cityLabelSize(label: string): string {
  if (label.length <= 13) return "text-2xl";
  if (label.length <= 17) return "text-xl";
  return "text-lg";
}

export function ClimaWidget({ clima }: ClimaWidgetProps) {
  const { ciudades, initialCityId } = clima;
  const initialIndex = Math.max(
    0,
    ciudades.findIndex((ciudad) => ciudad.id === initialCityId),
  );
  const canCycleCities = ciudades.length > 1;

  const sectionRef = useRef<HTMLElement>(null);
  const autoplay = useRef(
    Autoplay({
      delay: AUTOPLAY_DELAY,
      playOnInit: false,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
    }),
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, startIndex: initialIndex, active: canCycleCities },
    canCycleCities ? [autoplay.current] : [],
  );
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  const onSelect = useCallback(() => {
    if (!emblaApi) {
      return;
    }
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || !emblaApi || !canCycleCities) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          emblaApi.scrollTo(initialIndex, true);
          autoplay.current.play();
        } else {
          autoplay.current.stop();
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [emblaApi, canCycleCities, initialIndex]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (ciudades.length === 0) {
    return null;
  }

  const activeCity = ciudades[selectedIndex] ?? ciudades[0];

  return (
    <section ref={sectionRef} className="mx-auto w-full max-w-[360px] lg:max-w-[500px]">
      <div className="flex items-center">
        <button
          type="button"
          aria-label="Provincia anterior"
          className="flex-1 bg-transparent p-0 disabled:pointer-events-none disabled:opacity-0"
          disabled={!canCycleCities}
          onClick={scrollPrev}
        >
          <svg aria-hidden="true" width="100%" height="6" viewBox="0 0 139 6" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 2.88672L5 5.77347V-3.26633e-05L0 2.88672ZM139 2.88672V2.38672L4.5 2.38672V2.88672V3.38672L139 3.38672V2.88672Z" fill="#444444" />
          </svg>
        </button>

        <h3
          className={cn(
            "mx-4 shrink-0 whitespace-nowrap font-display font-normal text-text-primary lg:mx-6 lg:text-[26px]",
            cityLabelSize(activeCity.label),
          )}
        >
          {activeCity.label}
        </h3>

        <button
          type="button"
          aria-label="Provincia siguiente"
          className="flex-1 bg-transparent p-0 disabled:pointer-events-none disabled:opacity-0"
          disabled={!canCycleCities}
          onClick={scrollNext}
        >
          <svg aria-hidden="true" width="100%" height="6" viewBox="0 0 139 6" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M139 2.88672L134 -3.26633e-05V5.77347L139 2.88672ZM0 2.88672L0 3.38672L134.5 3.38672V2.88672V2.38672L0 2.38672L0 2.88672Z" fill="#444444" />
          </svg>
        </button>
      </div>

      <div className="mt-5 overflow-hidden lg:mt-6" ref={emblaRef}>
        <div className="flex">
          {ciudades.map((ciudad) => (
            <div key={ciudad.id} className="min-w-0 flex-[0_0_100%]">
              <div className="grid grid-cols-3 gap-4 lg:gap-5">
                {ciudad.dias.map((dia) => (
                  <article key={dia.fecha} className="text-center">
                    <ClimaIcon dia={dia} />
                    <div className="mt-3 font-display text-2xl font-medium text-text-primary lg:text-[26px]">
                      <span className="text-[#2F4E85]">{formatTemperature(dia.temperaturaMin)}</span>
                      <span className="text-text-secondary">/</span>
                      <span className="text-[#B74A4A]">{formatTemperature(dia.temperaturaMax)}</span>
                    </div>
                    <div className="mt-1.5 font-display text-xs font-medium text-text-primary lg:text-[13px]">
                      {dia.diaLabel}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
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
      className="mx-auto h-[100px] w-[100px] object-contain lg:h-[104px] lg:w-[104px]"
      height={112}
      src={climaIconPath(dia.icono)}
      width={112}
    />
  );
}

export type { ClimaWidgetProps };
