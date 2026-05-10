"use client";

import { type ReactNode } from "react";
import { SectionPanel } from "../SectionPanel";

type RowCardListHeaderProps = {
  children: ReactNode;
  className?: string;
};

export function RowCardListHeader({ children, className = "" }: RowCardListHeaderProps) {
  return (
    <SectionPanel className={`shrink-0 flex items-center justify-between ${className}`}>
      {children}
    </SectionPanel>
  );
}
