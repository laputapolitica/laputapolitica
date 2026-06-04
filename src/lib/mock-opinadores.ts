import { getStatusColor } from "@/lib/colors";
import { VOTE_COLORS } from "@/lib/constants";
export type { OpinadorAdmin, Postulacion } from "@/types/admin";
import type { OpinadorAdmin, Postulacion } from "@/types/admin";

export const getParticipacionColor = getStatusColor;

const votosPositivos = [
  VOTE_COLORS.positiva,
  VOTE_COLORS.positiva,
  VOTE_COLORS.negativa,
  VOTE_COLORS.incierta,
  VOTE_COLORS.positiva,
];

const votosMixtos = [
  VOTE_COLORS.negativa,
  VOTE_COLORS.positiva,
  VOTE_COLORS.incierta,
  VOTE_COLORS.positiva,
  VOTE_COLORS.negativa,
];

const votosConPendiente = [
  VOTE_COLORS.positiva,
  VOTE_COLORS.incierta,
  VOTE_COLORS.negativa,
  VOTE_COLORS.positiva,
  null,
];

const votosTensos = [
  VOTE_COLORS.negativa,
  VOTE_COLORS.negativa,
  VOTE_COLORS.incierta,
  null,
  VOTE_COLORS.positiva,
];

const votosIncompletos = [
  VOTE_COLORS.incierta,
  null,
  VOTE_COLORS.negativa,
  null,
  VOTE_COLORS.positiva,
];

const votosMinimos = [
  VOTE_COLORS.positiva,
  null,
  null,
  null,
  null,
];

const votosCompletosInciertos = [
  VOTE_COLORS.incierta,
  VOTE_COLORS.positiva,
  VOTE_COLORS.incierta,
  VOTE_COLORS.negativa,
  VOTE_COLORS.positiva,
];

