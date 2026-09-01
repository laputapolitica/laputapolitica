"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  getHistorialTexto,
  restaurarVersionTexto,
  type HistorialTextoItem,
  type VersionTextoCampo,
  type VersionTextoEntidadTipo,
} from "@/app/(admin)/admin/actions";
import { IconSelector } from "@/components/admin/icons";

type VersionesTextoControlProps = {
  entidadTipo: VersionTextoEntidadTipo;
  entidadId: string;
  campo: VersionTextoCampo;
  refreshKey?: string;
  onRestored?: () => Promise<void> | void;
  className?: string;
};

const RELATIVE_FORMATTER = new Intl.RelativeTimeFormat("es-AR", {
  numeric: "auto",
});

function previewTexto(value: string): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= 72) return normalized;
  return `${normalized.slice(0, 69).trim()}...`;
}

function fechaRelativa(value: string): string {
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return "";

  const diffSeconds = Math.round((time - Date.now()) / 1000);
  const absSeconds = Math.abs(diffSeconds);

  if (absSeconds < 60) return "recién";
  if (absSeconds < 60 * 60) {
    return RELATIVE_FORMATTER.format(Math.round(diffSeconds / 60), "minute");
  }
  if (absSeconds < 60 * 60 * 24) {
    return RELATIVE_FORMATTER.format(Math.round(diffSeconds / (60 * 60)), "hour");
  }
  if (absSeconds < 60 * 60 * 24 * 30) {
    return RELATIVE_FORMATTER.format(Math.round(diffSeconds / (60 * 60 * 24)), "day");
  }

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function VersionesTextoControl({
  entidadTipo,
  entidadId,
  campo,
  refreshKey,
  onRestored,
  className = "",
}: VersionesTextoControlProps) {
  const [historial, setHistorial] = useState<HistorialTextoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const requestSeqRef = useRef(0);

  const cargarHistorial = useCallback(async () => {
    const seq = requestSeqRef.current + 1;
    requestSeqRef.current = seq;
    setLoading(true);

    const versiones = await getHistorialTexto(entidadTipo, entidadId, campo);

    if (requestSeqRef.current === seq) {
      setHistorial(versiones);
      setLoading(false);
    }
  }, [campo, entidadId, entidadTipo]);

  useEffect(() => {
    setOpen(false);
    void cargarHistorial();
  }, [cargarHistorial]);

  useEffect(() => {
    if (!loading) {
      void cargarHistorial();
    }
    // refreshKey es la señal externa: cuando cambia el texto, refetch del historial visible.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  if (!loading && historial.length <= 1) {
    return null;
  }

  const vigenteId = historial.find((version) => version.vigente)?.id ?? null;

  async function handleRestaurar(version: HistorialTextoItem) {
    if (version.vigente || restoringId) return;

    const snapshot = historial;
    setRestoringId(version.id);
    setHistorial((current) =>
      current.map((item) => ({
        ...item,
        vigente: item.id === version.id,
      })),
    );
    setOpen(false);

    const res = await restaurarVersionTexto(version.id);
    if (res.error) {
      setHistorial(snapshot);
      alert(res.error);
      setRestoringId(null);
      return;
    }

    await onRestored?.();
    await cargarHistorial();
    setRestoringId(null);
  }

  return (
    <div className={`relative inline-flex ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        disabled={loading}
        title="Versiones del texto"
        className={`inline-flex h-[20px] cursor-pointer items-center gap-1.5 rounded-[3.5px] border border-admin-ink bg-white px-1.5 font-ui text-xs font-medium text-admin-ink ${
          loading ? "cursor-wait opacity-40" : ""
        }`}
      >
        <IconSelector width={7} height={10} />
        Versiones
      </button>

      {open && historial.length > 1 && (
        <div className="absolute right-0 top-full z-20 mt-1 w-[320px] overflow-hidden rounded-[3.5px] border border-admin-ink bg-white shadow-md">
          <div className="max-h-[260px] overflow-y-auto">
            {historial.map((version) => {
              const vigente = version.id === vigenteId;
              return (
                <button
                  key={version.id}
                  type="button"
                  onClick={() => void handleRestaurar(version)}
                  disabled={vigente || Boolean(restoringId)}
                  title={vigente ? "Versión actual" : "Restaurar esta versión"}
                  className={`flex w-full flex-col gap-1 border-b border-admin-ink/10 px-2.5 py-2 text-left font-ui last:border-b-0 ${
                    vigente
                      ? "cursor-default bg-admin-success/20"
                      : "cursor-pointer hover:bg-[#F0EDE6]"
                  } ${restoringId && !vigente ? "opacity-50" : ""}`}
                >
                  <span className="line-clamp-2 text-xs leading-snug text-admin-ink">
                    {previewTexto(version.contenido)}
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                    <span className="rounded-[3.5px] border border-admin-ink/20 px-1 py-0.5">
                      {version.origen}
                    </span>
                    <span>{fechaRelativa(version.created_at)}</span>
                    {vigente && <span className="text-admin-success">Vigente</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
