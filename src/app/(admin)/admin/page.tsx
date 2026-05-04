"use client";

import { PipelineDiagram, PublicacionPanel } from "@/components/admin";
import type { PipelineState } from "@/components/admin/PipelineDiagram";

const mockState: PipelineState = {
  relevamiento: "done",
  relevamientoGate: "approved",
  titulosResumenes: "done",
  titulosGate: "approved",
  portada: "done",
  portadaGate: "approved",
  ventanaOpinion: "done",
  elPulso: "done",
  web: "done",
  instagram: "done",
  twitter: "done",
  publicacion: "running",
};

export default function AdminPage() {
  return (
    <div className="flex h-full flex-col gap-4">
      <PipelineDiagram pipelineState={mockState} />
      <section className="min-h-0 flex-1 overflow-y-auto bg-bg-base w-full">
        <PublicacionPanel status="ready" />
      </section>
    </div>
  );
}
