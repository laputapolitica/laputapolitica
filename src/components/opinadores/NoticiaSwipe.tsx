"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

import type { OpinionSentiment } from "@/app/(opinadores)/el-pulso/dia/actions";
import { OpinionForm } from "@/components/opinadores/OpinionForm";
import type { Noticia } from "@/types/edicion";

export type NoticiaSwipeNoticia = Noticia;

export interface NoticiaSwipeProps {
  noticia: NoticiaSwipeNoticia;
  onRead: (noticia: NoticiaSwipeNoticia) => void;
  onOpinionEnviada?: (noticiaId: string) => void;
  opinionPrevia?: { texto: string; sentiment: OpinionSentiment };
}

const accentBySentiment: Record<OpinionSentiment, string> = {
  positiva: "border-t-vote-positive",
  negativa: "border-t-vote-negative",
  incierta: "border-t-vote-uncertain",
};

function tituloSize(titulo: string): string {
  const len = titulo.trim().length;
  if (len <= 34) return "text-2xl";
  if (len <= 46) return "text-[21px]";
  if (len <= 58) return "text-[19px]";
  if (len <= 70) return "text-[16px]";
  return "text-[15px]";
}

export function NoticiaSwipe({
  noticia,
  onRead,
  onOpinionEnviada,
  opinionPrevia,
}: NoticiaSwipeProps): React.ReactElement {
  const [sentiment, setSentiment] = useState<OpinionSentiment | null>(
    opinionPrevia?.sentiment ?? null,
  );
  const accentClass = sentiment
    ? accentBySentiment[sentiment]
    : "border-t-border-default";

  const numero = String(noticia.orden).padStart(2, "0");
  const parrafos = noticia.cuerpo
    .split(/\n+/)
    .map((parrafo): string => parrafo.trim())
    .filter(Boolean);

  const opinionFormProps = {
    noticiaId: noticia.id,
    sentiment,
    onSentimentChange: setSentiment,
    opinionPrevia,
    onOpinionEnviada: onOpinionEnviada
      ? (): void => onOpinionEnviada(noticia.id)
      : undefined,
  };

  return (
    <>
      {/* MOBILE */}
      <article
        className={`mx-auto flex h-full w-full max-w-[480px] flex-col overflow-hidden rounded-[8px] border border-t-[3px] border-border-default ${accentClass} bg-white transition-colors duration-300 lg:hidden`}
      >
        <OpinionForm
          {...opinionFormProps}
          header={
            <div className="flex flex-col">
              <span className="font-display text-[40px] font-bold leading-[0.9] text-text-secondary/30">
                {numero}
              </span>

              <h2
                className={`mt-2 line-clamp-2 font-display font-normal leading-tight text-text-primary ${tituloSize(noticia.titulo)}`}
              >
                {noticia.titulo}
              </h2>

              <span aria-hidden="true" className="mt-4 block h-px w-full bg-border-default" />

              <div className="mt-4 max-h-[4.6em] overflow-hidden fade-bottom">
                <p className="font-editorial text-[15px] leading-[1.55] text-text-primary first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:font-display first-letter:text-[38px] first-letter:font-bold first-letter:leading-[0.8] first-letter:text-text-primary">
                  {noticia.cuerpo}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onRead(noticia)}
                className="mt-4 inline-flex w-fit items-center font-ui text-[15px] font-bold text-text-primary"
              >
                <span className="underline underline-offset-[4px]">Leer noticia</span>
                <ArrowUpRight aria-hidden="true" className="h-[17px] w-[17px]" strokeWidth={2} />
              </button>
            </div>
          }
        />
      </article>

      {/* DESKTOP */}
      <div className="hidden h-full w-full lg:flex">
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto border-r border-border-default px-12 py-10">
          <span className="font-display text-[52px] font-bold leading-[0.9] text-text-secondary/25">
            {numero}
          </span>

          <h2 className="mt-3 max-w-[680px] font-display text-[30px] font-normal leading-[1.12] text-text-primary">
            {noticia.titulo}
          </h2>

          <span
            aria-hidden="true"
            className="mt-5 block h-px w-full max-w-[680px] bg-border-default"
          />

          <div className="mt-6 max-w-[680px]">
            {parrafos.map((parrafo, index): React.ReactElement => (
              <p
                key={index}
                className={`font-editorial text-[15.5px] leading-[1.72] text-text-primary ${
                  index > 0 ? "mt-4" : ""
                } ${
                  index === 0
                    ? "first-letter:float-left first-letter:mr-2.5 first-letter:mt-1 first-letter:font-display first-letter:text-[48px] first-letter:font-bold first-letter:leading-[0.8] first-letter:text-text-primary"
                    : ""
                }`}
              >
                {parrafo}
              </p>
            ))}
          </div>
        </div>

        <div
          className={`flex w-[40%] min-w-[380px] max-w-[520px] flex-none flex-col border-t-[3px] ${accentClass} transition-colors duration-300`}
        >
          <OpinionForm {...opinionFormProps} />
        </div>
      </div>
    </>
  );
}
