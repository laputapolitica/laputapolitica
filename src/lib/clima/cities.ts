// Config canónica de ciudades para el módulo de Clima de la web pública.
// Fuente única de la lista (frontend). El workflow n8n "Web" replica esta misma
// lista para consultar OpenWeatherMap por lat/lon — mantener ambas en sync.
//
// Decisiones (handoff 19-06-2026):
// - "Buenos Aires" = todo el AMBA (CABA + conurbano + La Plata), coords de CABA.
// - 26 ciudades: capitales provinciales + 2das ciudades (Rosario, Comodoro) + Mar del Plata.
// - Consultar OWM por lat/lon, NUNCA por nombre.

export interface ClimaCity {
  /** Slug estable; se guarda en `clima_diario.provincia`. */
  id: string;
  /** Nombre visible al usuario. */
  label: string;
  /** Provincia (para agrupar/admin). En `buenos-aires` representa todo el AMBA. */
  provincia: string;
  /** Centro urbano (4 decimales). Consultar OWM por lat/lon. */
  lat: number;
  /** Centro urbano (4 decimales). Consultar OWM por lat/lon. */
  lon: number;
  /** Orden por defecto en el sitio: Buenos Aires primero, resto alfabético por label. */
  orden: number;
}

/** ID de la ciudad por defecto (fallback de geo / arranque del sitio). */
export const DEFAULT_CITY_ID = "buenos-aires";

/** Radio por defecto para considerar a un visitante "cerca" de una ciudad de la lista. */
export const DEFAULT_NEARBY_RADIUS_KM = 50;

export const CLIMA_CITIES: readonly ClimaCity[] = [
  { id: "buenos-aires", label: "Buenos Aires", provincia: "Buenos Aires (AMBA)", lat: -34.6037, lon: -58.3816, orden: 1 },
  { id: "catamarca", label: "Catamarca", provincia: "Catamarca", lat: -28.4696, lon: -65.7795, orden: 2 },
  { id: "comodoro-rivadavia", label: "Comodoro Rivadavia", provincia: "Chubut", lat: -45.8642, lon: -67.4966, orden: 3 },
  { id: "cordoba", label: "Córdoba", provincia: "Córdoba", lat: -31.4201, lon: -64.1888, orden: 4 },
  { id: "corrientes", label: "Corrientes", provincia: "Corrientes", lat: -27.4692, lon: -58.8306, orden: 5 },
  { id: "formosa", label: "Formosa", provincia: "Formosa", lat: -26.1849, lon: -58.1731, orden: 6 },
  { id: "la-rioja", label: "La Rioja", provincia: "La Rioja", lat: -29.4131, lon: -66.8558, orden: 7 },
  { id: "mar-del-plata", label: "Mar del Plata", provincia: "Buenos Aires", lat: -38.0055, lon: -57.5426, orden: 8 },
  { id: "mendoza", label: "Mendoza", provincia: "Mendoza", lat: -32.8895, lon: -68.8458, orden: 9 },
  { id: "neuquen", label: "Neuquén", provincia: "Neuquén", lat: -38.9516, lon: -68.0591, orden: 10 },
  { id: "parana", label: "Paraná", provincia: "Entre Ríos", lat: -31.7319, lon: -60.5238, orden: 11 },
  { id: "posadas", label: "Posadas", provincia: "Misiones", lat: -27.3621, lon: -55.9009, orden: 12 },
  { id: "rawson", label: "Rawson", provincia: "Chubut", lat: -43.3002, lon: -65.1023, orden: 13 },
  { id: "resistencia", label: "Resistencia", provincia: "Chaco", lat: -27.4514, lon: -58.9867, orden: 14 },
  { id: "rio-gallegos", label: "Río Gallegos", provincia: "Santa Cruz", lat: -51.6230, lon: -69.2168, orden: 15 },
  { id: "rosario", label: "Rosario", provincia: "Santa Fe", lat: -32.9442, lon: -60.6505, orden: 16 },
  { id: "salta", label: "Salta", provincia: "Salta", lat: -24.7821, lon: -65.4232, orden: 17 },
  { id: "san-juan", label: "San Juan", provincia: "San Juan", lat: -31.5375, lon: -68.5364, orden: 18 },
  { id: "san-luis", label: "San Luis", provincia: "San Luis", lat: -33.3017, lon: -66.3378, orden: 19 },
  { id: "tucuman", label: "San Miguel de Tucumán", provincia: "Tucumán", lat: -26.8083, lon: -65.2176, orden: 20 },
  { id: "san-salvador-de-jujuy", label: "San Salvador de Jujuy", provincia: "Jujuy", lat: -24.1858, lon: -65.2995, orden: 21 },
  { id: "santa-fe", label: "Santa Fe", provincia: "Santa Fe", lat: -31.6107, lon: -60.6973, orden: 22 },
  { id: "santa-rosa", label: "Santa Rosa", provincia: "La Pampa", lat: -36.6203, lon: -64.2906, orden: 23 },
  { id: "santiago-del-estero", label: "Santiago del Estero", provincia: "Santiago del Estero", lat: -27.7951, lon: -64.2615, orden: 24 },
  { id: "ushuaia", label: "Ushuaia", provincia: "Tierra del Fuego", lat: -54.8019, lon: -68.3030, orden: 25 },
  { id: "viedma", label: "Viedma", provincia: "Río Negro", lat: -40.8135, lon: -62.9967, orden: 26 },
] as const;

/** Devuelve una ciudad por su id (o undefined). */
export function getCityById(id: string): ClimaCity | undefined {
  return CLIMA_CITIES.find((city) => city.id === id);
}

const EARTH_RADIUS_KM = 6371;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Distancia en km entre dos coordenadas (fórmula de haversine). */
export function haversineKm(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const dLat = toRadians(bLat - aLat);
  const dLon = toRadians(bLon - aLon);
  const lat1 = toRadians(aLat);
  const lat2 = toRadians(bLat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Devuelve la ciudad de la lista más cercana al punto dado, si está dentro de
 * `radiusKm`. Si no hay ninguna en rango, devuelve `null` (el visitante verá su
 * ciudad exacta en vivo, no editable en admin).
 */
export function findNearestCity(
  lat: number,
  lon: number,
  radiusKm: number = DEFAULT_NEARBY_RADIUS_KM,
): ClimaCity | null {
  let nearest: ClimaCity | null = null;
  let nearestKm = Number.POSITIVE_INFINITY;

  for (const city of CLIMA_CITIES) {
    const km = haversineKm(lat, lon, city.lat, city.lon);
    if (km < nearestKm) {
      nearestKm = km;
      nearest = city;
    }
  }

  return nearest !== null && nearestKm <= radiusKm ? nearest : null;
}
