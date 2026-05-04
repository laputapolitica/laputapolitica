import type { ReactNode } from "react";

export function TabButton({
  children,
  isActive,
  onClick,
  size = "default",
}: {
  children: ReactNode;
  isActive: boolean;
  onClick: () => void;
  size?: "default" | "small";
}) {
  const statusClass = isActive
    ? size === "small"
      ? "border border-admin-ink font-semibold text-admin-ink"
      : "border-2 border-admin-ink font-semibold text-admin-ink"
    : size === "small"
      ? "border border-[#CFCBC4] font-medium text-[#CFCBC4]"
      : "border-2 border-[#CFCBC4] font-medium text-[#CFCBC4]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex cursor-pointer items-center gap-1.5 rounded-[4px] border bg-white font-ui",
        size === "small" ? "h-[24px] px-2 text-xs" : "h-[28px] px-3 text-sm",
        statusClass,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
