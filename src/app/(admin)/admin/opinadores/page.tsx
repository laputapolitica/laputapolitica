"use client";

import { Suspense, useEffect, useState } from "react";
import {
  getPostulaciones,
  rechazarPostulacion,
  aprobarPostulacion,
  getOpinadores,
  desactivarOpinador,
} from "./actions";
import { useSearchParams } from "next/navigation";
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
import type { OpinadorEdicion } from "@/app/(admin)/admin/actions";
import { VOTE_COLORS } from "@/lib/constants";
import type { OpinadorAdmin, Postulacion } from "@/lib/mock-opinadores";

type VistaOpinadores = "lista" | "pendientes" | "rechazados";

type EdicionSeleccionada = {
  fecha: string;
  fechaISO: string;
  titulo: string;
};

function ListaOpinadores({
  opinadores,
  onSelect,
  onPendientes,
  onRechazados,
}: {
  opinadores: OpinadorAdmin[];
  onSelect: (op: OpinadorAdmin) => void;
  onPendientes: () => void;
  onRechazados: () => void;
}) {
  return (
    <PanelLayout
      header={
        <RowCardListHeader>
          <TitlePill>{opinadores.length} Opinadores</TitlePill>
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
      content={<OpinadoresList opinadores={opinadores} onSelect={onSelect} />}
    />
  );
}

function DetalleOpinador({
  opinador,
  onSelectEdicion,
  onEliminado,
}: {
  opinador: OpinadorAdmin;
  onSelectEdicion: (ed: EdicionSeleccionada) => void;
  onEliminado: () => void;
}) {
  const [isPending, setIsPending] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [error, setError] = useState<string | undefined>();

  async function handleEliminar() {
    setIsPending(true);
    setError(undefined);
    const result = await desactivarOpinador(opinador.id);
    if (result.success) {
      onEliminado();
    } else {
      setError(result.error);
      setIsPending(false);
      setConfirmando(false);
    }
  }

  return (
    <PanelLayout
      header={
        <HeaderPanel>
          {/* Fila 1: identidad + acción */}
          <div className="flex items-center justify-between">
            <TitlePill>{opinador.nombre}</TitlePill>
            {confirmando ? (
              <div className="flex items-center gap-2">
                <span className="font-ui text-sm text-text-secondary">
                  ¿Eliminar opinador?
                </span>
                <TitlePill
                  onClick={isPending ? undefined : () => setConfirmando(false)}
                >
                  Cancelar
                </TitlePill>
                <TitlePill
                  onClick={isPending ? undefined : handleEliminar}
                  borderColor="#FF5C60"
                >
                  {isPending ? "Eliminando..." : "Confirmar"}
                </TitlePill>
              </div>
            ) : (
              <TitlePill onClick={() => setConfirmando(true)} borderColor="#FF5C60">
                Eliminar
              </TitlePill>
            )}
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

          {error ? (
            <p className="font-ui text-sm text-state-required">{error}</p>
          ) : null}
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
): OpinadorEdicion {
  const edicionData = edicion
    ? op.ediciones.find(e => e.fechaISO === edicion.fechaISO)
    : undefined;
  const votos = edicionData?.votos ?? [];
  const completadas = votos.filter(v => v !== null).length;
  const interpretacionPorColor: Record<string, string> = {
    [VOTE_COLORS.positiva]: "Positiva",
    [VOTE_COLORS.negativa]: "Negativa",
    [VOTE_COLORS.incierta]: "Incierta",
  };

  return {
    id: String(op.id),
    nombre: op.nombre,
    email: op.email,
    ciudad: op.ciudad,
    votos,
    completadas,
    opiniones: votos.map((color, index) => ({
      noticia: `Noticia ${index + 1}`,
      texto: "",
      interpretacion: color ? (interpretacionPorColor[color] ?? "") : "",
      color: color ?? VOTE_COLORS.nula,
    })),
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
  onRechazada,
  onAprobada,
}: {
  postulacion: Postulacion;
  onRechazada: () => void;
  onAprobada: () => void;
}) {
  const [isRejecting, setIsRejecting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [credenciales, setCredenciales] = useState<{
    numero: number;
    password: string;
  } | null>(null);

  async function handleRechazar() {
    setIsRejecting(true);
    setError(undefined);
    const result = await rechazarPostulacion(postulacion.id);
    if (result.success) {
      onRechazada();
    } else {
      setError(result.error);
      setIsRejecting(false);
    }
  }

  async function handleAprobar() {
    setIsApproving(true);
    setError(undefined);
    const result = await aprobarPostulacion(postulacion.id);
    if (result.success && result.passwordTemporal && result.numeroUsuario) {
      setCredenciales({
        numero: result.numeroUsuario,
        password: result.passwordTemporal,
      });
    } else {
      setError(result.error ?? "No se pudo aprobar.");
      setIsApproving(false);
    }
  }

  // Pantalla de éxito: muestra las credenciales temporales UNA vez.
  if (credenciales) {
    return (
      <PanelLayout
        header={
          <HeaderPanel>
            <TitlePill>Opinador creado: {postulacion.nombre}</TitlePill>
          </HeaderPanel>
        }
        content={
          <div className="space-y-4 p-4">
            <p className="font-ui text-sm text-text-secondary">
              Pasale estos datos al opinador. La contraseña no se vuelve a
              mostrar.
            </p>
            <div className="space-y-2 rounded-[4px] border border-admin-ink bg-white p-4">
              <p className="font-ui text-sm text-admin-ink">
                <strong>Email:</strong> {postulacion.email}
              </p>
              <p className="font-ui text-sm text-admin-ink">
                <strong>Número de opinador:</strong> {credenciales.numero}
              </p>
              <p className="font-ui text-sm text-admin-ink">
                <strong>Contraseña temporal:</strong>{" "}
                <span className="font-mono">{credenciales.password}</span>
              </p>
            </div>
            <TitlePill onClick={onAprobada} borderColor="#35C759">
              Listo
            </TitlePill>
          </div>
        }
      />
    );
  }

  const isBusy = isRejecting || isApproving;

  return (
    <PanelLayout
      header={
        <HeaderPanel>
          {/* Fila 1: identidad + acciones */}
          <div className="flex items-center justify-between">
            <TitlePill>{postulacion.nombre}</TitlePill>
            <div className="flex items-center gap-2">
              <TitlePill
                onClick={isBusy ? undefined : handleRechazar}
                borderColor="#FF5C60"
              >
                {isRejecting ? "Rechazando..." : "Rechazar"}
              </TitlePill>
              <TitlePill
                onClick={isBusy ? undefined : handleAprobar}
                borderColor="#35C759"
              >
                {isApproving ? "Aprobando..." : "Aceptar"}
              </TitlePill>
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
          {error ? (
            <p className="font-ui text-sm text-state-required">{error}</p>
          ) : null}
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

function AdminOpinadoresContent() {
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
  const [opinadores, setOpinadores] = useState<OpinadorAdmin[]>([]);

  useEffect(() => {
    let activo = true;
    getPostulaciones().then((data) => {
      if (activo) {
        setPendientes(data.pendientes);
        setRechazados(data.rechazados);
      }
    });
    getOpinadores().then((data) => {
      if (activo) {
        setOpinadores(data);
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
      const recargar = () => {
        getPostulaciones().then((data) => {
          setPendientes(data.pendientes);
          setRechazados(data.rechazados);
        });
        setSelectedPostulacion(null);
      };
      return (
        <DetallePostulacion
          postulacion={selectedPostulacion}
          onRechazada={recargar}
          onAprobada={recargar}
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
        onSelectEdicion={setSelectedEdicion}
        onEliminado={() => {
          getOpinadores().then(setOpinadores);
          setSelectedOpinador(null);
        }}
      />
    );
  }

  return (
    <ListaOpinadores
      opinadores={opinadores}
      onSelect={setSelectedOpinador}
      onPendientes={() => setVista("pendientes")}
      onRechazados={() => setVista("rechazados")}
    />
  );
}

export default function AdminOpinadoresPage() {
  return (
    <Suspense fallback={null}>
      <AdminOpinadoresContent />
    </Suspense>
  );
}
