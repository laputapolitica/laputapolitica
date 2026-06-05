"use client";

import { useEffect, useState } from "react";
import { getPostulaciones, rechazarPostulacion } from "./actions";
import { useSearchParams } from "next/navigation";
import { mockOpinadores } from "@/lib/mock-opinadores";
import {
  DataPill,
  RatioPill,
  HeaderPanel,
  HeaderPill,
  PanelLayout,
  RowCard,
  RowCardCell,
  RowCardLeft,
  RowCardList,
  RowCardListHeader,
  TextArea,
  TextField,
  TitlePill,
} from "@/components/admin/shared";
import {
  OpinadorOpinionView,
  OpinadoresList,
} from "@/components/admin/sections/opinadores";
import { EdicionesOpinadorList } from "@/components/admin/sections/ediciones";
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
    <PanelLayout
      header={
        <RowCardListHeader>
          <TitlePill>{mockOpinadores.length} Opinadores</TitlePill>
          <div className="flex items-center gap-2">
            <TitlePill onClick={onRechazados} borderColor="#FF5C60">
              Rechazados
            </TitlePill>
            <TitlePill onClick={onPendientes} borderColor="#FAC800">
              Pendientes
            </TitlePill>
          </div>
        </RowCardListHeader>
      }
      content={<OpinadoresList opinadores={mockOpinadores} onSelect={onSelect} />}
    />
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
    <PanelLayout
      header={
        <HeaderPanel>
          {/* Fila 1: identidad + acción */}
          <div className="flex items-center justify-between">
            <TitlePill>{opinador.nombre}</TitlePill>
            <TitlePill onClick={() => {}} borderColor="#FF5C60">Eliminar</TitlePill>
          </div>

          {/* Fila 2: contacto + atributos */}
          <div className="flex items-center gap-2">
            <DataPill>{opinador.email}</DataPill>
            <DataPill>{opinador.telefono}</DataPill>
            <DataPill>{opinador.ciudad}</DataPill>
            <DataPill>{opinador.edad} años</DataPill>
          </div>

          {/* Fila 3: métricas + histórico */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RatioPill
                valor={opinador.diasParticipados}
                total={opinador.totalDias}
                sufijo="d/o"
              />
              <RatioPill
                valor={opinador.noticiasOpinadas}
                total={opinador.totalNoticias}
                sufijo="n/o"
              />
            </div>
            <DataPill>Inicio {opinador.fechaInicio}</DataPill>
          </div>
        </HeaderPanel>
      }
      content={
        <EdicionesOpinadorList
          ediciones={opinador.ediciones}
          onSelect={(ed) =>
            onSelectEdicion({
              fecha: ed.fecha,
              fechaISO: ed.fechaISO,
              titulo: ed.titulo,
            })
          }
        />
      }
    />
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

  return (
    <PanelLayout
      header={
        <HeaderPanel>
          {/* Fila 1: identidad + acción */}
          <div className="flex items-center justify-between">
            <TitlePill>{opinador.nombre}</TitlePill>
            <TitlePill onClick={() => {}} borderColor="#FF5C60">Eliminar</TitlePill>
          </div>

          {/* Fila 2: contacto + atributos */}
          <div className="flex items-center gap-2">
            <DataPill>{opinador.email}</DataPill>
            <DataPill>{opinador.telefono}</DataPill>
            <DataPill>{opinador.ciudad}</DataPill>
            <DataPill>{opinador.edad} años</DataPill>
          </div>

          {/* Fila 3: métricas + histórico */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RatioPill valor={opinador.diasParticipados} total={opinador.totalDias} sufijo="d/o" />
              <RatioPill valor={opinador.noticiasOpinadas} total={opinador.totalNoticias} sufijo="n/o" />
            </div>
            <DataPill>Inicio {opinador.fechaInicio}</DataPill>
          </div>
        </HeaderPanel>
      }
      content={
        <OpinadorOpinionView
          opinador={mockOpinadorParaDetalle(opinador, edicion)}
          noticiaIndex={noticiaIndex}
          onNoticiaIndexChange={setNoticiaIndex}
          onBack={onBack}
          leftHeader={
            <>
              <HeaderPill>{edicion.fecha}</HeaderPill>
              <HeaderPill>{edicion.titulo}</HeaderPill>
            </>
          }
        />
      }
    />
  );
}

function mockOpinadorParaDetalle(
  op: OpinadorAdmin,
  edicion?: EdicionSeleccionada
): MockOpinador {
  const edicionData = edicion
    ? op.ediciones.find(e => e.fechaISO === edicion.fechaISO)
    : undefined;
  const votos = edicionData?.votos ?? [];
  const completadas = votos.filter(v => v !== null).length;

  return {
    id: op.id,
    nombre: op.nombre,
    email: op.email,
    ciudad: op.ciudad,
    votos,
    completadas,
    ultimaRespuesta: "00:00",
  };
}

function ListaPendientes({
  pendientes,
  onSelect,
  onVolver,
}: {
  pendientes: Postulacion[];
  onSelect: (p: Postulacion) => void;
  onVolver: () => void;
}) {
  return (
    <PanelLayout
      header={
        <RowCardListHeader>
          <TitlePill onClick={onVolver} borderColor="#FAC800">
            Pendientes
          </TitlePill>
          <TitlePill>{pendientes.length} postulaciones</TitlePill>
        </RowCardListHeader>
      }
      content={
        <RowCardList>
          {pendientes.map((p) => (
            <RowCard key={p.id} onClick={() => onSelect(p)}>
              <RowCardLeft>
                <RowCardCell>{p.nombre}</RowCardCell>
                <RowCardCell>{p.email}</RowCardCell>
                <RowCardCell>{p.ciudad}</RowCardCell>
              </RowCardLeft>
            </RowCard>
          ))}
        </RowCardList>
      }
    />
  );
}

function ListaRechazados({
  rechazados,
  onVolver,
}: {
  rechazados: Postulacion[];
  onVolver: () => void;
}) {
  return (
    <PanelLayout
      header={
        <RowCardListHeader>
          <TitlePill onClick={onVolver} borderColor="#FF5C60">
            Rechazados
          </TitlePill>
          <TitlePill>{rechazados.length} rechazados</TitlePill>
        </RowCardListHeader>
      }
      content={
        <RowCardList>
          {rechazados.map((p) => (
            <RowCard key={p.id}>
              <RowCardLeft>
                <RowCardCell>{p.nombre}</RowCardCell>
                <RowCardCell>{p.email}</RowCardCell>
                <RowCardCell>{p.ciudad}</RowCardCell>
              </RowCardLeft>
            </RowCard>
          ))}
        </RowCardList>
      }
    />
  );
}

function DetallePostulacion({
  postulacion,
  onBack,
  onRechazada,
}: {
  postulacion: Postulacion;
  onBack: () => void;
  onRechazada: () => void;
}) {
  const [isPending, setIsPending] = useState(false);

  async function handleRechazar() {
    setIsPending(true);
    const result = await rechazarPostulacion(postulacion.id);
    if (result.success) {
      onRechazada();
    } else {
      setIsPending(false);
    }
  }

  return (
    <PanelLayout
      header={
        <HeaderPanel>
          {/* Fila 1: identidad + acciones */}
          <div className="flex items-center justify-between">
            <TitlePill>{postulacion.nombre}</TitlePill>
            <div className="flex items-center gap-2">
              <TitlePill
                onClick={isPending ? undefined : handleRechazar}
                borderColor="#FF5C60"
              >
                {isPending ? "Rechazando..." : "Rechazar"}
              </TitlePill>
              {/* Aceptar: pendiente del sprint de aprobación (crea usuario + opinador) */}
              <TitlePill onClick={() => {}} borderColor="#35C759">Aceptar</TitlePill>
            </div>
          </div>

          {/* Fila 2: contacto + atributos + histórico */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DataPill>{postulacion.email}</DataPill>
              <DataPill>{postulacion.telefono}</DataPill>
              <DataPill>{postulacion.ciudad}</DataPill>
              <DataPill>{postulacion.edad} años</DataPill>
            </div>
            <DataPill>Postulación enviada {postulacion.fechaPostulacion}</DataPill>
          </div>
        </HeaderPanel>
      }
      content={
        <div className="space-y-4">
          <div>
            <TextField value="¿Por qué quiere ser opinador?" variant="subtle" readOnly />
          </div>
          <div>
            <TextArea value={postulacion.motivacion} readOnly className="h-[160px]" />
          </div>
        </div>
      }
    />
  );
}

export default function AdminOpinadoresPage() {
  const [vista, setVista] = useState<VistaOpinadores>("lista");
  const [selectedOpinador, setSelectedOpinador] =
    useState<OpinadorAdmin | null>(null);
  const [selectedEdicion, setSelectedEdicion] =
    useState<EdicionSeleccionada | null>(null);
  const [selectedPostulacion, setSelectedPostulacion] =
    useState<Postulacion | null>(null);

  const searchParams = useSearchParams();
  const [pendientes, setPendientes] = useState<Postulacion[]>([]);
  const [rechazados, setRechazados] = useState<Postulacion[]>([]);

  useEffect(() => {
    let activo = true;
    getPostulaciones().then((data) => {
      if (activo) {
        setPendientes(data.pendientes);
        setRechazados(data.rechazados);
      }
    });
    return () => {
      activo = false;
    };
  }, []);

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
          onRechazada={() => {
            getPostulaciones().then((data) => {
              setPendientes(data.pendientes);
              setRechazados(data.rechazados);
            });
            setSelectedPostulacion(null);
          }}
        />
      );
    }
    return (
      <ListaPendientes
        pendientes={pendientes}
        onSelect={setSelectedPostulacion}
        onVolver={() => setVista("lista")}
      />
    );
  }

  if (vista === "rechazados") {
    return (
      <ListaRechazados
        rechazados={rechazados}
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
