-- 010_ventana_opinion_tiempos.sql
-- Agrega a pipeline_state los timestamps de la Ventana de Opinión.
-- La ventana se abre cuando se autoriza Títulos y Resúmenes (en paralelo con
-- Portada) y dura 1.5 horas. Guardamos cuándo abrió y cuándo cierra, para poder
-- mostrar el tiempo restante al opinador y cerrar automáticamente al vencer.
-- Idempotente.

alter table public.pipeline_state
  add column if not exists ventana_opinion_abierta_en timestamptz,
  add column if not exists ventana_opinion_cierra_en timestamptz;
