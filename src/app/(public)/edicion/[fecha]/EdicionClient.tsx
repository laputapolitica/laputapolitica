"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ElPulsoLogo } from "@/components/shared/ElPulsoLogo";
import { InterpretacionGeneral } from "@/components/shared/InterpretacionGeneral";
import {
  CTASlide,
  EdicionLayout,
  FechaSelector,
  NoticiaSlide,
  PortadaSlide,
} from "@/components/public";
import type { ClimaCiudadData } from "@/lib/clima";
import { cn } from "@/lib/utils";
import type { Edicion, Noticia } from "@/types/edicion";

type EdicionClientProps = {
  edicion: Edicion;
  clima: { ciudades: ClimaCiudadData[]; initialCityId: string };
};

function normalizeEditionDate(fecha: string) {
  const parts = fecha.split("-");
  if (parts.length !== 3) {
    return fecha;
  }
  const [first, second, third] = parts;
  if (first.length === 4) {
    return fecha;
  }
  return `${third}-${second}-${first}`;
}

export function EdicionClient({ edicion, clima }: EdicionClientProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);
  const [slideActivo, setSlideActivo] = useState(1);
  const [fechaSelectorOpen, setFechaSelectorOpen] = useState(false);
  const [noticiaLeyendo, setNoticiaLeyendo] = useState<Noticia | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const fechaActual = normalizeEditionDate(edicion.fecha);

  const noticiaEnSlide = edicion.noticias.find(
    (noticia) => noticia.orden === slideActivo - 1,
  );

  const abrirLectura = useCallback((noticia: Noticia) => {
    setIsClosing(false);
    setNoticiaLeyendo(noticia);
  }, []);

  const cerrarLectura = useCallback(() => {
    setIsClosing(true);
  }, []);

  const scrollToSlide = useCallback((slideNumber: number) => {
    const slide = slideRefs.current[slideNumber - 1];
    if (!slide) {
      return;
    }
    slide.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const root = scrollContainerRef.current;
    if (!root) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visibleEntry) {
          return;
        }
        const nextSlide = Number(visibleEntry.target.getAttribute("data-slide"));
        if (!Number.isNaN(nextSlide)) {
          setSlideActivo(nextSlide);
        }
      },
      { root, threshold: [0.55, 0.7, 0.85] },
    );
    slideRefs.current.forEach((slide) => {
      if (slide) {
        observer.observe(slide);
      }
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!noticiaLeyendo) {
      return;
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        cerrarLectura();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cerrarLectura, noticiaLeyendo]);

  return (
    <EdicionLayout
      fecha={edicion.fecha}
      slideActivo={slideActivo}
      onNext={() => scrollToSlide(Math.min(slideActivo + 1, 7))}
      onPrev={() => scrollToSlide(Math.max(slideActivo - 1, 1))}
      onFechaClick={() => setFechaSelectorOpen(true)}
      onReadMore={
        noticiaEnSlide ? () => abrirLectura(noticiaEnSlide) : undefined
      }
      modoLectura={Boolean(noticiaLeyendo) && !isClosing}
      onCerrar={cerrarLectura}
    >
      <div
        ref={scrollContainerRef}
        className="mx-auto h-full max-w-[480px] snap-y snap-mandatory overflow-y-scroll scroll-smooth bg-bg-base no-scrollbar"
      >
        <PortadaSlide
          ref={(node) => {
            slideRefs.current[0] = node;
          }}
          edicion={edicion}
        />

        {edicion.noticias.map((noticia) => (
          <NoticiaSlide
            key={noticia.id}
            ref={(node) => {
              slideRefs.current[noticia.orden] = node;
            }}
            isModalOpen={false}
            noticia={noticia}
            slideNumber={noticia.orden + 1}
          />
        ))}

        <CTASlide
          ref={(node) => {
            slideRefs.current[6] = node;
          }}
          clima={clima}
        />
      </div>

      {noticiaLeyendo ? (
        <NoticiaLectura
          noticia={noticiaLeyendo}
          isClosing={isClosing}
          onExited={() => {
            setNoticiaLeyendo(null);
            setIsClosing(false);
          }}
        />
      ) : null}

      <FechaSelector
        fechaActual={fechaActual}
        isOpen={fechaSelectorOpen}
        onClose={() => setFechaSelectorOpen(false)}
      />
    </EdicionLayout>
  );
}

type NoticiaLecturaProps = {
  noticia: Noticia;
  isClosing: boolean;
  onExited: () => void;
};

function NoticiaLectura({ noticia, isClosing, onExited }: NoticiaLecturaProps) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    let innerRaf = 0;
    const outerRaf = requestAnimationFrame(() => {
      innerRaf = requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      cancelAnimationFrame(outerRaf);
      cancelAnimationFrame(innerRaf);
    };
  }, []);

  const shown = entered && !isClosing;

  return (
    <div className="absolute inset-x-0 bottom-0 -top-px z-40 overflow-hidden">
      <div
        onTransitionEnd={() => {
          if (isClosing) {
            onExited();
          }
        }}
        className={cn(
          "absolute inset-0 overflow-y-auto bg-bg-base no-scrollbar transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          shown ? "translate-y-0" : "translate-y-full",
        )}
      >
        <article className="mx-auto flex max-w-[480px] flex-col px-6 pb-10 pt-6">
          <h1 className="font-display text-3xl font-semibold leading-[1.1] text-text-primary">
            {noticia.titulo}
          </h1>

          <p className="mt-6 whitespace-pre-line font-editorial text-base leading-relaxed text-text-primary">
            {noticia.cuerpo}
          </p>

          <ElPulsoLogo className="mt-8 h-auto w-[106px]" />

          <p className="mt-4 whitespace-pre-line font-editorial text-base leading-relaxed text-text-primary">
            {noticia.el_pulso.texto_resumen}
          </p>

          <InterpretacionGeneral
            className="mt-8"
            pct_incierta={noticia.el_pulso.pct_incierta}
            pct_negativa={noticia.el_pulso.pct_negativa}
            pct_positiva={noticia.el_pulso.pct_positiva}
          />
        </article>
      </div>
    </div>
  );
}
