export type { EstadoEdicion, Edicion } from "@/types/admin";
import type { Edicion } from "@/types/admin";

export const mockEdiciones: Edicion[] = [
  { fecha: "04 MAY 2026", fechaISO: "2026-05-04", titulo: "Equilibrio Ciego", opiniones: 14, totalOpinadores: 25, horaPublicacion: "22:03", estado: { nodo: "publicacion", status: "done" } },
  { fecha: "03 MAY 2026", fechaISO: "2026-05-03", titulo: "La Línea del Frente", opiniones: 18, totalOpinadores: 25, horaPublicacion: "21:58", estado: { nodo: "publicacion", status: "done" } },
  { fecha: "02 MAY 2026", fechaISO: "2026-05-02", titulo: "Manos Atadas", opiniones: 22, totalOpinadores: 25, horaPublicacion: "22:11", estado: { nodo: "publicacion", status: "done" } },
  { fecha: "01 MAY 2026", fechaISO: "2026-05-01", titulo: "El Precio del Orden", opiniones: 11, totalOpinadores: 25, horaPublicacion: "22:07", estado: { nodo: "publicacion", status: "done" } },
  { fecha: "30 ABR 2026", fechaISO: "2026-04-30", titulo: "Fuego Cruzado", opiniones: 19, totalOpinadores: 25, horaPublicacion: "21:55", estado: { nodo: "publicacion", status: "done" } },
  { fecha: "29 ABR 2026", fechaISO: "2026-04-29", titulo: "Sin Red", opiniones: 23, totalOpinadores: 25, horaPublicacion: "22:00", estado: { nodo: "publicacion", status: "done" } },
  { fecha: "28 ABR 2026", fechaISO: "2026-04-28", titulo: "La Hora del Ajuste", opiniones: 16, totalOpinadores: 25, horaPublicacion: "22:15", estado: { nodo: "publicacion", status: "done" } },
  { fecha: "27 ABR 2026", fechaISO: "2026-04-27", titulo: "Pulso Incierto", opiniones: 20, totalOpinadores: 25, horaPublicacion: "21:59", estado: { nodo: "publicacion", status: "done" } },
  { fecha: "26 ABR 2026", fechaISO: "2026-04-26", titulo: "El Tablero Roto", opiniones: 9, totalOpinadores: 25, horaPublicacion: "22:08", estado: { nodo: "publicacion", status: "done" } },
  { fecha: "25 ABR 2026", fechaISO: "2026-04-25", titulo: "Tensión en el Margen", opiniones: 21, totalOpinadores: 25, horaPublicacion: "22:02", estado: { nodo: "publicacion", status: "done" } },
];

// La edición del día (hoy, en curso)
export const edicionDelDia = {
  enCurso: true, // cuando sea false, pasa al listado automáticamente
};
