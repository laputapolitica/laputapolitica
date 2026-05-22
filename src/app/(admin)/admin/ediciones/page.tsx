import { PipelineDiagram, mockState } from "@/components/admin";
import { PanelLayout } from "@/components/admin/shared";
import { EdicionesList } from "@/components/admin/sections/ediciones";
import { edicionDelDia, mockEdiciones } from "@/lib/mock-ediciones";

export default function AdminEdicionesPage() {
  return (
    <PanelLayout
      header={
        edicionDelDia.enCurso ? (
          <PipelineDiagram pipelineState={mockState} diagramOnly />
        ) : null
      }
      content={<EdicionesList ediciones={mockEdiciones} />}
    />
  );
}
