"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type TextFieldProps = {
  value: string;
  onSave?: (newValue: string) => void;
  multiline?: boolean;
  readOnly?: boolean;
  variant?: "default" | "subtle";
  isEditing?: boolean;
  onEditingChange?: (isEditing: boolean) => void;
  style?: CSSProperties;
  className?: string;
};

export function TextField({
  value,
  onSave,
  multiline = false,
  readOnly = false,
  variant = "default",
  isEditing: controlledIsEditing,
  onEditingChange,
  style,
  className = "",
}: TextFieldProps) {
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [current, setCurrent] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Soporta tanto controlado (isEditing prop) como interno
  const isControlled = controlledIsEditing !== undefined;
  const isEditing = isControlled ? controlledIsEditing : internalIsEditing;

  function setIsEditing(value: boolean) {
    if (isControlled) {
      onEditingChange?.(value);
    } else {
      setInternalIsEditing(value);
    }
  }

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  function handleSave() {
    setCurrent(draft);
    onSave?.(draft);
    setIsEditing(false);
  }

  function handleCancel() {
    setDraft(current);
    setIsEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !multiline) handleSave();
    if (e.key === "Escape") handleCancel();
  }

  // Modo edición (solo si NO es readOnly)
  if (isEditing && !readOnly) {
    return (
      <div className={`flex w-full min-w-0 items-start gap-2 ${className}`}>
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[80px] w-full resize-none rounded-[4px] border-2 border-admin-ink bg-white px-3 py-2 font-ui text-sm font-medium text-admin-ink outline-none"
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-[28px] min-w-0 w-full rounded-[4px] border-2 border-admin-ink bg-white px-2 font-ui text-sm font-medium text-admin-ink outline-none"
          />
        )}
        <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex h-[28px] cursor-pointer items-center rounded-[4px] border border-admin-ink bg-admin-ink px-2 font-ui text-xs font-semibold text-white"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex h-[28px] cursor-pointer items-center rounded-[4px] border border-admin-ink bg-white px-2 font-ui text-xs font-medium text-admin-ink"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  // Modo lectura
  if (multiline) {
    return (
      <div
        className={`h-[100px] w-full overflow-y-auto rounded-[4px] border border-admin-ink bg-white px-3 py-2 ${className}`}
        style={style}
      >
        <p className="font-ui text-sm font-medium text-admin-ink">{current}</p>
      </div>
    );
  }

  const variantClasses = {
    default: "border border-admin-ink bg-white text-admin-ink",
    subtle: "border border-admin-ink bg-transparent text-admin-ink",
  }[variant];

  return (
    <div
      className={`inline-flex h-[28px] items-center rounded-[3.5px] px-2 ${variantClasses} ${className}`}
      style={style}
    >
      <span className="font-ui text-sm font-medium whitespace-nowrap">
        {current}
      </span>
    </div>
  );
}

export type { TextFieldProps };
