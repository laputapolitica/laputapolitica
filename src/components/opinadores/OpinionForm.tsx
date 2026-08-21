"use client";

import { CheckCircle2 } from "lucide-react";
import { useState, useTransition } from "react";

import {
  enviarOpinion,
  type EnviarOpinionResult,
  type OpinionSentiment,
} from "@/app/(opinadores)/el-pulso/dia/actions";
import { Textarea } from "@/components/ui/textarea";

export interface OpinionFormProps {
  noticiaId: string;
  sentiment: OpinionSentiment | null;
  onSentimentChange: (value: OpinionSentiment) => void;
  onOpinionEnviada?: () => void;
  opinionPrevia?: { texto: string; sentiment: OpinionSentiment };
  header?: React.ReactNode;
}

const labelClass =
  "font-ui text-[11px] font-semibold uppercase tracking-[0.08em] text-text-secondary";

const sentimentOptions: Array<{
  value: OpinionSentiment;
  label: string;
  dotClassName: string;
  selectedClassName: string;
}> = [
  {
    value: "positiva",
    label: "Positiva",
    dotClassName: "bg-vote-positive",
    selectedClassName: "border-vote-positive bg-vote-positive/20",
  },
  {
    value: "negativa",
    label: "Negativa",
    dotClassName: "bg-vote-negative",
    selectedClassName: "border-vote-negative bg-vote-negative/20",
  },
  {
    value: "incierta",
    label: "Incierta",
    dotClassName: "bg-vote-uncertain",
    selectedClassName: "border-vote-uncertain bg-vote-uncertain/20",
  },
];

export function OpinionForm({
  noticiaId,
  sentiment,
  onSentimentChange,
  onOpinionEnviada,
  opinionPrevia,
  header,
}: OpinionFormProps): React.ReactElement {
  const [texto, setTexto] = useState<string>("");
  const [error, setError] = useState<string | undefined>();
  const [enviada, setEnviada] = useState<{
    sentiment: OpinionSentiment;
    texto: string;
  } | null>(opinionPrevia ?? null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    startTransition(async (): Promise<void> => {
      if (!sentiment) {
        setError("Elegí cómo la ves y contá tu lectura");
        return;
      }

      const result: EnviarOpinionResult = await enviarOpinion({
        noticia_id: noticiaId,
        texto: texto.trim(),
        sentiment,
      });

      if (result.success) {
        setError(undefined);
        setEnviada({ sentiment, texto: texto.trim() });
        onOpinionEnviada?.();
        return;
      }

      setError(result.error);
    });
  }

  if (enviada) {
    const opcion = sentimentOptions.find(
      (option): boolean => option.value === enviada.sentiment,
    );

    return (
      <div className="flex h-full flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-4 lg:px-8 lg:py-8">
          {header}

          <div className={`flex flex-col gap-4 ${header ? "mt-6" : ""}`}>
            <div className="flex items-center gap-2 font-ui text-[12px] font-semibold uppercase tracking-[0.08em] text-text-secondary">
              <CheckCircle2 aria-hidden="true" className="text-vote-positive" size={18} />
              Ya opinaste esta noticia
            </div>

            <div className="flex flex-col gap-2">
              <span className={labelClass}>Tu voto</span>
              {opcion ? (
                <span
                  className={`inline-flex w-fit items-center gap-2 rounded-[6px] border px-3 py-2 font-ui text-sm text-text-primary ${opcion.selectedClassName}`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-2.5 w-2.5 rounded-full ${opcion.dotClassName}`}
                  />
                  {opcion.label}
                </span>
              ) : null}
            </div>

            {enviada.texto ? (
              <div className="flex flex-col gap-2">
                <span className={labelClass}>Tu opinión</span>
                <p className="whitespace-pre-line font-editorial text-[15px] leading-relaxed text-text-primary">
                  {enviada.texto}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-4 lg:px-8 lg:py-8">
        {header}

        <div className={`flex flex-col gap-5 ${header ? "mt-6" : ""}`}>
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Tu opinión</span>
            <Textarea
              value={texto}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>): void =>
                setTexto(event.target.value)
              }
              className="min-h-28 resize-none rounded-[6px] border border-border-default bg-white px-3.5 py-3 font-ui text-[15px] text-text-primary placeholder:text-text-secondary focus-visible:ring-1 focus-visible:ring-text-primary focus-visible:ring-offset-0"
              placeholder="Escribí tu lectura, sin vueltas..."
              rows={4}
            />
          </label>

          <div className="flex flex-col gap-2.5">
            <span className={labelClass}>¿Cómo la ves?</span>
            <div className="grid grid-cols-3 gap-2">
              {sentimentOptions.map((option): React.ReactElement => {
                const isSelected = sentiment === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onSentimentChange(option.value)}
                    className={[
                      "inline-flex min-h-10 items-center justify-center gap-2 rounded-[6px] border px-3 py-2 font-ui text-sm text-text-primary transition-colors",
                      isSelected ? option.selectedClassName : "border-border-default bg-white",
                    ].join(" ")}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-2.5 w-2.5 rounded-full ${option.dotClassName}`}
                    />
                    <span className="truncate">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {error ? (
            <p className="font-ui text-sm text-state-required">{error}</p>
          ) : null}
        </div>
      </div>

      <div className="flex-none border-t border-border-default px-5 py-4 lg:px-8 lg:py-5">
        <button
          type="submit"
          disabled={isPending}
          className="h-[52px] w-full rounded-[11px] border border-b-4 border-[#B6B0A5] bg-bg-base font-ui text-base font-bold text-text-primary transition-all duration-100 ease-out active:translate-y-[3px] active:border-b active:bg-[#F1EEE7] disabled:opacity-60"
        >
          {isPending ? "Enviando..." : "Enviar opinión"}
        </button>
      </div>
    </form>
  );
}
