import { forwardRef } from "react";

import { ElPulsoLogo } from "@/components/shared/ElPulsoLogo";
import { InterpretacionGeneral } from "@/components/shared/InterpretacionGeneral";
import type { Noticia } from "@/types/edicion";

type NoticiaSlideProps = {
  noticia: Noticia;
  slideNumber: number;
};

export const NoticiaSlide = forwardRef<HTMLElement, NoticiaSlideProps>(
  function NoticiaSlide({ noticia, slideNumber }, ref) {
    const numeroNoticia = String(slideNumber - 1).padStart(2, "0");
    const parrafos = noticia.cuerpo
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean);

    return (
      <section
        ref={ref}
        data-slide={slideNumber}
        className="flex h-full snap-start snap-always animate-in fade-in flex-col py-6 pl-12 pr-6 duration-200 lg:overflow-hidden lg:px-16 lg:py-8"
      >
        {/* MOBILE */}
        <article className="flex min-h-0 flex-1 flex-col lg:hidden">
          <div className="flex min-h-0 flex-1 flex-col">
            <h2 className="font-display text-3xl font-semibold leading-[1.1] text-text-primary">
              {noticia.titulo}
            </h2>
            <div className="mt-5 min-h-0 flex-1 overflow-hidden fade-bottom">
              <p className="font-editorial text-base leading-normal text-text-primary">
                {noticia.cuerpo}
              </p>
            </div>
          </div>
          <div className="mt-6 flex min-h-0 flex-1 flex-col">
            <ElPulsoLogo className="h-auto w-[106px]" />
            <div className="mt-4 min-h-0 flex-1 overflow-hidden fade-bottom">
              <p className="font-editorial text-base leading-normal text-text-primary">
                {noticia.el_pulso.texto_resumen}
              </p>
            </div>
            <InterpretacionGeneral
              className="mt-6"
              pct_incierta={noticia.el_pulso.pct_incierta}
              pct_negativa={noticia.el_pulso.pct_negativa}
              pct_positiva={noticia.el_pulso.pct_positiva}
            />
          </div>
        </article>

        {/* DESKTOP */}
        <div className="mx-auto hidden min-h-0 w-full max-w-[1000px] flex-1 flex-col lg:flex">
          <span
            className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-secondary"
            style={{ fontFamily: "var(--font-nav)" }}
          >
            Noticia {numeroNoticia}
          </span>
          <h2 className="mt-3 font-display text-[38px] font-semibold leading-[1.05] tracking-[-0.01em] text-text-primary">
            {noticia.titulo}
          </h2>
          <div className="mt-6 flex min-h-0 flex-1 gap-10">
            <div className="min-h-0 min-w-0 flex-1 overflow-hidden fade-bottom">
              <div className="columns-2 gap-8 font-editorial text-[14px] leading-[1.72] text-text-primary [&>p]:mb-3.5">
                {parrafos.map((parrafo, index) => (
                  <p
                    key={index}
                    className={
                      index === 0
                        ? "first-letter:float-left first-letter:pr-2 first-letter:pt-1 first-letter:font-display first-letter:text-[52px] first-letter:font-bold first-letter:leading-[0.8] first-letter:text-text-primary"
                        : undefined
                    }
                  >
                    {parrafo}
                  </p>
                ))}
              </div>
            </div>
            <aside className="flex w-[320px] flex-none flex-col rounded-xl border border-border-default bg-[#F3F1EB] p-6">
              <ElPulsoLogo className="h-auto w-[96px]" />
              <p
                className="mt-1.5 text-[8.5px] font-medium uppercase tracking-[0.14em] text-text-secondary"
                style={{ fontFamily: "var(--font-nav)" }}
              >
                La lectura de la comunidad
              </p>
              <div className="mt-4 min-h-0 flex-1 overflow-hidden fade-bottom">
                <p className="font-editorial text-[13.5px] leading-relaxed text-text-primary">
                  {noticia.el_pulso.texto_resumen}
                </p>
              </div>
              <InterpretacionGeneral
                className="mt-6 flex-none"
                pct_incierta={noticia.el_pulso.pct_incierta}
                pct_negativa={noticia.el_pulso.pct_negativa}
                pct_positiva={noticia.el_pulso.pct_positiva}
              />
            </aside>
          </div>
        </div>
      </section>
    );
  },
);

export type { NoticiaSlideProps };
