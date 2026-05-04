"use client";

import { useState } from "react";

import { IconAtras } from "@/components/admin/icons";
import { VOTE_COLORS } from "@/lib/constants";
import type { Canal, MockOpinador, NoticiaPublicacion } from "./PublicacionPanel/types";
import { canales, clima, mockOpiniones, mockOpinadores, noticias } from "./PublicacionPanel/mocks";
import { LoadingText } from "./PublicacionPanel/shared/LoadingText";
import { EditButton, CopyButton, DownloadButton } from "./PublicacionPanel/shared/ActionButtons";
import { CanalIcon } from "./PublicacionPanel/shared/CanalIcon";
import { TabButton } from "./PublicacionPanel/shared/TabButton";
import { EditableTitle } from "./PublicacionPanel/shared/EditableTitle";
import { getPointColor } from "./PublicacionPanel/helpers";
import { ElPulsoLogo } from "@/components/shared/ElPulsoLogo";

interface PublicacionPanelProps {
  status: "loading" | "ready";
  onPublicar?: () => void;
}

function PortadaSlide() {
  return (
    <div className="space-y-4">
      <EditableTitle value="Equilibrio ciego" />
      <div>
        <p className="mb-2 font-ui text-xs font-semibold tracking-wider text-text-secondary">
          PORTADA
        </p>
        <div className="flex items-start gap-4">
          <div className="h-[200px] w-[200px] shrink-0 rounded-lg border border-admin-ink bg-gray-200" />
          <DownloadButton />
        </div>
      </div>
    </div>
  );
}

