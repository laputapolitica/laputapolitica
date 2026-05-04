import { VOTE_COLORS } from "@/lib/constants";
import type { NoticiaPublicacion } from "../types";

export function InterpretacionGeneral({
  interpretacion,
}: {
  interpretacion: NoticiaPublicacion["interpretacion"];
}) {
  const items = [
    { label: "Positiva", value: interpretacion.positiva, color: VOTE_COLORS.positiva },
    { label: "Negativa", value: interpretacion.negativa, color: VOTE_COLORS.negativa },
    { label: "Incierta", value: interpretacion.incierta, color: VOTE_COLORS.incierta },
  ];

  return (
    <div>
      <p className="mb-2 font-ui text-xs font-semibold tracking-wider text-text-secondary">
        INTERPRETACIÓN GENERAL
      </p>
      <div className="inline-block rounded-[4px] border border-admin-ink bg-white p-3">
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                style={{
                  width: "3px",
                  height: "12px",
                  borderRadius: "9999px",
                  backgroundColor: item.color,
                }}
              />
              <span className="font-ui text-xs font-medium text-admin-ink w-[52px]">
                {item.label}
              </span>
              <div
                style={{
                  width: "100px",
                  height: "12px",
                  borderRadius: "3px",
                  backgroundColor: "#E9E5DE",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${item.value}px`,
                    height: "12px",
                    borderRadius: "3px",
                    backgroundColor: item.color,
                  }}
                />
              </div>
              <span className="font-ui text-xs font-semibold text-admin-ink w-[32px] text-right">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
