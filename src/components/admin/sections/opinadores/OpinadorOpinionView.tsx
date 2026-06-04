"use client";

import { type ReactNode } from "react";
import type { MockOpinador } from "@/components/admin/panels/PublicacionPanel/types";
import { mockOpiniones } from "@/components/admin/panels/PublicacionPanel/mocks";
import { IconAtras } from "@/components/admin/icons";
import {
  AdminButton,
  HeaderPill,
  TextArea,
  TextField,
} from "@/components/admin/shared";
import { getStatusColor } from "@/lib/colors";
import { VOTE_COLORS } from "@/lib/constants";

type OpinadorOpinionViewProps = {
  opinador: MockOpinador;
  noticiaIndex: number;
  onNoticiaIndexChange: (index: number) => void;
  totalNoticias?: number;
  onBack?: () => void;
  leftHeader?: ReactNode;
};

export function OpinadorOpinionView({
  opinador,
  noticiaIndex,
  onNoticiaIndexChange,
  totalNoticias = 5,
  onBack,
  leftHeader,
}: OpinadorOpinionViewProps) {
  const opinion = mockOpiniones[noticiaIndex];

  return (
    <div className="flex h-full min-h-0 flex-col font-ui">
      <div className="shrink-0 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBack && (
            <AdminButton onClick={onBack} className="gap-1.5">
              <IconAtras width={10} height={10} />
              Atras
            </AdminButton>
          )}
          {leftHeader ?? <HeaderPill>{opinador.nombre}</HeaderPill>}
        </div>

        <div className="flex items-center gap-3">
          <AdminButton
            onClick={() => onNoticiaIndexChange(Math.max(0, noticiaIndex - 1))}
            disabled={noticiaIndex === 0}
          >
            ←
          </AdminButton>
          <HeaderPill>
            Noticia {noticiaIndex + 1}/{totalNoticias}
          </HeaderPill>
          <AdminButton
            onClick={() =>
              onNoticiaIndexChange(
                Math.min(totalNoticias - 1, noticiaIndex + 1),
              )
            }
            disabled={noticiaIndex === totalNoticias - 1}
          >
            →
          </AdminButton>
        </div>

        <div className="flex items-center gap-2">
          <HeaderPill>
            {opinador.votos.map((color, i) => (
              <span
                key={i}
                className="h-[8px] w-[8px] rounded-full"
                style={{ backgroundColor: color ?? VOTE_COLORS.nula }}
              />
            ))}
          </HeaderPill>
          <HeaderPill>
            {opinador.completadas}/{totalNoticias}
            <span
              className="h-[8px] w-[8px] rounded-full"
              style={{
                backgroundColor: getStatusColor(
                  opinador.completadas,
                  totalNoticias,
                ),
              }}
            />
          </HeaderPill>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto space-y-4">
        <div>
          <TextField value={opinion.noticia} variant="subtle" readOnly />
        </div>
        <div>
          <TextArea value={opinion.texto} readOnly className="h-[160px]" />
        </div>
        <div>
          <TextField value="Interpretación" variant="subtle" readOnly />
        </div>
        <div>
          <TextField
            value={opinion.interpretacion}
            readOnly
            endAdornment={
              <span
                className="h-[8px] w-[8px] rounded-full"
                style={{ backgroundColor: opinion.color }}
              />
            }
          />
        </div>
      </div>
    </div>
  );
}
