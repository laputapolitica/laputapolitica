"use client";

import { useEffect, useState } from "react";
import { getPaisesConfig, setPipelineActivo, type PaisConfig } from "./actions";
import {
  HeaderPanel,
  PanelLayout,
  RowCard,
  RowCardButton,
  RowCardCell,
  RowCardLeft,
  RowCardList,
  RowCardRight,
  TitlePill,
} from "@/components/admin/shared";

export default function AdminConfiguracionPage() {
  const [paises, setPaises] = useState<PaisConfig[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [pendiente, setPendiente] = useState<string | null>(null);

  useEffect(() => {
    getPaisesConfig().then(setPaises);
  }, []);

  async function toggle(p: PaisConfig) {
    setError(undefined);
    setPendiente(p.codigo);
    const res = await setPipelineActivo(p.codigo, !p.pipelineActivo);
    if (res.success) {
      setPaises(await getPaisesConfig());
    } else {
      setError(res.error);
    }
    setPendiente(null);
  }

  return (
    <PanelLayout
      header={
        <HeaderPanel>
          <TitlePill>Configuración del pipeline</TitlePill>
          <p className="font-ui text-sm text-text-secondary">
            Prendé o pausá la generación automática de la edición diaria, por país.
          </p>
          {error ? (
            <p className="font-ui text-sm text-state-required">{error}</p>
          ) : null}
        </HeaderPanel>
      }
      content={
        <RowCardList>
          {paises.map((p) => (
            <RowCard key={p.codigo}>
              <RowCardLeft>
                <RowCardCell>{p.nombre}</RowCardCell>
                <RowCardCell>
                  {p.pipelineActivo ? "Pipeline activo" : "Pipeline pausado"}
                </RowCardCell>
              </RowCardLeft>
              <RowCardRight>
                <RowCardButton
                  borderColor={p.pipelineActivo ? "#FF5C60" : "#35C759"}
                  disabled={pendiente === p.codigo}
                  onClick={() => toggle(p)}
                >
                  {pendiente === p.codigo
                    ? "Guardando..."
                    : p.pipelineActivo
                      ? "Pausar"
                      : "Activar"}
                </RowCardButton>
              </RowCardRight>
            </RowCard>
          ))}
        </RowCardList>
      }
    />
  );
}
