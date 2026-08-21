"use client";

import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { HeaderElPulso } from "@/components/opinadores";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "h-12 rounded-[6px] border border-border-default bg-white px-3.5 font-ui text-[15px] text-text-primary placeholder:text-text-secondary focus-visible:ring-1 focus-visible:ring-text-primary focus-visible:ring-offset-0";
const labelClass =
  "font-ui text-[11px] font-semibold uppercase tracking-[0.08em] text-text-secondary";

export function LoginClient(): React.ReactElement {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
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
    <main className="flex h-[100dvh] flex-col overflow-hidden bg-bg-base text-text-primary">
      <header className="flex w-full flex-none items-center justify-between px-5 py-4 lg:border-b lg:border-border-default lg:px-8 lg:py-5">
        <HeaderElPulso />
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="hidden lg:flex lg:w-[46%] lg:max-w-[640px] lg:flex-col lg:items-center lg:justify-center lg:overflow-hidden lg:border-r lg:border-border-default lg:px-12 lg:text-center">
          <div className="relative mb-9 h-[320px] w-full max-w-[420px]">
            <Image
              src="/onboarding/slide-1.png"
              alt=""
              fill
              priority
              sizes="420px"
              className="object-contain"
            />
          </div>
          <h1 className="font-display text-[36px] font-normal leading-[1.1] text-text-primary">
            Iniciá sesión
          </h1>
          <p className="mt-4 max-w-[380px] font-editorial text-[16px] leading-relaxed text-text-secondary">
            Entrá para sumar tu mirada a la edición de hoy.
          </p>
        </aside>

        <div className="min-h-0 flex-1 lg:flex lg:flex-col lg:overflow-y-auto">
          <form onSubmit={handleSubmit} className="flex h-full flex-col">
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pb-8 pt-4 lg:px-8 lg:py-8">
              <div className="mx-auto flex w-full max-w-[440px] flex-col lg:my-auto lg:max-w-[460px]">
                <header className="text-center lg:hidden">
                  <h1 className="font-display text-[26px] font-normal leading-tight text-text-primary">
                    Iniciá sesión
                  </h1>
                </header>

                <div className="mt-7 flex flex-col gap-4 text-left lg:mt-0">
                  <label className="flex flex-col gap-2">
                    <span className={labelClass}>Email</span>
                    <Input
                      className={inputClass}
                      inputMode="email"
                      name="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className={labelClass}>Contraseña</span>
                    <div className="relative">
                      <Input
                        className={`${inputClass} pr-11`}
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
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
                  </label>

                  {error ? (
                    <p className="text-center font-ui text-sm text-state-required">{error}</p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex-none border-t border-border-default bg-bg-base px-6 py-4 lg:px-8 lg:py-5">
              <div className="mx-auto w-full max-w-[440px] lg:max-w-[460px]">
                <button
                  type="submit"
                  disabled={isPending}
                  className="h-[52px] w-full rounded-[11px] border border-b-4 border-[#B6B0A5] bg-bg-base font-ui text-base font-bold text-text-primary transition-all duration-100 ease-out active:translate-y-[3px] active:border-b active:bg-[#F1EEE7] disabled:opacity-60"
                >
                  {isPending ? "Entrando..." : "Entrar"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
