"use server";

import { redirect } from "next/navigation";

export type LoginOpinadorState = {
  error?: string;
};

export async function loginOpinador(
  _previousState: LoginOpinadorState,
  formData: FormData,
): Promise<LoginOpinadorState> {
  const numeroUsuario = String(formData.get("numero_usuario") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!numeroUsuario || !password) {
    return { error: "Completá todos los campos" };
  }

  // TODO: autenticar con Supabase usando @supabase/ssr.
  if (numeroUsuario === "00000001" && password === "test1234") {
    redirect("/el-pulso/dia");
  }

  return { error: "Número de usuario o contraseña incorrectos" };
}
