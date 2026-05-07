"use client";

import { useEffect, useState } from "react";

const PROXIMA_EDICION_HORA = 19 * 60 + 30; // 19:30 en minutos

function getProximaEdicion(): { fecha: string; countdown: string } {
  const now = new Date();
  const nowMinutes =
    now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

  // Si ya pasaron las 19:30, el próximo inicio es mañana a las 19:30
  const target = new Date(now);
  if (nowMinutes >= PROXIMA_EDICION_HORA) {
    target.setDate(target.getDate() + 1);
  }
  target.setHours(19, 30, 0, 0);

  const diffMs = target.getTime() - now.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(diffSeconds / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = diffSeconds % 60;

  const day = String(target.getDate()).padStart(2, "0");
  const monthNames = [
    "ENE",
    "FEB",
    "MAR",
    "ABR",
    "MAY",
    "JUN",
    "JUL",
    "AGO",
    "SEP",
    "OCT",
    "NOV",
    "DIC",
  ];
  const month = monthNames[target.getMonth()];
  const year = target.getFullYear();
  const fecha = `${day} ${month} ${year}`;

  const countdown = `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}min ${String(seconds).padStart(2, "0")}seg`;

  return { fecha, countdown };
}

// Mock de la edición publicada — luego viene de Supabase
const mockEdicionPublicada = {
  titulo: "Equilibrio Ciego",
  fecha: "04 MAY 2026",
  horaPublicacion: "22:00:47",
};

export function PublicadoPanel() {
  const [proxima, setProxima] = useState(getProximaEdicion());

  useEffect(() => {
    const interval = setInterval(() => {
      setProxima(getProximaEdicion());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center rounded-lg border-2 border-admin-ink bg-bg-base">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex flex-col items-center gap-1">
          <span className="font-ui text-sm font-semibold text-admin-ink">
            Edición &quot;{mockEdicionPublicada.titulo}&quot; —{" "}
            {mockEdicionPublicada.fecha}
          </span>
          <span className="font-ui text-sm font-medium text-text-secondary">
            Publicada a las {mockEdicionPublicada.horaPublicacion} (hora
            Argentina)
          </span>
        </div>

        <div className="w-[200px] border-t border-admin-ink" />

        <div className="flex flex-col items-center gap-1">
          <span className="font-ui text-sm font-semibold text-admin-ink">
            Próxima edición — {proxima.fecha}
          </span>
          <span className="font-ui text-sm font-medium text-text-secondary">
            Inicio del proceso en {proxima.countdown}
          </span>
        </div>
      </div>
    </div>
  );
}
