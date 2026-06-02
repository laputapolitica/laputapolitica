"use client";

import { type ChangeEvent } from "react";
import { IconSelector } from "@/components/admin/icons";

type AdminSelectOption = {
  value: string;
  label: string;
};

type AdminSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: AdminSelectOption[];
  placeholder?: string;
  size?: "sm" | "md";
  disabled?: boolean;
  className?: string;
};

export function AdminSelect({
  value,
  onChange,
  options,
  placeholder,
  size = "md",
  disabled = false,
  className = "",
}: AdminSelectProps) {
  const height = size === "sm" ? "h-[24px]" : "h-[32px]";

  return (
    <div className={`relative inline-flex ${className}`}>
      <select
        value={value}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        disabled={disabled}
        className={`${height} w-full cursor-pointer appearance-none rounded-[4px] border border-admin-ink bg-white pl-2 pr-6 font-ui text-xs text-admin-ink outline-none ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-admin-ink">
        <IconSelector width={7} height={10} />
      </span>
    </div>
  );
}
