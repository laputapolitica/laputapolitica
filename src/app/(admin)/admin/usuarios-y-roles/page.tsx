"use client";

import { useState } from "react";
import { mockUsuarios } from "@/lib/mock-usuarios";
import {
  AdminButton,
  AdminInput,
  AdminSelect,
  DataPill,
  HeaderPanel,
  PanelLayout,
} from "@/components/admin/shared";
import { UsuariosList } from "@/components/admin/sections/usuarios";
import type { Usuario } from "@/lib/mock-usuarios";

export default function AdminUsuariosYRolesPage() {
  const [usuarios] = useState<Usuario[]>(mockUsuarios);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("");

  // El botón "Enviar invitación" se habilita solo si los 3 campos están llenos
  const isReady = nombre.trim() !== "" && email.trim() !== "" && rol !== "";

  return (
    <PanelLayout
      header={
        <HeaderPanel>
          <div className="flex items-end gap-3">
            {/* Col 1: Nombre completo */}
            <div className="flex flex-col gap-1.5">
              <DataPill variant="subtle" className="w-fit">Nombre completo</DataPill>
              <AdminInput
                value={nombre}
                onChange={setNombre}
                placeholder="Juan Perez"
                className="w-[180px]"
              />
            </div>

            {/* Col 2: Email */}
            <div className="flex flex-col gap-1.5">
              <DataPill variant="subtle" className="w-fit">Email</DataPill>
              <AdminInput
                value={email}
                onChange={setEmail}
                type="email"
                placeholder="tu@email.com"
                className="w-[220px]"
              />
            </div>

            {/* Col 3: Rol */}
            <div className="flex flex-col gap-1.5">
              <DataPill variant="subtle" className="w-fit">Rol</DataPill>
              <AdminSelect
                value={rol}
                onChange={setRol}
                placeholder="Seleccionar"
                options={[
                  { value: "Editor", label: "Editor" },
                  { value: "Director", label: "Director" },
                  { value: "Admin", label: "Admin" },
                ]}
                className="w-[140px]"
              />
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Col 4: Invitar usuario */}
            <div className="flex flex-col items-end gap-1.5">
              <DataPill variant="subtle" className="w-fit">Invitar usuario</DataPill>
              <AdminButton
                size="md"
                variant={isReady ? "primary" : "default"}
                style={!isReady ? { backgroundColor: "transparent" } : undefined}
                className={`!text-xs !px-4 ${isReady ? "!font-bold" : ""}`}
              >
                Enviar invitación
              </AdminButton>
            </div>
          </div>
        </HeaderPanel>
      }
      content={<UsuariosList usuarios={usuarios} />}
    />
  );
}
