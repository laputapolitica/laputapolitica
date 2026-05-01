import { forwardRef } from "react";
import Image from "next/image";

import type { Edicion } from "@/lib/mock-data";

type PortadaSlideProps = {
  edicion: Edicion;
};

export const PortadaSlide = forwardRef<HTMLElement, PortadaSlideProps>(
  function PortadaSlide({ edicion }, ref) {
    return (
      <section
        ref={ref}
        data-slide="1"
        className="flex h-screen snap-start snap-always animate-in fade-in duration-200 flex-col items-center px-6 text-center"
      >
        <h1 className="mt-[25vh] font-display text-3xl font-normal leading-tight text-text-primary">
          {edicion.titulo}
        </h1>

        <div className="mt-12 flex h-80 w-80 items-center justify-center">
          <Image
            priority
            alt={`Ilustración de portada de ${edicion.titulo}`}
            className="h-full w-full object-contain"
            height={320}
            src={edicion.portada_illustracion_url}
            width={320}
          />
        </div>
      </section>
    );
  },
);
