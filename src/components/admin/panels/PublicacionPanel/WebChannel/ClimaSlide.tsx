"use client";

import { useEffect, useState } from "react";
import { IconEditar } from "@/components/admin/icons";
import { AdminSelect, IconButton, TextField } from "@/components/admin/shared";
import { climaIconPath, type ClimaCiudadData, type ClimaDiaData } from "@/lib/clima";

export function ClimaSlide({ clima }: { clima: ClimaCiudadData[] }) {
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
          />
        ))}
      </div>
    </div>
  );
}

function formatTemperatura(value: number | null): string {
  return value === null ? "—" : `${value}°`;
}

function DiaClima({ dia }: { dia: ClimaDiaData }) {
  const [minValue, setMinValue] = useState(formatTemperatura(dia.temperaturaMin));
  const [maxValue, setMaxValue] = useState(formatTemperatura(dia.temperaturaMax));
  const [isEditingMin, setIsEditingMin] = useState(false);
  const [isEditingMax, setIsEditingMax] = useState(false);

  useEffect(() => {
    setMinValue(formatTemperatura(dia.temperaturaMin));
    setMaxValue(formatTemperatura(dia.temperaturaMax));
  }, [dia.temperaturaMin, dia.temperaturaMax]);

  return (
    <article className="flex flex-col items-start gap-3">
      <TextField value={dia.diaLabel} variant="subtle" readOnly />

      {/* Imagen + botón Editar */}
      <div className="flex items-start gap-2">
        <div className="rounded-lg border border-admin-ink bg-white p-2">
          <div className="h-[100px] w-[100px] overflow-hidden rounded-[4px] bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={climaIconPath(dia.icono)}
              alt={dia.condicion ?? dia.icono}
              className="h-full w-full object-contain"
            />
          </div>
        </div>
        <IconButton onClick={() => {}}>
          <IconEditar width={11} height={11} />
          Editar
        </IconButton>
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
