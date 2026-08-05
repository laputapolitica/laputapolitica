-- 014_pipeline_activo.sql
-- Interruptor del pipeline diario por pais (Configuracion -> admin operador).
-- Aditivo, arranca apagado (false). Ya aplicado en el remoto.

alter table public.paises
  add column if not exists pipeline_activo boolean not null default false;

comment on column public.paises.pipeline_activo is 'Interruptor del pipeline diario para este pais (controlado por el admin operador desde Configuracion). false = pausado.';
