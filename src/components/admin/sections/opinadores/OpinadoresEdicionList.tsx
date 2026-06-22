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
import type { OpinadorEdicion } from "@/app/(admin)/admin/actions";

type OpinadoresEdicionListProps = {
  opinadores: OpinadorEdicion[];
  onSelect?: (opinador: OpinadorEdicion) => void;
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
            {/* Completadas con dot de status */}
            <RowCardCell>
              {op.completadas}/{op.votos.length}
              <span
                className="h-[8px] w-[8px] rounded-full"
                style={{
                  backgroundColor: getStatusColor(
                    op.completadas,
                    op.votos.length,
                  ),
                }}
              />
            </RowCardCell>
          </RowCardRight>
        </RowCard>
      ))}
    </RowCardList>
  );
}
