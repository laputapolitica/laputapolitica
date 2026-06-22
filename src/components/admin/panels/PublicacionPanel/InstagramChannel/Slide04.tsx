import { InstagramEditablePill, InstagramTitularRow } from "./shared";
import { formatFechaCorta } from "@/lib/fecha";
import type { SlideInstagram } from "@/app/(admin)/admin/actions";

type InstagramTitular = {
  texto: string;
  ok: boolean;
};

function stringFromPayload(
  payload: Record<string, unknown>,
  key: string,
): string {
  const value = payload[key];
  return typeof value === "string" ? value : "";
}

function titularesFromPayload(payload: Record<string, unknown>): InstagramTitular[] {
  const value = payload.titulares;
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];

    const titular = item as Record<string, unknown>;
    if (typeof titular.texto !== "string") return [];

    return [
      {
        texto: titular.texto,
        ok: typeof titular.ok === "boolean" ? titular.ok : true,
      },
    ];
  });
}

export function InstagramSlide04({ slide }: { slide: SlideInstagram }) {
  const titulares = titularesFromPayload(slide.payload);
  const fecha = formatFechaCorta(stringFromPayload(slide.payload, "fecha"));

  return (
    <div className="space-y-5">
      {titulares.map((titular) => (
        <div
          key={titular.texto}
          className={
            titular.ok
              ? undefined
              : "w-fit border-l-2 border-state-required pl-2"
          }
        >
          <InstagramTitularRow titulo={titular.texto} />
        </div>
      ))}
      <InstagramEditablePill value={fecha} />
    </div>
  );
}
