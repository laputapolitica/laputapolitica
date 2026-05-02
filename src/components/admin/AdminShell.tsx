import type { ReactNode } from "react";

import { AdminSidebar } from "./AdminSidebar";

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="h-screen overflow-hidden bg-bg-base pt-16">
      <div className="h-[calc(100vh-64px)] px-5 pb-5">
        <div className="grid h-full grid-cols-[220px_1fr] gap-6">
          <AdminSidebar />
          <main className="flex h-full min-h-0 flex-col">{children}</main>
        </div>
      </div>
    </div>
  );
}
