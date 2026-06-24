"use client";

import { IconCopiar } from "@/components/admin/icons";
import { IconButton } from "@/components/admin/shared";
import { InstagramEditablePill } from "./shared";
import { copyImageToClipboard } from "@/lib/clipboard";
import { formatFechaCorta } from "@/lib/fecha";
import type { SlideInstagram } from "@/app/(admin)/admin/actions";

function stringFromPayload(
  payload: Record<string, unknown>,
  key: string,
): string {
  const value = payload[key];
  return typeof value === "string" ? value : "";
}

export function InstagramSlide01({ slide }: { slide: SlideInstagram }) {
  const titulo = stringFromPayload(slide.payload, "titulo_edicion");
  const fecha = formatFechaCorta(stringFromPayload(slide.payload, "fecha"));
  const handleCopyImage = async () => {
    if (!slide.imagenUrl) return;

    try {
      await copyImageToClipboard(slide.imagenUrl);
    } catch {
      alert("No se pudo copiar la imagen.");
    }
  };

  return (
    <div>
      <InstagramEditablePill value={titulo} />

      <div className="mt-5 flex items-start gap-3">
        <div className="h-[150px] w-[150px] shrink-0 overflow-hidden rounded-lg border border-admin-ink bg-gray-200">
          {slide.imagenUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={slide.imagenUrl}
              alt="Tapa de Instagram"
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <IconButton onClick={handleCopyImage}>
          <IconCopiar width={12} height={12} />
          Copiar
        </IconButton>
      </div>

      <div className="mt-5">
        <InstagramEditablePill value={fecha} />
      </div>
    </div>
  );
}
