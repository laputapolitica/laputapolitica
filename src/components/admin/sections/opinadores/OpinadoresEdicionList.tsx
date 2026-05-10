"use client";

import {
  RowCard,
  RowCardCell,
  RowCardLeft,
  RowCardList,
  RowCardRight,
} from "@/components/admin/shared";
import { getStatusColor } from "@/lib/colors";
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
            <div className="inline-flex h-[20px] items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-2">
              {op.votos.map((color, i) => (
                <span
                  key={i}
                  className="h-[8px] w-[8px] rounded-full"
                  style={{ backgroundColor: color ?? "#E5E3DD" }}
                />
              ))}
            </div>
            {/* Completadas/5 con dot de status */}
            <div className="inline-flex h-[20px] items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium whitespace-nowrap text-admin-ink">
                {op.completadas}/5
              </span>
              <span
                className="h-[8px] w-[8px] rounded-full"
                style={{ backgroundColor: getStatusColor(op.completadas, 5) }}
              />
            </div>
          </RowCardRight>
        </RowCard>
      ))}
    </RowCardList>
  );
}
