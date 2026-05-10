import Link from "next/link";

import { PipelineDiagram, mockState } from "@/components/admin";
import {
  RatioPill,
  RowCard,
  RowCardCell,
  RowCardLeft,
  RowCardRight,
  RowCardList,
} from "@/components/admin/shared";
import { mockEdiciones } from "@/lib/mock-ediciones";

export default function AdminEdicionesPage() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {/* Pipeline de la edición en curso — fijo arriba */}
      <div className="shrink-0">
        <PipelineDiagram pipelineState={mockState} />
      </div>

      {/* Listado de ediciones — scrolleable */}
      <RowCardList>
        {mockEdiciones.map((edicion) => (
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
    </div>
  );
}
