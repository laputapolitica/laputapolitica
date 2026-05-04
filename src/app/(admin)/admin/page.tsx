"use client";

import { useState } from "react";
import {
  ElPulsoPanel,
  PipelineDiagram,
  PortadaPanel,
  PublicacionPanel,
  RelevamientoPanel,
  TitulosResumenesPanel,
  VentanaOpinionPanel,
} from "@/components/admin";
import type { PipelineState } from "@/components/admin/PipelineDiagram";
import type { PipelineNodeId } from "@/components/admin/PipelineDiagram";

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

function ActivePanel({ nodeId }: { nodeId: PipelineNodeId }) {
  const status = mockState[nodeId];
  const panelStatus = status === "running" ? "ready" : "ready";

  if (nodeId === "relevamiento") {
    return <RelevamientoPanel status={panelStatus} />;
  }
  if (nodeId === "titulosResumenes") {
    return <TitulosResumenesPanel status={panelStatus} />;
  }
  if (nodeId === "portada") {
    return <PortadaPanel status={panelStatus} />;
  }
  if (nodeId === "ventanaOpinion") {
    return <VentanaOpinionPanel />;
  }
  if (nodeId === "elPulso") {
    return <ElPulsoPanel status={panelStatus} />;
  }
  // web, instagram, twitter, publicacion → todos van a PublicacionPanel
  return <PublicacionPanel status={panelStatus} />;
}

export default function AdminPage() {
  const [activeNodeId, setActiveNodeId] = useState<PipelineNodeId>("publicacion");

  return (
    <div className="flex h-full flex-col gap-4">
      <PipelineDiagram
        pipelineState={mockState}
        activeNodeId={activeNodeId}
        onNodeClick={setActiveNodeId}
      />
      <section className="min-h-0 flex-1 overflow-y-auto bg-bg-base w-full">
        <ActivePanel nodeId={activeNodeId} />
      </section>
    </div>
  );
}
