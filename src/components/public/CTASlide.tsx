import { forwardRef } from "react";
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
        className="flex h-screen snap-start snap-always animate-in fade-in duration-200 flex-col justify-between px-6 pb-24 pt-24 text-center"
      >
        <div className="mx-auto max-w-[360px]">
          <h2 className="font-display text-2xl font-normal leading-tight text-text-primary">
            Sumá tu voz a La Puta Política
          </h2>

          <p className="mt-4 font-editorial text-base leading-normal text-text-primary">
            Sumate a la red que interpreta la política del día y ayuda a construir{" "}
            <ElPulsoLogo className="inline-block h-auto w-[88px] translate-y-1" />
          </p>

          <Link
            href="/el-pulso"
            className="mt-8 inline-flex rounded-full border border-black bg-white px-8 py-3 font-ui text-base font-normal text-text-primary"
          >
            Sumar mi voz
          </Link>
        </div>

        <ClimaWidget clima={clima} />
      </section>
    );
  },
);

export type { CTASlideProps };
