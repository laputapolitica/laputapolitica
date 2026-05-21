"use client";

import { useState, type KeyboardEvent } from "react";
import { IconCopiar, IconEditar } from "@/components/admin/icons";
import { IconButton, TextArea, TextField } from "@/components/admin/shared";

function copyToClipboard(value: string) {
  void navigator.clipboard.writeText(value);
}

export function InstagramEditablePill({ value }: { value: string }) {
  const [pillValue, setPillValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div
      className={
        isEditing
          ? "flex w-full items-center gap-2"
          : "flex w-fit items-center gap-2"
      }
    >
      <TextField
        value={pillValue}
        onSave={setPillValue}
        isEditing={isEditing}
        onEditingChange={setIsEditing}
      />
      {!isEditing && (
        <>
          <IconButton onClick={() => setIsEditing(true)}>
            <IconEditar width={12} height={12} />
            Editar
          </IconButton>
          <IconButton onClick={() => copyToClipboard(pillValue)}>
            <IconCopiar width={12} height={12} />
            Copiar
          </IconButton>
        </>
      )}
    </div>
  );
}

export function InstagramBulletRow({ bullet }: { bullet: string }) {
  const [bulletValue, setBulletValue] = useState(bullet);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex w-full min-w-0 items-start gap-2">
      {isEditing ? (
        <TextArea
          value={bulletValue}
          onSave={setBulletValue}
          isEditing
          onEditingChange={setIsEditing}
          fullWidth
          autoResize
        />
      ) : (
        <>
          <TextField
            value={`■ ${bulletValue}`}
            wrap
            isEditing={isEditing}
            onEditingChange={setIsEditing}
          />
          <div className="flex shrink-0 items-start gap-1.5">
            <IconButton onClick={() => setIsEditing(true)}>
              <IconEditar width={12} height={12} />
              Editar
            </IconButton>
            <IconButton onClick={() => copyToClipboard(bulletValue)}>
              <IconCopiar width={12} height={12} />
              Copiar
            </IconButton>
          </div>
        </>
      )}
    </div>
  );
}

export function InstagramBulletRows({ bullets }: { bullets: string[] }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {bullets.map((bullet) => (
        <InstagramBulletRow key={bullet} bullet={bullet} />
      ))}
    </div>
  );
}

export function InstagramVoteRow({
  label,
  borderColor,
  pxValue,
  percentValue,
}: {
  label: string;
  borderColor: string;
  pxValue: string;
  percentValue: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div
        className="inline-flex h-[28px] items-center rounded-[3.5px] px-2"
        style={{ border: `1px solid ${borderColor}` }}
      >
        <span
          className="font-ui text-sm font-medium"
          style={{ color: borderColor }}
        >
          {label}
        </span>
      </div>
      <TextField
        value={pxValue}
        variant="subtle"
        readOnly
        style={{ color: borderColor, borderColor }}
      />
      <IconButton onClick={() => copyToClipboard(pxValue)}>
        <IconCopiar width={12} height={12} />
        Copiar
      </IconButton>
      <TextField
        value={percentValue}
        variant="subtle"
        readOnly
        style={{ color: borderColor, borderColor }}
      />
      <IconButton onClick={() => copyToClipboard(percentValue)}>
        <IconCopiar width={12} height={12} />
        Copiar
      </IconButton>
    </div>
  );
}

export function InstagramTitularRow({ titulo }: { titulo: string }) {
  const [tituloValue, setTituloValue] = useState(titulo.toUpperCase());
  const [draft, setDraft] = useState(titulo.toUpperCase());
  const [isEditing, setIsEditing] = useState(false);

  function startEditing() {
    setDraft(tituloValue);
    setIsEditing(true);
  }

  function save() {
    setTituloValue(draft);
    setIsEditing(false);
  }

  function cancel() {
    setDraft(tituloValue);
    setIsEditing(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") save();
    if (event.key === "Escape") cancel();
  }

  return (
    <div className="flex w-fit items-start gap-2">
      {isEditing ? (
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value.toUpperCase())}
          onKeyDown={handleKeyDown}
          className="w-[14ch] rounded-[4px] border-2 border-admin-ink bg-white px-2 py-1 font-ui text-sm font-medium text-admin-ink outline-none"
          style={{
            letterSpacing: "8px",
            textTransform: "uppercase",
            wordBreak: "keep-all",
          }}
        />
      ) : (
        <div className="w-[14ch] rounded-[3.5px] border border-admin-ink bg-white px-2 py-1">
          <span
            className="font-ui text-sm font-medium uppercase whitespace-normal leading-normal"
            style={{ letterSpacing: "8px", wordBreak: "keep-all" }}
          >
            {tituloValue}
          </span>
        </div>
      )}
      {!isEditing && (
        <>
          <IconButton onClick={startEditing}>
            <IconEditar width={12} height={12} />
            Editar
          </IconButton>
          <IconButton onClick={() => copyToClipboard(tituloValue)}>
            <IconCopiar width={12} height={12} />
            Copiar
          </IconButton>
        </>
      )}
    </div>
  );
}
