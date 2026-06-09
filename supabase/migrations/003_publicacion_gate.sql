-- 003_publicacion_gate.sql
-- Agrega las marcas de autorización de la etapa de Publicación a pipeline_state,
-- siguiendo el mismo patrón que relevamiento/titulos/portada (aprobado_por + aprobado_en).
-- Idempotente.

alter table public.pipeline_state
  add column if not exists publicacion_aprobado_por uuid,
  add column if not exists publicacion_aprobado_en timestamptz;

-- FK opcional al staff que aprobó (consistente con las otras columnas de aprobación).
alter table public.pipeline_state
  drop constraint if exists pipeline_state_publicacion_aprobado_por_fkey;
alter table public.pipeline_state
  add constraint pipeline_state_publicacion_aprobado_por_fkey
  foreign key (publicacion_aprobado_por) references public.profiles(id);
