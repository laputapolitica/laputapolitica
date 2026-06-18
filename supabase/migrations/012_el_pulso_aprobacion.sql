-- 012_el_pulso_aprobacion.sql
-- Agrega a pipeline_state los campos de aprobación de la etapa El Pulso, para
-- que tenga su gate de revisión como las otras etapas (Relevamiento, Títulos,
-- Portada). El gate se considera aprobado cuando el_pulso_aprobado_en no es null.
-- Idempotente.

alter table public.pipeline_state
  add column if not exists el_pulso_aprobado_por uuid references public.profiles(id) on delete set null,
  add column if not exists el_pulso_aprobado_en timestamptz;
