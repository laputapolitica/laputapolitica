"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import {
  AdminButton,
  DataPill,
  adminInputClasses,
} from "@/components/admin/shared";

export function LoginAdminClient() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isPending, setIsPending] = useState(false);

  const isReady = email.trim() !== "" && password.trim() !== "";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setIsPending(true);

    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError || !data.user) {
        setError("Email o contraseña incorrectos.");
        setIsPending(false);
        return;
      }

      // Verificar que la cuenta sea staff activo (tiene fila en profiles).
      const { data: profile } = await supabase
        .from("profiles")
        .select("activo")
        .eq("id", data.user.id)
        .maybeSingle();

      if (!profile || !profile.activo) {
        await supabase.auth.signOut();
        setError("Esta cuenta no tiene acceso al panel.");
        setIsPending(false);
        return;
      }

      // Recarga completa para que el servidor lea la sesión recién creada.
      window.location.assign("/admin");
    } catch {
      setError("Ocurrió un error. Intentá de nuevo.");
      setIsPending(false);
    }
  }

  return (
    <main className="flex min-h-0 flex-1 items-center justify-center bg-bg-base px-5">
      <form
        onSubmit={handleSubmit}
        className="w-[360px] rounded-[4px] border border-admin-ink p-12"
      >
        <div className="space-y-5">
          <div className="space-y-2">
            <DataPill variant="subtle" className="w-fit">Email</DataPill>
            <Input
              id="admin-email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${adminInputClasses} w-full focus-visible:ring-0 focus-visible:ring-offset-0`}
            />
          </div>

          <div className="space-y-2">
            <DataPill variant="subtle" className="w-fit">Contraseña</DataPill>
            <div className="relative">
              <Input
                id="admin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${adminInputClasses} w-full pr-11 focus-visible:ring-0 focus-visible:ring-offset-0`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-text-secondary"
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error ? (
            <p className="font-ui text-sm text-state-required">{error}</p>
          ) : null}

          <AdminButton
            type="submit"
            size="md"
            variant={isReady ? "primary" : "default"}
            disabled={isPending}
            style={!isReady ? { backgroundColor: "transparent" } : undefined}
            className={`!w-full justify-center !text-xs ${isReady ? "!font-bold" : ""}`}
          >
            {isPending ? "Entrando..." : "Entrar"}
          </AdminButton>
        </div>
      </form>
    </main>
  );
}
