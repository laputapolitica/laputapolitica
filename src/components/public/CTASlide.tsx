import { forwardRef } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { ElPulsoLogo } from "@/components/shared/ElPulsoLogo";
import type { ClimaCiudadData } from "@/lib/clima";

import { ClimaWidget } from "./ClimaWidget";

type CTASlideProps = {
  clima: { ciudades: ClimaCiudadData[]; initialCityId: string };
};

export const CTASlide = forwardRef<HTMLElement, CTASlideProps>(
  function CTASlide({ clima }, ref) {
    return (
      <section
        ref={ref}
        data-slide="7"
        className="flex h-full snap-start snap-always animate-in fade-in duration-200 flex-col justify-between px-6 py-6 text-center"
      >
        <div className="mx-auto max-w-[360px]">
          <h2 className="font-display text-2xl font-normal leading-tight text-text-primary">
            Sumá tu voz a La Puta Política
          </h2>

          <p className="mt-4 font-editorial text-base leading-normal text-text-primary">
            Sumate a la red que interpreta la política del día y ayuda a construir
          </p>

          <ElPulsoLogo className="mx-auto mt-3 block h-auto w-[88px]" />

          <Link
            href="/el-pulso"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center font-ui text-base font-bold tracking-[-0.02em] text-text-primary"
          >
            <span className="underline underline-offset-[3px]">Sumar mi voz</span>
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>

        <ClimaWidget clima={clima} />
      </section>
    );
  },
);

export type { CTASlideProps };