export const mockOpinadores: OpinadorAdmin[] = [
  {
    id: 1,
    nombre: "Juan Perez",
    email: "juanperez@email.com",
    telefono: "+54 11 1234-5678",
    ciudad: "Buenos Aires",
    edad: 22,
    fechaInicio: "12/02/2026",
    diasParticipados: 18,
    totalDias: 37,
    noticiasOpinadas: 84,
    totalNoticias: 185,
    ediciones: [
      { fecha: "04 MAY 2026", fechaISO: "2026-05-04", titulo: "Equilibrio Ciego", votos: votosPositivos },
      { fecha: "03 MAY 2026", fechaISO: "2026-05-03", titulo: "La Línea del Frente", votos: votosCompletosInciertos },
      { fecha: "02 MAY 2026", fechaISO: "2026-05-02", titulo: "Manos Atadas", votos: votosConPendiente },
      { fecha: "01 MAY 2026", fechaISO: "2026-05-01", titulo: "El Precio del Orden", votos: votosMixtos },
      { fecha: "30 ABR 2026", fechaISO: "2026-04-30", titulo: "Fuego Cruzado", votos: votosTensos },
      { fecha: "29 ABR 2026", fechaISO: "2026-04-29", titulo: "Sin Red", votos: votosPositivos },
      { fecha: "28 ABR 2026", fechaISO: "2026-04-28", titulo: "La Hora del Ajuste", votos: votosMixtos },
      { fecha: "27 ABR 2026", fechaISO: "2026-04-27", titulo: "Pulso Incierto", votos: votosIncompletos },
      { fecha: "26 ABR 2026", fechaISO: "2026-04-26", titulo: "El Tablero Roto", votos: votosCompletosInciertos },
      { fecha: "25 ABR 2026", fechaISO: "2026-04-25", titulo: "Tensión en el Margen", votos: votosPositivos },
    ],
  },
  {
    id: 2,
    nombre: "Maria Lopez",
    email: "marialopez@email.com",
    telefono: "+54 11 2345-6789",
    ciudad: "Córdoba",
    edad: 28,
    fechaInicio: "15/02/2026",
    diasParticipados: 25,
    totalDias: 37,
    noticiasOpinadas: 120,
    totalNoticias: 185,
    ediciones: [
      { fecha: "04 MAY 2026", fechaISO: "2026-05-04", titulo: "Equilibrio Ciego", votos: votosCompletosInciertos },
      { fecha: "03 MAY 2026", fechaISO: "2026-05-03", titulo: "La Línea del Frente", votos: votosPositivos },
      { fecha: "02 MAY 2026", fechaISO: "2026-05-02", titulo: "Manos Atadas", votos: votosMixtos },
      { fecha: "01 MAY 2026", fechaISO: "2026-05-01", titulo: "El Precio del Orden", votos: votosConPendiente },
      { fecha: "30 ABR 2026", fechaISO: "2026-04-30", titulo: "Fuego Cruzado", votos: votosCompletosInciertos },
      { fecha: "29 ABR 2026", fechaISO: "2026-04-29", titulo: "Sin Red", votos: votosMixtos },
      { fecha: "28 ABR 2026", fechaISO: "2026-04-28", titulo: "La Hora del Ajuste", votos: votosPositivos },
      { fecha: "27 ABR 2026", fechaISO: "2026-04-27", titulo: "Pulso Incierto", votos: votosCompletosInciertos },
      { fecha: "26 ABR 2026", fechaISO: "2026-04-26", titulo: "El Tablero Roto", votos: votosMixtos },
      { fecha: "25 ABR 2026", fechaISO: "2026-04-25", titulo: "Tensión en el Margen", votos: votosPositivos },
    ],
  },
  {
    id: 3,
    nombre: "Carlos Ruiz",
    email: "carlosruiz@email.com",
    telefono: "+54 11 3456-7890",
    ciudad: "Rosario",
    edad: 35,
    fechaInicio: "01/03/2026",
    diasParticipados: 10,
    totalDias: 37,
    noticiasOpinadas: 45,
    totalNoticias: 185,
    ediciones: [
      { fecha: "04 MAY 2026", fechaISO: "2026-05-04", titulo: "Equilibrio Ciego", votos: votosIncompletos },
      { fecha: "03 MAY 2026", fechaISO: "2026-05-03", titulo: "La Línea del Frente", votos: votosMixtos },
      { fecha: "02 MAY 2026", fechaISO: "2026-05-02", titulo: "Manos Atadas", votos: votosTensos },
      { fecha: "01 MAY 2026", fechaISO: "2026-05-01", titulo: "El Precio del Orden", votos: votosMinimos },
      { fecha: "30 ABR 2026", fechaISO: "2026-04-30", titulo: "Fuego Cruzado", votos: votosCompletosInciertos },
    ],
  },
  {
    id: 4,
    nombre: "Ana Garcia",
    email: "anagarcia@email.com",
    telefono: "+54 11 4567-8901",
    ciudad: "Mendoza",
    edad: 31,
    fechaInicio: "20/01/2026",
    diasParticipados: 32,
    totalDias: 37,
    noticiasOpinadas: 158,
    totalNoticias: 185,
    ediciones: [
      { fecha: "04 MAY 2026", fechaISO: "2026-05-04", titulo: "Equilibrio Ciego", votos: votosPositivos },
      { fecha: "03 MAY 2026", fechaISO: "2026-05-03", titulo: "La Línea del Frente", votos: votosCompletosInciertos },
      { fecha: "02 MAY 2026", fechaISO: "2026-05-02", titulo: "Manos Atadas", votos: votosMixtos },
      { fecha: "01 MAY 2026", fechaISO: "2026-05-01", titulo: "El Precio del Orden", votos: votosPositivos },
      { fecha: "30 ABR 2026", fechaISO: "2026-04-30", titulo: "Fuego Cruzado", votos: votosCompletosInciertos },
      { fecha: "29 ABR 2026", fechaISO: "2026-04-29", titulo: "Sin Red", votos: votosMixtos },
      { fecha: "28 ABR 2026", fechaISO: "2026-04-28", titulo: "La Hora del Ajuste", votos: votosPositivos },
      { fecha: "27 ABR 2026", fechaISO: "2026-04-27", titulo: "Pulso Incierto", votos: votosCompletosInciertos },
      { fecha: "26 ABR 2026", fechaISO: "2026-04-26", titulo: "El Tablero Roto", votos: votosConPendiente },
      { fecha: "25 ABR 2026", fechaISO: "2026-04-25", titulo: "Tensión en el Margen", votos: votosMixtos },
    ],
  },
  {
    id: 5,
    nombre: "Pedro Sanchez",
    email: "pedrosanchez@email.com",
    telefono: "+54 11 5678-9012",
    ciudad: "La Plata",
    edad: 19,
    fechaInicio: "10/03/2026",
    diasParticipados: 5,
    totalDias: 37,
    noticiasOpinadas: 22,
    totalNoticias: 185,
    ediciones: [
      { fecha: "04 MAY 2026", fechaISO: "2026-05-04", titulo: "Equilibrio Ciego", votos: votosMinimos },
      { fecha: "03 MAY 2026", fechaISO: "2026-05-03", titulo: "La Línea del Frente", votos: votosPositivos },
      { fecha: "02 MAY 2026", fechaISO: "2026-05-02", titulo: "Manos Atadas", votos: votosIncompletos },
    ],
  },
];

