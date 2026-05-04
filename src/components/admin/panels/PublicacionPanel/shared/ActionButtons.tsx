import type { ReactNode } from "react";
import { IconBajar, IconCopiar, IconEditar } from "@/components/admin/icons";

export function ActionButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex h-[22px] cursor-pointer items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-2.5 font-ui text-xs font-medium text-admin-ink"
    >
      {children}
    </button>
  );
}

export function EditButton() {
  return (
    <ActionButton>
      <IconEditar width={12} height={12} />
      Editar
    </ActionButton>
  );
}

export function CopyButton() {
  return (
    <ActionButton>
      <IconCopiar width={12} height={12} />
      Copiar
    </ActionButton>
  );
}

export function DownloadButton() {
  return (
    <ActionButton>
      <IconBajar width={12} height={12} />
      Descargar
    </ActionButton>
  );
}
