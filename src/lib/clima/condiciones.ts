// Taxonomía de clima (14 claves) + mapeo desde códigos de OpenWeatherMap.
// Fuente única en el frontend. El workflow n8n "Web" replica `owmToClave` en un
// Code node para generar el clima — mantener ambas en sync.
//
// Las claves coinciden 1:1 con los assets `public/clima/<clave>.webp`.

export type ClimaClave =
  | "despejado"
  | "parcialmente-nublado"
  | "neblina"
  | "niebla"
  | "viento"
  | "nublado"
  | "tormenta"
  | "lluvia"
  | "lluvia-intensa"
  | "llovizna"
  | "nieve"
  | "nieve-intensa"
  | "aguanieve"
  | "granizo";

/** Las 14 claves, en el orden de la taxonomía de diseño. */
export const CLIMA_CLAVES: readonly ClimaClave[] = [
  "despejado",
  "parcialmente-nublado",
  "neblina",
  "niebla",
  "viento",
  "nublado",
  "tormenta",
  "lluvia",
  "lluvia-intensa",
  "llovizna",
  "nieve",
  "nieve-intensa",
  "aguanieve",
  "granizo",
] as const;

/** Nombres legibles para mostrar la taxonomía en UI. */
export const CLIMA_LABELS: Record<ClimaClave, string> = {
  despejado: "Despejado",
  "parcialmente-nublado": "Parcialmente nublado",
  neblina: "Neblina",
  niebla: "Niebla",
  viento: "Viento",
  nublado: "Nublado",
  tormenta: "Tormenta",
  lluvia: "Lluvia",
  "lluvia-intensa": "Lluvia intensa",
  llovizna: "Llovizna",
  nieve: "Nieve",
  "nieve-intensa": "Nieve intensa",
  aguanieve: "Aguanieve",
  granizo: "Granizo",
};

/** Ruta del asset ilustrado para una clave de clima. */
export function climaIconPath(clave: ClimaClave): string {
  return `/clima/${clave}.webp`;
}

/**
 * Umbral de viento (m/s) para pisar cielos sin precipitación con la clave `viento`.
 * ~32 km/h. OWM con `units=metric` devuelve `wind.speed` en m/s.
 */
export const VIENTO_UMBRAL_MS = 9;

const SET_LLUVIA_INTENSA = new Set([502, 503, 504, 522, 531]);
const SET_AGUANIEVE = new Set([611, 612, 613, 615, 616]);
const PISABLES_POR_VIENTO = new Set<ClimaClave>([
  "despejado",
  "parcialmente-nublado",
  "nublado",
]);

/**
 * Mapea un código de condición de OWM (`weather[0].id`) + viento (m/s) a una clave.
 * Asume `units=metric` (wind.speed en m/s). El viento solo pisa cielos sin precip.
 * `granizo` casi nunca viene como código propio en OWM → cae en `tormenta`.
 */
export function owmToClave(owmId: number, windSpeedMs: number): ClimaClave {
  let clave: ClimaClave;

  if (owmId >= 200 && owmId <= 232) {
    clave = "tormenta";
  } else if (owmId >= 600 && owmId <= 622) {
    if (owmId === 602 || owmId === 622) {
      clave = "nieve-intensa";
    } else if (SET_AGUANIEVE.has(owmId)) {
      clave = "aguanieve";
    } else {
      clave = "nieve";
    }
  } else if (owmId >= 500 && owmId <= 531) {
    if (SET_LLUVIA_INTENSA.has(owmId)) {
      clave = "lluvia-intensa";
    } else if (owmId === 511) {
      clave = "llovizna"; // lluvia helada
    } else {
      clave = "lluvia";
    }
  } else if (owmId >= 300 && owmId <= 321) {
    clave = "llovizna";
  } else if (owmId >= 701 && owmId <= 781) {
    clave = owmId === 701 || owmId === 721 ? "neblina" : "niebla";
  } else if (owmId === 800) {
    clave = "despejado";
  } else if (owmId === 801 || owmId === 802) {
    clave = "parcialmente-nublado";
  } else if (owmId === 803 || owmId === 804) {
    clave = "nublado";
  } else {
    clave = "parcialmente-nublado"; // default de seguridad para ids desconocidos
  }

  if (PISABLES_POR_VIENTO.has(clave) && windSpeedMs >= VIENTO_UMBRAL_MS) {
    clave = "viento";
  }

  return clave;
}
