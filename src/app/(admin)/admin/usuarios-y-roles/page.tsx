"use client";

import { useState } from "react";
import { mockUsuarios } from "@/lib/mock-usuarios";
import type { Usuario } from "@/lib/mock-usuarios";

function getRolPill(rol: Usuario["rol"]) {
  if (rol === "Admin") {
    return (
      <div className="inline-flex h-[24px] items-center rounded-[3.5px] bg-admin-ink px-2">
        <span className="font-ui text-xs font-semibold text-white">ADMIN</span>
      </div>
    );
  }
  return (
    <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
      <span className="font-ui text-xs font-medium text-admin-ink">{rol}</span>
    </div>
  );
}

export default function AdminUsuariosYRolesPage() {
  const [usuarios] = useState<Usuario[]>(mockUsuarios);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto">

      {/* Sección 1: Formulario de invitación */}
      <div className="shrink-0 rounded-lg border border-admin-ink px-3 py-2">
        <div className="flex items-end gap-3">
          {/* Nombre completo */}
          <div className="flex flex-col gap-1.5">
            <div className="inline-flex h-[24px] w-fit items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium text-admin-ink">Nombre completo</span>
            </div>
            <input
              type="text"
              placeholder="Juan Perez"
              className="h-[32px] w-[180px] rounded-[4px] border border-admin-ink bg-white px-2 font-ui text-xs text-admin-ink placeholder:text-[#9A968D] outline-none"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <div className="inline-flex h-[24px] w-fit items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium text-admin-ink">Email</span>
            </div>
            <input
              type="email"
              placeholder="tu@email.com"
              className="h-[32px] w-[220px] rounded-[4px] border border-admin-ink bg-white px-2 font-ui text-xs text-admin-ink placeholder:text-[#9A968D] outline-none"
            />
          </div>

          {/* Rol */}
          <div className="flex flex-col gap-1.5">
            <div className="inline-flex h-[24px] w-fit items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium text-admin-ink">Rol</span>
            </div>
            <select className="h-[32px] w-[140px] rounded-[4px] border border-admin-ink bg-white px-2 font-ui text-xs text-admin-ink outline-none cursor-pointer appearance-none">
              <option>Editor</option>
              <option>Director</option>
              <option>Admin</option>
            </select>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Botones */}
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              className="inline-flex h-[24px] cursor-pointer items-center rounded-[3.5px] border border-admin-ink bg-white px-2 font-ui text-xs font-medium text-admin-ink"
            >
              Invitar usuario
            </button>
            <button
              type="button"
              className="inline-flex h-[24px] cursor-pointer items-center rounded-[3.5px] border border-admin-ink bg-white px-2 font-ui text-xs font-medium text-admin-ink"
            >
              Enviar invitación
            </button>
          </div>
        </div>
      </div>

      {/* Sección 2: Lista de usuarios */}
      <div className="flex flex-col gap-3">
        {usuarios.map((usuario) => {
          const esAdmin = usuario.rol === "Admin";
          return (
            <div
              key={usuario.id}
              className="flex items-center gap-2 rounded-lg border border-admin-ink px-3 py-2"
            >
              {/* Nombre */}
              <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
                <span className="font-ui text-xs font-medium text-admin-ink whitespace-nowrap">{usuario.nombre}</span>
              </div>

              {/* Email */}
              <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
                <span className="font-ui text-xs font-medium text-admin-ink whitespace-nowrap">{usuario.email}</span>
              </div>

              {/* Fecha */}
              <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
                <span className="font-ui text-xs font-medium text-admin-ink whitespace-nowrap">Desde {usuario.fechaDesde}</span>
              </div>

              {/* Rol */}
              {getRolPill(usuario.rol)}

              {/* Spacer */}
              <div className="flex-1" />

              {/* Acciones */}
              <button
                type="button"
                disabled={esAdmin}
                className={`inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2 font-ui text-xs font-medium text-admin-ink ${esAdmin ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
              >
                Cambiar rol
              </button>
              <button
                type="button"
                disabled={esAdmin}
                className={`inline-flex h-[24px] items-center rounded-[3.5px] border bg-white px-2 font-ui text-xs font-medium ${esAdmin ? "border-admin-ink text-admin-ink opacity-30 cursor-not-allowed" : "border-[#E85A4F] text-[#E85A4F] cursor-pointer"}`}
              >
                Eliminar
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
