"use client";

import { useEffect, useState } from "react";
import { IconEditar } from "@/components/admin/icons";
import { AdminSelect, IconButton, TextField } from "@/components/admin/shared";
import { actualizarIconoClima } from "@/app/(admin)/admin/actions";
import {
  CLIMA_CLAVES,
  CLIMA_LABELS,
  climaIconPath,
  type ClimaCiudadData,
  type ClimaClave,
  type ClimaDiaData,
} from "@/lib/clima";

type ClimaSlideProps = {
  clima: ClimaCiudadData[];
  edicionId?: string;
};

const CLIMA_OPTIONS = CLIMA_CLAVES.map((clave) => ({
  value: clave,
  label: CLIMA_LABELS[clave],
}));

function isClimaClave(value: string): value is ClimaClave {
  return CLIMA_CLAVES.includes(value as ClimaClave);
}

export function ClimaSlide({ clima, edicionId }: ClimaSlideProps) {
  const defaultCiudadId = clima[0]?.id ?? "";
  const [ciudadId, setCiudadId] = useState(defaultCiudadId);

  useEffect(() => {
    if (ciudadId !== defaultCiudadId && !clima.some((ciudad) => ciudad.id === ciudadId)) {
      setCiudadId(defaultCiudadId);
    }
  }, [ciudadId, clima, defaultCiudadId]);

  if (clima.length === 0) {
    return (
      <div className="font-ui text-sm text-text-secondary">
        Sin datos de clima
      </div>
    );
  }

  const ciudadSeleccionada =
    clima.find((ciudad) => ciudad.id === ciudadId) ?? clima[0];

  return (
    <div className="flex flex-col gap-4 font-ui">
      {/* Selector de ciudad */}
      <AdminSelect
        value={ciudadSeleccionada.id}
        onChange={setCiudadId}
        size="sm"
        className="w-fit"
        options={clima.map((ciudad) => ({
          value: ciudad.id,
          label: ciudad.label,
        }))}
      />

      {/* Días */}
      <div className="flex gap-6 items-start">
        {ciudadSeleccionada.dias.map((dia) => (
          <DiaClima
            key={`${ciudadSeleccionada.id}-${dia.fecha}`}
            dia={dia}
            ciudadId={ciudadSeleccionada.id}
            edicionId={edicionId}
          />
        ))}
      </div>
    </div>
  );
}

function formatTemperatura(value: number | null): string {
  return value === null ? "—" : `${value}°`;
}

function DiaClima({
  dia,
  ciudadId,
  edicionId,
}: {
  dia: ClimaDiaData;
  ciudadId: string;
  edicionId?: string;
}) {
  const [icono, setIcono] = useState<ClimaClave>(dia.icono);
  const [minValue, setMinValue] = useState(formatTemperatura(dia.temperaturaMin));
  const [maxValue, setMaxValue] = useState(formatTemperatura(dia.temperaturaMax));
  const [isEditingMin, setIsEditingMin] = useState(false);
  const [isEditingMax, setIsEditingMax] = useState(false);

  useEffect(() => {
    setIcono(dia.icono);
    setMinValue(formatTemperatura(dia.temperaturaMin));
    setMaxValue(formatTemperatura(dia.temperaturaMax));
  }, [dia.icono, dia.temperaturaMin, dia.temperaturaMax]);

  async function handleIconoChange(value: string) {
    if (!isClimaClave(value)) {
      return;
    }

    const iconoAnterior = icono;
    setIcono(value);

    if (!edicionId) {
      return;
    }

    const result = await actualizarIconoClima(edicionId, ciudadId, dia.fecha, value);
    if (result.error) {
      setIcono(iconoAnterior);
      alert(result.error);
    }
  }

  return (
    <article className="flex flex-col items-start gap-3">
      <TextField value={dia.diaLabel} variant="subtle" readOnly />
      <AdminSelect
        value={icono}
        onChange={handleIconoChange}
        options={CLIMA_OPTIONS}
        size="sm"
        className="w-[170px]"
      />

      {/* Imagen */}
      <div className="rounded-lg border border-admin-ink bg-white p-2">
        <div className="h-[100px] w-[100px] overflow-hidden rounded-[4px] bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={climaIconPath(icono)}
            alt={dia.condicion ?? CLIMA_LABELS[icono]}
            className="h-full w-full object-contain"
          />
        </div>
      </div>

      {/* Min */}
      <div className="flex items-center gap-2">
        <TextField
          value="Min"
          variant="subtle"
          readOnly
          style={{ borderColor: "#2F4E85", color: "#2F4E85" }}
        />
        <TextField
          value={minValue}
          onSave={setMinValue}
          isEditing={isEditingMin}
          onEditingChange={setIsEditingMin}
        />
        {!isEditingMin && (
          <IconButton onClick={() => setIsEditingMin(true)}>
            <IconEditar width={11} height={11} />
            Editar
          </IconButton>
        )}
      </div>

      {/* Max */}
      <div className="flex items-center gap-2">
        <TextField
          value="Max"
          variant="subtle"
          readOnly
          style={{ borderColor: "#B74A4A", color: "#B74A4A" }}
        />
        <TextField
          value={maxValue}
          onSave={setMaxValue}
          isEditing={isEditingMax}
          onEditingChange={setIsEditingMax}
        />
        {!isEditingMax && (
          <IconButton onClick={() => setIsEditingMax(true)}>
            <IconEditar width={11} height={11} />
            Editar
          </IconButton>
        )}
      </div>
    </article>
  );
}
