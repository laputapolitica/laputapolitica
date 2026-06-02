"use client";

import { type ChangeEvent } from "react";
import { IconSelector } from "@/components/admin/icons";

type RowCardSelectOption = {
  value: string;
  label: string;
};

type RowCardSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: RowCardSelectOption[];
  disabled?: boolean;
  className?: string;
};

export function RowCardSelect({
  value,
  onChange,
  options,
  disabled = false,
  className = "",
}: RowCardSelectProps) {
  return (
    <div className={`relative inline-flex ${className}`}>
      <select
        value={value}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        disabled={disabled}
        className={`h-[20px] w-full cursor-pointer appearance-none rounded-[3.5px] border border-admin-ink bg-white pl-2 pr-6 font-ui text-xs font-medium whitespace-nowrap text-admin-ink outline-none ${disabled ? "cursor-not-allowed opacity-30" : ""}`}
      >
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
