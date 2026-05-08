"use client";

import { useSearchParams } from "next/navigation";
import {
  ElPulsoPanel,
  PipelineDiagram,
  PortadaPanel,
  PublicadoPanel,
  PublicacionPanel,
  RelevamientoPanel,
  TitulosResumenesPanel,
  VentanaOpinionPanel,
} from "@/components/admin";
import { LoadingTextGrid } from "@/components/admin/shared";
import {
  mockState,
  mockStateElPulsoRunning,
  mockStateInicio,
  mockStateParaleloPortadaOpinion,
  mockStateParaleloWebInstagramTwitter,
  mockStatePublicacion,
  mockStatePublicado,
  mockStateRevisionRelevamiento,
  mockStateRevisionTitulos,
  mockStateTitulosRunning,
} from "@/components/admin/PipelineDiagram";
import type { PipelineNodeId, PipelineState } from "@/components/admin/PipelineDiagram";

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

const REVIEW_GATES = [
  {
    gateId: "relevamientoGate",
    nodeId: "relevamiento",
  },
  {
    gateId: "titulosGate",
    nodeId: "titulosResumenes",
  },
  {
    gateId: "portadaGate",
    nodeId: "portada",
  },
] as const;

const RUNNING_MESSAGES: Record<PipelineNodeId, string> = {
  relevamiento: "Buscando y seleccionando las noticias del día",
  titulosResumenes: "Creando títulos y resúmenes",
  portada: "Creando portada",
  ventanaOpinion: "Ventana de opinión de El Pulso abierta",
  elPulso: "Creando resúmenes de El Pulso",
  web: "Creando contenido para Web",
  instagram: "Creando contenido para Instagram",
  twitter: "Creando contenido para X (Twitter)",
  publicacion: "Preparando publicación",
};

const SCENARIO_STATES: Record<string, PipelineState> = {
  inicio: mockStateInicio,
  "revision-relevamiento": mockStateRevisionRelevamiento,
  "titulos-running": mockStateTitulosRunning,
  "revision-titulos": mockStateRevisionTitulos,
  "paralelo-portada-opinion": mockStateParaleloPortadaOpinion,
  "revision-portada": mockState,
  "elpulso-running": mockStateElPulsoRunning,
  "paralelo-canales": mockStateParaleloWebInstagramTwitter,
  publicacion: mockStatePublicacion,
  publicado: mockStatePublicado,
};

function getReviewNode(state: PipelineState): PipelineNodeId | null {
  const reviewGate = REVIEW_GATES.find(
    ({ gateId, nodeId }) => state[gateId] === "pending" && state[nodeId] === "done",
  );

  return reviewGate?.nodeId ?? null;
}

function getRunningNodes(state: PipelineState): PipelineNodeId[] {
  return VALID_NODES.filter((nodeId) => state[nodeId] === "running");
}

function ActivePanel({ nodeId }: { nodeId: PipelineNodeId }) {
  if (nodeId === "relevamiento") return <RelevamientoPanel status="ready" />;
  if (nodeId === "titulosResumenes") return <TitulosResumenesPanel status="ready" />;
  if (nodeId === "portada") return <PortadaPanel status="ready" />;
  if (nodeId === "ventanaOpinion") return <VentanaOpinionPanel />;
  if (nodeId === "elPulso") return <ElPulsoPanel status="ready" />;
  return <PublicacionPanel status="ready" />;
}

function PipelineActivePanel({ state }: { state: PipelineState }) {
  // Si todo está done → pantalla de publicado con cuenta atrás
  const allDone = Object.entries(state)
    .filter(([key]) => !key.includes("Gate"))
    .every(([, val]) => val === "done");

  if (allDone) return <PublicadoPanel />;

  const reviewNode = getReviewNode(state);

  if (reviewNode) {
    return <ActivePanel nodeId={reviewNode} />;
  }

  const runningNodes = getRunningNodes(state);

  // Si el único nodo running es publicacion → mostrar PublicacionPanel
  if (runningNodes.length === 1 && runningNodes[0] === "publicacion") {
    return <PublicacionPanel status="ready" />;
  }

  if (runningNodes.length > 0) {
    return (
      <LoadingTextGrid
        messages={runningNodes.map((nodeId) => RUNNING_MESSAGES[nodeId])}
      />
    );
  }

  return <PublicacionPanel status="ready" />;
}

export default function AdminPage() {
  const searchParams = useSearchParams();
  const scenarioParam = searchParams.get("scenario");
  const panelParam = searchParams.get("panel") as PipelineNodeId | null;
  const pipelineState = scenarioParam
    ? SCENARIO_STATES[scenarioParam] ?? mockState
    : mockState;
  const forcedNodeId =
    panelParam && VALID_NODES.includes(panelParam) ? panelParam : null;

  return (
    <div className="flex h-full flex-col gap-4">
      <PipelineDiagram
        pipelineState={pipelineState}
        onAutorizar={() => console.log("Autorizar (mock)")}
        onPublicar={() => console.log("Publicar (mock)")}
      />
      <section className="min-h-0 flex-1 overflow-y-auto bg-bg-base w-full">
        {forcedNodeId ? (
          <ActivePanel nodeId={forcedNodeId} />
        ) : (
          <PipelineActivePanel state={pipelineState} />
        )}
      </section>
    </div>
  );
}
