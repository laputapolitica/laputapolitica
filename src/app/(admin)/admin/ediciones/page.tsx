import { PipelineDiagram, mockState } from "@/components/admin";
import { EdicionesList } from "@/components/admin/sections/ediciones";
import { mockEdiciones } from "@/lib/mock-ediciones";

export default function AdminEdicionesPage() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {/* Pipeline de la edición en curso — fijo arriba */}
      <div className="shrink-0">
        <PipelineDiagram pipelineState={mockState} />
      </div>

      {/* Listado de ediciones — scrolleable */}
      <EdicionesList ediciones={mockEdiciones} />
    </div>
  );
}
