import { IconR } from "@/components/admin/icons";
import type { GateStatus, NodeStatus } from "@/components/admin/PipelineDiagram";

type PipelineGateProps = {
  status: GateStatus;
  nodeStatus?: NodeStatus;
};

export function PipelineGate({ status, nodeStatus }: PipelineGateProps) {
  if (status === "approved") {
    return <IconR width={20} height={20} color="#35C759" />;
  }

  // Pending: si el nodo origen está done, mostrar spinner. Si no, R rojo estático.
  const isActive = nodeStatus === "done";

  if (!isActive) {
    return <IconR width={20} height={20} color="#FF5C60" />;
  }

  return (
    <div className="relative h-[20px] w-[20px]">
      <div className="absolute inset-0 rounded-full bg-[#FF5C60]" />
      <svg
        className="absolute inset-0 gate-spinner"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="10"
          cy="10"
          r="4.5"
          stroke="#FAF9F5"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="20 50"
        />
      </svg>
    </div>
  );
}
