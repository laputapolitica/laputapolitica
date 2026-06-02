"use client";

import { type CSSProperties, type ReactNode } from "react";

type RowCardButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  borderColor?: string;
  textColor?: string;
  className?: string;
};

export function RowCardButton({
  children,
  onClick,
  disabled = false,
  borderColor,
  textColor,
  className = "",
}: RowCardButtonProps) {
  const style: CSSProperties = {};
  if (borderColor) style.borderColor = borderColor;
  if (textColor) style.color = textColor;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={`inline-flex h-[20px] cursor-pointer items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-2 font-ui text-xs font-medium whitespace-nowrap text-admin-ink ${disabled ? "cursor-not-allowed opacity-30" : ""} ${className}`}
    >
      {children}
    </button>
  );
}