export const mockPostulaciones: Postulacion[] = [
  { id: 101, nombre: "Lucas Fernandez", email: "lucasfernandez@email.com", telefono: "+54 11 6789-0123", ciudad: "Buenos Aires", edad: 24, fechaPostulacion: "20/03/2026", motivacion: "Me interesa participar activamente en la política argentina y creo que mi perspectiva como joven profesional puede aportar valor a la comunidad de opinadores.", estado: "pendiente" },
  { id: 102, nombre: "Valentina Torres", email: "valentinat@email.com", telefono: "+54 11 7890-1234", ciudad: "Córdoba", edad: 29, fechaPostulacion: "19/03/2026", motivacion: "Soy politóloga y sigo de cerca la actualidad nacional. Quiero contribuir con análisis fundamentados y ayudar a construir un espacio de opinión diverso.", estado: "pendiente" },
  { id: 103, nombre: "Mateo Rodriguez", email: "mateor@email.com", telefono: "+54 11 8901-2345", ciudad: "Rosario", edad: 31, fechaPostulacion: "18/03/2026", motivacion: "Trabajo en el sector público y veo de cerca cómo las decisiones políticas afectan la vida cotidiana. Me gustaría expresar esa perspectiva.", estado: "pendiente" },
  { id: 104, nombre: "Camila Gutierrez", email: "camilag@email.com", telefono: "+54 11 9012-3456", ciudad: "Mendoza", edad: 26, fechaPostulacion: "17/03/2026", motivacion: "Soy estudiante de ciencias políticas y me parece muy valioso este tipo de plataformas para amplificar voces ciudadanas.", estado: "pendiente" },
  { id: 105, nombre: "Santiago Morales", email: "santiagom@email.com", telefono: "+54 11 0123-4567", ciudad: "La Plata", edad: 33, fechaPostulacion: "16/03/2026", motivacion: "Leo LPP todos los días y creo que puedo aportar una mirada crítica y constructiva sobre la actualidad política.", estado: "pendiente" },
  { id: 201, nombre: "Roberto Silva", email: "robertos@email.com", telefono: "+54 11 1234-5678", ciudad: "Buenos Aires", edad: 45, fechaPostulacion: "10/03/2026", motivacion: "Quiero participar.", estado: "rechazado" },
  { id: 202, nombre: "Marcela Lopez", email: "marcelal@email.com", telefono: "+54 11 2345-6789", ciudad: "Tucumán", edad: 52, fechaPostulacion: "09/03/2026", motivacion: "Me parece interesante.", estado: "rechazado" },
  { id: 203, nombre: "Federico Paz", email: "federicop@email.com", telefono: "+54 11 3456-7890", ciudad: "Salta", edad: 38, fechaPostulacion: "08/03/2026", motivacion: "Quiero opinar sobre política.", estado: "rechazado" },
];

export const mockPendientes = mockPostulaciones.filter(p => p.estado === "pendiente");
export const mockRechazados = mockPostulaciones.filter(p => p.estado === "rechazado");
