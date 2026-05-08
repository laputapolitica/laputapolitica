import {
  IconAgregar,
  IconBajar,
  IconEliminar,
  IconSubir,
} from "@/components/admin/icons";
import { IconButton, TextField } from "@/components/admin/shared";

type NoticiasListProps = {
  activas: string[];
  descartadas: string[];
  onSubir?: (index: number) => void;
  onBajar?: (index: number) => void;
  onEliminar?: (index: number) => void;
  onAgregar?: (index: number) => void;
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
        {activas.map((noticia, index) => (
          <div key={noticia} className="flex items-center gap-2">
            <TextField value={noticia} />
            <IconButton onClick={() => onSubir?.(index)} className="h-[22px]">
              <IconSubir />
              Subir
            </IconButton>
            <IconButton onClick={() => onBajar?.(index)} className="h-[22px]">
              <IconBajar />
              Bajar
            </IconButton>
            <IconButton onClick={() => onEliminar?.(index)} className="h-[22px]">
              <IconEliminar />
              Eliminar
            </IconButton>
          </div>
        ))}
      </div>

      {/* Noticias descartadas */}
      <div className="flex flex-col gap-2">
        {descartadas.map((noticia, index) => (
          <div key={noticia} className="flex items-center gap-2">
            <TextField value={noticia} readOnly className="opacity-40" />
            <IconButton onClick={() => onAgregar?.(index)} className="h-[22px]">
              <IconAgregar />
              Agregar
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
}
