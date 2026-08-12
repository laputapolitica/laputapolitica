"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";

import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";

type CountrySelectorProps = {
  className?: string;
};

type Country = {
  code: string;
  name: string;
  available: boolean;
};

const COUNTRIES: Country[] = [
  { code: "ar", name: "Argentina", available: true },
  { code: "bo", name: "Bolivia", available: false },
  { code: "br", name: "Brasil", available: false },
  { code: "cl", name: "Chile", available: false },
  { code: "co", name: "Colombia", available: false },
  { code: "ec", name: "Ecuador", available: false },
  { code: "mx", name: "México", available: false },
  { code: "py", name: "Paraguay", available: false },
  { code: "pe", name: "Perú", available: false },
  { code: "uy", name: "Uruguay", available: false },
  { code: "ve", name: "Venezuela", available: false },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function CountrySelector({ className }: CountrySelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Elegí tu país"
        onClick={() => setOpen(true)}
        className={[
          "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-bg-base shadow-[-3px_-3px_6px_#ffffff,4px_4px_9px_#D9D5CC] transition-shadow duration-150 ease-out active:shadow-[inset_3px_3px_6px_#D9D5CC,inset_-3px_-3px_6px_#ffffff]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/cockades/ar.svg" alt="Argentina" className="h-6 w-6" />
      </button>

      {open ? <PaisSelector onClose={() => setOpen(false)} /> : null}
    </>
  );
}

function PaisSelector({ onClose }: { onClose: () => void }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "center", loop: true });
  const [selected, setSelected] = useState(0);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const tweenNodesRef = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setVisible(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, []);

  const handleClose = useCallback(() => {
    setClosing(true);
  }, []);

  const applyTween = useCallback((api: EmblaCarouselType, eventName?: string) => {
    const engine = api.internalEngine();
    const scrollProgress = api.scrollProgress();
    const slidesInView = api.slidesInView();
    const isScroll = eventName === "scroll";
    const snaps = api.scrollSnapList();

    snaps.forEach((snap, snapIndex) => {
      let diff = snap - scrollProgress;
      const slidesInSnap = engine.slideRegistry[snapIndex];

      slidesInSnap.forEach((slideIndex) => {
        if (isScroll && !slidesInView.includes(slideIndex)) {
          return;
        }
        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target();
            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target);
              if (sign === -1) {
                diff = snap - (1 + scrollProgress);
              }
              if (sign === 1) {
                diff = snap + (1 - scrollProgress);
              }
            }
          });
        }

        const node = tweenNodesRef.current[slideIndex];
        if (!node) {
          return;
        }

        const distance = diff * snaps.length;
        const abs = Math.abs(distance);
        const scale = clamp(1 - abs * 0.16, 0.55, 1);
        const opacity = clamp(1 - abs * 0.55, 0.12, 1);
        const rotateY = clamp(distance * -34, -68, 68);

        node.style.opacity = String(opacity);
        node.style.transform = `perspective(1000px) rotateY(${rotateY}deg) scale(${scale})`;
      });
    });
  }, []);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    const onScroll = () => applyTween(emblaApi, "scroll");
    const onReInit = () => applyTween(emblaApi);

    onSelect();
    applyTween(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", onReInit);

    const raf = requestAnimationFrame(() => emblaApi.reInit());

    return () => {
      cancelAnimationFrame(raf);
      emblaApi.off("select", onSelect);
      emblaApi.off("scroll", onScroll);
      emblaApi.off("reInit", onReInit);
    };
  }, [emblaApi, applyTween]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
      if (event.key === "ArrowLeft") {
        emblaApi?.scrollPrev();
      }
      if (event.key === "ArrowRight") {
        emblaApi?.scrollNext();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose, emblaApi]);

  const shown = visible && !closing;
  const active = COUNTRIES[selected] ?? COUNTRIES[0];

  const arrowClass =
    "absolute top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-bg-base text-text-primary shadow-[-3px_-3px_6px_#ffffff,4px_4px_9px_#D9D5CC] transition-shadow duration-150 ease-out active:shadow-[inset_3px_3px_6px_#D9D5CC,inset_-3px_-3px_6px_#ffffff] lg:flex";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Selector de país"
      onTransitionEnd={(event) => {
        if (closing && event.target === event.currentTarget) {
          onClose();
        }
      }}
      className={cn(
        "fixed inset-0 z-[60] flex flex-col bg-bg-base transition-opacity duration-300 ease-out",
        shown ? "opacity-100" : "opacity-0",
      )}
    >
      <div className="relative flex items-center justify-center px-5 py-5 lg:py-7">
        <span
          className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-text-secondary lg:text-[11px]"
          style={{ fontFamily: "var(--font-nav)" }}
        >
          Elegí tu país
        </span>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Cerrar"
          className="absolute right-5 text-text-secondary transition-transform active:scale-90 lg:right-8"
        >
          <X aria-hidden="true" className="h-5 w-5 lg:h-6 lg:w-6" strokeWidth={1.8} />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="h-full overflow-hidden" ref={emblaRef}>
          <div className="flex h-full">
            {COUNTRIES.map((country, index) => (
              <div
                key={country.code}
                className="flex flex-[0_0_50%] items-center justify-center lg:flex-[0_0_26%]"
              >
                <button
                  type="button"
                  aria-label={`Ver ${country.name}`}
                  onClick={() => {
                    if (emblaApi) {
                      emblaApi.scrollTo(index);
                    }
                  }}
                  ref={(el) => {
                    tweenNodesRef.current[index] = el;
                  }}
                  className="h-[132px] w-[132px] lg:h-[168px] lg:w-[168px]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/cockades/${country.code}.svg`}
                    alt={`Escarapela de ${country.name}`}
                    className="h-full w-full"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => emblaApi?.scrollPrev()}
          aria-label="País anterior"
          className={cn(arrowClass, "left-12")}
        >
          <ChevronLeft aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
        </button>
        <button
          type="button"
          onClick={() => emblaApi?.scrollNext()}
          aria-label="País siguiente"
          className={cn(arrowClass, "right-12")}
        >
          <ChevronRight aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
        </button>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center">
          <div className="flex flex-1 flex-col items-center justify-end pb-9 lg:pb-12">
            <span
              className="text-[11px] font-medium uppercase tracking-[0.22em] text-text-primary lg:text-[13px] lg:tracking-[0.24em]"
              style={{ fontFamily: "var(--font-nav)" }}
            >
              {active.name}
            </span>
          </div>

          <div className="h-[132px] lg:h-[168px]" aria-hidden="true" />

          <div className="flex flex-1 flex-col items-center justify-start pt-9 lg:pt-12">
            <div className="flex h-9 items-center justify-center lg:h-[52px]">
              {active.available ? (
                <Logo variant="large" className="h-auto w-[200px] lg:w-[280px]" />
              ) : (
                <span className="font-display text-xl italic text-text-secondary lg:text-2xl">
                  Próximamente
                </span>
              )}
            </div>

            {active.available ? (
              <button
                type="button"
                onClick={handleClose}
                className="pointer-events-auto mt-7 inline-flex items-center gap-1 font-ui text-[15px] font-bold text-text-primary lg:mt-9 lg:text-[17px]"
              >
                <span className="underline underline-offset-[4px]">Entrar</span>
                <ArrowRight aria-hidden="true" className="h-4 w-4 lg:h-[18px] lg:w-[18px]" strokeWidth={2} />
              </button>
            ) : (
              <span
                className="mt-7 text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary lg:mt-9 lg:text-[11px]"
                style={{ fontFamily: "var(--font-nav)" }}
              >
                Aún no disponible
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-1.5 pb-9 pt-4 lg:pb-12">
        {COUNTRIES.map((country, index) => (
          <button
            key={country.code}
            type="button"
            aria-label={`Ir a ${country.name}`}
            onClick={() => emblaApi?.scrollTo(index)}
            className={cn(
              "h-1.5 w-1.5 rounded-full transition-colors",
              index === selected ? "bg-text-primary" : "bg-[#D3CFC6]",
            )}
          />
        ))}
      </div>
    </div>,
    document.body,
  );
}

export type { CountrySelectorProps };
