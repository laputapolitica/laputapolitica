import type { ReactNode } from "react";

type TabSecondaryProps = {
  children: ReactNode;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
};

export function TabSecondary({
  children,
  isActive,
  onClick,
  disabled = false,
}: TabSecondaryProps) {
  const statusClass = isActive
    ? "border border-admin-ink font-semibold text-admin-ink"
    : "border border-[#CFCBC4] font-medium text-[#CFCBC4]";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-[24px] cursor-pointer items-center gap-1.5 rounded-[4px] bg-white px-2 font-ui text-xs ${statusClass} ${disabled ? "cursor-not-allowed opacity-30" : ""}`}
    >
      {children}
    </button>
  );
}
