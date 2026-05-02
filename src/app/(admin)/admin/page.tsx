"use client";

import { PipelineDiagram, TitulosResumenesPanel } from "@/components/admin";
import type { PipelineState } from "@/components/admin/PipelineDiagram";

const mockState: PipelineState = {
  relevamiento: "done",
  relevamientoGate: "approved",
  titulosResumenes: "done",
  titulosGate: "pending",
  portada: "pending",
  portadaGate: "pending",
  ventanaOpinion: "pending",
  elPulso: "pending",
  web: "pending",
  instagram: "pending",
  twitter: "pending",
  publicacion: "pending",
};

export default function AdminPage() {
  return (
    <div className="flex h-full flex-col gap-4">
      <PipelineDiagram pipelineState={mockState} />
      <section className="min-h-0 flex-1 overflow-y-auto bg-bg-base">
        <TitulosResumenesPanel status="ready" />
      </section>
    </div>
  );
}
