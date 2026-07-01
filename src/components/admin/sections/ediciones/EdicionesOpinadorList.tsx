"use client";

import {
  RatioPill,
  RowCard,
  RowCardCell,
  RowCardLeft,
  RowCardList,
  RowCardRight,
} from "@/components/admin/shared";
import { VOTE_COLORS } from "@/lib/constants";
import type { EdicionOpinador } from "@/types/admin";

type EdicionesOpinadorListProps = {
  ediciones: EdicionOpinador[];
  onSelect?: (edicion: EdicionOpinador) => void;
};

export function EdicionesOpinadorList({ ediciones, onSelect }: EdicionesOpinadorListProps) {
  return (
    <RowCardList>
      {ediciones.map((ed) => {
        if (!ed.participo) {
          return (
            <RowCard key={ed.fechaISO} className="opacity-50">
              <RowCardLeft>
                <RowCardCell>{ed.fecha}</RowCardCell>
                <RowCardCell>{ed.titulo}</RowCardCell>
              </RowCardLeft>
              <RowCardRight>
                <RowCardCell>No participó</RowCardCell>
              </RowCardRight>
            </RowCard>
          );
        }
        return (
          <RowCard key={ed.fechaISO} onClick={onSelect ? () => onSelect(ed) : undefined}>
            <RowCardLeft>
              <RowCardCell>{ed.fecha}</RowCardCell>
              <RowCardCell>{ed.titulo}</RowCardCell>
            </RowCardLeft>
            <RowCardRight>
              <RowCardCell>
                {ed.votos.map((color, i) => (
                  <span
                    key={i}
                    className="h-[8px] w-[8px] rounded-full"
                    style={{ backgroundColor: color ?? VOTE_COLORS.nula }}
                  />
                ))}
              </RowCardCell>
              <RatioPill valor={ed.votos.filter((v) => v !== null).length} total={5} />
            </RowCardRight>
          </RowCard>
        );
      })}
    </RowCardList>
  );
}
