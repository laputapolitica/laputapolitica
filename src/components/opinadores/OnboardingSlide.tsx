"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface OnboardingSlideProps {
  numero: number;
  total: number;
  titulo: string;
  descripcion: string;
  ilustracionUrl: string;
  mostrarCta?: boolean;
}

export function OnboardingSlide({
  numero,
  total,
  titulo,
  descripcion,
  ilustracionUrl,
  mostrarCta = false,
}: OnboardingSlideProps): React.ReactElement {
  return (
    <section
      aria-label={`Slide ${numero} de ${total}: ${titulo}`}
      className="flex h-full flex-col items-center justify-center px-7 pb-24 pt-20 text-center"
    >
      <div className="flex min-h-0 w-full max-w-sm flex-1 flex-col items-center justify-center gap-5">
        <h1 className="max-w-[300px] font-display text-[30px] font-normal leading-[1.12] text-text-primary">
          {titulo}
        </h1>

        <div className="relative flex min-h-0 w-full flex-1 items-center justify-center">
          <Image
            src={ilustracionUrl}
            alt=""
            fill
            priority={numero === 1}
            sizes="(max-width: 480px) 86vw, 320px"
            className="object-contain"
          />
        </div>

        <p className="max-w-[300px] font-editorial text-[15px] leading-relaxed text-text-secondary">
          {descripcion}
        </p>

        {mostrarCta ? (
          <Link
            href="/el-pulso/postulacion"
            className="mt-2 inline-flex items-center font-ui text-[17px] font-bold text-text-primary"
          >
            <span className="underline underline-offset-[5px]">Postularme</span>
            <ArrowUpRight aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={2} />
          </Link>
        ) : null}
      </div>
    </section>
  );
}
