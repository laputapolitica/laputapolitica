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
    return (
      <section
        ref={ref}
        data-slide={slideNumber}
        className="flex h-full snap-start snap-always animate-in fade-in duration-200 flex-col py-6 pl-12 pr-6"
      >
        <article className="flex min-h-0 flex-1 flex-col">
          {/* Sección A — Noticia */}
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

          {/* Sección B — El Pulso */}
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
      </section>
    );
  },
);

export type { NoticiaSlideProps };
