"use client";

import { type ReactNode } from "react";

type RowCardListProps = {
  children: ReactNode;
  className?: string;
};

export function RowCardList({ children, className = "" }: RowCardListProps) {
  return (
    <div className={`flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto ${className}`}>
      {children}
    </div>
  );
}
