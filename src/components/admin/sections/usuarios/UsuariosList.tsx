"use client";

import { useState } from "react";
import {
  RowCard,
  RowCardButton,
  RowCardCell,
  RowCardLeft,
  RowCardList,
  RowCardRight,
  RowCardSelect,
} from "@/components/admin/shared";
import type { Usuario } from "@/types/admin";

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
  const [confirmId, setConfirmId] = useState<string | null>(null);

  return (
    <RowCardList>
      {usuarios.map((usuario) => {
        const esAdmin = usuario.rol === "Admin";
        const confirmando = confirmId === usuario.id;
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
              {confirmando ? (
                <>
                  <RowCardButton onClick={() => setConfirmId(null)}>
                    Cancelar
                  </RowCardButton>
                  <RowCardButton
                    borderColor="#FF5C60"
                    onClick={() => {
                      setConfirmId(null);
                      onEliminar?.(usuario);
                    }}
                  >
                    Confirmar
                  </RowCardButton>
                </>
              ) : (
                <RowCardButton
                  borderColor="#FF5C60"
                  disabled={esAdmin}
                  onClick={() => setConfirmId(usuario.id)}
                >
                  Eliminar
                </RowCardButton>
              )}
            </RowCardRight>
          </RowCard>
        );
      })}
    </RowCardList>
  );
}
