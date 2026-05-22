"use client";

import {
  RatioPill,
  RowCard,
  RowCardCell,
  RowCardLeft,
  RowCardList,
  RowCardRight,
} from "@/components/admin/shared";

type EdicionOpinador = {
  fecha: string;
  fechaISO: string;
  titulo: string;
  completadas: number;
  total: number;
};

type EdicionesOpinadorListProps = {
  ediciones: EdicionOpinador[];
  onSelect?: (edicion: EdicionOpinador) => void;
};

export function EdicionesOpinadorList({ ediciones, onSelect }: EdicionesOpinadorListProps) {
  return (
    <RowCardList>
      {ediciones.map((ed) => (
        <RowCard key={ed.fechaISO} onClick={onSelect ? () => onSelect(ed) : undefined}>
          <RowCardLeft>
            <RowCardCell>{ed.fecha}</RowCardCell>
            <RowCardCell>{ed.titulo}</RowCardCell>
          </RowCardLeft>
          <RowCardRight>
            {/* Dots de votos (placeholder hasta tener data real) */}
            <RowCardCell>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="h-[8px] w-[8px] rounded-full bg-[#E5E3DD]" />
              ))}
            </RowCardCell>
            <RatioPill valor={ed.completadas} total={ed.total} />
          </RowCardRight>
        </RowCard>
      ))}
    </RowCardList>
  );
}
