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
