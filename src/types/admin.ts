import type { PipelineNodeId } from "@/components/admin/PipelineDiagram";

// ─── Usuarios y roles ───────────────────────────────────────────────
export type RolAdmin = "Admin" | "Editor" | "Director";

export type Usuario = {
  id: string;
  nombre: string;
  email: string;
  fechaDesde: string;
  rol: RolAdmin;
};

// ─── Ediciones ──────────────────────────────────────────────────────
export type EstadoEdicion = {
  nodo: PipelineNodeId;
  status: "done" | "running" | "pending";
};

export type Edicion = {
  fecha: string;
  fechaISO: string;
  titulo: string;
  opiniones: number;
  totalOpinadores: number;
  horaPublicacion: string;
  estado: EstadoEdicion;
};

// ─── Opinadores ─────────────────────────────────────────────────────
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
    votos: (string | null)[];
  }[];
};

export type Postulacion = {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  ciudad: string;
  edad: number;
  fechaPostulacion: string;
  motivacion: string;
  estado: "pendiente" | "rechazado";
};

// ─── Métricas ───────────────────────────────────────────────────────
export type KPI = {
  label: string;
  valor: string;
  descripcion: string;
};

export type ParticipacionDia = {
  fecha: string;
  participaron: number;
  noParticiparon: number;
};

export type VisitasDia = {
  fecha: string;
  visitas: number;
};

export type PulsoSentimiento = "positivo" | "negativo" | "incierto";

export type EdicionMasVista = {
  ranking: number;
  fecha: string;
  fechaISO: string;
  titulo: string;
  opiniones: number;
  totalOpinadores: number;
  pulsoSentimiento: PulsoSentimiento;
  visitas: number;
};
