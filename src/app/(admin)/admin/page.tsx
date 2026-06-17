"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getPipelineEnCurso,
  getCandidatasRelevamiento,
  getNoticiasTitulosResumenes,
  getNoticiasElPulso,
  getPortadaVigente,
  getHistorialPortadas,
  getEstilosBanco,
  getEstadoVentanaOpinion,
  autorizarEtapa,
  moverCandidata,
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
  type PipelineEnCurso,
  type NoticiasRelevamiento,
  type NoticiaTituloResumen,
  type NoticiaElPulso,
  type PortadaVigente,
  type PortadaHistorial,
  type EstiloBanco,
  type EstadoVentanaOpinion,
  type AutorizarEtapa,
  type DireccionMover,
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
  noticiasRelev,
  noticiasTitulos,
  noticiasElPulso,
  portada,
  historialPortadas,
  estilosBancoProp,
  estadoVentana,
  onSubir,
  onBajar,
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
  onRehacer,
  onRehacerElPulso,
}: {
  nodeId: PipelineNodeId;
  noticiasRelev?: NoticiasRelevamientoState;
  noticiasTitulos?: NoticiasTitulosState;
  noticiasElPulso?: NoticiaElPulso[] | null;
  portada?: PortadaVigente;
  historialPortadas?: PortadaHistorial[];
  estilosBancoProp?: EstiloBanco[];
  estadoVentana?: EstadoVentanaOpinion;
  onSubir?: (id: string) => void;
  onBajar?: (id: string) => void;
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
  onRehacer?: (id: string, campo: "titulo" | "resumen") => Promise<void> | void;
  onRehacerElPulso?: (noticiaId: string) => Promise<void> | void;
}) {
  if (nodeId === "relevamiento") {
    return (
      <RelevamientoPanel
        status="ready"
        noticias={noticiasRelev ?? undefined}
        onSubir={onSubir}
        onBajar={onBajar}
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
        onRehacer={onRehacerElPulso}
      />
    );
  }
  return <PublicacionPanel status="ready" />;
}

function PipelineActivePanel({
  state,
  noticiasRelev,
  noticiasTitulos,
  noticiasElPulso,
  portada,
  historialPortadas,
  estilosBancoProp,
  estadoVentana,
  onSubir,
  onBajar,
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
  onRehacer,
  onRehacerElPulso,
}: {
  state: PipelineState;
  noticiasRelev?: NoticiasRelevamientoState;
  noticiasTitulos?: NoticiasTitulosState;
  noticiasElPulso?: NoticiaElPulso[] | null;
  portada?: PortadaVigente;
  historialPortadas?: PortadaHistorial[];
  estilosBancoProp?: EstiloBanco[];
  estadoVentana?: EstadoVentanaOpinion;
  onSubir?: (id: string) => void;
  onBajar?: (id: string) => void;
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
        noticiasRelev={noticiasRelev}
        noticiasTitulos={noticiasTitulos}
        noticiasElPulso={noticiasElPulso}
        portada={portada}
        historialPortadas={historialPortadas}
        estilosBancoProp={estilosBancoProp}
        estadoVentana={estadoVentana}
        onSubir={onSubir}
        onBajar={onBajar}
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
        onRehacer={onRehacer}
        onRehacerElPulso={onRehacerElPulso}
      />
    );
  }

  const runningNodes = getRunningNodes(state);

  // Si el único nodo running es publicacion → mostrar PublicacionPanel
  if (runningNodes.length === 1 && runningNodes[0] === "publicacion") {
    return <PublicacionPanel status="ready" />;
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

  return <PublicacionPanel status="ready" />;
}

