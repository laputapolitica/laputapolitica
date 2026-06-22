const MESES_CORTOS = [
  "ENE",
  "FEB",
  "MAR",
  "ABR",
  "MAY",
  "JUN",
  "JUL",
  "AGO",
  "SEP",
  "OCT",
  "NOV",
  "DIC",
] as const;

const MESES_LARGOS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
] as const;

type FechaParts = {
  day: number;
  month: number;
  year: number;
};

function parseFechaSlug(slug: string): FechaParts | null {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(slug);
  if (!match) return null;

  const day = Number.parseInt(match[1], 10);
  const month = Number.parseInt(match[2], 10);
  const year = Number.parseInt(match[3], 10);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return { day, month, year };
}

export function formatFechaCorta(slug: string): string {
  const fecha = parseFechaSlug(slug);
  if (!fecha) return slug;

  return `${fecha.day.toString().padStart(2, "0")} ${
    MESES_CORTOS[fecha.month - 1]
  } ${fecha.year}`;
}

export function formatFechaLarga(slug: string): string {
  const fecha = parseFechaSlug(slug);
  if (!fecha) return slug;

  return `${fecha.day} de ${MESES_LARGOS[fecha.month - 1]} del ${fecha.year}`;
}
