import Image from "next/image";

import { HeaderElPulso, PostulacionForm } from "@/components/opinadores";

export default function PostulacionPage(): React.ReactElement {
  return (
    <main className="flex h-[100dvh] flex-col overflow-hidden bg-bg-base text-text-primary">
      <header className="flex w-full flex-none items-center justify-between px-5 py-4 lg:border-b lg:border-border-default lg:px-8 lg:py-5">
        <HeaderElPulso />
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="hidden lg:flex lg:w-[46%] lg:max-w-[640px] lg:flex-col lg:items-center lg:justify-center lg:overflow-hidden lg:border-r lg:border-border-default lg:px-12 lg:text-center">
          <div className="relative mb-9 h-[320px] w-full max-w-[420px]">
            <Image
              src="/onboarding/slide-2.png"
              alt=""
              fill
              priority
              sizes="420px"
              className="object-contain"
            />
          </div>
          <h1 className="font-display text-[36px] font-normal leading-[1.1] text-text-primary">
            Sumate como opinador
          </h1>
          <p className="mt-4 max-w-[380px] font-editorial text-[16px] leading-relaxed text-text-secondary">
            Formá parte de la red que construye El Pulso. Tu voz importa.
          </p>
        </aside>

        <div className="min-h-0 flex-1 lg:flex lg:flex-col lg:overflow-y-auto">
          <PostulacionForm />
        </div>
      </div>
    </main>
  );
}
