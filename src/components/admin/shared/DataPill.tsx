import { type ReactNode } from "react";

type DataPillProps = {
  children: ReactNode;
  variant?: "outline" | "filled" | "danger";
  size?: "sm" | "lg";
  className?: string;
};

export function DataPill({
  children,
  variant = "outline",
  size = "sm",
  className = "",
}: DataPillProps) {
  const height = size === "lg" ? "h-[28px]" : "h-[24px]";
  const text = size === "lg" ? "text-sm" : "text-xs";

  const variantClasses = {
    outline: "border border-admin-ink bg-white text-admin-ink",
    filled: "bg-admin-ink text-white border border-admin-ink",
    danger: "border border-[#E85A4F] bg-white text-[#E85A4F]",
  }[variant];

  return (
    <div
      className={`inline-flex ${height} items-center rounded-[3.5px] px-2 ${variantClasses} ${className}`}
    >
      <span className={`font-ui ${text} font-medium whitespace-nowrap`}>
        {children}
      </span>
    </div>
  );
}
