import { VOTE_COLORS } from "@/lib/constants";
import { formatFechaCorta } from "@/lib/fecha";
import {
  InstagramBulletRows,
  InstagramEditablePill,
  InstagramVoteRow,
} from "./shared";
import type { SlideInstagram } from "@/app/(admin)/admin/actions";

type InstagramVotos = {
  positiva: number;
  negativa: number;
  incierta: number;
};

function stringFromPayload(
  payload: Record<string, unknown>,
  key: string,
): string {
  const value = payload[key];
  return typeof value === "string" ? value : "";
}

function stringsFromPayload(
  payload: Record<string, unknown>,
  key: string,
): string[] {
  const value = payload[key];
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function votosFromPayload(payload: Record<string, unknown>): InstagramVotos {
  const value = payload.votos;
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { positiva: 0, negativa: 0, incierta: 0 };
  }

  const votos = value as Record<string, unknown>;
  return {
    positiva: typeof votos.positiva === "number" ? votos.positiva : 0,
    negativa: typeof votos.negativa === "number" ? votos.negativa : 0,
    incierta: typeof votos.incierta === "number" ? votos.incierta : 0,
  };
}

export function InstagramSlide03({ slide }: { slide: SlideInstagram }) {
  const anexo = stringFromPayload(slide.payload, "anexo");
  const bullets = stringsFromPayload(slide.payload, "bullets");
  const votos = votosFromPayload(slide.payload);
  const fecha = formatFechaCorta(stringFromPayload(slide.payload, "fecha"));
  const votes = [
    {
      label: "Positiva",
      borderColor: VOTE_COLORS.positiva,
      pxValue: `${votos.positiva * 4}px`,
      percentValue: `${votos.positiva}%`,
    },
    {
      label: "Negativa",
      borderColor: VOTE_COLORS.negativa,
      pxValue: `${votos.negativa * 4}px`,
      percentValue: `${votos.negativa}%`,
    },
    {
      label: "Incierta",
      borderColor: VOTE_COLORS.incierta,
      pxValue: `${votos.incierta * 4}px`,
      percentValue: `${votos.incierta}%`,
    },
  ];

  return (
    <div className="space-y-5">
      <InstagramEditablePill value={anexo} />
      <InstagramBulletRows bullets={bullets} />
      <div className="flex flex-col gap-2">
        {votes.map((vote) => (
          <InstagramVoteRow
            key={vote.label}
            label={vote.label}
            borderColor={vote.borderColor}
            pxValue={vote.pxValue}
            percentValue={vote.percentValue}
          />
        ))}
      </div>
      <InstagramEditablePill value={fecha} />
    </div>
  );
}
