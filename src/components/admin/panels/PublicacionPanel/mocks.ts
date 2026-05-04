import { VOTE_COLORS } from "@/lib/constants";
import type { Canal, ClimaDia, MockOpinador, MockOpinion, NoticiaPublicacion } from "./types";

export const canales: { id: Canal; label: string }[] = [
  { id: "web", label: "Web" },
  { id: "instagram", label: "Instagram" },
  { id: "twitter", label: "X (Twitter)" },
];

export const noticias: NoticiaPublicacion[] = [
  {
    id: "transporte",
    titulo: "Ajustes y subsidios al transporte",
    resumen:
      "El Gobierno reabrió la discusión por los subsidios al transporte y las provincias buscan evitar que el ajuste caiga entero sobre los usuarios.",
    pulso:
      "La comunidad leyó la medida como una corrección necesaria, pero socialmente riesgosa para quienes viajan todos los días.",
    pulsoTwitter:
      "EL PULSO\nLa comunidad leyó la medida como una corrección necesaria, pero socialmente riesgosa para quienes viajan todos los días.\n🟢 32% Positiva\n🔴 46% Negativa\n🟣 22% Incierta",
    interpretacion: { positiva: 32, negativa: 46, incierta: 22 },
  },
  {
    id: "fmi",
    titulo: "Negociaciones con el FMI",
    resumen:
      "La Casa Rosada muestra respaldo financiero mientras gobernadores y oposición miden cuánto margen social queda para sostener el programa.",
    pulso:
      "El acuerdo aparece como alivio de corto plazo, aunque persisten dudas sobre su costo político y social.",
    pulsoTwitter:
      "EL PULSO\nEl acuerdo aparece como alivio de corto plazo, aunque persisten dudas sobre su costo político y social.\n🟢 36% Positiva\n🔴 39% Negativa\n🟣 25% Incierta",
    interpretacion: { positiva: 36, negativa: 39, incierta: 25 },
  },
  {
    id: "gobernadores",
    titulo: "Conflicto con gobernadores",
    resumen:
      "La disputa por fondos tensó la relación con Nación y reabrió una pulseada por obras, cajas provinciales y poder territorial.",
    pulso:
      "Predominó una lectura pragmática: nadie quiere romper, pero todos buscan mostrar poder propio antes de negociar.",
    pulsoTwitter:
      "EL PULSO\nPredomina una lectura pragmática: nadie quiere romper, pero todos buscan mostrar poder propio antes de negociar.\n🟢 24% Positiva\n🔴 51% Negativa\n🟣 25% Incierta",
    interpretacion: { positiva: 24, negativa: 51, incierta: 25 },
  },
  {
    id: "legislativo",
    titulo: "Reformas legislativas",
    resumen:
      "El oficialismo empuja cambios clave, pero cada artículo obliga a renegociar con bloques que quieren mostrar independencia.",
    pulso:
      "Los opinadores ven voluntad de cambio, aunque desconfían de una negociación acelerada y poco transparente.",
    pulsoTwitter:
      "EL PULSO\nLos opinadores ven voluntad de cambio, aunque desconfían de una negociación acelerada y poco transparente.\n🟢 41% Positiva\n🔴 34% Negativa\n🟣 25% Incierta",
    interpretacion: { positiva: 41, negativa: 34, incierta: 25 },
  },
  {
    id: "clima-social",
    titulo: "Clima social y protestas",
    resumen:
      "Las protestas muestran una tensión persistente entre el ajuste, la caída del poder adquisitivo y la búsqueda oficial de estabilidad.",
    pulso:
      "La preocupación social domina la conversación: hay cansancio, pero también cautela frente a una escalada del conflicto.",
    pulsoTwitter:
      "EL PULSO\nLa preocupación social domina la conversación: hay cansancio, pero también cautela frente a una escalada del conflicto.\n🟢 18% Positiva\n🔴 58% Negativa\n🟣 24% Incierta",
    interpretacion: { positiva: 18, negativa: 58, incierta: 24 },
  },
];

export const clima: ClimaDia[] = [
  { dia: "Miércoles", min: 12, max: 22 },
  { dia: "Jueves", min: 14, max: 24 },
  { dia: "Viernes", min: 11, max: 21 },
];

