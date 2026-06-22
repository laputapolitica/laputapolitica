"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  getPipelineEnCurso,
  getCandidatasRelevamiento,
  getNoticiasTitulosResumenes,
  getNoticiasElPulso,
  getNoticiasPublicacionWeb,
  getPortadaVigente,
  getDatosPublicacionWeb,
  getHistorialPortadas,
  getEstilosBanco,
  getEstadoVentanaOpinion,
  autorizarEtapa,
  reordenarCandidatas,
  eliminarCandidata,
  agregarCandidata,
  guardarTituloResumen,
  guardarTituloPortada,
  subirPortadaManual,
  restaurarPortada,
  rehacerPortada,
  rehacerTituloPortada,
  rehacerCampo,
  rehacerResumenElPulso,
  guardarResumenElPulso,
  type PipelineEnCurso,
  type NoticiasRelevamiento,
  type NoticiaTituloResumen,
  type NoticiaElPulso,
  type DatosPublicacionWeb,
  type PortadaVigente,
  type PortadaHistorial,
  type EstiloBanco,
  type EstadoVentanaOpinion,
  type AutorizarEtapa,
  type OpcionRehacer,
} from "./actions";
import {
  ElPulsoPanel,
  PipelineDiagram,
  PortadaPanel,
  PublicadoPanel,
  PublicacionPanel,
  RelevamientoPanel,
  TitulosResumenesPanel,
  VentanaOpinionPanel,
} from "@/components/admin";
import { LoadingTextGrid } from "@/components/admin/shared";
import {
  mockState,
  mockStateElPulsoRunning,
  mockStateInicio,
  mockStateParaleloPortadaOpinion,
  mockStateParaleloWebInstagramTwitter,
  mockStatePublicacion,
  mockStatePublicado,
  mockStateRevisionElPulso,
  mockStateRevisionRelevamiento,
  mockStateRevisionTitulos,
  mockStateTitulosRunning,
} from "@/components/admin/PipelineDiagram";
import type { PipelineNodeId, PipelineState } from "@/components/admin/PipelineDiagram";
import type { NoticiaPublicacion } from "@/components/admin/panels/PublicacionPanel/types";

const VALID_NODES: PipelineNodeId[] = [
  "relevamiento",
  "titulosResumenes",
  "portada",
  "ventanaOpinion",
  "elPulso",
  "web",
  "instagram",
  "twitter",
  "publicacion",
];

const REVIEW_GATES = [
  {
    gateId: "relevamientoGate",
    nodeId: "relevamiento",
  },
  {
    gateId: "titulosGate",
    nodeId: "titulosResumenes",
  },
  {
    gateId: "portadaGate",
    nodeId: "portada",
  },
  {
    gateId: "elPulsoGate",
    nodeId: "elPulso",
  },
] as const;

const RUNNING_MESSAGES: Record<PipelineNodeId, string> = {
  relevamiento: "Buscando y seleccionando las noticias del día",
  titulosResumenes: "Creando títulos y resúmenes",
  portada: "Creando portada",
  ventanaOpinion: "Ventana de opinión de El Pulso abierta",
  elPulso: "Creando resúmenes de El Pulso",
  web: "Creando contenido para Web",
  instagram: "Creando contenido para Instagram",
  twitter: "Creando contenido para X (Twitter)",
  publicacion: "Preparando publicación",
};

const SCENARIO_STATES: Record<string, PipelineState> = {
  inicio: mockStateInicio,
  "revision-relevamiento": mockStateRevisionRelevamiento,
  "titulos-running": mockStateTitulosRunning,
  "revision-titulos": mockStateRevisionTitulos,
  "paralelo-portada-opinion": mockStateParaleloPortadaOpinion,
  "revision-portada": mockState,
  "elpulso-running": mockStateElPulsoRunning,
  "revision-elpulso": mockStateRevisionElPulso,
  "paralelo-canales": mockStateParaleloWebInstagramTwitter,
  publicacion: mockStatePublicacion,
  publicado: mockStatePublicado,
};

