import type { NodeStatus } from "@/components/admin/PipelineDiagram";

const STATUS_COLORS: Record<NodeStatus, string> = {
  pending: "#D9D9D9",
  running: "#FAC800",
  done: "#35C759",
};

type PipelineNodeProps = {
  label: string;
  status: NodeStatus;
};

export function PipelineNode({ label, status }: PipelineNodeProps) {
  return (
    <div className="inline-flex h-[24px] items-center gap-2 rounded-[3.5px] border border-admin-ink bg-white px-1.5">
      <span className="font-ui text-[11px] font-medium leading-none text-admin-ink whitespace-nowrap">
        {label}
      </span>
      <span
        className={`h-[8px] w-[8px] shrink-0 rounded-full ${status === "running" ? "animate-pulse" : ""}`}
        style={{ backgroundColor: STATUS_COLORS[status] }}
      />
    </div>
  );
}
