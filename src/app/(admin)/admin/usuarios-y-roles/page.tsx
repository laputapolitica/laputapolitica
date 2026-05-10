"use client";

import { useState } from "react";
import { mockUsuarios } from "@/lib/mock-usuarios";
import {
  DataPill,
  AdminButton,
  SectionPanel,
} from "@/components/admin/shared";
import { UsuariosList } from "@/components/admin/sections/usuarios";
import type { Usuario } from "@/lib/mock-usuarios";

export default function AdminUsuariosYRolesPage() {
  const [usuarios] = useState<Usuario[]>(mockUsuarios);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto">

      {/* Sección 1: Formulario de invitación */}
      <SectionPanel className="shrink-0">
        <div className="flex items-end gap-3">
          {/* Nombre completo */}
          <div className="flex flex-col gap-1.5">
            <DataPill className="w-fit">Nombre completo</DataPill>
            <input
              type="text"
              placeholder="Juan Perez"
              className="h-[32px] w-[180px] rounded-[4px] border border-admin-ink bg-white px-2 font-ui text-xs text-admin-ink placeholder:text-[#9A968D] outline-none"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <DataPill className="w-fit">Email</DataPill>
            <input
              type="email"
              placeholder="tu@email.com"
              className="h-[32px] w-[220px] rounded-[4px] border border-admin-ink bg-white px-2 font-ui text-xs text-admin-ink placeholder:text-[#9A968D] outline-none"
            />
          </div>

          {/* Rol */}
          <div className="flex flex-col gap-1.5">
            <DataPill className="w-fit">Rol</DataPill>
            <select className="h-[32px] w-[140px] rounded-[4px] border border-admin-ink bg-white px-2 font-ui text-xs text-admin-ink outline-none cursor-pointer">
              <option>Editor</option>
              <option>Director</option>
              <option>Admin</option>
            </select>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Botones */}
          <div className="flex flex-col gap-1.5">
            <AdminButton>
              Invitar usuario
            </AdminButton>
            <AdminButton>
              Enviar invitación
            </AdminButton>
          </div>
        </div>
      </SectionPanel>

      {/* Sección 2: Lista de usuarios */}
      <UsuariosList usuarios={usuarios} />
    </div>
  );
}