type NoticiasRelevamientoState = NoticiasRelevamiento | null;
type NoticiasTitulosState = NoticiaTituloResumen[] | null;
const DATOS_WEB_INICIAL: DatosPublicacionWeb = {
  portadaUrl: null,
  clima: [],
};
type ResultadoOptimistaRelevamiento =
  | { estado: NoticiasRelevamiento }
  | { motivo: "minimo-activas" | "maximo-activas" | "sin-cambio" };

function ordenarActivas(
  activas: NoticiasRelevamiento["activas"],
): NoticiasRelevamiento["activas"] {
  return [...activas].sort((a, b) => {
    const ordenA = a.orden ?? Number.MAX_SAFE_INTEGER;
    const ordenB = b.orden ?? Number.MAX_SAFE_INTEGER;

    return ordenA - ordenB || a.ranking - b.ranking;
  });
}

function ordenarDescartadas(
  descartadas: NoticiasRelevamiento["descartadas"],
): NoticiasRelevamiento["descartadas"] {
  return [...descartadas].sort((a, b) => a.ranking - b.ranking);
}

function compactarOrdenes(
  activas: NoticiasRelevamiento["activas"],
): NoticiasRelevamiento["activas"] {
  return activas.map((candidata, index) => ({
    ...candidata,
    orden: index + 1,
  }));
}

function aplicarEliminar(
  state: NoticiasRelevamiento,
  id: string,
): ResultadoOptimistaRelevamiento {
  if (state.activas.length <= 3) {
    return { motivo: "minimo-activas" };
  }

  const activasOrdenadas = ordenarActivas(state.activas);
  const candidata = activasOrdenadas.find((item) => item.id === id);

  if (!candidata) {
    return { motivo: "sin-cambio" };
  }

  return {
    estado: {
      activas: compactarOrdenes(activasOrdenadas.filter((item) => item.id !== id)),
      descartadas: ordenarDescartadas([
        ...state.descartadas,
        { ...candidata, orden: null },
      ]),
    },
  };
}

function aplicarAgregar(
  state: NoticiasRelevamiento,
  id: string,
): ResultadoOptimistaRelevamiento {
  if (state.activas.length >= 5) {
    return { motivo: "maximo-activas" };
  }

  const descartadasOrdenadas = ordenarDescartadas(state.descartadas);
  const candidata = descartadasOrdenadas.find((item) => item.id === id);

  if (!candidata) {
    return { motivo: "sin-cambio" };
  }

  const activasOrdenadas = ordenarActivas(state.activas);

  return {
    estado: {
      activas: [
        ...activasOrdenadas,
        { ...candidata, orden: activasOrdenadas.length + 1 },
      ],
      descartadas: descartadasOrdenadas.filter((item) => item.id !== id),
    },
  };
}

function aplicarReordenar(
  state: NoticiasRelevamiento,
  ordenIds: string[],
): NoticiasRelevamiento {
  const activasOrdenadas = ordenarActivas(state.activas);
  const activasPorId = new Map(
    activasOrdenadas.map((candidata) => [candidata.id, candidata]),
  );
  const nuevasActivas = ordenIds
    .map((id) => activasPorId.get(id))
    .filter((candidata): candidata is NoticiasRelevamiento["activas"][number] =>
      Boolean(candidata),
    );

  return {
    activas: compactarOrdenes(nuevasActivas),
    descartadas: state.descartadas,
  };
}

function getReviewNode(state: PipelineState): PipelineNodeId | null {
  const reviewGate = REVIEW_GATES.find(
    ({ gateId, nodeId }) => state[gateId] === "pending" && state[nodeId] === "done",
  );

  return reviewGate?.nodeId ?? null;
}

function getRunningNodes(state: PipelineState): PipelineNodeId[] {
  return VALID_NODES.filter((nodeId) => state[nodeId] === "running");
}

