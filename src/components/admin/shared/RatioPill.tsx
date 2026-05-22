import { getStatusColor } from "@/lib/colors";
import { RowCardCell } from "./table/RowCardCell";

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
    <RowCardCell className={className}>
      {valor}/{total}{sufijo ? ` ${sufijo}` : ""}
      <span
        className="h-[8px] w-[8px] rounded-full shrink-0"
        style={{ backgroundColor: getStatusColor(valor, total) }}
      />
    </RowCardCell>
  );
}
