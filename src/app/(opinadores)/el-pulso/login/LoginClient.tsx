"use client";

import { Eye, EyeOff } from "lucide-react";
import { useActionState, useState } from "react";

import {
  loginOpinador,
  type LoginOpinadorState,
} from "@/app/(opinadores)/el-pulso/login/actions";
import { CountrySelector, ElPulsoLogo, Logo } from "@/components/shared";
import { Input } from "@/components/ui/input";

const fieldClassName =
  "h-12 rounded-lg border-border-default bg-white px-3 font-ui text-base text-text-primary placeholder:text-text-secondary focus-visible:ring-1 focus-visible:ring-text-primary focus-visible:ring-offset-0 md:text-base";

const labelClassName =
  "font-ui text-xs font-medium uppercase tracking-wider text-text-secondary";

export function LoginClient(): React.ReactElement {
  const initialState: LoginOpinadorState = {};
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(
    loginOpinador,
    initialState,
  );

  return (
    <main className="min-h-screen bg-bg-base text-text-primary">
      <header className="fixed left-0 top-0 z-50 flex w-full items-center justify-between bg-bg-base px-5 py-4">
        <div className="flex items-center gap-3">
          <Logo variant="small" className="h-10 w-auto" />
          <span aria-hidden="true" className="h-8 w-px bg-border-default" />
          <ElPulsoLogo className="h-[26px] w-auto" />
        </div>
        <CountrySelector />
      </header>

      <section className="flex min-h-screen items-center justify-center px-6 pb-20 pt-20">
        <div className="w-full max-w-sm">
          <h1 className="text-center font-display text-3xl font-normal leading-tight text-text-primary">
            Inicia sesión
          </h1>

          <form action={formAction} className="mt-10 flex flex-col gap-4">
            <FormField label="NUMERO DE USUARIO">
              <Input
                className={fieldClassName}
                inputMode="numeric"
                name="numero_usuario"
                placeholder="00000000"
                type="text"
              />
            </FormField>

            <FormField label="CONTRASEÑA">
              <div className="relative">
                <Input
                  className={`${fieldClassName} pr-12`}
                  name="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
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

            {state.error ? (
              <p className="pt-1 text-center font-ui text-sm text-state-required">
                {state.error}
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
