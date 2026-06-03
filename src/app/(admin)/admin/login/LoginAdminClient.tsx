"use client";

import { Eye, EyeOff } from "lucide-react";
import { useActionState, useState } from "react";

import { Input } from "@/components/ui/input";
import {
  AdminButton,
  DataPill,
  adminInputClasses,
} from "@/components/admin/shared";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isReady = email.trim() !== "" && password.trim() !== "";

  return (
    <main className="flex min-h-0 flex-1 items-center justify-center bg-bg-base px-5">
      <form
        action={formAction}
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

          {state.error ? (
            <p className="font-ui text-sm text-state-required">{state.error}</p>
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
