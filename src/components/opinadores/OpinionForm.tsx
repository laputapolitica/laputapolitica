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
}

const sentimentOptions: Array<{
  value: OpinionSentiment;
  label: string;
  circleClassName: string;
  selectedClassName: string;
}> = [
  {
    value: "positiva",
    label: "Positiva",
    circleClassName: "bg-vote-positive",
    selectedClassName: "border-vote-positive bg-vote-positive/20",
  },
  {
    value: "negativa",
    label: "Negativa",
    circleClassName: "bg-vote-negative",
    selectedClassName: "border-vote-negative bg-vote-negative/20",
  },
  {
    value: "incierta",
    label: "Incierta",
    circleClassName: "bg-vote-uncertain",
    selectedClassName: "border-vote-uncertain bg-vote-uncertain/20",
  },
];

export function OpinionForm({ noticiaId }: OpinionFormProps): React.ReactElement {
  const [texto, setTexto] = useState<string>("");
  const [sentiment, setSentiment] = useState<OpinionSentiment | null>(null);
  const [result, setResult] = useState<EnviarOpinionResult>({});
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    startTransition(async (): Promise<void> => {
      if (!sentiment) {
        setResult({ error: "Completá la opinión y elegí un sentiment" });
        return;
      }

      const nextResult = await enviarOpinion({
        noticia_id: noticiaId,
        texto: texto.trim(),
        sentiment,
      });

      setResult(nextResult);
    });
  }

  if (result.success) {
    return (
      <div className="mt-6 flex items-center gap-3 rounded-lg border border-vote-positive bg-vote-positive/20 px-4 py-4 font-ui text-base font-medium text-text-primary">
        <CheckCircle2 aria-hidden="true" className="text-vote-positive" size={22} />
        Opinión enviada
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="font-ui text-xs font-medium uppercase tracking-wider text-text-secondary">
          TU OPINIÓN
        </span>
        <Textarea
          value={texto}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>): void =>
            setTexto(event.target.value)
          }
          className="min-h-28 resize-none rounded-lg border-border-default bg-white px-3 py-3 font-ui text-base text-text-primary placeholder:text-text-secondary focus-visible:ring-1 focus-visible:ring-text-primary focus-visible:ring-offset-0"
          placeholder="Escribi tu análisis sobre esta noticia..."
          rows={4}
        />
      </label>

      <div className="grid grid-cols-3 gap-2">
        {sentimentOptions.map((option): React.ReactElement => {
          const isSelected = sentiment === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setSentiment(option.value)}
              className={[
                "inline-flex min-h-10 items-center justify-center gap-2 rounded-full border px-3 py-2 font-ui text-sm text-text-primary",
                isSelected
                  ? option.selectedClassName
                  : "border-border-default bg-white",
              ].join(" ")}
            >
              <span
                aria-hidden="true"
                className={`h-2.5 w-2.5 rounded-full ${option.circleClassName}`}
              />
              <span className="truncate">{option.label}</span>
            </button>
          );
        })}
      </div>

      {result.error ? (
        <p className="font-ui text-sm text-state-required">{result.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-fit rounded-lg border border-black bg-white px-5 py-3 font-ui text-base font-medium text-text-primary disabled:opacity-70"
      >
        {isPending ? "Enviando..." : "Enviar opinión"}
      </button>
    </form>
  );
}
