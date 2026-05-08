"use client";

import { useState } from "react";

import { IconEditar, IconRehacer } from "@/components/admin/icons";
import {
  DataPill,
  TextField,
  IconButton,
  LoadingText,
  PanelLayout,
} from "@/components/admin/shared";

import { Header } from "./Header";

interface TitulosResumenesPanelProps {
  status: "running" | "ready";
  onAutorizar?: () => void;
}

type NoticiaTituloResumen = {
  id: string;
  titulo: string;
  resumen: string;
  fuentes: string[];
};

const mockNoticias: NoticiaTituloResumen[] = [
  {
    id: "noticia-01",
    titulo: "El transporte vuelve al centro de la pulseada fiscal",
    resumen:
      "El Gobierno reabrió la discusión por los subsidios al transporte y las provincias buscan evitar que el ajuste caiga entero sobre los usuarios.",
    fuentes: ["Infobae", "La Nación", "Página/12"],
  },
  {
    id: "noticia-02",
    titulo: "El FMI ordena las cuentas, pero no despeja la política",
    resumen:
      "La Casa Rosada muestra respaldo financiero mientras gobernadores y oposición miden cuánto margen social queda para sostener el programa.",
    fuentes: ["Clarín", "Ámbito", "Perfil"],
  },
  {
    id: "noticia-03",
    titulo: "Los gobernadores negocian con la billetera en la mesa",
    resumen:
      "La disputa por fondos tensó la relación con Nación y reabrió una pulseada por obras, cajas provinciales y poder territorial.",
    fuentes: ["TN", "C5N", "El Destape"],
  },
  {
    id: "noticia-04",
    titulo: "El Congreso prueba la paciencia reformista",
    resumen:
      "El oficialismo empuja cambios clave, pero cada artículo obliga a renegociar con bloques que quieren mostrar independencia.",
    fuentes: ["Parlamentario", "Clarín", "Infobae"],
  },
  {
    id: "noticia-05",
    titulo: "La calle vuelve a medir el clima social",
    resumen:
      "Las protestas muestran una tensión persistente entre el ajuste, la caída del poder adquisitivo y la búsqueda oficial de estabilidad.",
    fuentes: ["Página/12", "La Nación", "C5N"],
  },
];

function FuenteIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4.5 7.5L7.5 4.5M6.5 2.5H9.5V5.5M5.5 2.5H3C2.44772 2.5 2 2.94772 2 3.5V9C2 9.55228 2.44772 10 3 10H8.5C9.05228 10 9.5 9.55228 9.5 9V6.5"
        stroke="#111111"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

export function TitulosResumenesPanel({
  status,
}: TitulosResumenesPanelProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [noticias, setNoticias] = useState(mockNoticias);

  if (status === "running") {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg border-2 border-admin-ink">
        <LoadingText text="Creando titulos y resumenes de las noticias" />
      </div>
    );
  }

  const activeNoticia = noticias[activeIndex];

  function updateActiveNoticia(
    field: keyof Pick<NoticiaTituloResumen, "titulo" | "resumen">,
    value: string,
  ) {
    setNoticias((currentNoticias) =>
      currentNoticias.map((noticia, index) =>
        index === activeIndex ? { ...noticia, [field]: value } : noticia,
      ),
    );
  }

  return (
    <PanelLayout
      header={
        <Header
          noticias={noticias}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />
      }
      legacy={
        <div className="w-full font-ui">
          <div className="mb-6 flex flex-col gap-4">
            <section>
              <span className="mb-2 block font-ui text-xs font-semibold tracking-wider text-text-secondary">
                TÍTULO
              </span>
              <div className="flex items-center gap-2">
                <TextField
                  value={activeNoticia.titulo}
                  onSave={(val) => updateActiveNoticia("titulo", val)}
                />
                <IconButton
                  onClick={() =>
                    navigator.clipboard.writeText(activeNoticia.titulo)
                  }
                >
                  <IconRehacer width={11} height={11} />
                  Copiar
                </IconButton>
                <IconButton onClick={() => {}}>
                  <IconEditar width={11} height={11} />
                  Editar
                </IconButton>
              </div>
            </section>

            <section>
              <span className="mb-2 block font-ui text-xs font-semibold tracking-wider text-text-secondary">
                RESUMEN
              </span>
              <div className="flex items-start gap-2">
                <TextField
                  value={activeNoticia.resumen}
                  onSave={(val) => updateActiveNoticia("resumen", val)}
                  multiline
                />
                <div className="flex flex-col gap-1.5">
                  <IconButton
                    onClick={() =>
                      navigator.clipboard.writeText(activeNoticia.resumen)
                    }
                  >
                    <IconRehacer width={11} height={11} />
                    Copiar
                  </IconButton>
                  <IconButton onClick={() => {}}>
                    <IconEditar width={11} height={11} />
                    Editar
                  </IconButton>
                </div>
              </div>
            </section>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-1.5 font-ui text-sm font-semibold text-admin-ink">
              <FuenteIcon />
              Fuentes
            </div>
            <div className="flex flex-wrap gap-2">
              {activeNoticia.fuentes.map((fuente) => (
                <DataPill key={fuente} variant="subtle">
                  {fuente}
                </DataPill>
              ))}
            </div>
          </div>
        </div>
      }
    />
  );
}

export type { TitulosResumenesPanelProps };
