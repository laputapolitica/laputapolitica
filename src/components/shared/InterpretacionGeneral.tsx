import { VOTE_COLORS } from "@/lib/constants";

type InterpretacionGeneralProps = {
  pct_positiva: number;
  pct_negativa: number;
  pct_incierta: number;
  className?: string;
};

const TRACK_BASE =
  "repeating-linear-gradient(90deg, #D7D3CA 0 8px, #FFFFFF 8px 11px)";

function segmentedFill(color: string) {
  return `repeating-linear-gradient(90deg, ${color} 0 8px, transparent 8px 11px)`;
}

export function InterpretacionGeneral({
  pct_positiva,
  pct_negativa,
  pct_incierta,
  className,
}: InterpretacionGeneralProps) {
  const items = [
    { label: "Positiva", value: pct_positiva, color: VOTE_COLORS.positiva },
    { label: "Negativa", value: pct_negativa, color: VOTE_COLORS.negativa },
    { label: "Incierta", value: pct_incierta, color: VOTE_COLORS.incierta },
  ];

  return (
    <div className={className}>
      <p className="mb-2 font-ui text-xs font-semibold tracking-wider text-text-secondary">
        INTERPRETACIÓN GENERAL
      </p>
      <div className="rounded-[6px] border-[1.5px] border-admin-ink bg-white px-3 pb-2.5 pt-3">
        <div className="space-y-[9px]">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-2.5">
              <span
                className="w-16 text-[11px] font-bold uppercase tracking-[0.02em] text-admin-ink"
                style={{ fontFamily: "var(--font-readout)" }}
              >
                {item.label}
              </span>
              <div
                className="relative h-[15px] flex-1 overflow-hidden rounded-[2px] border border-admin-ink"
                style={{ background: TRACK_BASE }}
              >
                <div
                  className="absolute inset-y-0 left-0"
                  style={{ width: `${item.value}%`, background: segmentedFill(item.color) }}
                />
              </div>
              <span
                className="w-[44px] text-right text-[13px] font-bold text-admin-ink"
                style={{ fontFamily: "var(--font-readout)" }}
              >
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export type { InterpretacionGeneralProps };
