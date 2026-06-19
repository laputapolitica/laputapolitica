"use client";

import { type CSSProperties } from "react";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconAgregar, IconEliminar } from "@/components/admin/icons";
import { IconButton, TextField } from "@/components/admin/shared";
import type { CandidataRelevamiento } from "./index";

type NoticiasListProps = {
  activas: CandidataRelevamiento[];
  descartadas: CandidataRelevamiento[];
  onReordenar?: (ordenIds: string[]) => void;
  onEliminar?: (id: string) => void;
  onAgregar?: (id: string) => void;
};

type SortableNoticiaActivaProps = {
  noticia: CandidataRelevamiento;
  onEliminar?: (id: string) => void;
};

function SortableNoticiaActiva({
  noticia,
  onEliminar,
}: SortableNoticiaActivaProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: noticia.id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.75 : undefined,
    zIndex: isDragging ? 1 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative flex items-start gap-2"
    >
      <button
        type="button"
        aria-label="Reordenar"
        className="inline-flex h-[22px] w-[22px] shrink-0 cursor-grab items-center justify-center rounded-[3.5px] border border-admin-ink bg-white font-ui text-[13px] font-medium leading-none text-admin-ink active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <span aria-hidden="true">⠿</span>
      </button>
      <TextField value={noticia.titulo} wrap fitContent className="min-w-0 max-w-full" />
      <div className="flex shrink-0 items-center gap-2">
        <IconButton onClick={() => onEliminar?.(noticia.id)} className="h-[22px]">
          <IconEliminar />
          Eliminar
        </IconButton>
      </div>
    </div>
  );
}

export function NoticiasList({
  activas,
  descartadas,
  onReordenar,
  onEliminar,
  onAgregar,
}: NoticiasListProps) {
  const sensores = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const activaIds = activas.map((noticia) => noticia.id);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);
    const oldIndex = activas.findIndex((noticia) => noticia.id === activeId);
    const newIndex = activas.findIndex((noticia) => noticia.id === overId);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const nuevasActivas = arrayMove(activas, oldIndex, newIndex);
    onReordenar?.(nuevasActivas.map((noticia) => noticia.id));
  }

  return (
    <div className="flex flex-col gap-4 font-ui">
      {/* Noticias activas */}
      <DndContext
        sensors={sensores}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={activaIds} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {activas.map((noticia) => (
              <SortableNoticiaActiva
                key={noticia.id}
                noticia={noticia}
                onEliminar={onEliminar}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

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
