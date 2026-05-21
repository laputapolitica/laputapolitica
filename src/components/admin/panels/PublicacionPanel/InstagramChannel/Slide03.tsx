import { VOTE_COLORS } from "@/lib/constants";
import { noticias } from "../mocks";
import {
  InstagramBulletRows,
  InstagramEditablePill,
  InstagramVoteRow,
} from "./shared";

export function InstagramSlide03() {
  const noticia = noticias[0];
  const bullets = [
    noticia.pulso,
    "La corrección aparece como necesaria para una parte de la comunidad.",
    "El riesgo social queda asociado al bolsillo cotidiano.",
    "La incertidumbre se concentra en el alcance real del aumento.",
    "El debate mezcla ajuste fiscal, transporte y humor social.",
  ];
  const votes = [
    {
      label: "Positiva",
      borderColor: VOTE_COLORS.positiva,
      pxValue: `${noticia.interpretacion.positiva * 2}px`,
      percentValue: `${noticia.interpretacion.positiva}%`,
    },
    {
      label: "Negativa",
      borderColor: VOTE_COLORS.negativa,
      pxValue: `${noticia.interpretacion.negativa * 2}px`,
      percentValue: `${noticia.interpretacion.negativa}%`,
    },
    {
      label: "Incierta",
      borderColor: VOTE_COLORS.incierta,
      pxValue: `${noticia.interpretacion.incierta * 2}px`,
      percentValue: `${noticia.interpretacion.incierta}%`,
    },
  ];

  return (
    <div className="space-y-5">
      <InstagramEditablePill value="ANEXO SOCIAL: 2026_080-AR-01-S" />
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
      <InstagramEditablePill value="21 MAR 2026" />
    </div>
  );
}
