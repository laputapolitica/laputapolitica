import { POINT_COLORS, VOTE_COLORS } from "@/lib/constants";

/**
 * Devuelve un color de POINT_COLORS según el porcentaje (valor/total).
 * Reemplaza las variantes legacy de color por porcentaje.
 */
export function getStatusColor(valor: number, total: number): string {
  const pct = (valor / total) * 100;
  if (pct < 33) return POINT_COLORS.low;
  if (pct < 66) return POINT_COLORS.medium;
  return POINT_COLORS.high;
}

/**
 * Devuelve un color de VOTE_COLORS según el sentimiento de El Pulso.
 * Reemplaza la variante legacy de color de pulso.
 */
export function getSentimientoColor(
  sentimiento: "positivo" | "negativo" | "incierto"
): string {
  if (sentimiento === "positivo") return VOTE_COLORS.positiva;
  if (sentimiento === "negativo") return VOTE_COLORS.negativa;
  return VOTE_COLORS.incierta;
}
