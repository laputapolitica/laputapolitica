"use client";

import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  HeaderElPulso,
  HeaderOpinador,
  NoticiaSwipe,
  type NoticiaSwipeNoticia,
} from "@/components/opinadores";
import { ElPulsoLogo, Logo } from "@/components/shared";
import type { OpinionSentiment } from "./actions";
import type { Edicion } from "@/types/edicion";

type DiaClientProps = {
  edicion: Edicion;
  nombre: string;
  opinionesPrevias: Record<string, { texto: string; sentiment: OpinionSentiment }>;
};

export function DiaClient({
  edicion,
  nombre,
  opinionesPrevias,
}: DiaClientProps): React.ReactElement {
  const [activeSlide, setActiveSlide] = useState<number>(1);
  const [noticiaActiva, setNoticiaActiva] =
    useState<NoticiaSwipeNoticia | null>(null);
  const [opinadas, setOpinadas] = useState<Set<string>>(
    () => new Set(Object.keys(opinionesPrevias)),
  );
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

  return (
    <main className="flex h-[100dvh] flex-col overflow-hidden bg-bg-base text-text-primary">
      <header className="flex w-full flex-none items-center justify-between px-5 py-4">
        <HeaderElPulso />
      </header>

      <HeaderOpinador nombre={nombre || "opinador"} />

      <div className="flex h-10 w-full flex-none items-center justify-between bg-bg-base px-4">
        <p className="font-ui text-xs font-medium uppercase tracking-wider text-text-secondary">
          NOTICIAS DEL DÍA
        </p>
        <nav aria-label="Navegación de noticias" className="flex items-center gap-2.5">
          {edicion.noticias.map((noticia): React.ReactElement => {
            const isActive = noticia.orden === activeSlide;
            const isDone = opinadas.has(noticia.id);

            return (
              <button
                key={noticia.id}
                type="button"
                aria-label={`Ir a la noticia ${noticia.orden}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => scrollToSlide(noticia.orden)}
                className={`bg-transparent p-0 text-[11px] leading-none tracking-[0.04em] transition-colors ${
                  isActive
                    ? "font-bold text-admin-ink"
                    : isDone
                      ? "text-admin-ink"
                      : "text-[#A7A29A]"
                }`}
                style={{ fontFamily: "var(--font-nav)" }}
              >
                {String(noticia.orden).padStart(2, "0")}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="no-scrollbar flex min-h-0 w-full flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth">
        {edicion.noticias.map(
          (noticia, index: number): React.ReactElement => (
            <div
              key={noticia.id}
              ref={(element: HTMLDivElement | null): void => {
                slideRefs.current[index] = element;
              }}
              data-slide={noticia.orden}
              className="h-full w-screen flex-shrink-0 snap-center snap-always px-4 py-4"
            >
              <NoticiaSwipe
                noticia={noticia}
                onRead={setNoticiaActiva}
                opinionPrevia={opinionesPrevias[noticia.id]}
                onOpinionEnviada={(id: string): void =>
                  setOpinadas((prev: Set<string>): Set<string> => {
                    const next = new Set(prev);
                    next.add(id);
                    return next;
                  })
                }
              />
            </div>
          ),
        )}
      </div>

      {noticiaActiva ? (
        <LecturaModal
          noticia={noticiaActiva}
          onClose={() => setNoticiaActiva(null)}
        />
      ) : null}
    </main>
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
      <header className="flex w-full flex-none items-center justify-between border-b border-border-default px-5 py-4">
        <div className="flex items-center gap-3">
          <Logo variant="small" className="h-[30px] w-auto" />
          <span aria-hidden="true" className="h-6 w-px bg-border-default" />
          <ElPulsoLogo className="h-[22px] w-auto" />
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="flex h-9 w-9 items-center justify-center bg-transparent text-text-secondary transition-colors hover:text-text-primary"
        >
          <X aria-hidden="true" size={22} strokeWidth={1.75} />
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-6">
        <article className="mx-auto flex max-w-[480px] flex-col pb-16 pt-8">
          <h1 className="font-display text-[26px] font-normal leading-[1.15] text-text-primary">
            {noticia.titulo}
          </h1>
          <p className="mt-5 whitespace-pre-line font-editorial text-base leading-relaxed text-text-primary">
            {noticia.cuerpo}
          </p>
        </article>
      </div>
    </div>
  );
}
