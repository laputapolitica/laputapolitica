import Image from "next/image";

export interface OnboardingSlideProps {
  numero: number;
  total: number;
  titulo: string;
  descripcion: string;
  ilustracionUrl: string;
  esFormulario?: boolean;
}

export function OnboardingSlide({
  numero,
  total,
  titulo,
  descripcion,
  ilustracionUrl,
  esFormulario = false,
}: OnboardingSlideProps): React.ReactElement {
  if (esFormulario) {
    return (
      <section
        aria-label={`Slide ${numero} de ${total}: ${titulo}`}
        className="flex min-h-screen flex-col items-center justify-center px-6 pb-20 pt-20 text-center"
      >
        <div className="flex min-h-72 w-full max-w-80 items-center justify-center border border-border-default bg-bg-base p-6">
          <p className="font-ui text-sm uppercase tracking-[0.08em] text-text-secondary">
            FORMULARIO DE POSTULACION (próximamente)
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label={`Slide ${numero} de ${total}: ${titulo}`}
      className="flex min-h-screen flex-col items-center justify-center px-6 pb-20 pt-20 text-center"
    >
      <div className="flex w-full max-w-sm flex-col items-center gap-8">
        <h1 className="max-w-80 text-center font-display text-3xl font-normal leading-tight text-text-primary">
          {titulo}
        </h1>

        <div className="relative aspect-square w-full max-w-[280px]">
          <Image
            src={ilustracionUrl}
            alt=""
            fill
            priority={numero === 1}
            sizes="280px"
            className="object-contain"
          />
        </div>

        <p className="max-w-80 text-center font-editorial text-base leading-relaxed text-text-secondary">
          {descripcion}
        </p>
      </div>
    </section>
  );
}