function ActivePanel({
  nodeId,
  edicionId,
  titulo,
  noticiasRelev,
  noticiasTitulos,
  noticiasElPulso,
  noticiasPublicacion,
  datosWeb,
  portada,
  historialPortadas,
  estilosBancoProp,
  estadoVentana,
  onReordenar,
  onEliminar,
  onAgregar,
  onSaveTitulo,
  onSaveTituloPortada,
  onSubirPortada,
  onRestaurarPortada,
  subiendoPortadaProp,
  onRehacerTituloPortada,
  rehaciendoTituloProp,
  onRehacerPortada,
  rehaciendoPortadaProp,
  onAbrirGaleriaEstilos,
  onSaveResumen,
  onSaveResumenElPulso,
  onRehacer,
  onRehacerElPulso,
}: {
  nodeId: PipelineNodeId;
  edicionId?: string;
  titulo?: string;
  noticiasRelev?: NoticiasRelevamientoState;
  noticiasTitulos?: NoticiasTitulosState;
  noticiasElPulso?: NoticiaElPulso[] | null;
  noticiasPublicacion?: NoticiaPublicacion[] | null;
  datosWeb?: DatosPublicacionWeb;
  portada?: PortadaVigente;
  historialPortadas?: PortadaHistorial[];
  estilosBancoProp?: EstiloBanco[];
  estadoVentana?: EstadoVentanaOpinion;
  onReordenar?: (ordenIds: string[]) => void;
  onEliminar?: (id: string) => void;
  onAgregar?: (id: string) => void;
  onSaveTitulo?: (id: string, val: string) => void;
  onSaveTituloPortada?: (titulo: string) => void;
  onSubirPortada?: (file: File) => void;
  onRestaurarPortada?: (portadaId: string) => void;
  subiendoPortadaProp?: boolean;
  onRehacerTituloPortada?: () => void;
  rehaciendoTituloProp?: boolean;
  onRehacerPortada?: (opcion: OpcionRehacer) => void;
  rehaciendoPortadaProp?: boolean;
  onAbrirGaleriaEstilos?: () => void;
  onSaveResumen?: (id: string, val: string) => void;
  onSaveResumenElPulso?: (id: string, val: string) => void;
  onRehacer?: (id: string, campo: "titulo" | "resumen") => Promise<void> | void;
  onRehacerElPulso?: (noticiaId: string) => Promise<void> | void;
}) {
  if (nodeId === "relevamiento") {
    return (
      <RelevamientoPanel
        status="ready"
        noticias={noticiasRelev ?? undefined}
        onReordenar={onReordenar}
        onEliminar={onEliminar}
        onAgregar={onAgregar}
      />
    );
  }
  if (nodeId === "titulosResumenes") {
    return (
      <TitulosResumenesPanel
        status="ready"
        noticias={noticiasTitulos ?? undefined}
        onSaveTitulo={(id, val) => onSaveTitulo?.(id, val)}
        onSaveResumen={(id, val) => onSaveResumen?.(id, val)}
        onRehacer={onRehacer}
      />
    );
  }
  if (nodeId === "portada") {
    return (
      <PortadaPanel
        status="ready"
        portada={portada}
        onSaveTitulo={onSaveTituloPortada}
        onSubirImagen={onSubirPortada}
        subiendoImagen={subiendoPortadaProp}
        onRehacerTitulo={onRehacerTituloPortada}
        rehaciendoTitulo={rehaciendoTituloProp}
        onRehacerPortada={onRehacerPortada}
        rehaciendoPortada={rehaciendoPortadaProp}
        estilosBanco={estilosBancoProp}
        onAbrirGaleriaEstilos={onAbrirGaleriaEstilos}
        historial={historialPortadas}
        onRestaurar={onRestaurarPortada}
      />
    );
  }
  if (nodeId === "ventanaOpinion") return <VentanaOpinionPanel estado={estadoVentana} />;
  if (nodeId === "elPulso") {
    return (
      <ElPulsoPanel
        status="ready"
        noticias={noticiasElPulso ?? undefined}
        onSaveResumen={onSaveResumenElPulso}
        onRehacer={onRehacerElPulso}
      />
    );
  }
  return (
    <PublicacionPanel
      status="ready"
      edicionId={edicionId}
      titulo={titulo}
      noticias={noticiasPublicacion ?? undefined}
      portadaUrl={datosWeb?.portadaUrl}
      clima={datosWeb?.clima}
    />
  );
}

