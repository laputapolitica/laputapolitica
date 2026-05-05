"use client";

import { IconR } from "@/components/admin/icons";

type NodeStatus = "pending" | "running" | "done";
type GateStatus = "pending" | "approved";

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

type PipelineNode = {
  id: PipelineNodeId;
  label: string;
  x: number;
  y: number;
  width: number;
};

type PipelineGate = {
  id: keyof Pick<
    PipelineState,
    "relevamientoGate" | "titulosGate" | "portadaGate"
  >;
  cx: number;
  cy: number;
};

export type PipelineDiagramProps = {
  pipelineState?: PipelineState;
};

export const mockState: PipelineState = {
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

const nodes: PipelineNode[] = [
  { id: "relevamiento", label: "Relevamiento", x: 20.5, y: 49.5, width: 132 },
  {
    id: "titulosResumenes",
    label: "Títulos y Resúmenes",
    x: 193.5,
    y: 49.5,
    width: 180,
  },
  { id: "portada", label: "Portada", x: 414.5, y: 19.5, width: 95 },
  {
    id: "ventanaOpinion",
    label: "Ventana de opinion",
    x: 414.5,
    y: 79.5,
    width: 170,
  },
  { id: "elPulso", label: "El Pulso", x: 625.5, y: 49.5, width: 94 },
  { id: "web", label: "Web", x: 760.5, y: 19.5, width: 71 },
  { id: "instagram", label: "Instagram", x: 760.5, y: 49.5, width: 109 },
  { id: "twitter", label: "X (Twitter)", x: 760.5, y: 79.5, width: 112 },
  { id: "publicacion", label: "Publicación", x: 910.5, y: 49.5, width: 119 },
];

const gates: PipelineGate[] = [
  { id: "relevamientoGate", cx: 173, cy: 60 },
  { id: "titulosGate", cx: 394, cy: 60 },
  { id: "portadaGate", cx: 558, cy: 30 },
];

const connectorPaths = [
  "M153 60H193",
  "M374 54.5H390C392.209 54.5 394 52.7091 394 50.5V33.5C394 31.2909 395.791 29.5 398 29.5H414",
  "M374 65.5H390C392.209 65.5 394 67.2909 394 69.5V85.5C394 87.7091 395.791 89.5 398 89.5H414",
  "M585 89.5H601C603.209 89.5 605 87.7091 605 85.5V69.5C605 67.2909 606.791 65.5 609 65.5H625",
  "M510 29.5H601C603.209 29.5 605 31.2909 605 33.5V50.5C605 52.7091 606.791 54.5 609 54.5H625",
  "M720 65.5H736C738.209 65.5 740 67.2909 740 69.5V85.5C740 87.7091 741.791 89.5 744 89.5H760",
  "M720 60H760",
  "M720 54.5H736C738.209 54.5 740 52.7091 740 50.5V33.5C740 31.2909 741.791 29.5 744 29.5H760",
  "M873 89.5H889C891.209 89.5 893 87.7091 893 85.5V69.5C893 67.2909 894.791 65.5 897 65.5H910",
  "M870 60H910",
  "M832 29.5H886C888.209 29.5 890 31.2909 890 33.5V50.5C890 52.7091 891.791 54.5 894 54.5H910",
];

const colors = {
  background: "#FAF9F5",
  ink: "#111111",
  white: "#FFFFFF",
  pending: "#D9D9D9",
  running: "#FAC800",
  done: "#35C759",
  gatePending: "#FF5C60",
} as const;

function getStatusColor(status: NodeStatus) {
  const statusColors: Record<NodeStatus, string> = {
    pending: colors.pending,
    running: colors.running,
    done: colors.done,
  };

  return statusColors[status];
}

function getGateColor(status: GateStatus) {
  const statusColors: Record<GateStatus, string> = {
    pending: colors.gatePending,
    approved: colors.done,
  };

  return statusColors[status];
}

function toXPercent(x: number) {
  return `${(x / 1076) * 100}%`;
}

function toYPercent(y: number) {
  return `${(y / 120) * 100}%`;
}

export function PipelineDiagram({
  pipelineState = mockState,
}: PipelineDiagramProps) {
  return (
    <div
      className="relative w-full rounded-lg border-2 border-admin-ink bg-bg-base"
      style={{ height: "96px" }}
    >
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        width="100%"
        height="100%"
        viewBox="0 0 1076 120"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {connectorPaths.map((path) => (
          <path
            key={path}
            d={path}
            stroke={colors.ink}
            strokeWidth="1"
            fill="none"
          />
        ))}

        {nodes.map((node) => (
          <rect
            key={node.id}
            x={node.x}
            y={node.y}
            width={node.width}
            height="24"
            rx="3.5"
            fill={colors.white}
            stroke={colors.ink}
            strokeWidth="1"
          />
        ))}
      </svg>

      <div style={{ position: "absolute", inset: 0 }}>
        {nodes.map((node) => (
          <div key={node.id}>
            <span
              className="absolute whitespace-nowrap font-ui text-[11px] font-medium leading-none text-admin-ink"
              style={{
                left: toXPercent(node.x + 8),
                top: toYPercent(node.y + 12),
                transform: "translateY(-50%)",
              }}
            >
              {node.label}
            </span>
            <span
              className="absolute h-[8px] w-[8px] rounded-full"
              style={{
                left: toXPercent(node.x + node.width - 14),
                top: toYPercent(node.y + 12),
                transform: "translate(-50%, -50%)",
                backgroundColor: getStatusColor(pipelineState[node.id]),
              }}
            />
          </div>
        ))}

        {gates.map((gate) => (
          <div
            key={gate.id}
            className="absolute"
            style={{
              left: toXPercent(gate.cx),
              top: toYPercent(gate.cy),
              transform: "translate(-50%, -50%)",
            }}
          >
            <IconR
              width={20}
              height={20}
              color={getGateColor(pipelineState[gate.id])}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
