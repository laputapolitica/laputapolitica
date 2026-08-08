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
        className="relative flex h-full snap-start snap-always flex-col items-center justify-center px-6 py-6 animate-in fade-in duration-200"
      >
        <div className="relative aspect-square w-full max-w-[360px]">
          <Image
            priority
            fill
            alt={`Ilustración de portada de ${edicion.titulo}`}
            className="object-contain"
            sizes="(max-width: 480px) 80vw, 360px"
            src={edicion.portada_illustracion_url}
          />

          <h1 className="absolute inset-x-0 top-full mt-4 text-center font-editorial text-base italic text-text-secondary">
            {edicion.titulo}
          </h1>
        </div>
      </section>
    );
  },
);
