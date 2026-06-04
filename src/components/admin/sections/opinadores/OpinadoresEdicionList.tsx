"use client";

import {
  RowCard,
  RowCardCell,
  RowCardLeft,
  RowCardList,
  RowCardRight,
} from "@/components/admin/shared";
import { getStatusColor } from "@/lib/colors";
import { VOTE_COLORS } from "@/lib/constants";
import type { MockOpinador } from "@/components/admin/panels/PublicacionPanel/types";

type OpinadoresEdicionListProps = {
  opinadores: MockOpinador[];
  onSelect?: (opinador: MockOpinador) => void;
};

export function OpinadoresEdicionList({ opinadores, onSelect }: OpinadoresEdicionListProps) {
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
            {/* Dots de votos en cada noticia */}
            <RowCardCell>
              {op.votos.map((color, i) => (
                <span
                  key={i}
                  className="h-[8px] w-[8px] rounded-full"
                  style={{ backgroundColor: color ?? VOTE_COLORS.nula }}
                />
              ))}
            </RowCardCell>
            {/* Completadas/5 con dot de status */}
            <RowCardCell>
              {op.completadas}/5
              <span
                className="h-[8px] w-[8px] rounded-full"
                style={{ backgroundColor: getStatusColor(op.completadas, 5) }}
              />
            </RowCardCell>
          </RowCardRight>
        </RowCard>
      ))}
    </RowCardList>
  );
}