function PipelineActivePanel({
  state,
  edicionId,
  titulo,
  noticiasRelev,
  noticiasTitulos,
  noticiasElPulso,
  noticiasPublicacion,
  datosWeb,
  portada,
  historialPortadas,
  estilosBancoProp,
  estadoVentana,
  onReordenar,
  onEliminar,
  onAgregar,
  onSaveTitulo,
  onSaveTituloPortada,
  onSubirPortada,
  onRestaurarPortada,
  subiendoPortadaProp,
  onRehacerTituloPortada,
  rehaciendoTituloProp,
  onRehacerPortada,
  rehaciendoPortadaProp,
  onAbrirGaleriaEstilos,
  onSaveResumen,
  onSaveResumenElPulso,
  onRehacer,
  onRehacerElPulso,
}: {
  state: PipelineState;
  edicionId?: string;
  titulo?: string;
  noticiasRelev?: NoticiasRelevamientoState;
  noticiasTitulos?: NoticiasTitulosState;
  noticiasElPulso?: NoticiaElPulso[] | null;
  noticiasPublicacion?: NoticiaPublicacion[] | null;
  datosWeb?: DatosPublicacionWeb;
  portada?: PortadaVigente;
  historialPortadas?: PortadaHistorial[];
  estilosBancoProp?: EstiloBanco[];
  estadoVentana?: EstadoVentanaOpinion;
  onReordenar?: (ordenIds: string[]) => void;
  onEliminar?: (id: string) => void;
  onAgregar?: (id: string) => void;
  onSaveTitulo?: (id: string, val: string) => void;
  onSaveTituloPortada?: (titulo: string) => void;
  onSubirPortada?: (file: File) => void;
  onRestaurarPortada?: (portadaId: string) => void;
  subiendoPortadaProp?: boolean;
  onRehacerTituloPortada?: () => void;
  rehaciendoTituloProp?: boolean;
  onRehacerPortada?: (opcion: OpcionRehacer) => void;
  rehaciendoPortadaProp?: boolean;
  onAbrirGaleriaEstilos?: () => void;
  onSaveResumen?: (id: string, val: string) => void;
  onSaveResumenElPulso?: (id: string, val: string) => void;
  onRehacer?: (id: string, campo: "titulo" | "resumen") => Promise<void> | void;
  onRehacerElPulso?: (noticiaId: string) => Promise<void> | void;
}) {
  // Si todo está done → pantalla de publicado con cuenta atrás
  const allDone = Object.entries(state)
    .filter(([key]) => !key.includes("Gate"))
    .every(([, val]) => val === "done");

  if (allDone) return <PublicadoPanel />;

  const reviewNode = getReviewNode(state);

  if (reviewNode) {
    return (
      <ActivePanel
        nodeId={reviewNode}
        edicionId={edicionId}
        titulo={titulo}
        noticiasRelev={noticiasRelev}
        noticiasTitulos={noticiasTitulos}
        noticiasElPulso={noticiasElPulso}
        noticiasPublicacion={noticiasPublicacion}
        datosWeb={datosWeb}
        portada={portada}
        historialPortadas={historialPortadas}
        estilosBancoProp={estilosBancoProp}
        estadoVentana={estadoVentana}
        onReordenar={onReordenar}
        onEliminar={onEliminar}
        onAgregar={onAgregar}
        onSaveTitulo={onSaveTitulo}
        onSaveTituloPortada={onSaveTituloPortada}
        onSubirPortada={onSubirPortada}
        onRestaurarPortada={onRestaurarPortada}
        subiendoPortadaProp={subiendoPortadaProp}
        onRehacerTituloPortada={onRehacerTituloPortada}
        rehaciendoTituloProp={rehaciendoTituloProp}
        onRehacerPortada={onRehacerPortada}
        rehaciendoPortadaProp={rehaciendoPortadaProp}
        onAbrirGaleriaEstilos={onAbrirGaleriaEstilos}
        onSaveResumen={onSaveResumen}
        onSaveResumenElPulso={onSaveResumenElPulso}
        onRehacer={onRehacer}
        onRehacerElPulso={onRehacerElPulso}
      />
    );
  }

  const runningNodes = getRunningNodes(state);

  // Si el único nodo running es publicacion → mostrar PublicacionPanel
  if (runningNodes.length === 1 && runningNodes[0] === "publicacion") {
    return (
      <PublicacionPanel
        status="ready"
        edicionId={edicionId}
        titulo={titulo}
        noticias={noticiasPublicacion ?? undefined}
        portadaUrl={datosWeb?.portadaUrl}
        clima={datosWeb?.clima}
      />
    );
  }

  if (runningNodes.includes("ventanaOpinion")) {
    return <VentanaOpinionPanel estado={estadoVentana} />;
  }

  if (runningNodes.length > 0) {
    return (
      <LoadingTextGrid
        messages={runningNodes.map((nodeId) => RUNNING_MESSAGES[nodeId])}
      />
    );
  }

  return (
    <PublicacionPanel
      status="ready"
      edicionId={edicionId}
      titulo={titulo}
      noticias={noticiasPublicacion ?? undefined}
      portadaUrl={datosWeb?.portadaUrl}
      clima={datosWeb?.clima}
    />
  );
}

