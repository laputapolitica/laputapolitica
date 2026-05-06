import Link from "next/link";

import { PipelineDiagram, mockState } from "@/components/admin";
import { DataPill, RatioPill, RowCard } from "@/components/admin/shared";
import { mockEdiciones } from "@/lib/mock-ediciones";

export default function AdminEdicionesPage() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {/* Pipeline de la edición en curso — fijo arriba */}
      <div className="shrink-0">
        <PipelineDiagram pipelineState={mockState} />
      </div>

      {/* Listado de ediciones — scrolleable */}
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
        {mockEdiciones.map((edicion) => (
          <Link
            key={edicion.fechaISO}
            href={`/admin/ediciones/${edicion.fechaISO}`}
            className="block"
          >
            <RowCard className="cursor-pointer transition-colors hover:bg-[#F0EDE6]">
              {/* Fecha */}
              <DataPill>{edicion.fecha}</DataPill>

              {/* Título */}
              <DataPill>{edicion.titulo}</DataPill>

              {/* Opiniones */}
              <RatioPill valor={edicion.opiniones} total={edicion.totalOpinadores} sufijo="opiniones" />

              {/* Espacio flexible */}
              <div className="flex-1" />

              {/* Hora de publicación */}
              <DataPill>{edicion.horaPublicacion}</DataPill>
            </RowCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
