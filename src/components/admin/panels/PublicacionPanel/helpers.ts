import { POINT_COLORS } from "@/lib/constants";

export function getPointColor(completadas: number, total: number): string {
  const pct = (completadas / total) * 100;
  if (pct < 33) return POINT_COLORS.low;
  if (pct < 66) return POINT_COLORS.medium;
  return POINT_COLORS.high;
}
