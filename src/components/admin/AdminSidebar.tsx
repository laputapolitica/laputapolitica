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
    <aside className="h-full w-[220px] bg-bg-base">
      <nav className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = isActivePath(pathname, item.href);

            if (item.href === "/admin/opinadores") {
              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => router.push(`/admin/opinadores?t=${Date.now()}`)}
                  className={[
                    "flex h-10 w-[220px] cursor-pointer items-center rounded-lg border pl-3 text-left font-ui text-base",
                    isActive
                      ? "border-admin-ink bg-admin-ink font-semibold text-bg-base"
                      : "border-admin-ink bg-white font-medium text-admin-ink",
                  ].join(" ")}
                >
                  {item.label}
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex h-10 w-[220px] items-center rounded-lg border pl-3 text-left font-ui text-base",
                  isActive
                    ? "border-admin-ink bg-admin-ink font-semibold text-bg-base"
                    : "border-admin-ink bg-white font-medium text-admin-ink",
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
          className="flex h-10 w-[220px] items-center rounded-lg border-2 border-[#C4342D] bg-white pl-3 text-left font-ui text-base font-semibold text-[#C4342D] cursor-pointer"
        >
          Cerrar Sesion
        </button>
      </nav>
    </aside>
  );
}
