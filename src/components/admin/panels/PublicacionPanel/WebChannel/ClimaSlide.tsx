"use client";

import { useState } from "react";
import { IconEditar } from "@/components/admin/icons";
import { AdminSelect, IconButton, TextField } from "@/components/admin/shared";
import { clima } from "../mocks";

export function ClimaSlide() {
  const [ciudad, setCiudad] = useState("Buenos Aires");

  return (
    <div className="flex flex-col gap-4 font-ui">
      {/* Selector de ciudad */}
      <AdminSelect
        value={ciudad}
        onChange={setCiudad}
        size="sm"
        className="w-fit"
        options={[
          { value: "Buenos Aires", label: "Buenos Aires" },
          { value: "Córdoba", label: "Córdoba" },
          { value: "Santa Fe", label: "Santa Fe" },
        ]}
      />

      {/* Días */}
      <div className="flex gap-6 items-start">
        {clima.map((dia) => (
          <DiaClima key={dia.dia} dia={dia.dia} min={dia.min} max={dia.max} />
        ))}
      </div>
    </div>
  );
}

function DiaClima({ dia, min, max }: { dia: string; min: number; max: number }) {
  const [minValue, setMinValue] = useState(`${min}°`);
  const [maxValue, setMaxValue] = useState(`${max}°`);
  const [isEditingMin, setIsEditingMin] = useState(false);
  const [isEditingMax, setIsEditingMax] = useState(false);

  return (
    <article className="flex flex-col items-start gap-3">
      <TextField value={dia} variant="subtle" readOnly />

      {/* Imagen + botón Editar */}
      <div className="flex items-start gap-2">
        <div className="rounded-lg border border-admin-ink bg-white p-2">
          <div className="h-[100px] w-[100px] rounded-[4px] bg-gray-200" />
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
