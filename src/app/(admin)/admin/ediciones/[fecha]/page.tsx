"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ElPulsoLogo } from "@/components/shared/ElPulsoLogo";
import { IconAtras, IconWeb } from "@/components/admin/icons";
import { TabButton } from "@/components/admin/panels/PublicacionPanel/shared/TabButton";
import { InterpretacionGeneral } from "@/components/admin/panels/PublicacionPanel/WebChannel/InterpretacionGeneral";
import { mockEdiciones } from "@/lib/mock-ediciones";
import { noticias } from "@/components/admin/panels/PublicacionPanel/mocks";
import { ElPulsoChannel } from "@/components/admin/panels/PublicacionPanel/ElPulsoChannel";
import { getStatusColor } from "@/lib/colors";
import { DataPill, AdminButton } from "@/components/admin/shared";
import type { MockOpinador } from "@/components/admin/panels/PublicacionPanel/types";

type TabDetalle = "web" | "elpulso";

// Slide 01 — Portada
function PortadaSlideDetalle() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <span className="font-ui text-xs font-semibold tracking-wider text-text-secondary">
          TÍTULO
        </span>
        <div className="inline-flex h-[32px] items-center rounded-[4px] border border-admin-ink bg-white px-3 w-fit">
          <span className="font-ui text-sm font-medium text-admin-ink">Equilibrio ciego</span>
        </div>
      </div>
      <div>
        <p className="mb-2 font-ui text-xs font-semibold tracking-wider text-text-secondary">
          PORTADA
        </p>
        <div className="h-[200px] w-[200px] shrink-0 rounded-lg border border-admin-ink bg-gray-200" />
      </div>
    </div>
  );
}

// Slides 02-06 — Noticia en modo lectura
function NoticiaSlideDetalle({ noticiaIndex }: { noticiaIndex: number }) {
  const noticia = noticias[noticiaIndex];
  if (!noticia) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <span className="font-ui text-xs font-semibold tracking-wider text-text-secondary">
            TÍTULO NOTICIA
          </span>
          <div className="inline-flex w-fit items-center rounded-[4px] border border-admin-ink bg-white px-3 py-2">
            <span className="font-ui text-sm font-medium text-admin-ink">{noticia.titulo}</span>
          </div>
        </div>
        <div>
          <span className="font-ui text-xs font-semibold tracking-wider text-text-secondary">
            RESUMEN
          </span>
          <div className="mt-2 rounded-[4px] border border-admin-ink bg-white px-3 py-2" style={{ maxWidth: "480px" }}>
            <p className="font-ui text-sm font-medium text-admin-ink">{noticia.resumen}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="mb-2">
          <ElPulsoLogo className="block" width={80} height={20} />
        </div>
        <div>
          <span className="font-ui text-xs font-semibold tracking-wider text-text-secondary">
            RESUMEN DE EL PULSO
          </span>
          <div className="mt-2 rounded-[4px] border border-admin-ink bg-white px-3 py-2" style={{ maxWidth: "480px" }}>
            <p className="font-ui text-sm font-medium text-admin-ink">{noticia.pulso}</p>
          </div>
        </div>
        <InterpretacionGeneral interpretacion={noticia.interpretacion} />
      </div>
    </div>
  );
}

