"use client";

import { useEffect, useRef, useState } from "react";

type TextAreaProps = {
  value: string;
  onSave?: (newValue: string) => void;
  fullWidth?: boolean;
  readOnly?: boolean;
  autoResize?: boolean;
  isEditing?: boolean;
  onEditingChange?: (isEditing: boolean) => void;
  variant?: "default" | "subtle";
  className?: string;
};

export function TextArea({
  value,
  onSave,
  fullWidth = false,
  readOnly = false,
  autoResize = false,
  isEditing: controlledIsEditing,
  onEditingChange,
  variant = "default",
  className = "",
}: TextAreaProps) {
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [current, setCurrent] = useState(value);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setCurrent(value);
    setDraft(value);
  }, [value]);

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

  useEffect(() => {
    if (!autoResize || !isEditing || !inputRef.current) return;

    inputRef.current.style.height = "auto";
    inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
  }, [autoResize, draft, isEditing]);

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
    if (e.key === "Escape") handleCancel();
  }

  const widthClass = fullWidth ? "w-full" : "w-[480px]";
  const bgClass = variant === "subtle" ? "bg-transparent" : "bg-white";
  const editingTextAreaClass = autoResize
    ? "min-w-0 w-full resize-none overflow-hidden rounded-[3.5px] border-2 border-admin-ink bg-white px-2 py-1.5 font-ui text-sm font-medium text-admin-ink outline-none"
    : "min-h-[200px] min-w-0 w-full resize-y rounded-[3.5px] border-2 border-admin-ink bg-white px-2 py-1.5 font-ui text-sm font-medium text-admin-ink outline-none";

  if (isEditing && !readOnly) {
    return (
      <div className="flex w-full min-w-0 items-start gap-2">
        <textarea
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`${editingTextAreaClass} ${className}`}
        />
        <div className="flex shrink-0 flex-col gap-1.5">
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

  return (
    <div
      onDoubleClick={readOnly ? undefined : () => setIsEditing(true)}
      className={`${widthClass} h-[80px] overflow-y-auto rounded-[3.5px] border border-admin-ink ${bgClass} px-2 py-1.5 ${className}`}
    >
      <p className="font-ui text-sm font-medium text-admin-ink">{current}</p>
    </div>
  );
}
