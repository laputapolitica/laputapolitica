import { IconR } from "@/components/admin/icons";
import type { GateStatus } from "@/components/admin/PipelineDiagram";

const GATE_COLORS: Record<GateStatus, string> = {
  pending: "#FF5C60",
  approved: "#35C759",
};

type PipelineGateProps = {
  status: GateStatus;
};

export function PipelineGate({ status }: PipelineGateProps) {
  return <IconR width={20} height={20} color={GATE_COLORS[status]} />;
}
