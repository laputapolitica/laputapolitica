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
        className="flex h-full snap-start snap-always animate-in fade-in duration-200 flex-col justify-between px-6 py-6 text-center lg:justify-center lg:overflow-hidden lg:px-16 lg:py-8 lg:text-left"
      >
        {/* MOBILE */}
        <div className="flex min-h-0 flex-1 flex-col justify-between lg:hidden">
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
        </div>

        {/* DESKTOP */}
        <div className="mx-auto hidden w-full max-w-[1160px] items-center justify-between gap-14 lg:flex">
          <div className="flex min-w-0 flex-1 flex-col items-center">
            <div className="w-full">
              <ClimaWidget clima={clima} />
            </div>
          </div>

          <aside className="w-[320px] flex-none rounded-2xl border border-border-default bg-[#F3F1EB] p-8 text-center">
            <h3 className="font-display text-2xl font-medium leading-tight text-text-primary">
              Sumá tu voz a La Puta Política
            </h3>
            <p className="mt-3 font-editorial text-[13.5px] leading-relaxed text-text-secondary">
              Sumate a la red que interpreta la política del día y ayudá a construir El Pulso.
            </p>
            <ElPulsoLogo className="mx-auto mt-5 block h-auto w-[100px]" />
            <Link
              href="/el-pulso"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center font-ui text-[15px] font-bold text-text-primary transition-transform active:scale-95"
            >
              <span className="underline underline-offset-[4px]">Sumar mi voz</span>
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
            </Link>
          </aside>
        </div>
      </section>
    );
  },
);

export type { CTASlideProps };
