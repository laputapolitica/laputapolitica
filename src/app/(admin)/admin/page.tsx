"use client";

import { useSearchParams } from "next/navigation";
import {
  ElPulsoPanel,
  PipelineDiagram,
  PortadaPanel,
  PublicacionPanel,
  RelevamientoPanel,
  TitulosResumenesPanel,
  VentanaOpinionPanel,
  mockState,
} from "@/components/admin";
import type { PipelineNodeId, PipelineState } from "@/components/admin/PipelineDiagram";

function getActiveNodeId(state: PipelineState): PipelineNodeId {
  const order: PipelineNodeId[] = [
    "relevamiento",
    "titulosResumenes",
    "portada",
    "ventanaOpinion",
    "elPulso",
    "web",
    "instagram",
    "twitter",
    "publicacion",
  ];

  const running = order.find((id) => state[id] === "running");
  if (running) return running;

  const done = [...order].reverse().find((id) => state[id] === "done");
  if (done) return done;

  return "relevamiento";
}

const VALID_NODES: PipelineNodeId[] = [
  "relevamiento",
  "titulosResumenes",
  "portada",
  "ventanaOpinion",
  "elPulso",
  "web",
  "instagram",
  "twitter",
  "publicacion",
];

function ActivePanel({ nodeId }: { nodeId: PipelineNodeId }) {
  if (nodeId === "relevamiento") return <RelevamientoPanel status="ready" />;
  if (nodeId === "titulosResumenes") return <TitulosResumenesPanel status="ready" />;
  if (nodeId === "portada") return <PortadaPanel status="ready" />;
  if (nodeId === "ventanaOpinion") return <VentanaOpinionPanel />;
  if (nodeId === "elPulso") return <ElPulsoPanel status="ready" />;
  return <PublicacionPanel status="ready" />;
}

export default function AdminPage() {
  const searchParams = useSearchParams();
  const panelParam = searchParams.get("panel") as PipelineNodeId | null;
  const activeNodeId =
    panelParam && VALID_NODES.includes(panelParam)
      ? panelParam
      : getActiveNodeId(mockState);

  return (
    <div className="flex h-full flex-col gap-4">
      <PipelineDiagram pipelineState={mockState} />
      <section className="min-h-0 flex-1 overflow-y-auto bg-bg-base w-full">
        <ActivePanel nodeId={activeNodeId} />
      </section>
    </div>
  );
}
