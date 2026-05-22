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
      className={`flex items-center gap-2 rounded-[6px] border border-admin-ink px-2 py-1.5 ${isClickable ? "cursor-pointer transition-colors hover:bg-[#F0EDE6]" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
