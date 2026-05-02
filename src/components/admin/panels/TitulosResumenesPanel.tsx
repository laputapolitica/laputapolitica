"use client";

import { Check, Copy, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

import { IconR } from "@/components/admin/icons";

export type TituloResumenItem = {
  id: string;
  noticia: string;
  titulo: string;
  resumen: string;
  fuentes: string[];
};

export interface TitulosResumenesPanelProps {
  status: "running" | "ready";
  items?: TituloResumenItem[];
  onAutorizar?: () => void;
  onRehacer?: (id: string) => void;
}

const defaultItems: TituloResumenItem[] = [
  {
    id: "transporte",
    noticia: "Ajustes y subsidios al transporte",
    titulo: "El transporte vuelve al centro de la pulseada fiscal",
    resumen:
      "El Gobierno reabrió la discusión por los subsidios y las provincias buscan evitar que el ajuste caiga entero sobre los usuarios.",
    fuentes: ["Infobae", "La Nación", "Página/12"],
  },
  {
    id: "fmi",
    noticia: "Negociaciones con el FMI",
    titulo: "El acuerdo con el FMI ordena cuentas, pero no despeja la política",
    resumen:
      "La Casa Rosada muestra respaldo financiero mientras gobernadores y oposición miden cuánto margen social queda para sostener el programa.",
    fuentes: ["Clarín", "Ámbito", "Perfil"],
  },
  {
    id: "gobernadores",
    noticia: "Conflicto con gobernadores",
    titulo: "Los gobernadores vuelven a negociar con la billetera en la mesa",
    resumen:
      "La disputa por fondos tensó la relación con Nación y reabrió una pulseada por obras, cajas provinciales y poder territorial.",
    fuentes: ["TN", "C5N", "El Destape"],
  },
  {
    id: "legislativo",
    noticia: "Reformas legislativas",
    titulo: "El Congreso prueba hasta dónde llega la paciencia reformista",
    resumen:
      "El oficialismo empuja cambios clave, pero cada artículo obliga a renegociar con bloques que quieren mostrar independencia.",
    fuentes: ["Parlamentario", "Clarín", "Infobae"],
  },
];

function LoadingText({ text }: { text: string }) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev === "..." ? "" : `${prev}.`));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="font-ui text-sm font-medium text-admin-ink">
      {text}
      <span className="inline-block w-[18px] text-left">{dots}</span>
    </span>
  );
}

export function TitulosResumenesPanel({
  status,
  items = defaultItems,
  onAutorizar,
  onRehacer,
}: TitulosResumenesPanelProps) {
  const [draftItems, setDraftItems] = useState(items);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (status === "running") {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg border-2 border-admin-ink">
        <LoadingText text="Generando títulos y resúmenes" />
      </div>
    );
  }

  function updateItem(
    id: string,
    field: keyof Pick<TituloResumenItem, "titulo" | "resumen">,
    value: string,
  ) {
    setDraftItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  }

  async function copyItem(item: TituloResumenItem) {
    await navigator.clipboard.writeText(`${item.titulo}\n\n${item.resumen}`);
    setCopiedId(item.id);
    window.setTimeout(() => setCopiedId(null), 1200);
  }

  return (
    <div className="w-full p-8 font-ui">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconR width={20} height={20} />
          <div className="flex h-[22px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
            <span className="whitespace-nowrap font-ui text-[11px] font-medium leading-none text-admin-ink">
              Títulos y Resúmenes
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onAutorizar}
          className="flex h-[28px] items-center rounded-[5px] border-2 border-admin-success bg-white px-3 font-ui text-sm font-semibold text-admin-ink"
        >
          Autorizar
        </button>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_220px] gap-6">
        <div className="flex flex-col gap-3">
          {draftItems.map((item, index) => {
            const isCopied = copiedId === item.id;

            return (
              <article
                key={item.id}
                className="rounded-lg border border-admin-ink bg-white p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-admin-ink text-xs font-semibold text-admin-ink">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="truncate text-sm font-semibold text-admin-ink">
                      {item.noticia}
                    </span>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => void copyItem(item)}
                      className="flex h-[24px] items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-2 text-xs font-medium text-admin-ink"
                    >
                      {isCopied ? <Check size={12} /> : <Copy size={12} />}
                      {isCopied ? "Copiado" : "Copiar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => onRehacer?.(item.id)}
                      className="flex h-[24px] items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-2 text-xs font-medium text-admin-ink"
                    >
                      <RotateCcw size={12} />
                      Rehacer
                    </button>
                  </div>
                </div>

                <label className="mb-2 block">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-normal text-text-secondary">
                    Título
                  </span>
                  <input
                    type="text"
                    value={item.titulo}
                    onChange={(event) =>
                      updateItem(item.id, "titulo", event.target.value)
                    }
                    className="h-10 w-full rounded-[5px] border border-border-default bg-bg-base px-3 font-editorial text-base font-semibold text-admin-ink outline-none focus:border-admin-ink"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-normal text-text-secondary">
                    Resumen
                  </span>
                  <textarea
                    value={item.resumen}
                    onChange={(event) =>
                      updateItem(item.id, "resumen", event.target.value)
                    }
                    rows={3}
                    className="min-h-[82px] w-full resize-none rounded-[5px] border border-border-default bg-bg-base px-3 py-2 font-ui text-sm leading-5 text-admin-ink outline-none focus:border-admin-ink"
                  />
                </label>
              </article>
            );
          })}
        </div>

        <aside className="flex h-fit flex-col gap-3 rounded-lg border border-admin-ink bg-white p-4">
          <div>
            <h2 className="text-sm font-semibold text-admin-ink">Fuentes</h2>
            <p className="mt-1 text-xs leading-4 text-text-secondary">
              Referencias usadas por el editor de títulos.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(draftItems.flatMap((item) => item.fuentes))).map(
              (fuente) => (
                <span
                  key={fuente}
                  className="rounded-[5px] border border-border-default bg-bg-base px-2 py-1 text-xs font-medium text-admin-ink"
                >
                  {fuente}
                </span>
              ),
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
