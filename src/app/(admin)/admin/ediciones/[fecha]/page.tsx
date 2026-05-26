"use client";

import { useParams } from "next/navigation";
import { mockEdiciones } from "@/lib/mock-ediciones";
import { DataPill, HeaderPanel, PanelLayout } from "@/components/admin/shared";
import { PublicacionPanel } from "@/components/admin/panels/PublicacionPanel";

export default function EdicionDetallePage() {
  const params = useParams();
  const fecha = params.fecha as string;

  const edicion = mockEdiciones.find((e) => e.fechaISO === fecha);

  if (!edicion) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="font-ui text-sm text-text-secondary">
          Edición no encontrada
        </span>
      </div>
    );
  }

  return (
    <PanelLayout
      header={
        <HeaderPanel>
          <div className="flex items-center gap-2">
            <DataPill>{edicion.fecha}</DataPill>
            <DataPill>{edicion.titulo}</DataPill>
          </div>
        </HeaderPanel>
      }
      content={<PublicacionPanel status="ready" />}
    />
  );
}
