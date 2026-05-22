import { type ReactNode } from "react";

type RowCardProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
};

export function RowCard({ children, onClick, className = "" }: RowCardProps) {
  const isClickable = typeof onClick === "function";

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg border border-admin-ink px-3 py-2 ${isClickable ? "cursor-pointer transition-colors hover:bg-[#F0EDE6]" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
