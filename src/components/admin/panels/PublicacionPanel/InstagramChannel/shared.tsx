"use client";

import { useState } from "react";
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
      <TextField value={pxValue} variant="default" readOnly />
      <IconButton onClick={() => copyToClipboard(pxValue)}>
        <IconCopiar width={12} height={12} />
        Copiar
      </IconButton>
      <TextField value={percentValue} variant="default" readOnly />
      <IconButton onClick={() => copyToClipboard(percentValue)}>
        <IconCopiar width={12} height={12} />
        Copiar
      </IconButton>
    </div>
  );
}

export function InstagramTitularRow({ titulo }: { titulo: string }) {
  const [tituloValue, setTituloValue] = useState(titulo.toUpperCase());
  const [isEditing, setIsEditing] = useState(false);

  const customStyle = {
    letterSpacing: "8px",
    maxWidth: "calc(12 * (1ch + 8px))",
    wordBreak: "keep-all" as const,
    overflowWrap: "break-word" as const,
    whiteSpace: "normal" as const,
    textTransform: "uppercase" as const,
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    boxSizing: "content-box" as const,
  };

  return (
    <div
      className={
        isEditing ? "flex items-start gap-2" : "flex w-fit items-start gap-2"
      }
    >
      <TextField
        value={tituloValue}
        onSave={(newValue) => setTituloValue(newValue.toUpperCase())}
        isEditing={isEditing}
        onEditingChange={setIsEditing}
        wrap
        multiline
        autoResize
        textStyle={customStyle}
      />
      {!isEditing && (
        <>
          <IconButton onClick={() => setIsEditing(true)}>
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
