"use client";

import { type ReactNode } from "react";

type RowCardRightProps = {
  children: ReactNode;
  className?: string;
};

export function RowCardRight({ children, className = "" }: RowCardRightProps) {
  return (
    <div className={`ml-auto flex items-center gap-2 ${className}`}>
      {children}
    </div>
  );
}
