"use client";

import { useState } from "react";
import { ElPulsoLogo } from "@/components/shared/ElPulsoLogo";
import { EditButton } from "../shared/ActionButtons";
import { InterpretacionGeneral } from "./InterpretacionGeneral";
import type { NoticiaPublicacion } from "../types";

export function NoticiaSlide({ noticia }: { noticia: NoticiaPublicacion }) {
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
