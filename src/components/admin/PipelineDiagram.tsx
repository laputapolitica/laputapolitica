"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { IconR } from "@/components/admin/icons";
import { PipelineNode } from "./pipeline/PipelineNode";
import { PipelineGate } from "./pipeline/PipelineGate";

export type NodeStatus = "pending" | "running" | "done";
export type GateStatus = "pending" | "approved";

export interface PipelineState {
  relevamiento: NodeStatus;
  relevamientoGate: GateStatus;
  titulosResumenes: NodeStatus;
  titulosGate: GateStatus;
  portada: NodeStatus;
  portadaGate: GateStatus;
  ventanaOpinion: NodeStatus;
  elPulso: NodeStatus;
  web: NodeStatus;
  instagram: NodeStatus;
  twitter: NodeStatus;
  publicacion: NodeStatus;
}

export type PipelineNodeId =
  | "relevamiento"
  | "titulosResumenes"
  | "portada"
  | "ventanaOpinion"
  | "elPulso"
  | "web"
  | "instagram"
  | "twitter"
  | "publicacion";

export type PipelineDiagramProps = {
  pipelineState?: PipelineState;
  onAutorizar?: () => void;
  onPublicar?: () => void;
  diagramOnly?: boolean;
};

// ─── MOCK STATES ─────────────────────────────────────────────────
export const mockState: PipelineState = {
  relevamiento: "done",
  relevamientoGate: "approved",
  titulosResumenes: "done",
  titulosGate: "approved",
  portada: "done",
  portadaGate: "pending",
  ventanaOpinion: "running",
  elPulso: "pending",
  web: "pending",
  instagram: "pending",
  twitter: "pending",
  publicacion: "pending",
};

