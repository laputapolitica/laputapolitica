"use server";

import { redirect } from "next/navigation";

type LoginAdminState = {
  error?: string;
};

export async function loginAdmin(
  _previousState: LoginAdminState,
  formData: FormData,
): Promise<LoginAdminState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    email === "admin@laputapolitica.com" &&
    password === "admin1234"
  ) {
    redirect("/admin");
  }

  return {
    error: "Email o contraseña incorrectos.",
  };
}
