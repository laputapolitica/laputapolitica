"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { CountryIndicator, ElPulsoLogo, Logo } from "@/components/shared";
import { Input } from "@/components/ui/input";

const fieldClassName =
  "h-12 rounded-lg border-border-default bg-white px-3 font-ui text-base text-text-primary placeholder:text-text-secondary focus-visible:ring-1 focus-visible:ring-text-primary focus-visible:ring-offset-0 md:text-base";

const labelClassName =
  "font-ui text-xs font-medium uppercase tracking-wider text-text-secondary";

export function LoginClient(): React.ReactElement {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);

    const mail = email.trim();
    const pass = password.trim();

    if (!mail || !pass) {
      setError("Completá todos los campos");
      return;
    }

    setIsPending(true);

    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: mail,
        password: pass,
      });

      if (signInError || !data.user) {
        setError("Email o contraseña incorrectos");
        setIsPending(false);
        return;
      }

      // Verificar que sea un opinador activo.
      const { data: opinador } = await supabase
        .from("opinadores")
        .select("activo")
        .eq("id", data.user.id)
        .maybeSingle();

      if (!opinador || !opinador.activo) {
        await supabase.auth.signOut();
        setError("Esta cuenta no está habilitada");
        setIsPending(false);
        return;
      }

      window.location.assign("/el-pulso/dia");
    } catch {
      setError("Ocurrió un error. Intentá de nuevo.");
      setIsPending(false);
    }
  }

  return (
    <main className="min-h-screen bg-bg-base text-text-primary">
      <header className="fixed left-0 top-0 z-50 flex w-full items-center justify-between bg-bg-base px-5 py-4">
        <div className="flex items-center gap-3">
          <Logo variant="small" className="h-10 w-auto" />
          <span aria-hidden="true" className="h-8 w-px bg-border-default" />
          <ElPulsoLogo className="h-[26px] w-auto" />
        </div>
        <CountryIndicator />
      </header>

      <section className="flex min-h-screen items-center justify-center px-6 pb-20 pt-20">
        <div className="w-full max-w-sm">
          <h1 className="text-center font-display text-3xl font-normal leading-tight text-text-primary">
            Inicia sesión
          </h1>

          <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-4">
            <FormField label="EMAIL">
              <Input
                className={fieldClassName}
                inputMode="email"
                name="email"
                placeholder="tu@email.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormField>

            <FormField label="CONTRASEÑA">
              <div className="relative">
                <Input
                  className={`${fieldClassName} pr-12`}
                  name="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center bg-transparent text-text-secondary"
                >
                  {showPassword ? (
                    <EyeOff aria-hidden="true" size={20} strokeWidth={1.75} />
                  ) : (
                    <Eye aria-hidden="true" size={20} strokeWidth={1.75} />
                  )}
                </button>
              </div>
            </FormField>

            {error ? (
              <p className="pt-1 text-center font-ui text-sm text-state-required">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isPending}
              className="fixed bottom-0 left-0 z-[60] h-14 w-full bg-[#111111] font-ui text-base font-medium text-white disabled:opacity-70"
            >
              {isPending ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

type FormFieldProps = {
  label: string;
  children: React.ReactNode;
};

function FormField({ label, children }: FormFieldProps): React.ReactElement {
  return (
    <label className="flex flex-col gap-2">
      <span className={labelClassName}>{label}</span>
      {children}
    </label>
  );
}
