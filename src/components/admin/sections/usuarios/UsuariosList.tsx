"use client";

import {
  AdminButton,
  RowCard,
  RowCardCell,
  RowCardLeft,
  RowCardList,
  RowCardRight,
} from "@/components/admin/shared";
import type { Usuario } from "@/lib/mock-usuarios";

type UsuariosListProps = {
  usuarios: Usuario[];
  onCambiarRol?: (usuario: Usuario) => void;
  onEliminar?: (usuario: Usuario) => void;
};

export function UsuariosList({ usuarios, onCambiarRol, onEliminar }: UsuariosListProps) {
  return (
    <RowCardList>
      {usuarios.map((usuario) => {
        const esAdmin = usuario.rol === "Admin";
        return (
          <RowCard key={usuario.id}>
            <RowCardLeft>
              <RowCardCell>{usuario.nombre}</RowCardCell>
              <RowCardCell>{usuario.email}</RowCardCell>
              <RowCardCell>Desde {usuario.fechaDesde}</RowCardCell>
              <RowCardCell>{esAdmin ? "ADMIN" : usuario.rol}</RowCardCell>
            </RowCardLeft>
            <RowCardRight>
              <AdminButton disabled={esAdmin} onClick={() => onCambiarRol?.(usuario)}>
                Cambiar rol
              </AdminButton>
              <AdminButton
                variant={esAdmin ? "default" : "danger"}
                disabled={esAdmin}
                onClick={() => onEliminar?.(usuario)}
              >
                Eliminar
              </AdminButton>
            </RowCardRight>
          </RowCard>
        );
      })}
    </RowCardList>
  );
}
