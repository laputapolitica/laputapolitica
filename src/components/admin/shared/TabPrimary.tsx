import type { ReactNode } from "react";

type TabPrimaryProps = {
  children: ReactNode;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
};

export function TabPrimary({
  children,
  isActive,
  onClick,
  disabled = false,
}: TabPrimaryProps) {
  const statusClass = isActive
    ? "border-2 border-admin-ink font-semibold text-admin-ink"
    : "border-2 border-[#CFCBC4] font-medium text-[#CFCBC4]";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-[28px] cursor-pointer items-center gap-1.5 rounded-[4px] bg-white px-2 font-ui text-sm ${statusClass} ${disabled ? "cursor-not-allowed opacity-30" : ""}`}
    >
      {children}
    </button>
  );
}
