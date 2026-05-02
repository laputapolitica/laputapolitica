"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Edicion del dia" },
  { href: "/admin/ediciones", label: "Lista de ediciones" },
  { href: "/admin/opinadores", label: "Opinadores" },
  { href: "/admin/metricas", label: "Metricas" },
  { href: "/admin/usuarios-y-roles", label: "Usuarios y roles" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-[200px] bg-bg-base pl-12">
      <nav className="flex h-full flex-col pt-12">
        <div className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "block border px-4 py-3 font-ui text-base",
                  isActive
                    ? "border-admin-ink bg-admin-ink text-bg-base"
                    : "border-border-default text-text-primary",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => router.push("/admin/login")}
          className="absolute bottom-12 left-12 w-[152px] border border-state-required px-4 py-3 text-left font-ui text-base text-state-required"
        >
          Cerrar Sesion
        </button>
      </nav>
    </aside>
  );
}
