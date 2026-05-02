"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { OnboardingNav, OnboardingSlide } from "@/components/opinadores";
import { CountrySelector, ElPulsoLogo, Logo } from "@/components/shared";

type OnboardingItem = {
  numero: number;
  titulo: string;
  descripcion: string;
  ilustracionUrl: string;
  esFormulario?: boolean;
};

const TOTAL_SLIDES = 4;

const slides: OnboardingItem[] = [
  {
    numero: 1,
    titulo: "La política del día, interpretada por vos",
    descripcion:
      "Leé las noticias centrales de cada jornada y sumá una mirada honesta, breve y situada.",
    ilustracionUrl: "/placeholder.svg",
  },
  {
    numero: 2,
    titulo: "Tu opinión construye El Pulso",
    descripcion:
      "Cada voto ayuda a revelar cómo se está leyendo la actualidad política desde la comunidad.",
    ilustracionUrl: "/placeholder.svg",
  },
  {
    numero: 3,
    titulo: "5 minutos. Todos los días. Tu voz importa.",
    descripcion:
      "Un ritual simple para participar mejor: leer, votar y dejar una interpretación propia.",
    ilustracionUrl: "/placeholder.svg",
  },
  {
    numero: 4,
    titulo: "Sumate como opinador",
    descripcion: "Completá tu postulación para formar parte de la comunidad.",
    ilustracionUrl: "/placeholder.svg",
    esFormulario: true,
  },
];

export function OpinadoresClient(): React.ReactElement {
  const [activeSlide, setActiveSlide] = useState<number>(1);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]): void => {
        const visibleEntry = entries
          .filter((entry: IntersectionObserverEntry): boolean => entry.isIntersecting)
          .sort(
            (a: IntersectionObserverEntry, b: IntersectionObserverEntry): number =>
              b.intersectionRatio - a.intersectionRatio,
          )[0];

        if (!visibleEntry) {
          return;
        }

        const slideNumber = Number(visibleEntry.target.getAttribute("data-slide"));

        if (Number.isInteger(slideNumber)) {
          setActiveSlide(slideNumber);
        }
      },
      {
        root: null,
        threshold: [0.55, 0.75],
      },
    );

    const observedSlides = slideRefs.current.filter(
      (slide): slide is HTMLDivElement => slide !== null,
    );

    observedSlides.forEach((slide: HTMLDivElement): void => observer.observe(slide));

    return (): void => {
      observedSlides.forEach((slide: HTMLDivElement): void => observer.unobserve(slide));
      observer.disconnect();
    };
  }, []);

  const scrollToSlide = useCallback((slideNumber: number): void => {
    const targetSlide = slideRefs.current[slideNumber - 1];

    if (!targetSlide) {
      return;
    }

    targetSlide.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, []);

  const handlePrevious = useCallback((): void => {
    if (activeSlide > 1) {
      scrollToSlide(activeSlide - 1);
    }
  }, [activeSlide, scrollToSlide]);

  const handleNext = useCallback((): void => {
    if (activeSlide < TOTAL_SLIDES) {
      scrollToSlide(activeSlide + 1);
    }
  }, [activeSlide, scrollToSlide]);

  return (
    <main className="min-h-screen overflow-hidden bg-bg-base text-text-primary">
      <header className="fixed left-0 top-0 z-50 flex w-full items-center justify-between bg-bg-base px-5 py-4">
        <div className="flex items-center gap-3">
          <Logo variant="small" className="h-10 w-auto" />
          <span aria-hidden="true" className="h-8 w-px bg-border-default" />
          <ElPulsoLogo className="h-[26px] w-auto" />
        </div>
        <CountrySelector />
      </header>

      <div className="flex h-screen w-screen snap-x snap-mandatory overflow-x-auto scroll-smooth">
        {slides.map(
          (slide: OnboardingItem, index: number): React.ReactElement => (
            <div
              key={slide.numero}
              ref={(element: HTMLDivElement | null): void => {
                slideRefs.current[index] = element;
              }}
              data-slide={slide.numero}
              className="w-screen flex-shrink-0 snap-center snap-always"
            >
              <OnboardingSlide {...slide} total={TOTAL_SLIDES} />
            </div>
          ),
        )}
      </div>

      <OnboardingNav
        activeSlide={activeSlide}
        total={TOTAL_SLIDES}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </main>
  );
}
