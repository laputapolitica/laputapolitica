export type KPI = {
  label: string;
  valor: string;
  descripcion: string;
};

export type ParticipacionDia = {
  fecha: string;        // "04/03"
  participaron: number;
  noParticiparon: number;
};

export type VisitasDia = {
  fecha: string;        // "10/03"
  visitas: number;
};

export type EdicionMasVista = {
  ranking: number;
  fecha: string;
  fechaISO: string;
  titulo: string;
  opiniones: number;
  totalOpinadores: number;
  pulsoSentimiento: "positivo" | "negativo" | "incierto";
  visitas: number;
};

export const mockKPIs: KPI[] = [
  { label: "Opinadores", valor: "25", descripcion: "verificados activos" },
  { label: "Participación promedio", valor: "72%", descripcion: "últimos 30 días" },
  { label: "Ediciones publicadas", valor: "38", descripcion: "desde el lanzamiento" },
  { label: "Visitas totales", valor: "4.821", descripcion: "a la web pública" },
];

export const mockParticipacion: ParticipacionDia[] = [
  { fecha: "04/03", participaron: 18, noParticiparon: 7 },
  { fecha: "05/03", participaron: 16, noParticiparon: 9 },
  { fecha: "06/03", participaron: 19, noParticiparon: 6 },
  { fecha: "07/03", participaron: 21, noParticiparon: 4 },
  { fecha: "08/03", participaron: 17, noParticiparon: 8 },
  { fecha: "09/03", participaron: 20, noParticiparon: 5 },
  { fecha: "10/03", participaron: 22, noParticiparon: 3 },
  { fecha: "11/03", participaron: 18, noParticiparon: 7 },
  { fecha: "12/03", participaron: 15, noParticiparon: 10 },
  { fecha: "13/03", participaron: 19, noParticiparon: 6 },
  { fecha: "14/03", participaron: 23, noParticiparon: 2 },
  { fecha: "15/03", participaron: 21, noParticiparon: 4 },
  { fecha: "16/03", participaron: 18, noParticiparon: 7 },
  { fecha: "17/03", participaron: 20, noParticiparon: 5 },
  { fecha: "18/03", participaron: 17, noParticiparon: 8 },
  { fecha: "19/03", participaron: 22, noParticiparon: 3 },
  { fecha: "20/03", participaron: 19, noParticiparon: 6 },
  { fecha: "21/03", participaron: 16, noParticiparon: 9 },
  { fecha: "22/03", participaron: 14, noParticiparon: 11 },
  { fecha: "23/03", participaron: 21, noParticiparon: 4 },
  { fecha: "24/03", participaron: 23, noParticiparon: 2 },
];

export const mockVisitas: VisitasDia[] = [
  { fecha: "10/03", visitas: 195 },
  { fecha: "11/03", visitas: 208 },
  { fecha: "12/03", visitas: 220 },
  { fecha: "13/03", visitas: 198 },
  { fecha: "14/03", visitas: 175 },
  { fecha: "15/03", visitas: 232 },
  { fecha: "16/03", visitas: 285 },
  { fecha: "17/03", visitas: 240 },
  { fecha: "18/03", visitas: 178 },
  { fecha: "19/03", visitas: 245 },
  { fecha: "20/03", visitas: 308 },
  { fecha: "21/03", visitas: 280 },
  { fecha: "22/03", visitas: 265 },
  { fecha: "23/03", visitas: 270 },
  { fecha: "24/03", visitas: 295 },
];

export const mockEdicionesMasVistas: EdicionMasVista[] = [
  { ranking: 1, fecha: "21 MAR 2026", fechaISO: "2026-03-21", titulo: "Equilibrio Ciego", opiniones: 14, totalOpinadores: 25, pulsoSentimiento: "negativo", visitas: 312 },
  { ranking: 2, fecha: "20 MAR 2026", fechaISO: "2026-03-20", titulo: "La Línea del Frente", opiniones: 18, totalOpinadores: 25, pulsoSentimiento: "positivo", visitas: 308 },
  { ranking: 3, fecha: "16 MAR 2026", fechaISO: "2026-03-16", titulo: "Manos Atadas", opiniones: 22, totalOpinadores: 25, pulsoSentimiento: "negativo", visitas: 285 },
  { ranking: 4, fecha: "24 MAR 2026", fechaISO: "2026-03-24", titulo: "El Precio del Orden", opiniones: 11, totalOpinadores: 25, pulsoSentimiento: "negativo", visitas: 295 },
  { ranking: 5, fecha: "22 MAR 2026", fechaISO: "2026-03-22", titulo: "Fuego Cruzado", opiniones: 19, totalOpinadores: 25, pulsoSentimiento: "positivo", visitas: 265 },
  { ranking: 6, fecha: "12 MAR 2026", fechaISO: "2026-03-12", titulo: "Sin Red", opiniones: 23, totalOpinadores: 25, pulsoSentimiento: "negativo", visitas: 220 },
];