function InterpretacionGeneral({
  interpretacion,
}: {
  interpretacion: NoticiaPublicacion["interpretacion"];
}) {
  const items = [
    { label: "Positiva", value: interpretacion.positiva, color: VOTE_COLORS.positiva },
    { label: "Negativa", value: interpretacion.negativa, color: VOTE_COLORS.negativa },
    { label: "Incierta", value: interpretacion.incierta, color: VOTE_COLORS.incierta },
  ];

  return (
    <div>
      <p className="mb-2 font-ui text-xs font-semibold tracking-wider text-text-secondary">
        INTERPRETACIÓN GENERAL
      </p>
      <div className="inline-block rounded-[4px] border border-admin-ink bg-white p-3">
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              {/* Indicador */}
              <div
                style={{
                  width: "3px",
                  height: "12px",
                  borderRadius: "9999px",
                  backgroundColor: item.color,
                }}
              />
              {/* Texto */}
              <span className="font-ui text-xs font-medium text-admin-ink w-[52px]">
                {item.label}
              </span>
              {/* Barra fondo */}
              <div
                style={{
                  width: "100px",
                  height: "12px",
                  borderRadius: "3px",
                  backgroundColor: "#E9E5DE",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Barra color */}
                <div
                  style={{
                    width: `${item.value}px`,
                    height: "12px",
                    borderRadius: "3px",
                    backgroundColor: item.color,
                  }}
                />
              </div>
              {/* Porcentaje */}
              <span className="font-ui text-xs font-semibold text-admin-ink w-[32px] text-right">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NoticiaSlide({ noticia }: { noticia: NoticiaPublicacion }) {
  const [titulo, setTitulo] = useState(noticia.titulo);
  const [resumen, setResumen] = useState(noticia.resumen);
  const [pulso, setPulso] = useState(noticia.pulso);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-ui text-xs font-semibold tracking-wider text-text-secondary">
              TÍTULO NOTICIA
            </span>
            <EditButton />
          </div>
          <input
            type="text"
            value={titulo}
            onChange={(event) => setTitulo(event.target.value)}
            className="w-full rounded-[4px] border border-admin-ink bg-white px-3 py-2 font-ui text-sm font-medium text-admin-ink outline-none"
          />
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-ui text-xs font-semibold tracking-wider text-text-secondary">
              RESUMEN
            </span>
            <EditButton />
          </div>
          <textarea
            value={resumen}
            onChange={(event) => setResumen(event.target.value)}
            className="min-h-[130px] w-full resize-none rounded-[4px] border border-admin-ink bg-white px-3 py-2 font-ui text-sm font-medium text-admin-ink outline-none"
          />
        </div>
      </div>

      <div>
        <div>
          <div className="mb-4">
            <ElPulsoLogo className="block" width={80} height={20} />
          </div>
          <div className="mb-2 flex items-center justify-between">
            <p className="font-ui text-xs font-semibold tracking-wider text-text-secondary">
              RESUMEN DE EL PULSO
            </p>
            <EditButton />
          </div>
          <textarea
            value={pulso}
            onChange={(event) => setPulso(event.target.value)}
            className="min-h-[130px] w-full resize-none rounded-[4px] border border-admin-ink bg-white px-3 py-2 font-ui text-sm font-medium text-admin-ink outline-none"
          />
        </div>

        <div className="mt-4">
          <InterpretacionGeneral interpretacion={noticia.interpretacion} />
        </div>
      </div>
    </div>
  );
}

function ClimaSlide() {
  return (
    <div>
      <div className="relative inline-flex">
        <select className="h-[24px] appearance-none rounded-[4px] border border-admin-ink bg-white pl-2 pr-6 font-ui text-xs font-medium text-admin-ink outline-none cursor-pointer">
          <option>Buenos Aires</option>
          <option>Córdoba</option>
          <option>Santa Fe</option>
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-admin-ink text-[10px]">↓</span>
      </div>

      <div className="mt-4 flex gap-6 items-start">
        {clima.map((dia) => (
          <article key={dia.dia} className="flex flex-col gap-3">
            {/* Label día */}
            <div className="inline-flex w-fit h-[22px] items-center rounded-[3.5px] border border-admin-ink px-2">
              <span className="font-ui text-[11px] font-medium text-admin-ink whitespace-nowrap">{dia.dia}</span>
            </div>

            {/* Imagen */}
            <div className="flex items-start gap-3">
              <div className="rounded-lg border border-admin-ink bg-white p-2">
                <div className="h-[100px] w-[100px] rounded-[4px] bg-gray-200" />
              </div>
              <EditButton />
            </div>

            {/* Min */}
            <div className="flex items-center gap-2">
              <div className="inline-flex h-[22px] items-center rounded-[3.5px] px-2 border" style={{ borderColor: "#2F4E85", color: "#2F4E85" }}>
                <span className="font-ui text-[11px] font-medium">Min</span>
              </div>
              <div className="inline-flex h-[22px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
                <span className="font-ui text-[11px] font-medium text-admin-ink">{dia.min}°</span>
              </div>
              <EditButton />
            </div>

            {/* Max */}
            <div className="flex items-center gap-2">
              <div className="inline-flex h-[22px] items-center rounded-[3.5px] px-2 border" style={{ borderColor: "#B74A4A", color: "#B74A4A" }}>
                <span className="font-ui text-[11px] font-medium">Max</span>
              </div>
              <div className="inline-flex h-[22px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
                <span className="font-ui text-[11px] font-medium text-admin-ink">{dia.max}°</span>
              </div>
              <EditButton />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function InstagramEditablePill({ value }: { value: string }) {
  const [pillValue, setPillValue] = useState(value);

  return (
    <div className="inline-flex items-center gap-3">
      <input
        type="text"
        value={pillValue}
        onChange={(event) => setPillValue(event.target.value)}
        className="h-[28px] rounded-[3.5px] border border-admin-ink bg-white px-2 font-ui text-xs font-semibold text-admin-ink outline-none"
        style={{ width: `${pillValue.length + 2}ch` }}
      />
      <EditButton />
      <CopyButton />
    </div>
  );
}

function InstagramBulletRows({ bullets }: { bullets: string[] }) {
  return (
    <div className="flex flex-col gap-1">
      {bullets.map((bullet) => (
        <InstagramBulletRow key={bullet} bullet={bullet} />
      ))}
    </div>
  );
}

function InstagramBulletRow({ bullet }: { bullet: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="inline-flex rounded-[3.5px] border border-admin-ink bg-white px-2 py-1">
        <span className="font-ui text-sm font-medium text-admin-ink">
          ■ {bullet}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-2 pt-1">
        <EditButton />
        <CopyButton />
      </div>
    </div>
  );
}

function InstagramVoteRow({
  label,
  borderColor,
  pxValue,
  percentValue,
}: {
  label: string;
  borderColor: string;
  pxValue: string;
  percentValue: string;
}) {
  const [widthValue, setWidthValue] = useState(pxValue);
  const [voteValue, setVoteValue] = useState(percentValue);

  return (
    <div className="flex items-center gap-2">
      <div
        className="inline-flex h-[28px] items-center rounded-[3.5px] px-2"
        style={{ border: `1px solid ${borderColor}` }}
      >
        <span
          className="font-ui text-sm font-medium"
          style={{ color: borderColor }}
        >
          {label}
        </span>
      </div>
      <input
        type="text"
        value={widthValue}
        onChange={(event) => setWidthValue(event.target.value)}
        className="h-[28px] rounded-[4px] border border-admin-ink bg-white px-2 font-ui text-xs font-medium text-admin-ink outline-none"
        style={{ width: `${widthValue.length + 2}ch` }}
      />
      <CopyButton />
      <input
        type="text"
        value={voteValue}
        onChange={(event) => setVoteValue(event.target.value)}
        className="h-[28px] rounded-[4px] border border-admin-ink bg-white px-2 font-ui text-xs font-medium text-admin-ink outline-none"
        style={{ width: `${voteValue.length + 3}ch` }}
      />
      <CopyButton />
    </div>
  );
}

function InstagramSlide01() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="inline-flex h-[28px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
          <span className="font-ui text-sm font-medium text-admin-ink">
            Equilibrio ciego
          </span>
        </div>
        <EditButton />
        <CopyButton />
      </div>

      <div className="mt-5 flex items-start gap-3">
        <div className="h-[150px] w-[150px] shrink-0 rounded-lg border border-admin-ink bg-gray-200" />
        <CopyButton />
      </div>

      <div className="mt-5 flex items-center gap-2">
        <div className="inline-flex h-[28px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
          <span className="font-ui text-sm font-medium text-admin-ink">
            21 MAR 2026
          </span>
        </div>
        <EditButton />
        <CopyButton />
      </div>
    </div>
  );
}

function InstagramStaticPillRow({ value }: { value: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="inline-flex h-[28px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
        <span className="whitespace-nowrap font-ui text-xs font-semibold text-admin-ink">
          {value}
        </span>
      </div>
      <EditButton />
      <CopyButton />
    </div>
  );
}

function InstagramSlide02() {
  const noticia = noticias[0];
  const bullets = [
    "El Gobierno reabrió la discusión por los subsidios al transporte.",
    "Las provincias buscan evitar que el ajuste caiga sobre los usuarios.",
    "La tarifa volvió al centro de la agenda económica.",
    "El costo político se reparte entre Nación y gobernadores.",
    "El impacto diario se concentra en quienes viajan para trabajar.",
  ];

  return (
    <div className="space-y-5">
      <InstagramStaticPillRow value="EXPEDIENTE Nº: 2026_080-AR-01" />
      <InstagramStaticPillRow value={noticia.titulo} />
      <InstagramBulletRows bullets={bullets} />
      <InstagramStaticPillRow value="21 MAR 2026" />
    </div>
  );
}

function InstagramSlide03() {
  const noticia = noticias[0];
  const bullets = [
    noticia.pulso,
    "La corrección aparece como necesaria para una parte de la comunidad.",
    "El riesgo social queda asociado al bolsillo cotidiano.",
    "La incertidumbre se concentra en el alcance real del aumento.",
    "El debate mezcla ajuste fiscal, transporte y humor social.",
  ];
  const votes = [
    {
      label: "Positiva",
      borderColor: VOTE_COLORS.positiva,
      pxValue: `${noticia.interpretacion.positiva * 2}px`,
      percentValue: `${noticia.interpretacion.positiva}%`,
    },
    {
      label: "Negativa",
      borderColor: VOTE_COLORS.negativa,
      pxValue: `${noticia.interpretacion.negativa * 2}px`,
      percentValue: `${noticia.interpretacion.negativa}%`,
    },
    {
      label: "Incierta",
      borderColor: VOTE_COLORS.incierta,
      pxValue: `${noticia.interpretacion.incierta * 2}px`,
      percentValue: `${noticia.interpretacion.incierta}%`,
    },
  ];

  return (
    <div className="space-y-5">
      <InstagramEditablePill value="ANEXO SOCIAL: 2026_080-AR-01-S" />
      <InstagramBulletRows bullets={bullets} />
      <div className="inline-flex flex-col gap-2">
        {votes.map((vote) => (
          <InstagramVoteRow
            key={vote.label}
            label={vote.label}
            borderColor={vote.borderColor}
            pxValue={vote.pxValue}
            percentValue={vote.percentValue}
          />
        ))}
      </div>
      <InstagramEditablePill value="21 MAR 2026" />
    </div>
  );
}

function InstagramSlide04() {
  const titulares = [
    "Pacto con el FMI",
    "Provincias en guerra",
    "Reformas en el Congreso",
    "Clima social en alerta",
  ];

  return (
    <div className="space-y-5">
      {titulares.map((titulo) => (
        <div key={titulo} className="flex items-start gap-2">
          <div className="inline-flex items-start rounded-[3.5px] border border-admin-ink bg-white px-2 py-1">
            <span
              className="font-ui text-sm font-medium text-admin-ink uppercase"
              style={{
                letterSpacing: "8px",
                maxWidth: "22ch",
                wordBreak: "keep-all",
                overflowWrap: "break-word",
                whiteSpace: "normal",
                display: "block",
              }}
            >
              {titulo}
            </span>
          </div>
          <EditButton />
          <CopyButton />
        </div>
      ))}
      <div className="flex items-center gap-2">
        <div className="inline-flex h-[28px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
          <span className="font-ui text-sm font-medium text-admin-ink">
            21 MAR 2026
          </span>
        </div>
        <EditButton />
        <CopyButton />
      </div>
    </div>
  );
}

function InstagramSlideContent({ activeSlide }: { activeSlide: number }) {
  if (activeSlide === 1) {
    return <InstagramSlide01 />;
  }

  if (activeSlide === 2) {
    return <InstagramSlide02 />;
  }

  if (activeSlide === 3) {
    return <InstagramSlide03 />;
  }

  return <InstagramSlide04 />;
}

function TwitterSlideContent({ activeSlide }: { activeSlide: number }) {
  if (activeSlide === 1) {
    return (
      <div className="space-y-5">
        <InstagramStaticPillRow value="Equilibrio ciego" />
        <div className="flex items-start gap-3">
          <div className="h-[150px] w-[150px] shrink-0 rounded-lg border border-admin-ink bg-gray-200" />
          <CopyButton />
        </div>
      </div>
    );
  }

  if (activeSlide === 12) {
    return (
      <InstagramStaticPillRow value="La edición completa en laputapolitica.com" />
    );
  }

  const pulsoSlides = [3, 5, 7, 9, 11];
  const noticiaIndex = pulsoSlides.includes(activeSlide)
    ? (activeSlide - 3) / 2
    : (activeSlide - 2) / 2;
  const noticia = noticias[noticiaIndex % noticias.length];
  const texto = pulsoSlides.includes(activeSlide)
    ? noticia.pulsoTwitter
    : `${noticia.titulo}.\n${noticia.resumen}`;

  return (
    <div className="flex items-start gap-2">
      <div
        className="flex items-start rounded-[3.5px] border border-admin-ink bg-white px-2 py-1"
        style={{ maxWidth: "480px" }}
      >
        <span className="font-ui text-sm font-medium whitespace-pre-line text-admin-ink">
          {texto}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-2 pt-1">
        <EditButton />
        <CopyButton />
      </div>
    </div>
  );
}

function ElPulsoContent({ onSelect }: { onSelect: (opinador: MockOpinador) => void }) {
  const opinadoresOrdenados = [...mockOpinadores].sort((a, b) =>
    b.ultimaRespuesta.localeCompare(a.ultimaRespuesta),
  );

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {opinadoresOrdenados.map((op) => (
          <div
            key={op.id}
            onClick={() => onSelect(op)}
            className="flex cursor-pointer items-center justify-between rounded-lg border border-admin-ink px-3 py-2 transition-colors hover:bg-[#F0EDE6]"
          >
            <div className="flex items-center gap-2">
              <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
                <span className="font-ui text-xs font-medium text-admin-ink">
                  {op.nombre}
                </span>
              </div>
              <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
                <span className="font-ui text-xs font-medium text-admin-ink">
                  {op.email}
                </span>
              </div>
              <div className="inline-flex h-[24px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
                <span className="font-ui text-xs font-medium text-admin-ink">
                  {op.ciudad}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex h-[24px] items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-2">
                {op.votos.map((color, i) => (
                  <span
                    key={i}
                    className="h-[8px] w-[8px] rounded-full"
                    style={{ backgroundColor: color ?? "#E5E3DD" }}
                  />
                ))}
              </div>
              <div className="inline-flex h-[24px] items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-2">
                <span className="font-ui text-xs font-semibold text-admin-ink">
                  {op.completadas}/5
                </span>
                <span
                  className="h-[8px] w-[8px] rounded-full"
                  style={{ backgroundColor: getPointColor(op.completadas, 5) }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ElPulsoDetalle({
  opinador,
  noticiaIndex,
}: {
  opinador: MockOpinador;
  noticiaIndex: number;
}) {
  const opinion = mockOpiniones[noticiaIndex];
  const votoColor = opinador.votos[noticiaIndex] ?? "#E5E3DD";

  return (
    <div className="space-y-4">
      <div className="inline-flex items-center rounded-[3.5px] border border-admin-ink px-2 py-1">
        <span className="font-ui text-sm font-medium text-admin-ink">{opinion.noticia}</span>
      </div>

      <div className="flex items-start rounded-[3.5px] border border-admin-ink bg-white px-2 py-1" style={{ maxWidth: '480px' }}>
        <span className="font-ui text-sm font-medium text-admin-ink">{opinion.texto}</span>
      </div>

      <div className="inline-flex flex-col gap-2">
        <div className="inline-flex items-center rounded-[3.5px] border border-admin-ink px-2 py-1">
          <span className="font-ui text-sm font-medium text-admin-ink">Interpretación</span>
        </div>
        <div className="inline-flex h-[28px] w-fit items-center gap-2 rounded-[3.5px] border border-admin-ink bg-white px-2">
          <span className="font-ui text-sm font-medium text-admin-ink">{opinion.interpretacion}</span>
          <span className="h-[8px] w-[8px] rounded-full" style={{ backgroundColor: opinion.color }} />
        </div>
      </div>
    </div>
  );
}

function SlideContent({
  activeCanal,
  activeSlide,
}: {
  activeCanal: Canal;
  activeSlide: number;
}) {
  if (activeCanal === "instagram") {
    return <InstagramSlideContent activeSlide={activeSlide} />;
  }

  if (activeCanal === "twitter") {
    return <TwitterSlideContent activeSlide={activeSlide} />;
  }

  if (activeSlide === 1) {
    return <PortadaSlide />;
  }

  if (activeSlide === 7) {
    return <ClimaSlide />;
  }

  return <NoticiaSlide noticia={noticias[activeSlide - 2]} />;
}

export function PublicacionPanel({ status, onPublicar }: PublicacionPanelProps) {
  const [activeCanal, setActiveCanal] = useState<Canal>("web");
  const [activeSlide, setActiveSlide] = useState(1);
  const [selectedOpinador, setSelectedOpinador] = useState<MockOpinador | null>(
    null,
  );
  const [noticiaIndex, setNoticiaIndex] = useState(0);
  const slideCount = activeCanal === "twitter" ? 12 : activeCanal === "instagram" ? 4 : 7;

  if (status === "loading") {
    return (
      <div className="flex h-full w-full flex-col gap-2">
        <section className="flex min-h-[150px] flex-1 items-center justify-center rounded-lg border-2 border-admin-ink bg-bg-base">
          <LoadingText text="Creando contenido para la Web" />
        </section>
        <section className="flex min-h-[150px] flex-1 items-center justify-center rounded-lg border-2 border-admin-ink bg-bg-base">
          <LoadingText text="Creando contenido para Instagram" />
        </section>
        <section className="flex min-h-[150px] flex-1 items-center justify-center rounded-lg border-2 border-admin-ink bg-bg-base">
          <LoadingText text="Creando contenido para X (Twitter)" />
        </section>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col font-ui">
      <div className="shrink-0 bg-bg-base pb-4">
        <header className="mb-4 flex items-center justify-between">
          <div className="flex h-[22px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
            <span className="font-ui text-[11px] font-medium leading-none text-admin-ink">
              Publicación
            </span>
          </div>
          <button
            type="button"
            onClick={onPublicar}
            className="flex h-[28px] cursor-pointer items-center rounded-[5px] border-2 border-admin-success bg-white px-3 font-ui text-sm font-semibold text-admin-ink"
          >
            Publicar
          </button>
        </header>

        <div className="mb-2 flex items-center justify-between">
          <div className="flex gap-2">
            {canales.map((canal) => (
              <TabButton
                key={canal.id}
                isActive={activeCanal === canal.id}
                onClick={() => {
                  setActiveCanal(canal.id);
                  setActiveSlide(1);
                }}
              >
                <CanalIcon canal={canal.id} />
                {canal.label}
              </TabButton>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setActiveCanal("elpulso")}
            className={`flex cursor-pointer items-center ${activeCanal === "elpulso" ? "opacity-100" : "opacity-30"}`}
          >
            <ElPulsoLogo width={82} height={20} />
          </button>
        </div>

        {activeCanal === "elpulso" && (
          <div className="mb-2 mt-4 flex items-center justify-between">
            {selectedOpinador ? (
              <>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOpinador(null)}
                    className="inline-flex h-[24px] cursor-pointer items-center gap-1.5 rounded-[4px] border-2 border-admin-ink bg-white px-2 font-ui text-xs font-semibold text-admin-ink"
                  >
                    <IconAtras width={10} height={10} />
                    Atras
                  </button>
                  <div className="inline-flex h-[24px] items-center rounded-[4px] border-2 border-admin-ink bg-white px-2 font-ui text-xs font-semibold text-admin-ink">
                    {selectedOpinador.nombre}
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
                    Noticia {noticiaIndex + 1}/{mockOpiniones.length}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setNoticiaIndex((i) =>
                        Math.min(mockOpiniones.length - 1, i + 1),
                      )
                    }
                    disabled={noticiaIndex === mockOpiniones.length - 1}
                    className={`cursor-pointer inline-flex h-[24px] items-center rounded-[4px] border border-admin-ink bg-white px-3 font-ui text-sm font-medium text-admin-ink ${noticiaIndex === mockOpiniones.length - 1 ? "opacity-30" : ""}`}
                  >
                    <span style={{ paddingBottom: "1px" }}>→</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="inline-flex h-[24px] items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-2">
                    {selectedOpinador.votos.map((color, i) => (
                      <span key={i} className="h-[8px] w-[8px] rounded-full" style={{ backgroundColor: color ?? "#E5E3DD" }} />
                    ))}
                  </div>
                  <div className="inline-flex h-[24px] items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-2">
                    <span className="font-ui text-xs font-semibold text-admin-ink">{selectedOpinador.completadas}/5</span>
                    <span className="h-[8px] w-[8px] rounded-full" style={{ backgroundColor: getPointColor(selectedOpinador.completadas, 5) }} />
                  </div>
                </div>
              </>
            ) : (
              <div className="inline-flex h-[24px] items-center rounded-[4px] border-2 border-admin-ink bg-white px-2 font-ui text-xs font-semibold text-admin-ink">
                14/25 opiniones
              </div>
            )}
          </div>
        )}

        {activeCanal !== "elpulso" ? (
          <div className="mb-2 flex gap-2">
            {Array.from({ length: slideCount }, (_, index) => index + 1).map(
              (slide) => (
                <TabButton
                  key={slide}
                  isActive={activeSlide === slide}
                  onClick={() => setActiveSlide(slide)}
                  size="small"
                >
                  {activeCanal === "twitter"
                    ? `Hilo ${String(slide).padStart(2, "0")}`
                    : `Slide ${String(slide).padStart(2, "0")}`}
                </TabButton>
              ),
            )}
          </div>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {activeCanal === "elpulso" ? (
          selectedOpinador ? (
            <ElPulsoDetalle
              opinador={selectedOpinador}
              noticiaIndex={noticiaIndex}
            />
          ) : (
            <ElPulsoContent onSelect={setSelectedOpinador} />
          )
        ) : (
          <SlideContent activeCanal={activeCanal} activeSlide={activeSlide} />
        )}
      </div>
    </div>
  );
}

export type { PublicacionPanelProps };
