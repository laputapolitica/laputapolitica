"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import {
  crearPostulacion,
  type CrearPostulacionState,
} from "@/app/(opinadores)/el-pulso/actions";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export interface OnboardingSlideProps {
  numero: number;
  total: number;
  titulo: string;
  descripcion: string;
  ilustracionUrl: string;
  esFormulario?: boolean;
}

const provinciasArgentinas = [
  "Buenos Aires",
  "CABA",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
] as const;

const fieldClassName =
  "h-12 rounded-lg border-border-default bg-white px-3 font-ui text-base text-text-primary placeholder:text-text-secondary focus-visible:ring-1 focus-visible:ring-text-primary focus-visible:ring-offset-0 md:text-base";

const labelClassName =
  "font-ui text-xs font-medium uppercase tracking-wider text-text-secondary";

export function OnboardingSlide({
  numero,
  total,
  titulo,
  descripcion,
  ilustracionUrl,
  esFormulario = false,
}: OnboardingSlideProps): React.ReactElement {
  if (esFormulario) {
    return <PostulacionSlide numero={numero} total={total} titulo={titulo} />;
  }

  return (
    <section
      aria-label={`Slide ${numero} de ${total}: ${titulo}`}
      className="flex min-h-screen flex-col items-center justify-center px-6 pb-20 pt-20 text-center"
    >
      <div className="flex w-full max-w-sm flex-col items-center gap-8">
        <h1 className="max-w-80 text-center font-display text-3xl font-normal leading-tight text-text-primary">
          {titulo}
        </h1>

        <div className="relative aspect-square w-full max-w-[280px]">
          <Image
            src={ilustracionUrl}
            alt=""
            fill
            priority={numero === 1}
            sizes="280px"
            className="object-contain"
          />
        </div>

        <p className="max-w-80 text-center font-editorial text-base leading-relaxed text-text-secondary">
          {descripcion}
        </p>
      </div>
    </section>
  );
}

type PostulacionSlideProps = {
  numero: number;
  total: number;
  titulo: string;
};

function PostulacionSlide({
  numero,
  total,
  titulo,
}: PostulacionSlideProps): React.ReactElement {
  const initialState: CrearPostulacionState = {};
  const [phone, setPhone] = useState<string | undefined>();
  const [state, formAction, isPending] = useActionState(
    crearPostulacion,
    initialState,
  );

  if (state.success) {
    return (
      <section
        aria-label={`Slide ${numero} de ${total}: ${titulo}`}
        className="flex min-h-screen flex-col items-center justify-center px-6 pb-24 pt-24 text-center"
      >
        <div className="max-w-80">
          <h1 className="font-display text-2xl font-normal leading-tight text-text-primary">
            ¡Postulación enviada!
          </h1>
          <p className="mt-4 font-editorial text-sm leading-relaxed text-text-secondary">
            Te contactamos pronto.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label={`Slide ${numero} de ${total}: ${titulo}`}
      className="relative h-screen overflow-y-auto px-6 pb-24 pt-24 text-center"
    >
      <div className="mx-auto flex w-full max-w-sm flex-col">
        <header>
          <h1 className="font-display text-2xl font-normal leading-tight text-text-primary">
            Sumate como opinador
          </h1>
          <p className="mx-auto mt-3 max-w-72 font-editorial text-sm leading-relaxed text-text-secondary">
            Formá parte de la red que construye El Pulso. Tu voz importa.
          </p>
        </header>

        <form action={formAction} className="mt-6 flex flex-col gap-4 text-left">
          <FormField label="NOMBRE COMPLETO">
            <Input
              className={fieldClassName}
              name="nombre"
              placeholder="Juan Perez"
              required
            />
          </FormField>

          <FormField label="EMAIL">
            <Input
              className={fieldClassName}
              name="email"
              placeholder="tu@email.com"
              required
              type="email"
            />
          </FormField>

          <FormField label="TELÉFONO">
            <PhoneInput
              defaultCountry="AR"
              international
              withCountryCallingCode
              value={phone}
              onChange={setPhone}
              className="phone-input-lpp flex h-12 w-full items-center rounded-lg border border-border-default bg-white px-3 font-ui text-base text-text-primary"
              numberInputProps={{
                className:
                  "min-w-0 flex-1 border-0 bg-transparent px-3 py-0 font-ui text-base text-text-primary outline-none placeholder:text-text-secondary",
                placeholder: "11 1234-5678",
              }}
            />
            <input type="hidden" name="telefono" value={phone ?? ""} />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="EDAD">
              <Input
                className={fieldClassName}
                min={13}
                name="edad"
                placeholder="22"
                required
                type="number"
              />
            </FormField>

            <FormField label="PROVINCIA">
              <Select name="provincia" required>
                <SelectTrigger className={fieldClassName}>
                  <SelectValue placeholder="Buenos Aires" />
                </SelectTrigger>
                <SelectContent className="max-h-72 rounded-lg border-border-default bg-white font-ui text-base">
                  {provinciasArgentinas.map(
                    (provincia): React.ReactElement => (
                      <SelectItem key={provincia} value={provincia}>
                        {provincia}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <FormField label="¿POR QUÉ QUERÉS SER OPINADOR?">
            <Textarea
              className={`${fieldClassName} min-h-28 resize-none py-3`}
              name="motivacion"
              placeholder="Contanos tu motivación..."
              required
              rows={4}
            />
          </FormField>

          {state.error ? (
            <p className="pb-2 text-center font-ui text-sm text-state-required">
              {state.error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isPending}
            className="fixed bottom-0 left-0 z-[60] h-14 w-full bg-[#111111] font-ui text-base font-medium text-white disabled:opacity-70"
          >
            {isPending ? "Enviando..." : "Postularme"}
          </button>
        </form>
      </div>
    </section>
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