export default function AdminPage() {
  const searchParams = useSearchParams();
  const scenarioParam = searchParams.get("scenario");
  const panelParam = searchParams.get("panel") as PipelineNodeId | null;

  const [enCurso, setEnCurso] = useState<PipelineEnCurso>(null);
  const [noticiasRelev, setNoticiasRelev] = useState<NoticiasRelevamientoState>(null);
  const [noticiasTitulos, setNoticiasTitulos] =
    useState<NoticiasTitulosState>(null);
  const [noticiasElPulso, setNoticiasElPulso] =
    useState<NoticiaElPulso[] | null>(null);
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
      const candidatas = await getCandidatasRelevamiento(data.edicionId);
      const titNoticias = await getNoticiasTitulosResumenes(data.edicionId);
      const pulsoNoticias = await getNoticiasElPulso(data.edicionId);
      const portadaData = await getPortadaVigente(data.edicionId);
      const hist = await getHistorialPortadas(data.edicionId);
      const ev = await getEstadoVentanaOpinion(data.edicionId);
      setNoticiasRelev(candidatas);
      setNoticiasTitulos(titNoticias);
      setNoticiasElPulso(pulsoNoticias);
      setPortada(portadaData);
      setHistorialPortadas(hist);
      setEstadoVentana(ev);
    } else {
      setNoticiasRelev(null);
      setNoticiasTitulos(null);
      setNoticiasElPulso(null);
      setPortada(null);
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
          const candidatas = await getCandidatasRelevamiento(data.edicionId);
          const titNoticias = await getNoticiasTitulosResumenes(data.edicionId);
          const pulsoNoticias = await getNoticiasElPulso(data.edicionId);
          const portadaData = await getPortadaVigente(data.edicionId);
          const hist = await getHistorialPortadas(data.edicionId);
          const ev = await getEstadoVentanaOpinion(data.edicionId);
          if (activo) {
            setNoticiasRelev(candidatas);
            setNoticiasTitulos(titNoticias);
            setNoticiasElPulso(pulsoNoticias);
            setPortada(portadaData);
            setHistorialPortadas(hist);
            setEstadoVentana(ev);
          }
        } else {
          setNoticiasRelev(null);
          setNoticiasTitulos(null);
          setNoticiasElPulso(null);
          setPortada(null);
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

  async function handleMoverCandidata(candidataId: string, direccion: DireccionMover) {
    if (!enCurso) return;
    const res = await moverCandidata(enCurso.edicionId, candidataId, direccion);
    if (res.success) {
      await recargarPipeline();
    }
  }

  async function handleEliminarCandidata(candidataId: string) {
    if (!enCurso) return;
    const res = await eliminarCandidata(enCurso.edicionId, candidataId);
    if (res.success) {
      await recargarPipeline();
    } else if (res.error) {
      alert(res.error);
    }
  }

  async function handleAgregarCandidata(candidataId: string) {
    if (!enCurso) return;
    const res = await agregarCandidata(enCurso.edicionId, candidataId);
    if (res.success) {
      await recargarPipeline();
    } else if (res.error) {
      alert(res.error);
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
      return;
    }
    await recargarPipeline();
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
            noticiasRelev={noticiasRelev}
            noticiasTitulos={noticiasTitulos}
            noticiasElPulso={noticiasElPulso}
            portada={portada}
            historialPortadas={historialPortadas}
            estilosBancoProp={estilosBanco}
            estadoVentana={estadoVentana}
            onSubir={(id) => handleMoverCandidata(id, "subir")}
            onBajar={(id) => handleMoverCandidata(id, "bajar")}
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
            onRehacer={handleRehacer}
            onRehacerElPulso={handleRehacerElPulso}
          />
        ) : (
          <PipelineActivePanel
            state={pipelineState}
            noticiasRelev={noticiasRelev}
            noticiasTitulos={noticiasTitulos}
            noticiasElPulso={noticiasElPulso}
            portada={portada}
            historialPortadas={historialPortadas}
            estilosBancoProp={estilosBanco}
            estadoVentana={estadoVentana}
            onSubir={(id) => handleMoverCandidata(id, "subir")}
            onBajar={(id) => handleMoverCandidata(id, "bajar")}
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
            onRehacer={handleRehacer}
            onRehacerElPulso={handleRehacerElPulso}
          />
        )}
      </section>
    </div>
  );
}
