"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Edicion del dia" },
  { href: "/admin/ediciones", label: "Lista de ediciones" },
  { href: "/admin/opinadores", label: "Opinadores" },
  { href: "/admin/metricas", label: "Métricas" },
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
  const searchParams = useSearchParams();

  function updateAdminQuery(key: "panel" | "scenario", value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    const query = params.toString();
    router.push(query ? `/admin?${query}` : "/admin");
  }

  return (
    <aside className="h-full w-[180px] bg-bg-base">
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
                    "flex h-8 w-[180px] cursor-pointer items-center rounded-md border pl-3 text-left font-ui text-sm",
                    isActive
                      ? "border-admin-ink bg-admin-ink font-medium text-bg-base"
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
                  "flex h-8 w-[180px] items-center rounded-md border pl-3 text-left font-ui text-sm",
                  isActive
                    ? "border-admin-ink bg-admin-ink font-medium text-bg-base"
                    : "border-admin-ink bg-white font-medium text-admin-ink",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {pathname === "/admin" && (
          <div className="mt-2 flex flex-col gap-3">
            <span className="font-ui text-[10px] font-medium text-text-secondary uppercase tracking-wider px-1">
              Dev — Escenario
            </span>
            <select
              className="h-9 w-[180px] rounded-lg border border-admin-ink bg-white px-2 font-ui text-xs text-admin-ink cursor-pointer outline-none"
              value={searchParams.get("scenario") ?? ""}
              onChange={(event) => updateAdminQuery("scenario", event.target.value)}
            >
              <option value="">Auto (mock state)</option>
              <option value="inicio">Inicio: Relevamiento running</option>
              <option value="revision-relevamiento">
                Revisión de Relevamiento
              </option>
              <option value="titulos-running">
                Títulos y Resúmenes running
              </option>
              <option value="revision-titulos">Revisión de Títulos</option>
              <option value="paralelo-portada-opinion">
                Portada + Ventana de Opinión (paralelo)
              </option>
              <option value="revision-portada">
                Revisión de Portada + Ventana running
              </option>
              <option value="elpulso-running">El Pulso running</option>
              <option value="paralelo-canales">
                Web + Instagram + Twitter (paralelo)
              </option>
              <option value="publicacion">Publicación running</option>
              <option value="publicado">
                ✓ Publicado (esperando próxima edición)
              </option>
            </select>

            <span className="font-ui text-[10px] font-medium text-text-secondary uppercase tracking-wider px-1">
              Dev — Panel activo
            </span>
            <select
              className="h-9 w-[180px] rounded-lg border border-admin-ink bg-white px-2 font-ui text-xs text-admin-ink cursor-pointer outline-none"
              value={searchParams.get("panel") ?? ""}
              onChange={(event) => updateAdminQuery("panel", event.target.value)}
            >
              <option value="">Auto</option>
              <option value="relevamiento">Relevamiento</option>
              <option value="titulosResumenes">Títulos y Resúmenes</option>
              <option value="portada">Portada</option>
              <option value="ventanaOpinion">Ventana de Opinión</option>
              <option value="elPulso">El Pulso</option>
              <option value="web">Web (Publicación)</option>
              <option value="instagram">Instagram (Publicación)</option>
              <option value="twitter">Twitter (Publicación)</option>
              <option value="publicacion">Publicación</option>
            </select>
          </div>
        )}

        <button
          type="button"
          onClick={() => router.push("/admin/login")}
          className="flex h-8 w-[180px] items-center rounded-md border border-[#C4342D] bg-white pl-3 text-left font-ui text-sm font-medium text-[#C4342D] cursor-pointer"
        >
          Cerrar Sesion
        </button>
      </nav>
    </aside>
  );
}
