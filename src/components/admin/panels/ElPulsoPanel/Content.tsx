"use client";

import { useEffect, useState } from "react";

import type { NoticiaElPulso } from "@/app/(admin)/admin/actions";
import { IconEditar, IconRehacer } from "@/components/admin/icons";
import { InterpretacionGeneral } from "@/components/admin/panels/PublicacionPanel/WebChannel/InterpretacionGeneral";
import {
  IconButton,
  TextArea,
  TextField,
  VersionesTextoControl,
} from "@/components/admin/shared";
import { ElPulsoLogo } from "@/components/shared/ElPulsoLogo";

type ContentProps = {
  noticia: NoticiaElPulso;
  onSaveResumen: (value: string) => void;
  onRehacerResumen: () => void;
  onVersionRestored?: () => Promise<void> | void;
  versionRefreshKey?: string;
  rehaciendoResumen?: boolean;
};

export function ElPulsoContent({
  noticia,
  onSaveResumen,
  onRehacerResumen,
  onVersionRestored,
  versionRefreshKey,
  rehaciendoResumen = false,
}: ContentProps) {
  const [isEditingResumen, setIsEditingResumen] = useState(false);

  useEffect(() => {
    setIsEditingResumen(false);
  }, [noticia.id]);

  return (
    <div className="grid h-full min-w-0 grid-cols-2 gap-6 font-ui">
      <div className="flex min-w-0 flex-col gap-4">
        <section className="flex min-w-0 flex-col gap-2">
          <span className="font-ui text-xs font-semibold tracking-wider text-text-secondary">
            RESUMEN DE EL PULSO
          </span>
          <div className="flex min-w-0 items-start gap-2">
            <TextArea
              value={noticia.resumen}
              onSave={onSaveResumen}
              isEditing={isEditingResumen}
              onEditingChange={setIsEditingResumen}
              fullWidth
              className="h-[160px]"
            />
            {!isEditingResumen && (
              <div className="flex w-fit flex-col items-start gap-1.5">
                <IconButton onClick={() => setIsEditingResumen(true)}>
                  <IconEditar width={11} height={11} />
                  Editar
                </IconButton>
                <IconButton onClick={onRehacerResumen} disabled={rehaciendoResumen}>
                  <IconRehacer width={11} height={11} />
                  {rehaciendoResumen ? "Rehaciendo..." : "Rehacer"}
                </IconButton>
                <VersionesTextoControl
                  entidadTipo="el_pulso"
                  entidadId={noticia.id}
                  campo="resumen_pulso"
                  refreshKey={`${noticia.resumen}:${versionRefreshKey ?? ""}`}
                  onRestored={onVersionRestored}
                />
              </div>
            )}
          </div>
        </section>

        <section className="flex min-w-0 flex-col gap-2">
          <InterpretacionGeneral
            interpretacion={{
              positiva: noticia.pctPositiva,
              negativa: noticia.pctNegativa,
              incierta: noticia.pctIncierta,
            }}
          />

          <span className="font-ui text-xs text-text-secondary">
            {noticia.totalOpiniones}/{noticia.totalOpinadores} opiniones
          </span>
        </section>
      </div>

      <div className="flex h-full min-w-0 flex-col items-end gap-4">
        <section className="flex w-full min-w-0 flex-col items-end">
          <TextField value={noticia.titulo} variant="subtle" readOnly wrap fitContent />
        </section>
        <section className="flex w-full min-w-0 flex-col items-end">
          <TextArea
            value={noticia.resumenNoticia}
            variant="subtle"
            readOnly
            fullWidth
            className="h-[160px]"
          />
        </section>
        <div className="mt-auto">
          <ElPulsoLogo className="block" width={80} height={20} />
        </div>
      </div>
    </div>
  );
}
