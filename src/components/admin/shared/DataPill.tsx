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
      className={`inline-flex h-[20px] items-center rounded-[3.5px] px-2 ${variantClasses} ${className}`}
      style={style}
    >
      <span className="font-ui text-xs font-medium whitespace-nowrap">
        {children}
      </span>
    </div>
  );
}
