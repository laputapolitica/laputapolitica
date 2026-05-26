"use client";

import { type ReactNode } from "react";

type TitlePillProps = {
  children: ReactNode;
  onClick?: () => void;
  borderColor?: string;
  className?: string;
};

export function TitlePill({
  children,
  onClick,
  borderColor,
  className = "",
}: TitlePillProps) {
  const sharedClasses = `inline-flex h-[28px] items-center gap-1.5 rounded-[4px] border-2 border-admin-ink bg-white px-2 font-ui text-sm font-semibold text-admin-ink whitespace-nowrap`;
  const style = borderColor ? { borderColor } : undefined;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        style={style}
        className={`${sharedClasses} cursor-pointer ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <div style={style} className={`${sharedClasses} ${className}`}>
      {children}
    </div>
  );
}
