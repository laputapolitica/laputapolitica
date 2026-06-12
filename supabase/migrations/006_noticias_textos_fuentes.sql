-- 006_noticias_textos_fuentes.sql
-- Agrega columna `textos_fuentes` a noticias: guarda el texto completo de
-- cada fuente leída (hoy una, en el futuro varias).
-- Forma: [{"url": "...", "texto": "..."}].
-- Permite regenerar título/resumen ("Rehacer") sin volver a leer la fuente,
-- y deja preparado el terreno para resúmenes multi-fuente (Fase 2).
-- Idempotente.

alter table public.noticias
  add column if not exists textos_fuentes jsonb not null default '[]'::jsonb;
