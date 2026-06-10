"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getPipelineEnCurso,
  getCandidatasRelevamiento,
  autorizarEtapa,
  moverCandidata,
  type PipelineEnCurso,
  type NoticiasRelevamiento,
  type AutorizarEtapa,
  type DireccionMover,
} from "./actions";
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

type NoticiasRelevamientoState = NoticiasRelevamiento | null;

function getReviewNode(state: PipelineState): PipelineNodeId | null {
  const reviewGate = REVIEW_GATES.find(
    ({ gateId, nodeId }) => state[gateId] === "pending" && state[nodeId] === "done",
  );

  return reviewGate?.nodeId ?? null;
}

function getRunningNodes(state: PipelineState): PipelineNodeId[] {
  return VALID_NODES.filter((nodeId) => state[nodeId] === "running");
}

function ActivePanel({
  nodeId,
  noticiasRelev,
  onSubir,
  onBajar,
  onEliminar,
  onAgregar,
}: {
  nodeId: PipelineNodeId;
  noticiasRelev?: NoticiasRelevamientoState;
  onSubir?: (id: string) => void;
  onBajar?: (id: string) => void;
  onEliminar?: (id: string) => void;
  onAgregar?: (id: string) => void;
}) {
  if (nodeId === "relevamiento") {
    return (
      <RelevamientoPanel
        status="ready"
        noticias={noticiasRelev ?? undefined}
        onSubir={onSubir}
        onBajar={onBajar}
        onEliminar={onEliminar}
        onAgregar={onAgregar}
      />
    );
  }
  if (nodeId === "titulosResumenes") return <TitulosResumenesPanel status="ready" />;
  if (nodeId === "portada") return <PortadaPanel status="ready" />;
  if (nodeId === "ventanaOpinion") return <VentanaOpinionPanel />;
  if (nodeId === "elPulso") return <ElPulsoPanel status="ready" />;
  return <PublicacionPanel status="ready" />;
}

function PipelineActivePanel({
  state,
  noticiasRelev,
  onSubir,
  onBajar,
  onEliminar,
  onAgregar,
}: {
  state: PipelineState;
  noticiasRelev?: NoticiasRelevamientoState;
  onSubir?: (id: string) => void;
  onBajar?: (id: string) => void;
  onEliminar?: (id: string) => void;
  onAgregar?: (id: string) => void;
}) {
  // Si todo está done → pantalla de publicado con cuenta atrás
  const allDone = Object.entries(state)
    .filter(([key]) => !key.includes("Gate"))
    .every(([, val]) => val === "done");

  if (allDone) return <PublicadoPanel />;

  const reviewNode = getReviewNode(state);

  if (reviewNode) {
    return (
      <ActivePanel
        nodeId={reviewNode}
        noticiasRelev={noticiasRelev}
        onSubir={onSubir}
        onBajar={onBajar}
        onEliminar={onEliminar}
        onAgregar={onAgregar}
      />
    );
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

  const [enCurso, setEnCurso] = useState<PipelineEnCurso>(null);
  const [noticiasRelev, setNoticiasRelev] = useState<NoticiasRelevamientoState>(null);
  const [cargando, setCargando] = useState(true);

  async function recargarPipeline() {
    const data = await getPipelineEnCurso();
    setEnCurso(data);
    if (data) {
      const candidatas = await getCandidatasRelevamiento(data.edicionId);
      setNoticiasRelev(candidatas);
    } else {
      setNoticiasRelev(null);
    }
  }

  useEffect(() => {
    let activo = true;
    getPipelineEnCurso().then(async (data) => {
      if (activo) {
        setEnCurso(data);
        if (data) {
          const candidatas = await getCandidatasRelevamiento(data.edicionId);
          if (activo) {
            setNoticiasRelev(candidatas);
          }
        } else {
          setNoticiasRelev(null);
        }
        setCargando(false);
      }
    });
    return () => {
      activo = false;
    };
  }, []);

  async function handleAutorizar(nodeId: string) {
    if (!enCurso) return;
    const etapasValidas: AutorizarEtapa[] = [
      "relevamiento",
      "titulosResumenes",
      "portada",
      "publicacion",
    ];
    if (!etapasValidas.includes(nodeId as AutorizarEtapa)) return;
    const res = await autorizarEtapa(enCurso.edicionId, nodeId as AutorizarEtapa);
    if (res.success) {
      await recargarPipeline();
    }
  }

  async function handlePublicar() {
    if (!enCurso) return;
    const res = await autorizarEtapa(enCurso.edicionId, "publicacion");
    if (res.success) {
      await recargarPipeline();
    }
  }

  async function handleMoverCandidata(candidataId: string, direccion: DireccionMover) {
    if (!enCurso) return;
    const res = await moverCandidata(enCurso.edicionId, candidataId, direccion);
    if (res.success) {
      await recargarPipeline();
    }
  }

  async function handleEliminarCandidata(candidataId: string) {
    void candidataId;
    // TODO: implementar en el próximo paso
  }

  async function handleAgregarCandidata(candidataId: string) {
    void candidataId;
    // TODO: implementar en el próximo paso
  }

  // Si hay ?scenario= en la URL, se usa el mock (herramienta de testing Dev).
  // Si no, se usa el estado real de la edición en curso.
  const pipelineState: PipelineState | null = scenarioParam
    ? SCENARIO_STATES[scenarioParam] ?? mockState
    : enCurso?.state ?? null;

  const forcedNodeId =
    panelParam && VALID_NODES.includes(panelParam) ? panelParam : null;

  // Sin scenario y todavía cargando el estado real.
  if (!scenarioParam && cargando) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="font-ui text-sm text-text-secondary">Cargando…</span>
      </div>
    );
  }

  // Sin scenario y sin edición en curso.
  if (!pipelineState) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="font-ui text-sm text-text-secondary">
          No hay una edición en curso en este momento.
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <PipelineDiagram
        pipelineState={pipelineState}
        onAutorizar={handleAutorizar}
        onPublicar={handlePublicar}
      />
      <section className="min-h-0 flex-1 overflow-y-auto bg-bg-base w-full">
        {forcedNodeId ? (
          <ActivePanel
            nodeId={forcedNodeId}
            noticiasRelev={noticiasRelev}
            onSubir={(id) => handleMoverCandidata(id, "subir")}
            onBajar={(id) => handleMoverCandidata(id, "bajar")}
            onEliminar={handleEliminarCandidata}
            onAgregar={handleAgregarCandidata}
          />
        ) : (
          <PipelineActivePanel
            state={pipelineState}
            noticiasRelev={noticiasRelev}
            onSubir={(id) => handleMoverCandidata(id, "subir")}
            onBajar={(id) => handleMoverCandidata(id, "bajar")}
            onEliminar={handleEliminarCandidata}
            onAgregar={handleAgregarCandidata}
          />
        )}
      </section>
    </div>
  );
}
