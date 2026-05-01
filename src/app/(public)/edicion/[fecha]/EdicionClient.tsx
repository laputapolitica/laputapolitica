"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDownLeft } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { CountrySelector } from "@/components/shared/CountrySelector";
import { ElPulsoLogo } from "@/components/shared/ElPulsoLogo";
import { InterpretacionBars } from "@/components/shared/InterpretacionBars";
import { Logo } from "@/components/shared/Logo";
import {
  CTASlide,
  EdicionLayout,
  NoticiaSlide,
  PortadaSlide,
} from "@/components/public";
import type { Clima, Edicion, Noticia } from "@/lib/mock-data";

type EdicionClientProps = {
  edicion: Edicion;
  clima: Clima;
};

function getOrderFromParam(value: string | null) {
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed)) {
    return null;
  }

  return parsed;
}

function formatNewsNumber(orden: number) {
  return String(orden).padStart(2, "0");
}

export function EdicionClient({ edicion, clima }: EdicionClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);
  const [slideActivo, setSlideActivo] = useState(1);

  const activeOrder = getOrderFromParam(searchParams.get("n"));
  const noticiaActiva =
    activeOrder === null
      ? undefined
      : edicion.noticias.find((noticia) => noticia.orden === activeOrder);

  const closeModal = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  const openNoticia = useCallback(
    (orden: number) => {
      router.push(`${pathname}?n=${formatNewsNumber(orden)}`, { scroll: false });
    },
    [pathname, router],
  );

  const scrollToSlide = useCallback((slideNumber: number) => {
    const slide = slideRefs.current[slideNumber - 1];

    if (!slide) {
      return;
    }

    slide.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
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
      {
        root,
        threshold: [0.55, 0.7, 0.85],
      },
    );

    slideRefs.current.forEach((slide) => {
      if (slide) {
        observer.observe(slide);
      }
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!noticiaActiva) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeModal();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeModal, noticiaActiva]);

  return (
    <EdicionLayout
      fecha={edicion.fecha}
      onNext={() => scrollToSlide(Math.min(slideActivo + 1, 7))}
      onPrev={() => scrollToSlide(Math.max(slideActivo - 1, 1))}
      slideActivo={slideActivo}
    >
      <div
        ref={scrollContainerRef}
        className="mx-auto h-screen max-w-[480px] snap-y snap-mandatory overflow-y-scroll scroll-smooth bg-bg-base"
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
            noticia={noticia}
            slideNumber={noticia.orden + 1}
            onReadMore={() => openNoticia(noticia.orden)}
          />
        ))}

        <CTASlide
          ref={(node) => {
            slideRefs.current[6] = node;
          }}
          clima={clima}
        />
      </div>

      {noticiaActiva ? (
        <NoticiaExpandedModal noticia={noticiaActiva} onClose={closeModal} />
      ) : null}
    </EdicionLayout>
  );
}

type NoticiaExpandedModalProps = {
  noticia: Noticia;
  onClose: () => void;
};

function NoticiaExpandedModal({ noticia, onClose }: NoticiaExpandedModalProps) {
  const newsNumber = formatNewsNumber(noticia.orden);

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#FAF9F5]/85 backdrop-blur-md"
      role="dialog"
    >
      <header className="sticky top-0 z-10 bg-[#FAF9F5]/85 px-5 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-[480px] items-center justify-between gap-4">
          <Logo className="h-auto w-[206px] max-w-[calc(100vw-112px)]" variant="large" />
          <CountrySelector />
        </div>
      </header>

      <article className="mx-auto flex min-h-[calc(100vh-72px)] max-w-[480px] flex-col px-6 pb-12 pt-6">
        <div className="font-ui text-sm font-semibold text-text-secondary">
          NOTICIA {newsNumber}
        </div>

        <h1 className="mt-4 font-display text-2xl font-normal leading-[1.15] text-text-primary">
          {noticia.titulo}
        </h1>

        <p className="mt-6 whitespace-pre-line font-editorial text-base leading-relaxed text-text-primary">
          {noticia.cuerpo}
        </p>

        <ElPulsoLogo className="mt-8 h-auto w-[106px]" />

        <p className="mt-4 whitespace-pre-line font-editorial text-base leading-relaxed text-text-primary">
          {noticia.el_pulso.texto_resumen}
        </p>

        <section className="mt-8">
          <h2 className="font-ui text-base font-medium text-text-primary">
            Interpretación general
          </h2>
          <InterpretacionBars
            className="mt-4"
            pct_incierta={noticia.el_pulso.pct_incierta}
            pct_negativa={noticia.el_pulso.pct_negativa}
            pct_positiva={noticia.el_pulso.pct_positiva}
          />
        </section>

        <button
          type="button"
          onClick={onClose}
          className="mx-auto mb-12 mt-8 inline-flex items-center gap-2 font-ui text-base font-normal text-text-primary"
        >
          Cerrar
          <ArrowDownLeft aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
        </button>
      </article>
    </div>
  );
}
