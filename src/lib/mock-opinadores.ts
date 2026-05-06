import { getStatusColor } from "@/lib/colors";

export type OpinadorAdmin = {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  ciudad: string;
  edad: number;
  fechaInicio: string;
  diasParticipados: number;
  totalDias: number;
  noticiasOpinadas: number;
  totalNoticias: number;
  ediciones: {
    fecha: string;
    fechaISO: string;
    titulo: string;
    completadas: number;
    total: number;
  }[];
};

export const getParticipacionColor = getStatusColor;

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
      { fecha: "04 MAY 2026", fechaISO: "2026-05-04", titulo: "Equilibrio Ciego", completadas: 5, total: 5 },
      { fecha: "03 MAY 2026", fechaISO: "2026-05-03", titulo: "La Línea del Frente", completadas: 5, total: 5 },
      { fecha: "02 MAY 2026", fechaISO: "2026-05-02", titulo: "Manos Atadas", completadas: 4, total: 5 },
      { fecha: "01 MAY 2026", fechaISO: "2026-05-01", titulo: "El Precio del Orden", completadas: 5, total: 5 },
      { fecha: "30 ABR 2026", fechaISO: "2026-04-30", titulo: "Fuego Cruzado", completadas: 3, total: 5 },
      { fecha: "29 ABR 2026", fechaISO: "2026-04-29", titulo: "Sin Red", completadas: 5, total: 5 },
      { fecha: "28 ABR 2026", fechaISO: "2026-04-28", titulo: "La Hora del Ajuste", completadas: 5, total: 5 },
      { fecha: "27 ABR 2026", fechaISO: "2026-04-27", titulo: "Pulso Incierto", completadas: 2, total: 5 },
      { fecha: "26 ABR 2026", fechaISO: "2026-04-26", titulo: "El Tablero Roto", completadas: 5, total: 5 },
      { fecha: "25 ABR 2026", fechaISO: "2026-04-25", titulo: "Tensión en el Margen", completadas: 5, total: 5 },
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
      { fecha: "04 MAY 2026", fechaISO: "2026-05-04", titulo: "Equilibrio Ciego", completadas: 5, total: 5 },
      { fecha: "03 MAY 2026", fechaISO: "2026-05-03", titulo: "La Línea del Frente", completadas: 5, total: 5 },
      { fecha: "02 MAY 2026", fechaISO: "2026-05-02", titulo: "Manos Atadas", completadas: 5, total: 5 },
      { fecha: "01 MAY 2026", fechaISO: "2026-05-01", titulo: "El Precio del Orden", completadas: 4, total: 5 },
      { fecha: "30 ABR 2026", fechaISO: "2026-04-30", titulo: "Fuego Cruzado", completadas: 5, total: 5 },
      { fecha: "29 ABR 2026", fechaISO: "2026-04-29", titulo: "Sin Red", completadas: 5, total: 5 },
      { fecha: "28 ABR 2026", fechaISO: "2026-04-28", titulo: "La Hora del Ajuste", completadas: 5, total: 5 },
      { fecha: "27 ABR 2026", fechaISO: "2026-04-27", titulo: "Pulso Incierto", completadas: 5, total: 5 },
      { fecha: "26 ABR 2026", fechaISO: "2026-04-26", titulo: "El Tablero Roto", completadas: 5, total: 5 },
      { fecha: "25 ABR 2026", fechaISO: "2026-04-25", titulo: "Tensión en el Margen", completadas: 5, total: 5 },
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
      { fecha: "04 MAY 2026", fechaISO: "2026-05-04", titulo: "Equilibrio Ciego", completadas: 2, total: 5 },
      { fecha: "03 MAY 2026", fechaISO: "2026-05-03", titulo: "La Línea del Frente", completadas: 5, total: 5 },
      { fecha: "02 MAY 2026", fechaISO: "2026-05-02", titulo: "Manos Atadas", completadas: 3, total: 5 },
      { fecha: "01 MAY 2026", fechaISO: "2026-05-01", titulo: "El Precio del Orden", completadas: 1, total: 5 },
      { fecha: "30 ABR 2026", fechaISO: "2026-04-30", titulo: "Fuego Cruzado", completadas: 5, total: 5 },
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
      { fecha: "04 MAY 2026", fechaISO: "2026-05-04", titulo: "Equilibrio Ciego", completadas: 5, total: 5 },
      { fecha: "03 MAY 2026", fechaISO: "2026-05-03", titulo: "La Línea del Frente", completadas: 5, total: 5 },
      { fecha: "02 MAY 2026", fechaISO: "2026-05-02", titulo: "Manos Atadas", completadas: 5, total: 5 },
      { fecha: "01 MAY 2026", fechaISO: "2026-05-01", titulo: "El Precio del Orden", completadas: 5, total: 5 },
      { fecha: "30 ABR 2026", fechaISO: "2026-04-30", titulo: "Fuego Cruzado", completadas: 5, total: 5 },
      { fecha: "29 ABR 2026", fechaISO: "2026-04-29", titulo: "Sin Red", completadas: 5, total: 5 },
      { fecha: "28 ABR 2026", fechaISO: "2026-04-28", titulo: "La Hora del Ajuste", completadas: 5, total: 5 },
      { fecha: "27 ABR 2026", fechaISO: "2026-04-27", titulo: "Pulso Incierto", completadas: 5, total: 5 },
      { fecha: "26 ABR 2026", fechaISO: "2026-04-26", titulo: "El Tablero Roto", completadas: 4, total: 5 },
      { fecha: "25 ABR 2026", fechaISO: "2026-04-25", titulo: "Tensión en el Margen", completadas: 5, total: 5 },
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
      { fecha: "04 MAY 2026", fechaISO: "2026-05-04", titulo: "Equilibrio Ciego", completadas: 1, total: 5 },
      { fecha: "03 MAY 2026", fechaISO: "2026-05-03", titulo: "La Línea del Frente", completadas: 5, total: 5 },
      { fecha: "02 MAY 2026", fechaISO: "2026-05-02", titulo: "Manos Atadas", completadas: 2, total: 5 },
    ],
  },
];

export type Postulacion = {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  ciudad: string;
  edad: number;
  fechaPostulacion: string;
  motivacion: string;
  estado: "pendiente" | "rechazado";
};

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
