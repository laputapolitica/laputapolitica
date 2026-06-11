"use client";

import { useEffect, useState } from "react";

import type { NoticiaTituloResumen } from "@/app/(admin)/admin/actions";
import { LoadingText, PanelLayout } from "@/components/admin/shared";

import { TitulosResumenesContent } from "./Content";
import { TitulosResumenesHeader } from "./Header";

interface TitulosResumenesPanelProps {
  status: "running" | "ready";
  noticias?: NoticiaTituloResumen[];
  onSaveTitulo?: (noticiaId: string, value: string) => void;
  onSaveResumen?: (noticiaId: string, value: string) => void;
  onAutorizar?: () => void;
}

const mockNoticias: NoticiaTituloResumen[] = [
  {
    id: "noticia-01",
    titulo: "El transporte vuelve al centro de la pulseada fiscal",
    resumen:
      "El Gobierno reabrió la discusión por los subsidios al transporte y las provincias buscan evitar que el ajuste caiga entero sobre los usuarios.",
    fuentes: [
      { nombre: "Infobae", url: "https://www.infobae.com" },
      { nombre: "La Nación", url: "https://www.lanacion.com.ar" },
      { nombre: "Página/12", url: "https://www.pagina12.com.ar" },
    ],
  },
  {
    id: "noticia-02",
    titulo: "El FMI ordena las cuentas, pero no despeja la política",
    resumen:
      "La Casa Rosada muestra respaldo financiero mientras gobernadores y oposición miden cuánto margen social queda para sostener el programa.",
    fuentes: [
      { nombre: "Clarín", url: "https://www.clarin.com" },
      { nombre: "Ámbito", url: "https://www.ambito.com" },
      { nombre: "Perfil", url: "https://www.perfil.com" },
    ],
  },
  {
    id: "noticia-03",
    titulo: "Los gobernadores negocian con la billetera en la mesa",
    resumen:
      "La disputa por fondos tensó la relación con Nación y reabrió una pulseada por obras, cajas provinciales y poder territorial.",
    fuentes: [
      { nombre: "TN", url: "https://tn.com.ar" },
      { nombre: "C5N", url: "https://www.c5n.com" },
      { nombre: "El Destape", url: "https://www.eldestapeweb.com" },
    ],
  },
  {
    id: "noticia-04",
    titulo: "El Congreso prueba la paciencia reformista",
    resumen:
      "El oficialismo empuja cambios clave, pero cada artículo obliga a renegociar con bloques que quieren mostrar independencia.",
    fuentes: [
      { nombre: "Parlamentario", url: "https://www.parlamentario.com" },
      { nombre: "Clarín", url: "https://www.clarin.com" },
      { nombre: "Infobae", url: "https://www.infobae.com" },
    ],
  },
  {
    id: "noticia-05",
    titulo: "La calle vuelve a medir el clima social",
    resumen:
      "Las protestas muestran una tensión persistente entre el ajuste, la caída del poder adquisitivo y la búsqueda oficial de estabilidad.",
    fuentes: [
      { nombre: "Página/12", url: "https://www.pagina12.com.ar" },
      { nombre: "La Nación", url: "https://www.lanacion.com.ar" },
      { nombre: "C5N", url: "https://www.c5n.com" },
    ],
  },
];

export function TitulosResumenesPanel({
  status,
  noticias: noticiasProp,
  onSaveTitulo,
  onSaveResumen,
}: TitulosResumenesPanelProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [noticias, setNoticias] = useState(noticiasProp ?? mockNoticias);

  useEffect(() => {
    if (noticiasProp) setNoticias(noticiasProp);
  }, [noticiasProp]);

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
    const activeNoticiaId = noticias[activeIndex]?.id;

    setNoticias((currentNoticias) =>
      currentNoticias.map((noticia, index) =>
        index === activeIndex ? { ...noticia, [field]: value } : noticia,
      ),
    );

    if (!activeNoticiaId) return;
    if (field === "titulo") {
      onSaveTitulo?.(activeNoticiaId, value);
    } else {
      onSaveResumen?.(activeNoticiaId, value);
    }
  }

  return (
    <PanelLayout
      header={
        <TitulosResumenesHeader
          noticias={noticias}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />
      }
      content={
        <TitulosResumenesContent
          noticia={activeNoticia}
          onSaveTitulo={(val) => updateActiveNoticia("titulo", val)}
          onSaveResumen={(val) => updateActiveNoticia("resumen", val)}
        />
      }
    />
  );
}

export type { TitulosResumenesPanelProps };