// Slide 07 — Clima en modo lectura
function ClimaSlideDetalle() {
  const clima = [
    { dia: "Miércoles", min: 12, max: 22 },
    { dia: "Jueves", min: 14, max: 24 },
    { dia: "Viernes", min: 11, max: 21 },
  ];

  return (
    <div>
      <div className="relative inline-flex mb-4">
        <select className="h-[24px] appearance-none rounded-[4px] border border-admin-ink bg-white pl-2 pr-6 font-ui text-xs font-medium text-admin-ink outline-none cursor-pointer">
          <option>Buenos Aires</option>
          <option>Córdoba</option>
          <option>Santa Fe</option>
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-admin-ink text-[10px]">↓</span>
      </div>
      <div className="flex gap-6 items-start">
        {clima.map((dia) => (
          <article key={dia.dia} className="flex flex-col gap-3">
            <div className="inline-flex w-fit h-[22px] items-center rounded-[3.5px] border border-admin-ink px-2">
              <span className="font-ui text-[11px] font-medium text-admin-ink whitespace-nowrap">{dia.dia}</span>
            </div>
            <div className="rounded-lg border border-admin-ink bg-white p-2">
              <div className="h-[100px] w-[100px] rounded-[4px] bg-gray-200" />
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex h-[22px] items-center rounded-[3.5px] px-2 border" style={{ borderColor: "#2F4E85", color: "#2F4E85" }}>
                <span className="font-ui text-[11px] font-medium">Min</span>
              </div>
              <div className="inline-flex h-[22px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
                <span className="font-ui text-[11px] font-medium text-admin-ink">{dia.min}°</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex h-[22px] items-center rounded-[3.5px] px-2 border" style={{ borderColor: "#B74A4A", color: "#B74A4A" }}>
                <span className="font-ui text-[11px] font-medium">Max</span>
              </div>
              <div className="inline-flex h-[22px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
                <span className="font-ui text-[11px] font-medium text-admin-ink">{dia.max}°</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function EdicionDetallePage() {
  const params = useParams();
  const fecha = params.fecha as string;
  const [activeTab, setActiveTab] = useState<TabDetalle>("web");
  const [activeSlide, setActiveSlide] = useState(1);
  const [selectedOpinador, setSelectedOpinador] = useState<MockOpinador | null>(null);
  const [noticiaIndex, setNoticiaIndex] = useState(0);

  const edicion = mockEdiciones.find((e) => e.fechaISO === fecha);

  if (!edicion) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="font-ui text-sm text-text-secondary">Edición no encontrada</span>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {/* Header — fecha + título */}
      <div className="shrink-0 flex items-center gap-2">
        <DataPill size="lg">{edicion.fecha}</DataPill>
        <DataPill size="lg">{edicion.titulo}</DataPill>
      </div>

      {/* Tabs — Web + El Pulso */}
      <div className="shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TabButton
            isActive={activeTab === "web"}
            onClick={() => { setActiveTab("web"); setActiveSlide(1); setSelectedOpinador(null); setNoticiaIndex(0); }}
          >
            <IconWeb width={14} height={14} />
            Web
          </TabButton>
        </div>
        <button
          type="button"
          onClick={() => setActiveTab("elpulso")}
          className={`flex cursor-pointer items-center ${activeTab === "elpulso" ? "opacity-100" : "opacity-30"}`}
        >
          <ElPulsoLogo width={82} height={20} />
        </button>
      </div>

      {/* Header de opinador seleccionado — fila separada debajo de los tabs */}
      {activeTab === "elpulso" && selectedOpinador && (
        <div className="shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AdminButton
              onClick={() => setSelectedOpinador(null)}
              className="gap-1.5 rounded-[4px] border-2 font-semibold"
            >
              <IconAtras width={10} height={10} />
              Atras
            </AdminButton>
            <DataPill className="rounded-[4px] border-2 font-semibold">
              {selectedOpinador.nombre}
            </DataPill>
          </div>
          <div className="flex items-center gap-3">
            <AdminButton
              onClick={() => setNoticiaIndex((i) => Math.max(0, i - 1))}
              disabled={noticiaIndex === 0}
              className="rounded-[4px] px-3 text-sm"
            >
              <span style={{ paddingBottom: "1px" }}>←</span>
            </AdminButton>
            <DataPill className="rounded-[4px] border-2 font-semibold">
              Noticia {noticiaIndex + 1}/5
            </DataPill>
            <AdminButton
              onClick={() => setNoticiaIndex((i) => Math.min(4, i + 1))}
              disabled={noticiaIndex === 4}
              className="rounded-[4px] px-3 text-sm"
            >
              <span style={{ paddingBottom: "1px" }}>→</span>
            </AdminButton>
          </div>
          <div className="flex items-center gap-2">
            <DataPill>
              {selectedOpinador.votos.map((color, i) => (
                <span
                  key={i}
                  className="ml-1.5 inline-block h-[8px] w-[8px] rounded-full first:ml-0"
                  style={{ backgroundColor: color ?? "#E5E3DD" }}
                />
              ))}
            </DataPill>
            <DataPill>
              <span className="font-semibold">{selectedOpinador.completadas}/5</span>
              <span
                className="ml-1.5 inline-block h-[8px] w-[8px] rounded-full"
                style={{ backgroundColor: getStatusColor(selectedOpinador.completadas, 5) }}
              />
            </DataPill>
          </div>
        </div>
      )}

      {/* Selector de slides (solo en tab Web) */}
      {activeTab === "web" && (
        <div className="shrink-0 flex gap-2">
          {Array.from({ length: 7 }, (_, i) => i + 1).map((slide) => (
            <TabButton
              key={slide}
              isActive={activeSlide === slide}
              onClick={() => setActiveSlide(slide)}
              size="small"
            >
              {`Slide ${String(slide).padStart(2, "0")}`}
            </TabButton>
          ))}
        </div>
      )}

      {/* Contenido scrolleable */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {activeTab === "web" ? (
          activeSlide === 1 ? <PortadaSlideDetalle /> :
          activeSlide === 7 ? <ClimaSlideDetalle /> :
          <NoticiaSlideDetalle noticiaIndex={activeSlide - 2} />
        ) : (
          <ElPulsoChannel
            selectedOpinador={selectedOpinador}
            noticiaIndex={noticiaIndex}
            onSelect={setSelectedOpinador}
          />
        )}
      </div>
    </div>
  );
}
