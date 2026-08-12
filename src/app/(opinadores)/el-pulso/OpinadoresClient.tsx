"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { HeaderElPulso, OnboardingNav, OnboardingSlide } from "@/components/opinadores";

type OnboardingItem = {
  numero: number;
  titulo: string;
  descripcion: string;
  ilustracionUrl: string;
};

const TOTAL_SLIDES = 3;

const slides: OnboardingItem[] = [
  {
    numero: 1,
    titulo: "La política del día, interpretada por vos",
    descripcion:
      "Leé las noticias centrales de cada jornada y sumá una mirada honesta, breve y situada.",
    ilustracionUrl: "/onboarding/slide-1.png",
  },
  {
    numero: 2,
    titulo: "Tu opinión construye El Pulso",
    descripcion:
      "Cada voto ayuda a revelar cómo se está leyendo la actualidad política desde la comunidad.",
    ilustracionUrl: "/onboarding/slide-2.png",
  },
  {
    numero: 3,
    titulo: "5 minutos. Todos los días. Tu voz importa.",
    descripcion:
      "Un ritual simple para participar mejor: leer, votar y dejar una interpretación propia.",
    ilustracionUrl: "/onboarding/slide-3.png",
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
    <main className="fixed inset-0 overflow-hidden bg-bg-base text-text-primary">
      <header className="fixed left-0 top-0 z-50 flex w-full items-center justify-between bg-bg-base px-5 py-4">
        <HeaderElPulso />
      </header>

      <div className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth">
        {slides.map(
          (slide: OnboardingItem, index: number): React.ReactElement => (
            <div
              key={slide.numero}
              ref={(element: HTMLDivElement | null): void => {
                slideRefs.current[index] = element;
              }}
              data-slide={slide.numero}
              className="h-full w-screen flex-shrink-0 snap-center snap-always"
            >
              <OnboardingSlide
                {...slide}
                total={TOTAL_SLIDES}
                mostrarCta={slide.numero === TOTAL_SLIDES}
              />
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
