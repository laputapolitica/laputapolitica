"use client";

import Link from "next/link";
import {
  RatioPill,
  RowCard,
  RowCardCell,
  RowCardLeft,
  RowCardList,
  RowCardRight,
} from "@/components/admin/shared";
import type { Edicion } from "@/types/admin";

type EdicionesListProps = {
  ediciones: Edicion[];
};

export function EdicionesList({ ediciones }: EdicionesListProps) {
  return (
    <RowCardList>
      {ediciones.map((edicion) => (
        <Link
          key={edicion.fechaISO}
          href={`/admin/ediciones/${edicion.fechaISO}`}
          className="block"
        >
          <RowCard className="cursor-pointer transition-colors hover:bg-[#F0EDE6]">
            <RowCardLeft>
              <RowCardCell>{edicion.fecha}</RowCardCell>
              <RowCardCell>{edicion.titulo}</RowCardCell>
              <RatioPill valor={edicion.opiniones} total={edicion.totalOpinadores} sufijo="opiniones" />
            </RowCardLeft>
            <RowCardRight>
              <RowCardCell>{edicion.horaPublicacion}</RowCardCell>
            </RowCardRight>
          </RowCard>
        </Link>
      ))}
    </RowCardList>
  );
}
