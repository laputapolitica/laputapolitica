import type { ReactNode } from "react";

import { AdminSidebar } from "./AdminSidebar";

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-bg-base">
      <AdminSidebar />
      <main className="ml-[248px] min-h-screen pr-12 pt-16">{children}</main>
    </div>
  );
}
