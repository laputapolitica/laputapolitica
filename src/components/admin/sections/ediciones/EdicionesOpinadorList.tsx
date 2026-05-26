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
  votos: (string | null)[];
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
            <RowCardCell>
              {ed.votos.map((color, i) => (
                <span
                  key={i}
                  className="h-[8px] w-[8px] rounded-full"
                  style={{ backgroundColor: color ?? "#E5E3DD" }}
                />
              ))}
            </RowCardCell>
            <RatioPill valor={ed.votos.filter(v => v !== null).length} total={5} />
          </RowCardRight>
        </RowCard>
      ))}
    </RowCardList>
  );
}
