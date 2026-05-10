"use client";

import { type ReactNode } from "react";

type RowCardHeaderCellProps = {
  children: ReactNode;
  className?: string;
};

export function RowCardHeaderCell({ children, className = "" }: RowCardHeaderCellProps) {
  return (
    <span className={`font-ui text-xs font-semibold tracking-wider text-text-secondary uppercase ${className}`}>
      {children}
    </span>
  );
}
