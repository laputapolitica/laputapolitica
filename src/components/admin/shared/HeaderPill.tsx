"use client";

import { type ReactNode } from "react";

type HeaderPillProps = {
  children: ReactNode;
  className?: string;
};

export function HeaderPill({ children, className = "" }: HeaderPillProps) {
  return (
    <div
      className={`inline-flex h-[24px] items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-2 font-ui text-xs font-medium text-admin-ink whitespace-nowrap ${className}`}
    >
      {children}
    </div>
  );
}