export const mockOpinadores: MockOpinador[] = [
  {
    id: 1,
    nombre: "Juan Perez",
    email: "juanperez@email.com",
    ciudad: "Buenos Aires",
    votos: [VOTE_COLORS.negativa, VOTE_COLORS.incierta, VOTE_COLORS.negativa, VOTE_COLORS.positiva, VOTE_COLORS.negativa],
    completadas: 5,
    ultimaRespuesta: "20:38",
  },
  {
    id: 2,
    nombre: "Maria Lopez",
    email: "marialopez@email.com",
    ciudad: "Cordoba",
    votos: [VOTE_COLORS.negativa, VOTE_COLORS.positiva, VOTE_COLORS.negativa, VOTE_COLORS.incierta, VOTE_COLORS.negativa],
    completadas: 5,
    ultimaRespuesta: "20:35",
  },
  {
    id: 3,
    nombre: "Carlos Ruiz",
    email: "carlosruiz@email.com",
    ciudad: "Rosario",
    votos: [VOTE_COLORS.negativa, VOTE_COLORS.incierta, null, null, null],
    completadas: 3,
    ultimaRespuesta: "20:30",
  },
  {
    id: 4,
    nombre: "Ana Garcia",
    email: "anagarcia@email.com",
    ciudad: "Mendoza",
    votos: [VOTE_COLORS.negativa, VOTE_COLORS.incierta, VOTE_COLORS.positiva, VOTE_COLORS.positiva, VOTE_COLORS.negativa],
    completadas: 5,
    ultimaRespuesta: "20:20",
  },
  {
    id: 5,
    nombre: "Pedro Sanchez",
    email: "pedrosanchez@email.com",
    ciudad: "La Plata",
    votos: [VOTE_COLORS.negativa, null, null, null, null],
    completadas: 1,
    ultimaRespuesta: "20:15",
  },
  {
    id: 6,
    nombre: "Lucia Diaz",
    email: "luciadiaz@email.com",
    ciudad: "Tucuman",
    votos: [VOTE_COLORS.negativa, VOTE_COLORS.positiva, VOTE_COLORS.negativa, VOTE_COLORS.positiva, VOTE_COLORS.incierta],
    completadas: 5,
    ultimaRespuesta: "20:10",
  },
  {
    id: 7,
    nombre: "Diego Romero",
    email: "diegoromero@email.com",
    ciudad: "Salta",
    votos: [VOTE_COLORS.negativa, VOTE_COLORS.incierta, null, null, null],
    completadas: 2,
    ultimaRespuesta: "20:05",
  },
  {
    id: 8,
    nombre: "Sofia Martinez",
    email: "sofiamartinez@email.com",
    ciudad: "Mar del Plata",
    votos: [VOTE_COLORS.negativa, VOTE_COLORS.positiva, VOTE_COLORS.negativa, VOTE_COLORS.incierta, VOTE_COLORS.negativa],
    completadas: 5,
    ultimaRespuesta: "20:00",
  },
];

export const mockOpiniones: MockOpinion[] = [
  {
    noticia: "Ajustes y subsidios al transporte",
    texto:
      "Predominó una lectura crítica de la medida, marcada por la preocupación por su impacto social y por la falta de precisiones sobre su implementación. Entre los argumentos más repetidos apareció la idea de que el ajuste podría trasladarse directamente a los usuarios del transporte, con efectos desiguales según la región.",
    interpretacion: "Negativa",
    color: VOTE_COLORS.negativa,
  },
  {
    noticia: "Negociaciones con el FMI",
    texto:
      "El acuerdo aparece como un alivio necesario de corto plazo, pero la comunidad desconfía de su costo político y social a largo plazo. Predominó la incertidumbre sobre los efectos reales del programa.",
    interpretacion: "Incierta",
    color: VOTE_COLORS.incierta,
  },
  {
    noticia: "Conflicto con gobernadores",
    texto:
      "Nadie quiere romper, pero todos muestran fuerza antes de negociar. La lectura fue pragmática: el conflicto es una pulseada de poder más que una crisis institucional.",
    interpretacion: "Negativa",
    color: VOTE_COLORS.negativa,
  },
  {
    noticia: "Reformas legislativas",
    texto:
      "Hay voluntad de cambio pero desconfianza en el proceso. La negociación acelerada y poco transparente genera más dudas que certezas entre los opinadores.",
    interpretacion: "Positiva",
    color: VOTE_COLORS.positiva,
  },
  {
    noticia: "Clima social y protestas",
    texto:
      "El cansancio social es real pero hay cautela frente a la escalada. La preocupación domina pero no hay consenso sobre hacia dónde va el conflicto.",
    interpretacion: "Negativa",
    color: VOTE_COLORS.negativa,
  },
];
