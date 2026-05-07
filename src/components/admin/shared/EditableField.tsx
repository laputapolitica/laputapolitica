"use client";

import { useEffect, useRef, useState } from "react";

type EditableFieldProps = {
  value: string;
  onSave?: (newValue: string) => void;
  multiline?: boolean;
  readOnly?: boolean;
  className?: string;
};

export function EditableField({
  value,
  onSave,
  multiline = false,
  className = "",
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [current, setCurrent] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

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

  // Modo edición
  if (isEditing) {
    return (
      <div className={`flex items-start gap-2 ${className}`}>
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
            className="h-[28px] rounded-[4px] border-2 border-admin-ink bg-white px-2 font-ui text-sm font-medium text-admin-ink outline-none"
            style={{ width: `${Math.max(draft.length + 4, 20)}ch` }}
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

  // Modo lectura — solo el pill, sin botones
  if (multiline) {
    return (
      <div
        className={`h-[100px] w-full overflow-y-auto rounded-[4px] border border-admin-ink bg-white px-3 py-2 ${className}`}
      >
        <p className="font-ui text-sm font-medium text-admin-ink">{current}</p>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex h-[28px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2 ${className}`}
    >
      <span className="font-ui text-sm font-medium text-admin-ink whitespace-nowrap">
        {current}
      </span>
    </div>
  );
}

// Expone el setter para que el padre pueda activar edición externamente si necesita
export type { EditableFieldProps };
