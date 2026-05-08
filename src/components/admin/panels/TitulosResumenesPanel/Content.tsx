import { IconEditar, IconRehacer } from "@/components/admin/icons";
import { IconButton, TextArea, TextField } from "@/components/admin/shared";

type NoticiaTituloResumen = {
  id: string;
  titulo: string;
  resumen: string;
  fuentes: { nombre: string; url: string }[];
};

type ContentProps = {
  noticia: NoticiaTituloResumen;
  onSaveTitulo: (value: string) => void;
  onSaveResumen: (value: string) => void;
};

export function TitulosResumenesContent({
  noticia,
  onSaveTitulo,
  onSaveResumen,
}: ContentProps) {
  return (
    <div className="flex h-full flex-col gap-4 font-ui">
      {/* TÍTULO */}
      <section className="flex flex-col gap-2">
        <span className="font-ui text-xs font-semibold tracking-wider text-text-secondary">
          TÍTULO
        </span>
        <div className="flex items-center gap-2">
          <TextField value={noticia.titulo} onSave={onSaveTitulo} />
          <IconButton onClick={() => {}}>
            <IconEditar width={11} height={11} />
            Editar
          </IconButton>
          <IconButton onClick={() => navigator.clipboard.writeText(noticia.titulo)}>
            <IconRehacer width={11} height={11} />
            Rehacer
          </IconButton>
        </div>
      </section>

      {/* RESUMEN */}
      <section className="flex flex-col gap-2">
        <span className="font-ui text-xs font-semibold tracking-wider text-text-secondary">
          RESUMEN
        </span>
        <div className="flex items-start gap-2">
          <TextArea
            value={noticia.resumen}
            onSave={onSaveResumen}
            className="h-[160px]"
          />
          <div className="flex w-fit flex-col items-start gap-1.5">
            <IconButton onClick={() => {}}>
              <IconEditar width={11} height={11} />
              Editar
            </IconButton>
            <IconButton
              onClick={() => navigator.clipboard.writeText(noticia.resumen)}
            >
              <IconRehacer width={11} height={11} />
              Rehacer
            </IconButton>
          </div>
        </div>
      </section>

      {/* FUENTES */}
      <section className="mt-auto flex flex-wrap gap-2 pt-4">
        {noticia.fuentes.map((fuente, index) => (
          <a
            key={`${index}-${fuente.nombre}`}
            href={fuente.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-[24px] cursor-pointer items-center rounded-[3.5px] border border-admin-ink bg-white px-2 font-ui text-xs font-medium text-admin-ink transition-colors hover:bg-[#F0EDE6]"
          >
            {fuente.nombre}
          </a>
        ))}
      </section>
    </div>
  );
}
