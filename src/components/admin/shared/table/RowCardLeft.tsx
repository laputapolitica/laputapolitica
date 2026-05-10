"use client";

import { type ReactNode } from "react";

type RowCardLeftProps = {
  children: ReactNode;
  className?: string;
};

export function RowCardLeft({ children, className = "" }: RowCardLeftProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {children}
    </div>
  );
}
