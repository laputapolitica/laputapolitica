"use server";

import { createClient } from "@/lib/supabase/server";

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

const SENTIMENTS: OpinionSentiment[] = ["positiva", "negativa", "incierta"];

export async function enviarOpinion(
  data: OpinionData,
): Promise<EnviarOpinionResult> {
  const texto = data.texto?.trim() ?? "";

  if (!texto || !data.sentiment) {
    return { error: "Completá la opinión y elegí un sentiment" };
  }

  if (!SENTIMENTS.includes(data.sentiment)) {
    return { error: "Sentiment inválido" };
  }

  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    return { error: "Tu sesión expiró. Volvé a iniciar sesión." };
  }

  const { error } = await supabase.from("opiniones").insert({
    opinador_id: user.id,
    noticia_id: data.noticia_id,
    texto,
    sentiment: data.sentiment,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Ya enviaste tu opinión sobre esta noticia." };
    }
    console.error("Error insertando opinión:", error.message);
    return { error: "No pudimos enviar tu opinión. Intentá de nuevo." };
  }

  return { success: true };
}
