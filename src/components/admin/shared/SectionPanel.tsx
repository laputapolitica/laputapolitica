import { type ReactNode } from "react";

type SectionPanelProps = {
  children: ReactNode;
  thick?: boolean;
  className?: string;
};

export function SectionPanel({
  children,
  thick = true,
  className = "",
}: SectionPanelProps) {
  const border = thick ? "border-2" : "border";

  return (
    <div
      className={`rounded-lg ${border} border-admin-ink bg-bg-base px-3 py-2 ${className}`}
    >
      {children}
    </div>
  );
}
