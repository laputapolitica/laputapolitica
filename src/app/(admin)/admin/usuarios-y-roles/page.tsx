"use client";

import { useEffect, useState } from "react";
import {
  getUsuarios,
  cambiarRolUsuario,
  eliminarUsuario,
} from "./actions";
import {
  AdminButton,
  AdminInput,
  AdminSelect,
  DataPill,
  HeaderPanel,
  PanelLayout,
} from "@/components/admin/shared";
import { UsuariosList } from "@/components/admin/sections/usuarios";
import type { Usuario, RolAdmin } from "@/types/admin";

export default function AdminUsuariosYRolesPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("");
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    getUsuarios().then(setUsuarios);
  }, []);

  async function recargar() {
    setUsuarios(await getUsuarios());
  }

  async function handleCambiarRol(usuario: Usuario, nuevoRol: string) {
    setError(undefined);
    const res = await cambiarRolUsuario(usuario.id, nuevoRol as RolAdmin);
    if (res.success) {
      await recargar();
    } else {
      setError(res.error);
    }
  }

  async function handleEliminar(usuario: Usuario) {
    setError(undefined);
    const res = await eliminarUsuario(usuario.id);
    if (res.success) {
      await recargar();
    } else {
      setError(res.error);
    }
  }

  // El botón "Enviar invitación" se habilita solo si los 3 campos están llenos.
  // (La invitación en sí se implementa en un prompt aparte; hoy el botón queda inerte.)
  const isReady = nombre.trim() !== "" && email.trim() !== "" && rol !== "";

  return (
    <PanelLayout
      header={
        <HeaderPanel>
          <div className="flex items-end gap-3">
            <div className="flex flex-col gap-1.5">
              <DataPill variant="subtle" className="w-fit">Nombre completo</DataPill>
              <AdminInput value={nombre} onChange={setNombre} placeholder="Juan Perez" className="w-[180px]" />
            </div>

            <div className="flex flex-col gap-1.5">
              <DataPill variant="subtle" className="w-fit">Email</DataPill>
              <AdminInput value={email} onChange={setEmail} type="email" placeholder="tu@email.com" className="w-[220px]" />
            </div>

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

            <div className="flex-1" />

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

          {error ? (
            <p className="mt-2 font-ui text-sm text-state-required">{error}</p>
          ) : null}
        </HeaderPanel>
      }
      content={
        <UsuariosList
          usuarios={usuarios}
          onCambiarRol={handleCambiarRol}
          onEliminar={handleEliminar}
        />
      }
    />
  );
}
