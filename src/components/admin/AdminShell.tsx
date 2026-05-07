import type { ReactNode } from "react";

import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="flex h-screen flex-col bg-bg-base">
      <AdminHeader />
      <div className="flex flex-1 min-h-0 gap-6 px-5 pb-5">
        <AdminSidebar />
        <main className="flex flex-1 min-h-0 flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
