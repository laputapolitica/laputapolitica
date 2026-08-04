"use client";

import { useEffect, useState } from "react";
import {
  getUsuarios,
  cambiarRolUsuario,
  eliminarUsuario,
  invitarUsuario,
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
  const [isInviting, setIsInviting] = useState(false);
  const [credenciales, setCredenciales] = useState<{ email: string; password: string } | null>(null);

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

  async function handleInvitar() {
    setError(undefined);
    setIsInviting(true);
    const res = await invitarUsuario(nombre, email, rol as RolAdmin);
    if (res.success && res.email && res.passwordTemporal) {
      setCredenciales({ email: res.email, password: res.passwordTemporal });
      setNombre("");
      setEmail("");
      setRol("");
      await recargar();
    } else {
      setError(res.error ?? "No se pudo invitar.");
    }
    setIsInviting(false);
  }

  const isReady =
    nombre.trim() !== "" && email.trim() !== "" && rol !== "";

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
                variant={isReady && !isInviting ? "primary" : "default"}
                style={!isReady || isInviting ? { backgroundColor: "transparent" } : undefined}
                className={`!text-xs !px-4 ${isReady && !isInviting ? "!font-bold" : ""}`}
                onClick={isReady && !isInviting ? handleInvitar : undefined}
              >
                {isInviting ? "Enviando..." : "Enviar invitación"}
              </AdminButton>
            </div>
          </div>

          {error ? (
            <p className="mt-2 font-ui text-sm text-state-required">{error}</p>
          ) : null}
        </HeaderPanel>
      }
      content={
        <div className="space-y-3">
          {credenciales ? (
            <div className="space-y-2 rounded-[4px] border border-admin-ink bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="font-ui text-sm font-medium text-admin-ink">
                  Usuario creado. Pasale estos datos; la contraseña no se vuelve a mostrar.
                </p>
                <AdminButton size="sm" onClick={() => setCredenciales(null)}>
                  Listo
                </AdminButton>
              </div>
              <p className="font-ui text-sm text-admin-ink">
                <strong>Email:</strong> {credenciales.email}
              </p>
              <p className="font-ui text-sm text-admin-ink">
                <strong>Contraseña temporal:</strong>{" "}
                <span className="font-mono">{credenciales.password}</span>
              </p>
            </div>
          ) : null}

          <UsuariosList
            usuarios={usuarios}
            onCambiarRol={handleCambiarRol}
            onEliminar={handleEliminar}
          />
        </div>
      }
    />
  );
}
