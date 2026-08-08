import { forwardRef } from "react";
import Image from "next/image";

import type { Edicion } from "@/types/edicion";

type PortadaSlideProps = {
  edicion: Edicion;
};

export const PortadaSlide = forwardRef<HTMLElement, PortadaSlideProps>(
  function PortadaSlide({ edicion }, ref) {
    return (
      <section
        ref={ref}
        data-slide="1"
        className="flex h-full snap-start snap-always flex-col items-center justify-center gap-8 px-6 py-6 text-center animate-in fade-in duration-200"
      >
        <h1 className="font-display text-3xl font-normal leading-tight text-text-primary">
          {edicion.titulo}
        </h1>

        <div className="relative aspect-square w-full max-w-[360px]">
          <Image
            priority
            fill
            alt={`Ilustración de portada de ${edicion.titulo}`}
            className="object-contain"
            sizes="(max-width: 480px) 80vw, 360px"
            src={edicion.portada_illustracion_url}
          />
        </div>
      </section>
    );
  },
);
