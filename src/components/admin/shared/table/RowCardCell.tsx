"use client";

import { type ReactNode } from "react";

type RowCardCellProps = {
  children: ReactNode;
  className?: string;
};

export function RowCardCell({ children, className = "" }: RowCardCellProps) {
  return (
    <div
      className={`inline-flex h-[20px] items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-2 font-ui text-xs font-medium whitespace-nowrap text-admin-ink ${className}`}
    >
      {children}
    </div>
  );
}
