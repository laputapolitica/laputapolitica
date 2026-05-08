"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconAtras } from "@/components/admin/icons";
import { ElPulsoDetailView } from "@/components/admin/panels/PublicacionPanel/ElPulsoChannel/DetailView";
import {
  mockOpinadores,
  mockPendientes,
  mockRechazados,
} from "@/lib/mock-opinadores";
import { DataPill, RatioPill, AdminButton, RowCard, SectionPanel } from "@/components/admin/shared";
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
      <SectionPanel className="shrink-0 flex items-center justify-between">
        <DataPill>{mockOpinadores.length} Opinadores</DataPill>
        <div className="flex items-center gap-2">
          <AdminButton variant="default" onClick={onRechazados}>
            Rechazados
          </AdminButton>
          <button
            type="button"
            onClick={onPendientes}
            className="inline-flex h-[24px] cursor-pointer items-center rounded-[3.5px] border border-[#FAC800] bg-white px-2 font-ui text-xs font-medium text-[#FAC800]"
          >
            Pendientes
          </button>
        </div>
      </SectionPanel>

      {/* Listado scrolleable */}
      <div className="min-h-0 flex-1 overflow-y-auto flex flex-col gap-3">
        {mockOpinadores.map((op) => (
          <RowCard
            key={op.id}
            onClick={() => onSelect(op)}
          >
            <DataPill>{op.nombre}</DataPill>
            <DataPill>{op.email}</DataPill>
            <DataPill>{op.ciudad}</DataPill>
            <div className="flex-1" />
            <RatioPill valor={op.diasParticipados} total={op.totalDias} sufijo="d/o" />
          </RowCard>
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
      <SectionPanel className="shrink-0 space-y-2">
        {/* Fila 1: nombre + ratios + eliminar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-[24px] items-center rounded-[3.5px] border-2 border-admin-ink bg-white px-2 font-ui text-xs font-semibold text-admin-ink">
              {opinador.nombre}
            </div>
            <RatioPill valor={opinador.diasParticipados} total={opinador.totalDias} sufijo="d/o" />
            <RatioPill valor={opinador.noticiasOpinadas} total={opinador.totalNoticias} sufijo="n/o" />
          </div>
          <AdminButton variant="default">
            Eliminar
          </AdminButton>
        </div>

        {/* Fila 2: email + teléfono */}
        <div className="flex items-center gap-2">
          <DataPill>{opinador.email}</DataPill>
          <DataPill>{opinador.telefono}</DataPill>
        </div>

        {/* Fila 3: ciudad + edad + fecha de inicio */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DataPill>{opinador.ciudad}</DataPill>
            <DataPill>{opinador.edad} años</DataPill>
          </div>
          <DataPill>Fecha de inicio {opinador.fechaInicio}</DataPill>
        </div>
      </SectionPanel>

      {/* Listado de ediciones scrolleable */}
      <div className="min-h-0 flex-1 overflow-y-auto flex flex-col gap-3">
        {opinador.ediciones.map((ed) => (
          <RowCard
            key={ed.fechaISO}
            onClick={() => onSelectEdicion({ fecha: ed.fecha, fechaISO: ed.fechaISO, titulo: ed.titulo })}
          >
            <DataPill>{ed.fecha}</DataPill>
            <DataPill>{ed.titulo}</DataPill>
            <div className="flex-1" />
            <div className="inline-flex h-[24px] items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="h-[8px] w-[8px] rounded-full bg-[#E5E3DD]" />
              ))}
            </div>
            <RatioPill valor={ed.completadas} total={ed.total} />
          </RowCard>
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
      <SectionPanel className="shrink-0 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-[24px] items-center rounded-[3.5px] border-2 border-admin-ink bg-white px-2 font-ui text-xs font-semibold text-admin-ink">
              {opinador.nombre}
            </div>
            <RatioPill valor={opinador.diasParticipados} total={opinador.totalDias} sufijo="d/o" />
            <RatioPill valor={opinador.noticiasOpinadas} total={opinador.totalNoticias} sufijo="n/o" />
          </div>
          <AdminButton variant="default">
            Eliminar
          </AdminButton>
        </div>

        <div className="flex items-center gap-2">
          <DataPill>{opinador.email}</DataPill>
          <DataPill>{opinador.telefono}</DataPill>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DataPill>{opinador.ciudad}</DataPill>
            <DataPill>{opinador.edad} años</DataPill>
          </div>
          <DataPill>Fecha de inicio {opinador.fechaInicio}</DataPill>
        </div>
      </SectionPanel>

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
          <DataPill>{edicion.fecha}</DataPill>
          <DataPill>{edicion.titulo}</DataPill>
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

        <div className="flex items-center gap-2">
          <div className="inline-flex h-[24px] items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="h-[8px] w-[8px] rounded-full bg-[#E5E3DD]" />
            ))}
          </div>
          <RatioPill valor={5} total={5} />
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
      <SectionPanel className="shrink-0 flex items-center justify-between">
        <button
          type="button"
          onClick={onVolver}
          className="inline-flex h-[24px] cursor-pointer items-center rounded-[3.5px] border border-[#FAC800] bg-white px-2 font-ui text-xs font-medium text-[#FAC800]"
        >
          Pendientes
        </button>
        <DataPill>{mockPendientes.length} postulaciones</DataPill>
      </SectionPanel>
      <div className="min-h-0 flex-1 overflow-y-auto flex flex-col gap-3">
        {mockPendientes.map((p) => (
          <RowCard
            key={p.id}
            onClick={() => onSelect(p)}
          >
            <DataPill>{p.nombre}</DataPill>
            <DataPill>{p.email}</DataPill>
            <DataPill>{p.ciudad}</DataPill>
          </RowCard>
        ))}
      </div>
    </div>
  );
}

function ListaRechazados({ onVolver }: { onVolver: () => void }) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <SectionPanel className="shrink-0 flex items-center justify-between">
        <AdminButton variant="default" onClick={onVolver}>
          Rechazados
        </AdminButton>
        <DataPill>{mockRechazados.length} rechazados</DataPill>
      </SectionPanel>
      <div className="min-h-0 flex-1 overflow-y-auto flex flex-col gap-3">
        {mockRechazados.map((p) => (
          <RowCard
            key={p.id}
          >
            <DataPill>{p.nombre}</DataPill>
            <DataPill>{p.email}</DataPill>
            <DataPill>{p.ciudad}</DataPill>
          </RowCard>
        ))}
      </div>
    </div>
  );
}