export const mockStateInicio: PipelineState = {
  relevamiento: "running",
  relevamientoGate: "pending",
  titulosResumenes: "pending",
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

export const mockStateRevisionRelevamiento: PipelineState = {
  relevamiento: "done",
  relevamientoGate: "pending",
  titulosResumenes: "pending",
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

export const mockStateTitulosRunning: PipelineState = {
  relevamiento: "done",
  relevamientoGate: "approved",
  titulosResumenes: "running",
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

export const mockStateRevisionTitulos: PipelineState = {
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

export const mockStateParaleloPortadaOpinion: PipelineState = {
  relevamiento: "done",
  relevamientoGate: "approved",
  titulosResumenes: "done",
  titulosGate: "approved",
  portada: "running",
  portadaGate: "pending",
  ventanaOpinion: "running",
  elPulso: "pending",
  web: "pending",
  instagram: "pending",
  twitter: "pending",
  publicacion: "pending",
};

export const mockStateElPulsoRunning: PipelineState = {
  relevamiento: "done",
  relevamientoGate: "approved",
  titulosResumenes: "done",
  titulosGate: "approved",
  portada: "done",
  portadaGate: "approved",
  ventanaOpinion: "done",
  elPulso: "running",
  web: "pending",
  instagram: "pending",
  twitter: "pending",
  publicacion: "pending",
};

export const mockStateParaleloWebInstagramTwitter: PipelineState = {
  relevamiento: "done",
  relevamientoGate: "approved",
  titulosResumenes: "done",
  titulosGate: "approved",
  portada: "done",
  portadaGate: "approved",
  ventanaOpinion: "done",
  elPulso: "done",
  web: "running",
  instagram: "running",
  twitter: "running",
  publicacion: "pending",
};

export const mockStatePublicacion: PipelineState = {
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

export const mockStatePublicado: PipelineState = {
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
  publicacion: "done",
};

// ─── CONNECTORS DEFINITION ───────────────────────────────────────
// Cada conector va de un anchor a otro anchor.
// Anchor format: "{refKey}:{side}" donde side es L o R.
// El path se calcula en runtime según las posiciones reales.
type ConnectorDef = {
  from: string;
  to: string;
  // Si está running, el conector tiene animación
  fromNode?: PipelineNodeId;
};

const CONNECTORS: ConnectorDef[] = [
  { from: "relevamiento:R", to: "relevamientoGate:L", fromNode: "relevamiento" },
  { from: "relevamientoGate:R", to: "titulosResumenes:L" },
  { from: "titulosResumenes:R", to: "titulosGate:L", fromNode: "titulosResumenes" },
  { from: "titulosGate:R", to: "portada:L" },
  { from: "titulosGate:R", to: "ventanaOpinion:L" },
  { from: "portada:R", to: "portadaGate:L", fromNode: "portada" },
  { from: "portadaGate:R", to: "elPulso:L" },
  { from: "ventanaOpinion:R", to: "elPulso:L", fromNode: "ventanaOpinion" },
  { from: "elPulso:R", to: "web:L", fromNode: "elPulso" },
  { from: "elPulso:R", to: "instagram:L", fromNode: "elPulso" },
  { from: "elPulso:R", to: "twitter:L", fromNode: "elPulso" },
  { from: "web:R", to: "publicacion:L", fromNode: "web" },
  { from: "instagram:R", to: "publicacion:L", fromNode: "instagram" },
  { from: "twitter:R", to: "publicacion:L", fromNode: "twitter" },
];

export const REVIEW_GATES: Array<{
  gateId: keyof PipelineState;
  nodeId: PipelineNodeId;
  label: string;
}> = [
  {
    gateId: "relevamientoGate",
    nodeId: "relevamiento",
    label: "Relevamiento",
  },
  {
    gateId: "titulosGate",
    nodeId: "titulosResumenes",
    label: "Títulos y Resúmenes",
  },
  { gateId: "portadaGate", nodeId: "portada", label: "Portada" },
];

// ─── COMPONENT ───────────────────────────────────────────────────
export function PipelineDiagram({
  pipelineState = mockState,
  onAutorizar,
  onPublicar,
  diagramOnly = false,
}: PipelineDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const refs = useRef<Record<string, HTMLDivElement | null>>({});
  const [paths, setPaths] = useState<
    { d: string; running: boolean; key: string }[]
  >([]);

  const recalculate = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const RADIUS = 8;

    // Pre-calcular posiciones de todos los nodos
    const positions: Record<
      string,
      {
        left: number;
        right: number;
        top: number;
        bottom: number;
        centerY: number;
      }
    > = {};
    Object.entries(refs.current).forEach(([key, el]) => {
      if (!el) return;

      const rect = el.getBoundingClientRect();
      positions[key] = {
        left: rect.left - containerRect.left,
        right: rect.right - containerRect.left,
        top: rect.top - containerRect.top,
        bottom: rect.bottom - containerRect.top,
        centerY: rect.top + rect.height / 2 - containerRect.top,
      };
    });

    // Calcular midX compartido por destino: el midX se ubica a una distancia fija del nodo destino
    // Esto asegura que conectores que entran al mismo nodo curven en el mismo punto X
    function getSharedMidX(
      toKey: string,
      toSide: string,
      fromX: number,
    ): number {
      const toPos = positions[toKey];
      if (!toPos) return (fromX + 0) / 2;

      const targetX = toSide === "L" ? toPos.left : toPos.right;
      // El midX está a 16px del nodo destino, pero nunca más cerca al origen que la mitad
      const offset = 16;
      const direction = targetX > fromX ? -1 : 1;
      return targetX + direction * offset;
    }

    const newPaths = CONNECTORS.map((connector, i) => {
      const [fromKey, fromSide] = connector.from.split(":");
      const [toKey, toSide] = connector.to.split(":");

      const fromPos = positions[fromKey];
      const toPos = positions[toKey];

      if (!fromPos || !toPos) return null;

      const x1 = fromSide === "R" ? fromPos.right : fromPos.left;
      const y1 = fromPos.centerY;
      const x2 = toSide === "L" ? toPos.left : toPos.right;
      const y2 = toPos.centerY;

      let d: string;

      if (Math.abs(y1 - y2) < 1) {
        d = `M${x1} ${y1} L${x2} ${y2}`;
      } else {
        const midX = getSharedMidX(toKey, toSide, x1);
        const goingDown = y2 > y1;
        const r = Math.min(RADIUS, Math.abs(midX - x1), Math.abs(y2 - y1) / 2);

        if (goingDown) {
          d = [
            `M${x1} ${y1}`,
            `L${midX - r} ${y1}`,
            `Q${midX} ${y1} ${midX} ${y1 + r}`,
            `L${midX} ${y2 - r}`,
            `Q${midX} ${y2} ${midX + r} ${y2}`,
            `L${x2} ${y2}`,
          ].join(" ");
        } else {
          d = [
            `M${x1} ${y1}`,
            `L${midX - r} ${y1}`,
            `Q${midX} ${y1} ${midX} ${y1 - r}`,
            `L${midX} ${y2 + r}`,
            `Q${midX} ${y2} ${midX + r} ${y2}`,
            `L${x2} ${y2}`,
          ].join(" ");
        }
      }

      const running = connector.fromNode
        ? pipelineState[connector.fromNode] === "running"
        : false;

      return { d, running, key: `${connector.from}->${connector.to}-${i}` };
    }).filter(
      (p): p is { d: string; running: boolean; key: string } => p !== null,
    );

    setPaths(newPaths);
  }, [pipelineState]);

  useLayoutEffect(() => {
    recalculate();
  }, [recalculate]);

  useEffect(() => {
    const observer = new ResizeObserver(() => recalculate());
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [recalculate]);

  function setRef(key: string) {
    return (el: HTMLDivElement | null) => {
      refs.current[key] = el;
    };
  }

  // Detectar si hay revisión activa: gate pending + nodo origen done
  const activeReview = REVIEW_GATES.find(
    (gate) =>
      pipelineState[gate.gateId] === "pending" &&
      pipelineState[gate.nodeId] === "done",
  );
  const isPublicacionRunning = pipelineState.publicacion === "running";

  return (
    <div
      className={`flex w-full flex-col rounded-lg ${
        !diagramOnly && (activeReview || isPublicacionRunning) ? "bg-admin-ink" : ""
      }`}
    >
      {/* Pipeline */}
      <div
        ref={containerRef}
        className="relative w-full rounded-lg border-2 border-admin-ink bg-bg-base px-3 py-2"
      >
        {/* SVG layer de conectores */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ overflow: "visible" }}
        >
          {paths.map((p) => (
            <path
              key={p.key}
              d={p.d}
              stroke={p.running ? "#FAC800" : "#111111"}
              strokeWidth="1.5"
              fill="none"
              className={p.running ? "pipeline-flow" : undefined}
            />
          ))}
        </svg>

        <div className="relative flex items-center justify-between">
          {/* Relevamiento */}
          <div ref={setRef("relevamiento")}>
            <PipelineNode
              label="Relevamiento"
              status={pipelineState.relevamiento}
            />
          </div>

          {/* relevamientoGate */}
          <div ref={setRef("relevamientoGate")}>
            <PipelineGate
              status={pipelineState.relevamientoGate}
              nodeStatus={pipelineState.relevamiento}
            />
          </div>

          {/* Títulos y Resúmenes */}
          <div ref={setRef("titulosResumenes")}>
            <PipelineNode
              label="Títulos y Resúmenes"
              status={pipelineState.titulosResumenes}
            />
          </div>

          {/* titulosGate */}
          <div ref={setRef("titulosGate")}>
            <PipelineGate
              status={pipelineState.titulosGate}
              nodeStatus={pipelineState.titulosResumenes}
            />
          </div>

          {/* Portada + Ventana de Opinión (stack vertical) */}
          <div className="flex flex-col gap-5 items-start">
            <div ref={setRef("portada")}>
              <PipelineNode label="Portada" status={pipelineState.portada} />
            </div>
            <div ref={setRef("ventanaOpinion")}>
              <PipelineNode
                label="Ventana de opinión"
                status={pipelineState.ventanaOpinion}
              />
            </div>
          </div>

          {/* portadaGate (alineado con Portada arriba) */}
          <div className="flex flex-col gap-5 items-start">
            <div ref={setRef("portadaGate")} className="ml-2">
              <PipelineGate
                status={pipelineState.portadaGate}
                nodeStatus={pipelineState.portada}
              />
            </div>
            {/* Spacer invisible para que tenga la misma altura que el grupo Portada+Ventana */}
            <div className="h-[24px] w-[20px]" />
          </div>

          {/* El Pulso */}
          <div ref={setRef("elPulso")}>
            <PipelineNode label="El Pulso" status={pipelineState.elPulso} />
          </div>

          {/* Web/Instagram/Twitter (stack vertical) */}
          <div className="flex flex-col gap-1 items-start">
            <div ref={setRef("web")}>
              <PipelineNode label="Web" status={pipelineState.web} />
            </div>
            <div ref={setRef("instagram")}>
              <PipelineNode label="Instagram" status={pipelineState.instagram} />
            </div>
            <div ref={setRef("twitter")}>
              <PipelineNode label="X (Twitter)" status={pipelineState.twitter} />
            </div>
          </div>

          {/* Publicación */}
          <div ref={setRef("publicacion")}>
            <PipelineNode
              label="Publicación"
              status={pipelineState.publicacion}
            />
          </div>
        </div>
      </div>
      {/* Bandeja de revisión activa (sin borde ni fondo propio) */}
      {!diagramOnly && activeReview && (
        <div className="flex w-full items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <IconR width={20} height={20} color="#FF5C60" />
            <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-1.5">
              <span className="font-ui text-[11px] font-medium leading-none text-admin-ink whitespace-nowrap">
                {activeReview.label}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onAutorizar}
            className="inline-flex h-[28px] cursor-pointer items-center rounded-md border-2 border-[#35C759] bg-white px-4 font-ui text-sm font-bold text-admin-ink"
          >
            Autorizar
          </button>
        </div>
      )}
      {/* Bandeja de publicación (sin R, botón Publicar) */}
      {!diagramOnly && isPublicacionRunning && (
        <div className="flex w-full items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-1.5">
              <span className="font-ui text-[11px] font-medium leading-none text-admin-ink whitespace-nowrap">
                Publicación
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onPublicar}
            className="inline-flex h-[28px] cursor-pointer items-center rounded-md border-2 border-[#35C759] bg-white px-4 font-ui text-sm font-bold text-admin-ink"
          >
            Publicar
          </button>
        </div>
      )}
    </div>
  );
}
