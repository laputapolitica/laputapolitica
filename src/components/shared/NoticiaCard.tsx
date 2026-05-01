"use client";

import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

import { InterpretacionBars } from "./InterpretacionBars";

type NoticiaMode = "web-publica" | "opinadores" | "admin";

type Noticia = {
  id: string;
  orden: number;
  titulo: string;
  cuerpo: string;
  fuentes_urls: string[];
  el_pulso?: {
    texto_resumen: string;
    pct_positiva: number;
    pct_negativa: number;
    pct_incierta: number;
  };
};

type NoticiaCardProps = {
  noticia: Noticia;
  mode?: NoticiaMode;
  className?: string;
};

function formatNewsNumber(orden: number) {
  return String(orden).padStart(2, "0");
}

export function NoticiaCard({
  noticia,
  mode = "web-publica",
  className,
}: NoticiaCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const newsNumber = formatNewsNumber(noticia.orden);

  function handleReadMore() {
    router.push(`${pathname}?n=${newsNumber}`, { scroll: false });
  }

  return (
    <article
      data-mode={mode}
      className={cn(
        "w-full max-w-3xl border-b border-border-default px-5 py-6 md:px-8 md:py-8",
        className,
      )}
    >
      <div className="mb-4 inline-flex rounded-full bg-primary px-3 py-1.5 font-ui text-xs font-semibold uppercase tracking-wider text-primary-foreground">
        NOTICIA {newsNumber}
      </div>

      <h2 className="font-display text-2xl font-bold leading-tight text-text-primary md:text-4xl">
        {noticia.titulo}
      </h2>

      <p className="mt-4 line-clamp-2 font-editorial text-base leading-relaxed text-text-primary">
        {noticia.cuerpo}
      </p>

      {noticia.el_pulso ? (
        <InterpretacionBars
          className="mt-6"
          pct_positiva={noticia.el_pulso.pct_positiva}
          pct_negativa={noticia.el_pulso.pct_negativa}
          pct_incierta={noticia.el_pulso.pct_incierta}
        />
      ) : null}

      <button
        type="button"
        onClick={handleReadMore}
        className="mt-6 inline-flex items-center justify-center border border-primary px-4 py-2 font-ui text-sm font-medium text-text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Leer más
      </button>
    </article>
  );
}

export type { Noticia, NoticiaCardProps, NoticiaMode };
