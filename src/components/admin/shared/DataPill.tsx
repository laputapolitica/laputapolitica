import { type CSSProperties, type ReactNode } from "react";

type DataPillProps = {
  children: ReactNode;
  variant?: "default" | "subtle";
  className?: string;
  style?: CSSProperties;
};

export function DataPill({
  children,
  variant = "default",
  className = "",
  style,
}: DataPillProps) {
  const variantClasses = {
    default: "border border-admin-ink bg-white text-admin-ink",
    subtle: "border border-admin-ink bg-transparent text-admin-ink",
  }[variant];

  return (
    <div
      className={`inline-flex h-[20px] items-center gap-1.5 rounded-[3.5px] px-2 font-ui text-xs font-medium whitespace-nowrap ${variantClasses} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
