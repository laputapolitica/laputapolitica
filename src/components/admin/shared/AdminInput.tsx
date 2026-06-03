"use client";

import { type ChangeEvent } from "react";

// Clases visuales compartidas del input admin. Se exporta para reutilizar el
// mismo look en otros inputs (ej. el Input de shadcn en el login de admin).
// No incluye ancho: el consumer define w-full o w-[...] según necesite.
export const adminInputClasses =
  "h-[32px] rounded-[4px] border border-admin-ink bg-white px-2 font-ui text-xs text-admin-ink placeholder:text-[#9A968D] outline-none";

type AdminInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "password";
  disabled?: boolean;
  className?: string;
};

export function AdminInput({
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  className = "",
}: AdminInputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`${adminInputClasses} ${disabled ? "cursor-not-allowed opacity-50" : ""} ${className}`}
    />
  );
}