function DetallePostulacion({ postulacion, onBack }: { postulacion: Postulacion; onBack: () => void }) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {/* Header */}
      <SectionPanel className="shrink-0 space-y-2">
        <div className="flex items-center justify-between">
          <div className="inline-flex h-[24px] items-center rounded-[3.5px] border-2 border-admin-ink bg-white px-2 font-ui text-xs font-semibold text-admin-ink">
            {postulacion.nombre}
          </div>
          <div className="flex items-center gap-2">
            <AdminButton variant="default" onClick={onBack}>
              Rechazar
            </AdminButton>
            <button
              type="button"
              className="inline-flex h-[24px] cursor-pointer items-center rounded-[3.5px] border border-[#35C759] bg-white px-2 font-ui text-xs font-medium text-[#35C759]"
            >
              Aceptar
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DataPill>{postulacion.email}</DataPill>
          <DataPill>{postulacion.telefono}</DataPill>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DataPill>{postulacion.ciudad}</DataPill>
            <DataPill>{postulacion.edad} años</DataPill>
          </div>
          <DataPill>Postulacion enviada {postulacion.fechaPostulacion}</DataPill>
        </div>
      </SectionPanel>

      {/* Motivación */}
      <div className="min-h-0 flex-1 overflow-y-auto space-y-3">
        <DataPill>¿Por qué quiere ser opinador?</DataPill>
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
