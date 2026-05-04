export type Canal = "web" | "instagram" | "twitter" | "elpulso";

export type NoticiaPublicacion = {
  id: string;
  titulo: string;
  resumen: string;
  pulso: string;
  pulsoTwitter: string;
  interpretacion: {
    positiva: number;
    negativa: number;
    incierta: number;
  };
};

export type ClimaDia = {
  dia: string;
  min: number;
  max: number;
};

export type MockOpinador = {
  id: number;
  nombre: string;
  email: string;
  ciudad: string;
  votos: (string | null)[];
  completadas: number;
  ultimaRespuesta: string;
};

export type MockOpinion = {
  noticia: string;
  texto: string;
  interpretacion: string;
  color: string;
};
