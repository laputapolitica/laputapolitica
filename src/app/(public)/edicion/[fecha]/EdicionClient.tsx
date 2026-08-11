"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

import { ElPulsoLogo } from "@/components/shared/ElPulsoLogo";
import { InterpretacionGeneral } from "@/components/shared/InterpretacionGeneral";
import {
  CTASlide,
  EdicionLayout,
  FechaSelector,
  NoticiaSlide,
  PortadaSlide,
} from "@/components/public";
import { obtenerEdicion } from "@/lib/actions";
import type { ClimaCiudadData } from "@/lib/clima";
import { cn } from "@/lib/utils";
import type { Edicion, EdicionResumen, Noticia } from "@/types/edicion";

type ClimaData = { ciudades: ClimaCiudadData[]; initialCityId: string };

type EdicionClientProps = {
  edicion: Edicion;
  clima: ClimaData;
  ediciones: EdicionResumen[];
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

export function EdicionClient({
  edicion: edicionInicial,
  clima: climaInicial,
  ediciones,
}: EdicionClientProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);
  const [edicion, setEdicion] = useState(edicionInicial);
  const [clima, setClima] = useState<ClimaData>(climaInicial);
  const [slideActivo, setSlideActivo] = useState(1);
  const [fechaSelectorOpen, setFechaSelectorOpen] = useState(false);
  const [cambiandoEdicion, setCambiandoEdicion] = useState(false);
  const [noticiaLeyendo, setNoticiaLeyendo] = useState<Noticia | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const fechaActual = normalizeEditionDate(edicion.fecha);

  const noticiaEnSlide = edicion.noticias.find(
    (noticia) => noticia.orden === slideActivo - 1,
  );
  const secciones = [
    { n: 1, titulo: "Portada" },
    ...edicion.noticias.map((n) => ({ n: n.orden + 1, titulo: n.titulo })),
    { n: edicion.noticias.length + 2, titulo: "El clima" },
  ];

  const abrirLectura = useCallback((noticia: Noticia) => {
    setIsClosing(false);
    setNoticiaLeyendo(noticia);
  }, []);

  const cerrarLectura = useCallback(() => {
    setIsClosing(true);
  }, []);

  const seleccionarEdicion = useCallback(async (fecha: string) => {
    setCambiandoEdicion(true);
    try {
      const data = await obtenerEdicion(fecha);
      if (data) {
        setNoticiaLeyendo(null);
        setIsClosing(false);
        setEdicion(data.edicion);
        setClima(data.clima);
        setSlideActivo(1);
        scrollContainerRef.current?.scrollTo({ top: 0 });
      }
    } finally {
      setCambiandoEdicion(false);
    }
  }, []);

  const compartir = useCallback(async () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/edicion/${edicion.fecha}`;
    const noticia = edicion.noticias.find(
      (item) => item.orden === slideActivo - 1,
    );
    const titulo = noticia ? noticia.titulo : edicion.titulo;
    const datos = {
      title: titulo,
      text: `${titulo} — La Puta Política`,
      url,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(datos);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setCopiado(true);
      } catch {
        // no se pudo copiar el link
      }
    }
  }, [edicion, slideActivo]);

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
  }, [edicion]);

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

  useEffect(() => {
    if (!copiado) {
      return;
    }
    const timeout = setTimeout(() => setCopiado(false), 1800);
    return () => clearTimeout(timeout);
  }, [copiado]);

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
      onShare={compartir}
      secciones={secciones}
      onSelectSlide={scrollToSlide}
      modoLectura={Boolean(noticiaLeyendo) && !isClosing}
      onCerrar={cerrarLectura}
    >
      <div
        ref={scrollContainerRef}
        className={cn(
          "mx-auto h-full max-w-[480px] snap-y snap-mandatory overflow-y-scroll scroll-smooth bg-bg-base no-scrollbar transition-opacity duration-200 lg:mx-0 lg:max-w-none lg:flex-1",
          cambiandoEdicion && "pointer-events-none opacity-50",
        )}
      >
        <PortadaSlide
          ref={(node) => {
            slideRefs.current[0] = node;
          }}
          edicion={edicion}
          onStart={() => scrollToSlide(2)}
        />

        {edicion.noticias.map((noticia) => (
          <NoticiaSlide
            key={noticia.id}
            ref={(node) => {
              slideRefs.current[noticia.orden] = node;
            }}
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
          onRequestClose={cerrarLectura}
          onExited={() => {
            setNoticiaLeyendo(null);
            setIsClosing(false);
          }}
        />
      ) : null}

      <FechaSelector
        fechaActual={fechaActual}
        ediciones={ediciones}
        isOpen={fechaSelectorOpen}
        onClose={() => setFechaSelectorOpen(false)}
        onSelect={seleccionarEdicion}
      />

      <div
        aria-live="polite"
        className={cn(
          "pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex justify-center px-6 transition-all duration-300 ease-out",
          copiado ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        )}
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-admin-ink bg-bg-base px-4 py-2 text-[13px] font-medium text-text-primary">
          <Check aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
          Link copiado
        </span>
      </div>
    </EdicionLayout>
  );
}

type NoticiaLecturaProps = {
  noticia: Noticia;
  isClosing: boolean;
  onExited: () => void;
  onRequestClose: () => void;
};

function NoticiaLectura({ noticia, isClosing, onExited, onRequestClose }: NoticiaLecturaProps) {
  const [entered, setEntered] = useState(false);
  const exited = useRef(false);

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
  const parrafos = noticia.cuerpo
    .split(/\n+/)
    .map((parrafo) => parrafo.trim())
    .filter(Boolean);

  const handleEnd = () => {
    if (isClosing && !exited.current) {
      exited.current = true;
      onExited();
    }
  };

  return (
    <>
      {/* MOBILE — hoja que sube */}
      <div className="absolute inset-x-0 bottom-0 -top-px z-40 overflow-hidden lg:hidden">
        <div
          onTransitionEnd={handleEnd}
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

      {/* DESKTOP — modal centrado */}
      <div className="hidden lg:block">
        <div
          onClick={onRequestClose}
          className={cn(
            "fixed inset-0 z-50 bg-[rgba(20,18,14,0.44)] transition-opacity duration-300 ease-out",
            shown ? "opacity-100" : "opacity-0",
          )}
        />
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-8">
          <div
            onTransitionEnd={handleEnd}
            className={cn(
              "pointer-events-auto relative flex max-h-[86vh] w-full max-w-[760px] flex-col overflow-hidden rounded-[18px] bg-bg-base shadow-[0_30px_80px_rgba(0,0,0,0.35)] transition-all duration-300 ease-out",
              shown ? "scale-100 opacity-100" : "scale-95 opacity-0",
            )}
          >
            <button
              type="button"
              onClick={onRequestClose}
              aria-label="Cerrar lectura"
              className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-border-default bg-bg-base text-text-primary shadow-[-2px_-2px_5px_#ffffff,3px_3px_7px_#E4DFD5] transition active:scale-90"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-4 w-4">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <div className="overflow-y-auto px-16 pb-12 pt-14 no-scrollbar">
              <h1 className="font-display text-[38px] font-semibold leading-[1.08] tracking-[-0.01em] text-text-primary">
                {noticia.titulo}
              </h1>
              <div className="mt-6 max-w-[600px] font-editorial text-base leading-[1.75] text-text-primary [&>p]:mb-4">
                {parrafos.map((parrafo, index) => (
                  <p
                    key={index}
                    className={
                      index === 0
                        ? "first-letter:float-left first-letter:pr-2.5 first-letter:pt-1 first-letter:font-display first-letter:text-[58px] first-letter:font-bold first-letter:leading-[0.82] first-letter:text-text-primary"
                        : undefined
                    }
                  >
                    {parrafo}
                  </p>
                ))}
              </div>
              <hr className="mt-8 border-border-default" />
              <ElPulsoLogo className="mt-7 h-auto w-[112px]" />
              <p
                className="mt-1.5 text-[9px] font-medium uppercase tracking-[0.14em] text-text-secondary"
                style={{ fontFamily: "var(--font-nav)" }}
              >
                La lectura de la comunidad
              </p>
              <p className="mt-4 max-w-[600px] whitespace-pre-line font-editorial text-[15.5px] leading-relaxed text-text-primary">
                {noticia.el_pulso.texto_resumen}
              </p>
              <InterpretacionGeneral
                className="mt-6 max-w-[520px]"
                pct_incierta={noticia.el_pulso.pct_incierta}
                pct_negativa={noticia.el_pulso.pct_negativa}
                pct_positiva={noticia.el_pulso.pct_positiva}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
