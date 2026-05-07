import { type ReactNode } from "react";

type IconButtonProps = {
  children: ReactNode;
  variant?: "default" | "danger";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
};

export function IconButton({
  children,
  variant = "default",
  onClick,
  disabled = false,
  className = "",
  type = "button",
}: IconButtonProps) {
  const variantClasses = {
    default: "border-admin-ink text-admin-ink",
    danger: "border-[#E85A4F] text-[#E85A4F]",
  }[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-[24px] cursor-pointer items-center gap-1.5 rounded-[3.5px] border bg-white px-2 font-ui text-xs font-medium ${variantClasses} ${disabled ? "cursor-not-allowed opacity-30" : ""} ${className}`}
    >
      {children}
    </button>
  );
}
