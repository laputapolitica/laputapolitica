import { getStatusColor } from "@/lib/colors";

type RatioPillProps = {
  valor: number;
  total: number;
  sufijo?: string;
  className?: string;
};

export function RatioPill({
  valor,
  total,
  sufijo,
  className = "",
}: RatioPillProps) {
  return (
    <div
      className={`inline-flex h-[20px] items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-2 ${className}`}
    >
      <span className="font-ui text-xs font-semibold text-admin-ink whitespace-nowrap">
        {valor}/{total}{sufijo ? ` ${sufijo}` : ""}
      </span>
      <span
        className="h-[8px] w-[8px] rounded-full shrink-0"
        style={{ backgroundColor: getStatusColor(valor, total) }}
      />
    </div>
  );
}
