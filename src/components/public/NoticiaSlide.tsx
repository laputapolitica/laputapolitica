import { forwardRef } from "react";
import { ArrowUpRight } from "lucide-react";

import { ElPulsoLogo } from "@/components/shared/ElPulsoLogo";
import { InterpretacionBars } from "@/components/shared/InterpretacionBars";
import { cn } from "@/lib/utils";
import type { Noticia } from "@/types/edicion";

type NoticiaSlideProps = {
  noticia: Noticia;
  slideNumber: number;
  isModalOpen: boolean;
  onReadMore: () => void;
};

export const NoticiaSlide = forwardRef<HTMLElement, NoticiaSlideProps>(
  function NoticiaSlide({ noticia, slideNumber, isModalOpen, onReadMore }, ref) {
    return (
      <section
        ref={ref}
        data-slide={slideNumber}
        className="flex h-screen snap-start snap-always animate-in fade-in duration-200 flex-col pb-24 pl-12 pr-6 pt-24"
      >
        <article
          className={cn("flex min-h-0 flex-1 flex-col", isModalOpen && "invisible")}
        >
          <h2 className="font-display text-2xl font-normal leading-[1.15] text-text-primary">
            {noticia.titulo}
          </h2>

          <p className="mt-5 line-clamp-4 font-editorial text-base leading-normal text-text-primary">
            {noticia.cuerpo}
          </p>

          <ElPulsoLogo className="mt-6 h-auto w-[106px]" />

          <p className="mt-4 line-clamp-4 font-editorial text-base leading-normal text-text-primary">
            {noticia.el_pulso.texto_resumen}
          </p>

          <section className="mt-6">
            <h3 className="font-ui text-base font-medium text-text-primary">
              Interpretación general
            </h3>
            <InterpretacionBars
              className="mt-3"
              pct_incierta={noticia.el_pulso.pct_incierta}
              pct_negativa={noticia.el_pulso.pct_negativa}
              pct_positiva={noticia.el_pulso.pct_positiva}
            />
          </section>

          <button
            type="button"
            onClick={onReadMore}
            className="mx-auto mt-7 inline-flex items-center gap-2 font-ui text-base font-normal text-text-primary"
          >
            Leer más
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </article>
      </section>
    );
  },
);

export type { NoticiaSlideProps };
