"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";

import {
  crearPostulacion,
  type CrearPostulacionState,
} from "@/app/(opinadores)/el-pulso/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const provinciasArgentinas = [
  "Buenos Aires", "CABA", "Catamarca", "Chaco", "Chubut", "Córdoba",
  "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja",
  "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan",
  "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero",
  "Tierra del Fuego", "Tucumán",
] as const;

const inputClass =
  "h-12 rounded-[10px] border border-border-default bg-white px-3.5 font-ui text-[15px] text-text-primary placeholder:text-text-secondary focus-visible:ring-1 focus-visible:ring-text-primary focus-visible:ring-offset-0";
const textareaClass =
  "min-h-28 resize-none rounded-[10px] border border-border-default bg-white px-3.5 py-3 font-ui text-[15px] text-text-primary placeholder:text-text-secondary focus-visible:ring-1 focus-visible:ring-text-primary focus-visible:ring-offset-0";
const labelClass =
  "font-ui text-[11px] font-semibold uppercase tracking-[0.08em] text-text-secondary";

export function PostulacionForm(): React.ReactElement {
  const [state, formAction, isPending] = useActionState<CrearPostulacionState, FormData>(
    crearPostulacion,
    {},
  );
  const [numero, setNumero] = useState("");

  if (state.success) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-2xl font-normal leading-tight text-text-primary">
          ¡Postulación enviada!
        </h1>
        <p className="mt-4 max-w-xs font-editorial text-base leading-relaxed text-text-secondary">
          Te contactamos pronto. Gracias por sumarte a El Pulso.
        </p>
        <Link
          href="/el-pulso"
          className="mt-8 inline-flex items-center font-ui text-[15px] font-bold text-text-primary"
        >
          <span className="underline underline-offset-[4px]">Volver</span>
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8 pt-4">
        <div className="mx-auto w-full max-w-[440px]">
          <header className="text-center">
            <h1 className="font-display text-[26px] font-normal leading-tight text-text-primary">
              Sumate como opinador
            </h1>
            <p className="mx-auto mt-2.5 max-w-[280px] font-editorial text-[14px] leading-relaxed text-text-secondary">
              Formá parte de la red que construye El Pulso. Tu voz importa.
            </p>
          </header>

          <div className="mt-7 flex flex-col gap-4 text-left">
            <label className="flex flex-col gap-2">
              <span className={labelClass}>Nombre completo</span>
              <Input className={inputClass} name="nombre" placeholder="Juan Pérez" required />
            </label>

            <label className="flex flex-col gap-2">
              <span className={labelClass}>Email</span>
              <Input className={inputClass} name="email" type="email" placeholder="tu@email.com" required />
            </label>

            <label className="flex flex-col gap-2">
              <span className={labelClass}>Teléfono</span>
              <div className="flex h-12 items-stretch overflow-hidden rounded-[10px] border border-border-default bg-white">
                <span className="flex items-center border-r border-border-default bg-[#F3F1EB] px-3.5 font-ui text-[15px] font-semibold text-text-primary">
                  +54
                </span>
                <input
                  inputMode="tel"
                  required
                  value={numero}
                  onChange={(event) => setNumero(event.target.value)}
                  placeholder="11 1234-5678"
                  className="min-w-0 flex-1 bg-transparent px-3.5 font-ui text-[15px] text-text-primary outline-none placeholder:text-text-secondary"
                />
              </div>
              <input type="hidden" name="telefono" value={numero.trim() ? `+54 ${numero.trim()}` : ""} />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-2">
                <span className={labelClass}>Edad</span>
                <Input className={inputClass} name="edad" type="number" inputMode="numeric" min={13} placeholder="22" required />
              </label>
              <label className="flex flex-col gap-2">
                <span className={labelClass}>Provincia</span>
                <div className="relative">
                  <select
                    name="provincia"
                    required
                    defaultValue=""
                    className="h-12 w-full appearance-none rounded-[10px] border border-border-default bg-white pl-3.5 pr-9 font-ui text-[15px] text-text-primary invalid:text-text-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text-primary"
                  >
                    <option value="" disabled>
                      Elegí una
                    </option>
                    {provinciasArgentinas.map((provincia): React.ReactElement => (
                      <option key={provincia} value={provincia}>
                        {provincia}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
                  />
                </div>
              </label>
            </div>

            <label className="flex flex-col gap-2">
              <span className={labelClass}>¿Por qué querés ser opinador?</span>
              <Textarea className={textareaClass} name="motivacion" rows={4} placeholder="Contanos tu motivación..." required />
            </label>

            {state.error ? (
              <p className="text-center font-ui text-sm text-state-required">{state.error}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex-none border-t border-border-default bg-bg-base px-6 py-4">
        <div className="mx-auto w-full max-w-[440px]">
          <button
            type="submit"
            disabled={isPending}
            className="h-[52px] w-full rounded-[11px] border border-b-4 border-[#B6B0A5] bg-bg-base font-ui text-base font-bold text-text-primary transition-all duration-100 ease-out active:translate-y-[3px] active:border-b active:bg-[#F1EEE7] disabled:opacity-60"
          >
            {isPending ? "Enviando..." : "Postularme"}
          </button>
        </div>
      </div>
    </form>
  );
}
