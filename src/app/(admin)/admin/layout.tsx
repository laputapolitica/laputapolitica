"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { AdminHeader, AdminShell } from "@/components/admin";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return (
      <>
        <AdminHeader />
        {children}
      </>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
