"use client";

import { ArrowUpRight } from "lucide-react";

import { OpinionForm } from "@/components/opinadores/OpinionForm";
import type { Noticia } from "@/lib/mock-data";

export type NoticiaSwipeNoticia = Noticia;

export interface NoticiaSwipeProps {
  noticia: NoticiaSwipeNoticia;
  onRead: (noticia: NoticiaSwipeNoticia) => void;
}

export function NoticiaSwipe({
  noticia,
  onRead,
}: NoticiaSwipeProps): React.ReactElement {
  return (
    <article className="mx-auto flex min-h-full max-w-[480px] flex-col rounded-xl border border-border-default bg-white p-6">
      <p className="font-ui text-sm text-text-secondary">
        Noticia {String(noticia.orden).padStart(2, "0")}
      </p>

      <h2 className="mt-3 font-display text-2xl font-normal leading-tight text-text-primary">
        {noticia.titulo}
      </h2>

      <p className="mt-4 font-editorial text-base leading-relaxed text-text-primary">
        {noticia.el_pulso.texto_resumen}
      </p>

      <button
        type="button"
        onClick={() => onRead(noticia)}
        className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-black bg-white px-4 py-2 font-ui text-sm text-text-primary"
      >
        Leer noticia
        <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.75} />
      </button>

      <OpinionForm noticiaId={noticia.id} />
    </article>
  );
}
