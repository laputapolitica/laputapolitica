"use client";

import {
  RatioPill,
  RowCard,
  RowCardCell,
  RowCardLeft,
  RowCardList,
  RowCardRight,
} from "@/components/admin/shared";
import type { OpinadorAdmin } from "@/lib/mock-opinadores";

type OpinadoresListProps = {
  opinadores: OpinadorAdmin[];
  onSelect?: (opinador: OpinadorAdmin) => void;
};

export function OpinadoresList({ opinadores, onSelect }: OpinadoresListProps) {
  return (
    <RowCardList>
      {opinadores.map((op) => (
        <RowCard key={op.id} onClick={onSelect ? () => onSelect(op) : undefined}>
          <RowCardLeft>
            <RowCardCell>{op.nombre}</RowCardCell>
            <RowCardCell>{op.email}</RowCardCell>
            <RowCardCell>{op.ciudad}</RowCardCell>
          </RowCardLeft>
          <RowCardRight>
            <RatioPill valor={op.diasParticipados} total={op.totalDias} sufijo="d/o" />
          </RowCardRight>
        </RowCard>
      ))}
    </RowCardList>
  );
}
