"use client";

import { ArrowDownLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  HeaderOpinador,
  NoticiaSwipe,
  type NoticiaSwipeNoticia,
} from "@/components/opinadores";
import { CountrySelector, ElPulsoLogo, Logo } from "@/components/shared";
import type { Edicion } from "@/lib/mock-data";

type DiaClientProps = {
  edicion: Edicion;
};

const TOTAL_NOTICIAS = 5;

export function DiaClient({ edicion }: DiaClientProps): React.ReactElement {
  const [activeSlide, setActiveSlide] = useState<number>(1);
  const [noticiaActiva, setNoticiaActiva] =
    useState<NoticiaSwipeNoticia | null>(null);
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
    if (activeSlide < TOTAL_NOTICIAS) {
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

      <HeaderOpinador nombre="Martin" />

      <div className="fixed left-0 top-[122px] z-30 w-full bg-bg-base px-4 pt-4">
        <p className="font-ui text-xs font-medium uppercase tracking-wider text-text-secondary">
          NOTICIAS DEL DÍA - OPINÁ SOBRE CADA UNA
        </p>
      </div>

      <div className="flex h-screen w-screen snap-x snap-mandatory overflow-x-auto scroll-smooth">
        {edicion.noticias.map(
          (noticia, index: number): React.ReactElement => (
            <div
              key={noticia.id}
              ref={(element: HTMLDivElement | null): void => {
                slideRefs.current[index] = element;
              }}
              data-slide={noticia.orden}
              className="w-screen flex-shrink-0 snap-center snap-always overflow-y-auto px-4 pb-28 pt-[166px]"
            >
              <NoticiaSwipe noticia={noticia} onRead={setNoticiaActiva} />
            </div>
          ),
        )}
      </div>

      <DiaNav
        activeSlide={activeSlide}
        total={TOTAL_NOTICIAS}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />

      {noticiaActiva ? (
        <LecturaModal
          noticia={noticiaActiva}
          onClose={() => setNoticiaActiva(null)}
        />
      ) : null}
    </main>
  );
}

type DiaNavProps = {
  activeSlide: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
};

function DiaNav({
  activeSlide,
  total,
  onPrevious,
  onNext,
}: DiaNavProps): React.ReactElement {
  const isFirstSlide = activeSlide === 1;
  const isLastSlide = activeSlide === total;
  const indicator = `Noticia ${String(activeSlide).padStart(2, "0")}/${String(total).padStart(2, "0")}`;

  return (
    <nav
      aria-label="Navegación de noticias"
      className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-between bg-bg-base px-5 py-5 text-text-primary"
    >
      <button
        type="button"
        aria-label="Noticia anterior"
        disabled={isFirstSlide}
        onClick={onPrevious}
        className="flex min-w-0 flex-1 items-center gap-2 disabled:pointer-events-none disabled:opacity-30"
      >
        <ChevronLeft aria-hidden="true" size={24} strokeWidth={1.5} />
        <span aria-hidden="true" className="h-px flex-1 bg-text-primary" />
      </button>

      <span className="shrink-0 px-4 text-center font-display text-base font-normal text-text-primary">
        {indicator}
      </span>

      <button
        type="button"
        aria-label="Noticia siguiente"
        disabled={isLastSlide}
        onClick={onNext}
        className="flex min-w-0 flex-1 items-center gap-2 disabled:pointer-events-none disabled:opacity-30"
      >
        <span aria-hidden="true" className="h-px flex-1 bg-text-primary" />
        <ChevronRight aria-hidden="true" size={24} strokeWidth={1.5} />
      </button>
    </nav>
  );
}

type LecturaModalProps = {
  noticia: NoticiaSwipeNoticia;
  onClose: () => void;
};

function LecturaModal({
  noticia,
  onClose,
}: LecturaModalProps): React.ReactElement {
  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[70] flex flex-col bg-bg-base"
      role="dialog"
    >
      <header className="sticky top-0 z-10 bg-bg-base px-4 py-4">
        <div className="mx-auto flex max-w-[480px] items-center justify-between gap-4">
          <Logo
            className="h-auto w-[206px] max-w-[calc(100vw-112px)]"
            variant="large"
          />
          <CountrySelector />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6">
        <article className="mx-auto flex max-w-[480px] flex-col pb-28 pt-6">
          <div className="font-ui text-sm font-semibold text-text-secondary">
            NOTICIA {String(noticia.orden).padStart(2, "0")}
          </div>

          <h1 className="mt-4 font-display text-2xl font-normal leading-[1.15] text-text-primary">
            {noticia.titulo}
          </h1>

          <p className="mt-6 whitespace-pre-line font-editorial text-base leading-relaxed text-text-primary">
            {noticia.cuerpo}
          </p>
        </article>
      </div>

      <footer className="fixed bottom-0 left-0 z-20 flex w-full justify-center bg-bg-base px-5 py-5">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-full border border-black bg-white px-5 py-2 font-ui text-sm text-text-primary"
        >
          Cerrar
          <ArrowDownLeft aria-hidden="true" size={16} strokeWidth={1.75} />
        </button>
      </footer>
    </div>
  );
}
