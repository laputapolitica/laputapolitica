import {
  IconAgregar,
  IconBajar,
  IconEliminar,
  IconSubir,
} from "@/components/admin/icons";
import { IconButton, TextField } from "@/components/admin/shared";
import type { CandidataRelevamiento } from "./index";

type NoticiasListProps = {
  activas: CandidataRelevamiento[];
  descartadas: CandidataRelevamiento[];
  onSubir?: (id: string) => void;
  onBajar?: (id: string) => void;
  onEliminar?: (id: string) => void;
  onAgregar?: (id: string) => void;
};

export function NoticiasList({
  activas,
  descartadas,
  onSubir,
  onBajar,
  onEliminar,
  onAgregar,
}: NoticiasListProps) {
  return (
    <div className="flex flex-col gap-4 font-ui">
      {/* Noticias activas */}
      <div className="flex flex-col gap-2">
        {activas.map((noticia) => (
          <div key={noticia.id} className="flex items-start gap-2">
            <TextField value={noticia.titulo} wrap fitContent className="min-w-0 max-w-full" />
            <div className="flex shrink-0 items-center gap-2">
              <IconButton onClick={() => onSubir?.(noticia.id)} className="h-[22px]">
                <IconSubir />
                Subir
              </IconButton>
              <IconButton onClick={() => onBajar?.(noticia.id)} className="h-[22px]">
                <IconBajar />
                Bajar
              </IconButton>
              <IconButton onClick={() => onEliminar?.(noticia.id)} className="h-[22px]">
                <IconEliminar />
                Eliminar
              </IconButton>
            </div>
          </div>
        ))}
      </div>

      {/* Noticias descartadas */}
      <div className="flex flex-col gap-2">
        {descartadas.map((noticia) => (
          <div key={noticia.id} className="flex items-start gap-2">
            <TextField value={noticia.titulo} readOnly wrap fitContent className="min-w-0 max-w-full opacity-40" />
            <div className="flex shrink-0 items-center">
              <IconButton onClick={() => onAgregar?.(noticia.id)} className="h-[22px]">
                <IconAgregar />
                Agregar
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
