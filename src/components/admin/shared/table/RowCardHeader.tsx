"use client";

import { type ReactNode } from "react";

type RowCardHeaderProps = {
  children: ReactNode;
  className?: string;
};

export function RowCardHeader({ children, className = "" }: RowCardHeaderProps) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 font-ui text-xs font-semibold tracking-wider text-text-secondary uppercase ${className}`}>
      {children}
    </div>
  );
}
