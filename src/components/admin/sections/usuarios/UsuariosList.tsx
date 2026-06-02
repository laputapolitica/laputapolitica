"use client";

import {
  RowCard,
  RowCardButton,
  RowCardCell,
  RowCardLeft,
  RowCardList,
  RowCardRight,
  RowCardSelect,
} from "@/components/admin/shared";
import type { Usuario } from "@/lib/mock-usuarios";

type UsuariosListProps = {
  usuarios: Usuario[];
  onCambiarRol?: (usuario: Usuario, nuevoRol: string) => void;
  onEliminar?: (usuario: Usuario) => void;
};

const ROLES = [
  { value: "Editor", label: "Editor" },
  { value: "Director", label: "Director" },
  { value: "Admin", label: "Admin" },
];

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
              <RowCardCell>{usuario.rol}</RowCardCell>
            </RowCardLeft>
            <RowCardRight>
              <RowCardSelect
                value={usuario.rol}
                onChange={(nuevoRol) => onCambiarRol?.(usuario, nuevoRol)}
                options={ROLES}
                disabled={esAdmin}
              />
              <RowCardButton
                borderColor="#FF5C60"
                disabled={esAdmin}
                onClick={() => onEliminar?.(usuario)}
              >
                Eliminar
              </RowCardButton>
            </RowCardRight>
          </RowCard>
        );
      })}
    </RowCardList>
  );
}
