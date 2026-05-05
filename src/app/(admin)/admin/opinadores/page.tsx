"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconAtras } from "@/components/admin/icons";
import { ElPulsoDetailView } from "@/components/admin/panels/PublicacionPanel/ElPulsoChannel/DetailView";
import {
  mockOpinadores,
  getParticipacionColor,
  mockPendientes,
  mockRechazados,
} from "@/lib/mock-opinadores";
import type { MockOpinador } from "@/components/admin/panels/PublicacionPanel/types";
import type { OpinadorAdmin, Postulacion } from "@/lib/mock-opinadores";

type VistaOpinadores = "lista" | "pendientes" | "rechazados";

type EdicionSeleccionada = {
  fecha: string;
  fechaISO: string;
  titulo: string;
};

function ListaOpinadores({
  onSelect,
  onPendientes,
  onRechazados,
}: {
  onSelect: (op: OpinadorAdmin) => void;
  onPendientes: () => void;
  onRechazados: () => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between rounded-lg border border-admin-ink px-3 py-2">
        <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
          <span className="font-ui text-xs font-semibold text-admin-ink">
            {mockOpinadores.length} Opinadores
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRechazados}
            className="inline-flex h-[24px] cursor-pointer items-center rounded-[3.5px] border border-[#E85A4F] bg-white px-2 font-ui text-xs font-medium text-[#E85A4F]"
          >
            Rechazados
          </button>
          <button
            type="button"
            onClick={onPendientes}
            className="inline-flex h-[24px] cursor-pointer items-center rounded-[3.5px] border border-[#FAC800] bg-white px-2 font-ui text-xs font-medium text-[#FAC800]"
          >
            Pendientes
          </button>
        </div>
      </div>

      {/* Listado scrolleable */}
      <div className="min-h-0 flex-1 overflow-y-auto flex flex-col gap-3">
        {mockOpinadores.map((op) => (
          <div
            key={op.id}
            onClick={() => onSelect(op)}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-admin-ink px-3 py-2 transition-colors hover:bg-[#F0EDE6]"
          >
            <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium text-admin-ink whitespace-nowrap">{op.nombre}</span>
            </div>
            <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium text-admin-ink whitespace-nowrap">{op.email}</span>
            </div>
            <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium text-admin-ink whitespace-nowrap">{op.ciudad}</span>
            </div>
            <div className="flex-1" />
            <div className="inline-flex h-[24px] items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium text-admin-ink whitespace-nowrap">
                {op.diasParticipados}/{op.totalDias} d/o
              </span>
              <span
                className="h-[8px] w-[8px] rounded-full shrink-0"
                style={{ backgroundColor: getParticipacionColor(op.diasParticipados, op.totalDias) }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetalleOpinador({
  opinador,
  onSelectEdicion,
}: {
  opinador: OpinadorAdmin;
  onBack: () => void;
  onSelectEdicion: (ed: EdicionSeleccionada) => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {/* Header del opinador */}
      <div className="shrink-0 rounded-lg border border-admin-ink px-3 py-2 space-y-2">
        {/* Fila 1: nombre + ratios + eliminar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-[24px] items-center rounded-[3.5px] border-2 border-admin-ink bg-white px-2 font-ui text-xs font-semibold text-admin-ink">
              {opinador.nombre}
            </div>
            <div className="inline-flex h-[24px] items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium text-admin-ink">
                {opinador.diasParticipados}/{opinador.totalDias} d/o
              </span>
              <span
                className="h-[8px] w-[8px] rounded-full shrink-0"
                style={{ backgroundColor: getParticipacionColor(opinador.diasParticipados, opinador.totalDias) }}
              />
            </div>
            <div className="inline-flex h-[24px] items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium text-admin-ink">
                {opinador.noticiasOpinadas}/{opinador.totalNoticias} n/o
              </span>
              <span
                className="h-[8px] w-[8px] rounded-full shrink-0"
                style={{ backgroundColor: getParticipacionColor(opinador.noticiasOpinadas, opinador.totalNoticias) }}
              />
            </div>
          </div>
          <button
            type="button"
            className="inline-flex h-[24px] items-center rounded-[3.5px] border border-[#E85A4F] bg-white px-2 font-ui text-xs font-medium text-[#E85A4F] cursor-pointer"
          >
            Eliminar
          </button>
        </div>

        {/* Fila 2: email + teléfono */}
        <div className="flex items-center gap-2">
          <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
            <span className="font-ui text-xs font-medium text-admin-ink">{opinador.email}</span>
          </div>
          <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
            <span className="font-ui text-xs font-medium text-admin-ink">{opinador.telefono}</span>
          </div>
        </div>

        {/* Fila 3: ciudad + edad + fecha de inicio */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium text-admin-ink">{opinador.ciudad}</span>
            </div>
            <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium text-admin-ink">{opinador.edad} años</span>
            </div>
          </div>
          <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
            <span className="font-ui text-xs font-medium text-admin-ink">Fecha de inicio {opinador.fechaInicio}</span>
          </div>
        </div>
      </div>

      {/* Listado de ediciones scrolleable */}
      <div className="min-h-0 flex-1 overflow-y-auto flex flex-col gap-3">
        {opinador.ediciones.map((ed) => (
          <div
            key={ed.fechaISO}
            onClick={() => onSelectEdicion({ fecha: ed.fecha, fechaISO: ed.fechaISO, titulo: ed.titulo })}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-admin-ink px-3 py-2 transition-colors hover:bg-[#F0EDE6]"
          >
            <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium text-admin-ink whitespace-nowrap">{ed.fecha}</span>
            </div>
            <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium text-admin-ink whitespace-nowrap">{ed.titulo}</span>
            </div>
            <div className="flex-1" />
            <div className="inline-flex h-[24px] items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-semibold text-admin-ink">
                {ed.completadas}/{ed.total}
              </span>
              <span
                className="h-[8px] w-[8px] rounded-full shrink-0"
                style={{ backgroundColor: getParticipacionColor(ed.completadas, ed.total) }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OpinionesEnEdicion({
  opinador,
  edicion,
  onBack,
}: {
  opinador: OpinadorAdmin;
  edicion: EdicionSeleccionada;
  onBack: () => void;
}) {
  const [noticiaIndex, setNoticiaIndex] = useState(0);

  // Mock: el opinador opinó sobre las 5 noticias de la edición.
  // Reutilizamos mockOpiniones de PublicacionPanel para no duplicar contenido.
  // (En la integración real, esto vendrá de Supabase filtrado por opinador + edición.)

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {/* Header del opinador (igual que en DetalleOpinador) */}
      <div className="shrink-0 rounded-lg border border-admin-ink px-3 py-2 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-[24px] items-center rounded-[3.5px] border-2 border-admin-ink bg-white px-2 font-ui text-xs font-semibold text-admin-ink">
              {opinador.nombre}
            </div>
            <div className="inline-flex h-[24px] items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium text-admin-ink">
                {opinador.diasParticipados}/{opinador.totalDias} d/o
              </span>
              <span
                className="h-[8px] w-[8px] rounded-full shrink-0"
                style={{ backgroundColor: getParticipacionColor(opinador.diasParticipados, opinador.totalDias) }}
              />
            </div>
            <div className="inline-flex h-[24px] items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium text-admin-ink">
                {opinador.noticiasOpinadas}/{opinador.totalNoticias} n/o
              </span>
              <span
                className="h-[8px] w-[8px] rounded-full shrink-0"
                style={{ backgroundColor: getParticipacionColor(opinador.noticiasOpinadas, opinador.totalNoticias) }}
              />
            </div>
          </div>
          <button
            type="button"
            className="inline-flex h-[24px] items-center rounded-[3.5px] border border-[#E85A4F] bg-white px-2 font-ui text-xs font-medium text-[#E85A4F] cursor-pointer"
          >
            Eliminar
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
            <span className="font-ui text-xs font-medium text-admin-ink">{opinador.email}</span>
          </div>
          <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
            <span className="font-ui text-xs font-medium text-admin-ink">{opinador.telefono}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium text-admin-ink">{opinador.ciudad}</span>
            </div>
            <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium text-admin-ink">{opinador.edad} años</span>
            </div>
          </div>
          <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
            <span className="font-ui text-xs font-medium text-admin-ink">Fecha de inicio {opinador.fechaInicio}</span>
          </div>
        </div>
      </div>

      {/* Header de edición seleccionada con navegación */}
      <div className="shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-[24px] cursor-pointer items-center gap-1.5 rounded-[4px] border-2 border-admin-ink bg-white px-2 font-ui text-xs font-semibold text-admin-ink"
          >
            <IconAtras width={10} height={10} />
            Atras
          </button>
          <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
            <span className="font-ui text-xs font-medium text-admin-ink">{edicion.fecha}</span>
          </div>
          <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
            <span className="font-ui text-xs font-medium text-admin-ink">{edicion.titulo}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setNoticiaIndex((i) => Math.max(0, i - 1))}
            disabled={noticiaIndex === 0}
            className={`cursor-pointer inline-flex h-[24px] items-center rounded-[4px] border border-admin-ink bg-white px-3 font-ui text-sm font-medium text-admin-ink ${noticiaIndex === 0 ? "opacity-30" : ""}`}
          >
            <span style={{ paddingBottom: "1px" }}>←</span>
          </button>
          <div className="inline-flex h-[24px] items-center rounded-[4px] border-2 border-admin-ink bg-white px-2 font-ui text-xs font-semibold text-admin-ink">
            Noticia {noticiaIndex + 1}/5
          </div>
          <button
            type="button"
            onClick={() => setNoticiaIndex((i) => Math.min(4, i + 1))}
            disabled={noticiaIndex === 4}
            className={`cursor-pointer inline-flex h-[24px] items-center rounded-[4px] border border-admin-ink bg-white px-3 font-ui text-sm font-medium text-admin-ink ${noticiaIndex === 4 ? "opacity-30" : ""}`}
          >
            <span style={{ paddingBottom: "1px" }}>→</span>
          </button>
        </div>

        <div className="inline-flex h-[24px] items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-2">
          <span className="font-ui text-xs font-semibold text-admin-ink">5/5</span>
          <span
            className="h-[8px] w-[8px] rounded-full shrink-0"
            style={{ backgroundColor: getParticipacionColor(5, 5) }}
          />
        </div>
      </div>

      {/* Opinión del opinador en la noticia actual */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <ElPulsoDetailView
          opinador={mockOpinadorParaDetalle(opinador)}
          noticiaIndex={noticiaIndex}
        />
      </div>
    </div>
  );
}

// Helper: convierte OpinadorAdmin (de mock-opinadores) al shape de MockOpinador
// que espera ElPulsoDetailView. Solo necesita los campos básicos.
function mockOpinadorParaDetalle(op: OpinadorAdmin): MockOpinador {
  return {
    id: op.id,
    nombre: op.nombre,
    email: op.email,
    ciudad: op.ciudad,
    votos: [],
    completadas: 5,
    ultimaRespuesta: "00:00",
  };
}

function ListaPendientes({ onSelect, onVolver }: { onSelect: (p: Postulacion) => void; onVolver: () => void }) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="shrink-0 flex items-center justify-between rounded-lg border border-admin-ink px-3 py-2">
        <button
          type="button"
          onClick={onVolver}
          className="inline-flex h-[24px] cursor-pointer items-center rounded-[3.5px] border border-[#FAC800] bg-white px-2 font-ui text-xs font-medium text-[#FAC800]"
        >
          Pendientes
        </button>
        <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
          <span className="font-ui text-xs font-medium text-admin-ink">{mockPendientes.length} postulaciones</span>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto flex flex-col gap-3">
        {mockPendientes.map((p) => (
          <div
            key={p.id}
            onClick={() => onSelect(p)}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-admin-ink px-3 py-2 transition-colors hover:bg-[#F0EDE6]"
          >
            <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium text-admin-ink whitespace-nowrap">{p.nombre}</span>
            </div>
            <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium text-admin-ink whitespace-nowrap">{p.email}</span>
            </div>
            <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium text-admin-ink whitespace-nowrap">{p.ciudad}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ListaRechazados({ onVolver }: { onVolver: () => void }) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="shrink-0 flex items-center justify-between rounded-lg border border-admin-ink px-3 py-2">
        <button
          type="button"
          onClick={onVolver}
          className="inline-flex h-[24px] cursor-pointer items-center rounded-[3.5px] border border-[#E85A4F] bg-white px-2 font-ui text-xs font-medium text-[#E85A4F]"
        >
          Rechazados
        </button>
        <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
          <span className="font-ui text-xs font-medium text-admin-ink">{mockRechazados.length} rechazados</span>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto flex flex-col gap-3">
        {mockRechazados.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-2 rounded-lg border border-admin-ink px-3 py-2"
          >
            <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium text-admin-ink whitespace-nowrap">{p.nombre}</span>
            </div>
            <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium text-admin-ink whitespace-nowrap">{p.email}</span>
            </div>
            <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium text-admin-ink whitespace-nowrap">{p.ciudad}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetallePostulacion({ postulacion, onBack }: { postulacion: Postulacion; onBack: () => void }) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {/* Header */}
      <div className="shrink-0 rounded-lg border border-admin-ink px-3 py-2 space-y-2">
        <div className="flex items-center justify-between">
          <div className="inline-flex h-[24px] items-center rounded-[3.5px] border-2 border-admin-ink bg-white px-2 font-ui text-xs font-semibold text-admin-ink">
            {postulacion.nombre}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-[24px] cursor-pointer items-center rounded-[3.5px] border border-[#E85A4F] bg-white px-2 font-ui text-xs font-medium text-[#E85A4F]"
            >
              Rechazar
            </button>
            <button
              type="button"
              className="inline-flex h-[24px] cursor-pointer items-center rounded-[3.5px] border border-[#35C759] bg-white px-2 font-ui text-xs font-medium text-[#35C759]"
            >
              Aceptar
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
            <span className="font-ui text-xs font-medium text-admin-ink">{postulacion.email}</span>
          </div>
          <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
            <span className="font-ui text-xs font-medium text-admin-ink">{postulacion.telefono}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium text-admin-ink">{postulacion.ciudad}</span>
            </div>
            <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
              <span className="font-ui text-xs font-medium text-admin-ink">{postulacion.edad} años</span>
            </div>
          </div>
          <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
            <span className="font-ui text-xs font-medium text-admin-ink">Postulacion enviada {postulacion.fechaPostulacion}</span>
          </div>
        </div>
      </div>

      {/* Motivación */}
      <div className="min-h-0 flex-1 overflow-y-auto space-y-3">
        <div className="inline-flex h-[28px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
          <span className="font-ui text-xs font-medium text-admin-ink">¿Por qué quiere ser opinador?</span>
        </div>
        <div className="rounded-[4px] border border-admin-ink bg-white px-3 py-2" style={{ maxWidth: "480px" }}>
          <p className="font-ui text-sm font-medium text-admin-ink">{postulacion.motivacion}</p>
        </div>
      </div>
    </div>
  );
}

export default function AdminOpinadoresPage() {
  const [vista, setVista] = useState<VistaOpinadores>("lista");
  const [selectedOpinador, setSelectedOpinador] = useState<OpinadorAdmin | null>(null);
  const [selectedEdicion, setSelectedEdicion] = useState<EdicionSeleccionada | null>(null);
  const [selectedPostulacion, setSelectedPostulacion] = useState<Postulacion | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    setSelectedOpinador(null);
    setSelectedEdicion(null);
    setSelectedPostulacion(null);
    setVista("lista");
  }, [searchParams]);

  if (vista === "pendientes") {
    if (selectedPostulacion) {
      return (
        <DetallePostulacion
          postulacion={selectedPostulacion}
          onBack={() => setSelectedPostulacion(null)}
        />
      );
    }
    return (
      <ListaPendientes
        onSelect={setSelectedPostulacion}
        onVolver={() => setVista("lista")}
      />
    );
  }

  if (vista === "rechazados") {
    return (
      <ListaRechazados
        onVolver={() => setVista("lista")}
      />
    );
  }

  if (selectedEdicion && selectedOpinador) {
    return (
      <OpinionesEnEdicion
        opinador={selectedOpinador}
        edicion={selectedEdicion}
        onBack={() => setSelectedEdicion(null)}
      />
    );
  }

  if (selectedOpinador) {
    return (
      <DetalleOpinador
        opinador={selectedOpinador}
        onBack={() => setSelectedOpinador(null)}
        onSelectEdicion={setSelectedEdicion}
      />
    );
  }

  return (
    <ListaOpinadores
      onSelect={setSelectedOpinador}
      onPendientes={() => setVista("pendientes")}
      onRechazados={() => setVista("rechazados")}
    />
  );
}
