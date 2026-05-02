"use server";

export type OpinionSentiment = "positiva" | "negativa" | "incierta";

export interface OpinionData {
  noticia_id: string;
  texto: string;
  sentiment: OpinionSentiment;
}

export type EnviarOpinionResult = {
  error?: string;
  success?: boolean;
};

export async function enviarOpinion(
  data: OpinionData,
): Promise<EnviarOpinionResult> {
  if (!data.texto || !data.sentiment) {
    return { error: "Completá la opinión y elegí un sentiment" };
  }

  // TODO: insertar en tabla opiniones de Supabase.
  console.log("Nueva opinión:", data);

  return { success: true };
}
