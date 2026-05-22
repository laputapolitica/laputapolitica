import { type ReactNode } from "react";

type AdminButtonProps = {
  children: ReactNode;
  variant?: "default" | "danger" | "primary";
  size?: "sm" | "md";
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
};

export function AdminButton({
  children,
  variant = "default",
  size = "sm",
  disabled = false,
  onClick,
  type = "button",
  className = "",
}: AdminButtonProps) {
  const height = size === "md" ? "h-[32px]" : "h-[24px]";
  const text = size === "md" ? "text-sm" : "text-xs";

  const variantClasses = {
    default: "border border-admin-ink bg-white text-admin-ink",
    danger: "border border-[#E85A4F] bg-white text-[#E85A4F]",
    primary: "border border-admin-ink bg-admin-ink text-white",
  }[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex ${height} cursor-pointer items-center rounded-[3.5px] px-2 font-ui ${text} font-medium ${variantClasses} ${disabled ? "cursor-not-allowed opacity-30" : ""} ${className}`}
    >
      {children}
    </button>
  );
}
