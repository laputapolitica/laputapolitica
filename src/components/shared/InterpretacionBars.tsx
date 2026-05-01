import { cn } from "@/lib/utils";

type InterpretacionBarsProps = {
  pct_positiva: number;
  pct_negativa: number;
  pct_incierta: number;
  className?: string;
};

type BarConfig = {
  label: string;
  value: number;
  className: string;
};

function clampPercentage(value: number) {
  return Math.min(100, Math.max(0, value));
}

function formatPercentage(value: number) {
  return `${Math.round(clampPercentage(value))}%`;
}

export function InterpretacionBars({
  pct_positiva,
  pct_negativa,
  pct_incierta,
  className,
}: InterpretacionBarsProps) {
  const bars: BarConfig[] = [
    {
      label: "Positiva",
      value: pct_positiva,
      className: "bg-vote-positive",
    },
    {
      label: "Negativa",
      value: pct_negativa,
      className: "bg-vote-negative",
    },
    {
      label: "Incierta",
      value: pct_incierta,
      className: "bg-vote-uncertain",
    },
  ];

  return (
    <div className={cn("space-y-2", className)}>
      {bars.map((bar) => {
        const width = clampPercentage(bar.value);

        return (
          <div
            key={bar.label}
            className="grid grid-cols-[72px_1fr_40px] items-center gap-3"
          >
            <span className="font-ui text-sm text-text-primary">{bar.label}</span>
            <div
              className="h-2 overflow-hidden rounded-full bg-border-default"
              aria-label={`${bar.label}: ${formatPercentage(bar.value)}`}
            >
              <div
                className={cn("h-full rounded-full", bar.className)}
                style={{ width: `${width}%` }}
              />
            </div>
            <span className="text-right font-ui text-xs text-text-secondary">
              {formatPercentage(bar.value)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export type { InterpretacionBarsProps };
