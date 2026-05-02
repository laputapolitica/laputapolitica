"use client";

import { Eye, EyeOff } from "lucide-react";
import { useActionState, useState } from "react";

import { Input } from "@/components/ui/input";

import { loginAdmin } from "./actions";

type LoginAdminState = {
  error?: string;
};

const initialState: LoginAdminState = {};

export function LoginAdminClient() {
  const [state, formAction, isPending] = useActionState(
    loginAdmin,
    initialState,
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-base px-5 pt-16">
      <form
        action={formAction}
        className="w-[360px] rounded-[4px] border border-admin-ink p-12"
      >
        <div className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="admin-email"
              className="inline-flex rounded-[4px] border border-admin-ink px-2 py-0.5 font-ui text-sm text-text-primary"
            >
              Email
            </label>
            <Input
              id="admin-email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              required
              className="rounded-[4px] border-border-default bg-bg-base font-ui"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="admin-password"
              className="inline-flex rounded-[4px] border border-admin-ink px-2 py-0.5 font-ui text-sm text-text-primary"
            >
              Contraseña
            </label>
            <div className="relative">
              <Input
                id="admin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="rounded-[4px] border-border-default bg-bg-base pr-11 font-ui"
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

          {state.error ? (
            <p className="font-ui text-sm text-state-required">{state.error}</p>
          ) : null}

          <button
            type="submit"
            disabled={isPending}
            className="h-10 w-full rounded-[4px] bg-admin-ink font-ui text-sm font-medium text-bg-base disabled:opacity-60"
          >
            Entrar
          </button>
        </div>
      </form>
    </main>
  );
}
