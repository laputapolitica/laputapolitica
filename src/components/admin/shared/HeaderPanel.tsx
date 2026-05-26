"use client";

import { type ReactNode } from "react";

type HeaderPanelProps = {
  children: ReactNode;
  className?: string;
};

export function HeaderPanel({ children, className = "" }: HeaderPanelProps) {
  return (
    <div
      className={`w-full rounded-lg border-2 border-admin-ink bg-bg-base px-3 py-2 space-y-2 ${className}`}
    >
      {children}
    </div>
  );
}
