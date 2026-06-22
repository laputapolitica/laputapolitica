import { InstagramBulletRows, InstagramEditablePill } from "./shared";
import { formatFechaCorta } from "@/lib/fecha";
import type { SlideInstagram } from "@/app/(admin)/admin/actions";

function stringFromPayload(
  payload: Record<string, unknown>,
  key: string,
): string {
  const value = payload[key];
  return typeof value === "string" ? value : "";
}

function stringsFromPayload(
  payload: Record<string, unknown>,
  key: string,
): string[] {
  const value = payload[key];
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

export function InstagramSlide02({ slide }: { slide: SlideInstagram }) {
  const expediente = stringFromPayload(slide.payload, "expediente");
  const titulo = stringFromPayload(slide.payload, "titulo");
  const bullets = stringsFromPayload(slide.payload, "bullets");
  const fecha = formatFechaCorta(stringFromPayload(slide.payload, "fecha"));

  return (
    <div className="space-y-5">
      <InstagramEditablePill value={expediente} />
      <InstagramEditablePill value={titulo} />
      <InstagramBulletRows bullets={bullets} />
      <InstagramEditablePill value={fecha} />
    </div>
  );
}