function AdminPageContent() {
  const searchParams = useSearchParams();
  const scenarioParam = searchParams.get("scenario");
  const panelParam = searchParams.get("panel") as PipelineNodeId | null;

  const [enCurso, setEnCurso] = useState<PipelineEnCurso>(null);
  const [noticiasRelev, setNoticiasRelev] = useState<NoticiasRelevamientoState>(null);
  const [noticiasTitulos, setNoticiasTitulos] =
    useState<NoticiasTitulosState>(null);
  const [noticiasElPulso, setNoticiasElPulso] =
    useState<NoticiaElPulso[] | null>(null);
  const [noticiasPublicacion, setNoticiasPublicacion] =
    useState<NoticiaPublicacion[] | null>(null);
  const [datosWeb, setDatosWeb] =
    useState<DatosPublicacionWeb>(DATOS_WEB_INICIAL);
  const [portada, setPortada] = useState<PortadaVigente>(null);
  const [historialPortadas, setHistorialPortadas] = useState<PortadaHistorial[]>([]);
  const [estilosBanco, setEstilosBanco] = useState<EstiloBanco[]>([]);
  const [estadoVentana, setEstadoVentana] = useState<EstadoVentanaOpinion | undefined>(
    undefined,
  );
  const [subiendoPortada, setSubiendoPortada] = useState(false);
  const [rehaciendoTitulo, setRehaciendoTitulo] = useState(false);
  const [rehaciendoPortada, setRehaciendoPortada] = useState(false);
  const [cargando, setCargando] = useState(true);

  async function recargarPipeline() {
    const data = await getPipelineEnCurso();
    setEnCurso(data);
    if (data) {
      const [
        candidatas,
        titNoticias,
        pulsoNoticias,
        publicacionNoticias,
        portadaData,
        datosWebData,
        hist,
        ev,
      ] = await Promise.all([
        getCandidatasRelevamiento(data.edicionId),
        getNoticiasTitulosResumenes(data.edicionId),
        getNoticiasElPulso(data.edicionId),
        getNoticiasPublicacionWeb(data.edicionId),
        getPortadaVigente(data.edicionId),
        getDatosPublicacionWeb(data.edicionId),
        getHistorialPortadas(data.edicionId),
        getEstadoVentanaOpinion(data.edicionId),
      ]);
      setNoticiasRelev(candidatas);
      setNoticiasTitulos(titNoticias);
      setNoticiasElPulso(pulsoNoticias);
      setNoticiasPublicacion(publicacionNoticias);
      setPortada(portadaData);
      setDatosWeb(datosWebData);
      setHistorialPortadas(hist);
      setEstadoVentana(ev);
    } else {
      setNoticiasRelev(null);
      setNoticiasTitulos(null);
      setNoticiasElPulso(null);
      setNoticiasPublicacion(null);
      setPortada(null);
      setDatosWeb(DATOS_WEB_INICIAL);
      setHistorialPortadas([]);
      setEstadoVentana(undefined);
    }
  }

  useEffect(() => {
    let activo = true;
    getPipelineEnCurso().then(async (data) => {
      if (activo) {
        setEnCurso(data);
        if (data) {
          const [
            candidatas,
            titNoticias,
            pulsoNoticias,
            publicacionNoticias,
            portadaData,
            datosWebData,
            hist,
            ev,
          ] = await Promise.all([
            getCandidatasRelevamiento(data.edicionId),
            getNoticiasTitulosResumenes(data.edicionId),
            getNoticiasElPulso(data.edicionId),
            getNoticiasPublicacionWeb(data.edicionId),
            getPortadaVigente(data.edicionId),
            getDatosPublicacionWeb(data.edicionId),
            getHistorialPortadas(data.edicionId),
            getEstadoVentanaOpinion(data.edicionId),
          ]);
          if (activo) {
            setNoticiasRelev(candidatas);
            setNoticiasTitulos(titNoticias);
            setNoticiasElPulso(pulsoNoticias);
            setNoticiasPublicacion(publicacionNoticias);
            setPortada(portadaData);
            setDatosWeb(datosWebData);
            setHistorialPortadas(hist);
            setEstadoVentana(ev);
          }
        } else {
          setNoticiasRelev(null);
          setNoticiasTitulos(null);
          setNoticiasElPulso(null);
          setNoticiasPublicacion(null);
          setPortada(null);
          setDatosWeb(DATOS_WEB_INICIAL);
          setHistorialPortadas([]);
          setEstadoVentana(undefined);
        }
        setCargando(false);
      }
    });
    return () => {
      activo = false;
    };
  }, []);

  async function handleAutorizar(nodeId: string) {
    if (!enCurso) return;
    const etapasValidas: AutorizarEtapa[] = [
      "relevamiento",
      "titulosResumenes",
      "portada",
      "publicacion",
      "elPulso",
    ];
    if (!etapasValidas.includes(nodeId as AutorizarEtapa)) return;
    const res = await autorizarEtapa(enCurso.edicionId, nodeId as AutorizarEtapa);
    if (res.success) {
      await recargarPipeline();
    }
  }

  async function handlePublicar() {
    if (!enCurso) return;
    const res = await autorizarEtapa(enCurso.edicionId, "publicacion");
    if (res.success) {
      await recargarPipeline();
    }
  }

  async function handleReordenarCandidatas(ordenIds: string[]) {
    if (!enCurso || !noticiasRelev) return;
    const snapshot = noticiasRelev;
    setNoticiasRelev(aplicarReordenar(noticiasRelev, ordenIds));

    try {
      const res = await reordenarCandidatas(enCurso.edicionId, ordenIds);
      if (res?.error) {
        setNoticiasRelev(snapshot);
        alert(res.error);
      }
    } catch {
      setNoticiasRelev(snapshot);
      alert("No se pudo completar la acción. Intentá de nuevo.");
    }
  }

  async function handleEliminarCandidata(candidataId: string) {
    if (!enCurso || !noticiasRelev) return;
    const resultado = aplicarEliminar(noticiasRelev, candidataId);

    if ("motivo" in resultado) {
      if (resultado.motivo === "minimo-activas") {
        alert("Tenés que mantener al menos 3 noticias activas.");
      }
      return;
    }

    const snapshot = noticiasRelev;
    setNoticiasRelev(resultado.estado);

    try {
      const res = await eliminarCandidata(enCurso.edicionId, candidataId);
      if (res?.error) {
        setNoticiasRelev(snapshot);
        alert(res.error);
      }
    } catch {
      setNoticiasRelev(snapshot);
      alert("No se pudo completar la acción. Intentá de nuevo.");
    }
  }

  async function handleAgregarCandidata(candidataId: string) {
    if (!enCurso || !noticiasRelev) return;
    const resultado = aplicarAgregar(noticiasRelev, candidataId);

    if ("motivo" in resultado) {
      if (resultado.motivo === "maximo-activas") {
        alert("Ya tenés 5 noticias activas (el máximo).");
      }
      return;
    }

    const snapshot = noticiasRelev;
    setNoticiasRelev(resultado.estado);

    try {
      const res = await agregarCandidata(enCurso.edicionId, candidataId);
      if (res?.error) {
        setNoticiasRelev(snapshot);
        alert(res.error);
      }
    } catch {
      setNoticiasRelev(snapshot);
      alert("No se pudo completar la acción. Intentá de nuevo.");
    }
  }

  async function handleGuardarTituloResumen(
    noticiaId: string,
    campo: "titulo" | "resumen",
    valor: string,
  ) {
    if (!enCurso) return;
    const res = await guardarTituloResumen(noticiaId, campo, valor);
    if (res.success) {
      await recargarPipeline();
    } else if (res.error) {
      alert(res.error);
    }
  }

  async function handleGuardarTituloPortada(titulo: string) {
    if (!portada) return;
    const res = await guardarTituloPortada(portada.id, titulo);
    if (res.error) {
      alert(res.error);
    }
  }

  async function handleSubirPortada(file: File) {
    if (!enCurso) return;
    setSubiendoPortada(true);
    try {
      const formData = new FormData();
      formData.append("imagen", file);
      const res = await subirPortadaManual(enCurso.edicionId, formData);
      if (res.success) {
        await recargarPipeline();
      } else if (res.error) {
        alert(res.error);
      }
    } finally {
      setSubiendoPortada(false);
    }
  }

  async function handleRestaurarPortada(portadaId: string) {
    if (!enCurso) return;
    const res = await restaurarPortada(enCurso.edicionId, portadaId);
    if (res.success) {
      await recargarPipeline();
    } else if (res.error) {
      alert(res.error);
    }
  }

  async function handleRehacerTitulo() {
    if (!enCurso) return;
    setRehaciendoTitulo(true);
    try {
      const res = await rehacerTituloPortada(enCurso.edicionId);
      if (res.success) {
        await recargarPipeline();
      } else if (res.error) {
        alert(res.error);
      }
    } finally {
      setRehaciendoTitulo(false);
    }
  }

  async function handleAbrirGaleriaEstilos() {
    const estilos = await getEstilosBanco();
    setEstilosBanco(estilos);
  }

  async function handleRehacerPortada(opcion: OpcionRehacer) {
    if (!enCurso) return;
    setRehaciendoPortada(true);
    try {
      const res = await rehacerPortada(enCurso.edicionId, opcion);
      if (res.success) {
        await recargarPipeline();
      } else if (res.error) {
        alert(res.error);
      }
    } finally {
      setRehaciendoPortada(false);
    }
  }

  async function handleRehacer(noticiaId: string, campo: "titulo" | "resumen") {
    const res = await rehacerCampo(noticiaId, campo);
    if (res.error) {
      alert(res.error);
      return;
    }
    if (res.valor) {
      const guardado = await guardarTituloResumen(noticiaId, campo, res.valor);
      if (guardado.success) {
        await recargarPipeline();
      } else if (guardado.error) {
        alert(guardado.error);
      }
    }
  }

  async function handleRehacerElPulso(noticiaId: string) {
    const res = await rehacerResumenElPulso(noticiaId);
    if (res?.error) {
      console.error(res.error);
      alert(res.error);
      return;
    }
    await recargarPipeline();
  }

  async function handleGuardarResumenElPulso(noticiaId: string, valor: string) {
    if (!enCurso) return;
    const res = await guardarResumenElPulso(noticiaId, valor);
    if (res.success) {
      await recargarPipeline();
    } else if (res.error) {
      alert(res.error);
    }
  }

  // Si hay ?scenario= en la URL, se usa el mock (herramienta de testing Dev).
  // Si no, se usa el estado real de la edición en curso.
  const pipelineState: PipelineState | null = scenarioParam
    ? SCENARIO_STATES[scenarioParam] ?? mockState
    : enCurso?.state ?? null;

  const forcedNodeId =
    panelParam && VALID_NODES.includes(panelParam) ? panelParam : null;

  // Sin scenario y todavía cargando el estado real.
  if (!scenarioParam && cargando) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="font-ui text-sm text-text-secondary">Cargando…</span>
      </div>
    );
  }

  // Sin scenario y sin edición en curso.
  if (!pipelineState) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="font-ui text-sm text-text-secondary">
          No hay una edición en curso en este momento.
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <PipelineDiagram
        pipelineState={pipelineState}
        onAutorizar={handleAutorizar}
        onPublicar={handlePublicar}
      />
      <section className="min-h-0 flex-1 overflow-y-auto bg-bg-base w-full">
        {forcedNodeId ? (
          <ActivePanel
            nodeId={forcedNodeId}
            edicionId={enCurso?.edicionId}
            titulo={enCurso?.titulo}
            noticiasRelev={noticiasRelev}
            noticiasTitulos={noticiasTitulos}
            noticiasElPulso={noticiasElPulso}
            noticiasPublicacion={noticiasPublicacion}
            datosWeb={datosWeb}
            portada={portada}
            historialPortadas={historialPortadas}
            estilosBancoProp={estilosBanco}
            estadoVentana={estadoVentana}
            onReordenar={handleReordenarCandidatas}
            onEliminar={handleEliminarCandidata}
            onAgregar={handleAgregarCandidata}
            onSaveTitulo={(id, val) =>
              handleGuardarTituloResumen(id, "titulo", val)
            }
            onSaveTituloPortada={handleGuardarTituloPortada}
            onSubirPortada={handleSubirPortada}
            onRestaurarPortada={handleRestaurarPortada}
            subiendoPortadaProp={subiendoPortada}
            onRehacerTituloPortada={handleRehacerTitulo}
            rehaciendoTituloProp={rehaciendoTitulo}
            onRehacerPortada={handleRehacerPortada}
            rehaciendoPortadaProp={rehaciendoPortada}
            onAbrirGaleriaEstilos={handleAbrirGaleriaEstilos}
            onSaveResumen={(id, val) =>
              handleGuardarTituloResumen(id, "resumen", val)
            }
            onSaveResumenElPulso={handleGuardarResumenElPulso}
            onRehacer={handleRehacer}
            onRehacerElPulso={handleRehacerElPulso}
          />
        ) : (
          <PipelineActivePanel
            state={pipelineState}
            edicionId={enCurso?.edicionId}
            titulo={enCurso?.titulo}
            noticiasRelev={noticiasRelev}
            noticiasTitulos={noticiasTitulos}
            noticiasElPulso={noticiasElPulso}
            noticiasPublicacion={noticiasPublicacion}
            datosWeb={datosWeb}
            portada={portada}
            historialPortadas={historialPortadas}
            estilosBancoProp={estilosBanco}
            estadoVentana={estadoVentana}
            onReordenar={handleReordenarCandidatas}
            onEliminar={handleEliminarCandidata}
            onAgregar={handleAgregarCandidata}
            onSaveTitulo={(id, val) =>
              handleGuardarTituloResumen(id, "titulo", val)
            }
            onSaveTituloPortada={handleGuardarTituloPortada}
            onSubirPortada={handleSubirPortada}
            onRestaurarPortada={handleRestaurarPortada}
            subiendoPortadaProp={subiendoPortada}
            onRehacerTituloPortada={handleRehacerTitulo}
            rehaciendoTituloProp={rehaciendoTitulo}
            onRehacerPortada={handleRehacerPortada}
            rehaciendoPortadaProp={rehaciendoPortada}
            onAbrirGaleriaEstilos={handleAbrirGaleriaEstilos}
            onSaveResumen={(id, val) =>
              handleGuardarTituloResumen(id, "resumen", val)
            }
            onSaveResumenElPulso={handleGuardarResumenElPulso}
            onRehacer={handleRehacer}
            onRehacerElPulso={handleRehacerElPulso}
          />
        )}
      </section>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <span className="font-ui text-sm text-text-secondary">Cargando…</span>
        </div>
      }
    >
      <AdminPageContent />
    </Suspense>
  );
}
