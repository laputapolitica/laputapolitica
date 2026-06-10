-- 005_relevamiento_orden.sql
-- Agrega columna `orden` a relevamiento_candidatas: posición entre las activas.
-- `ranking` pasa a ser la jerarquía base inmutable (para ordenar descartadas).
-- `orden` es la posición editable entre activas (lo que mueve subir/bajar).
-- Idempotente.

alter table public.relevamiento_candidatas
  add column if not exists orden integer;

-- Inicializar `orden` para las candidatas activas existentes, según su ranking actual.
-- Las descartadas quedan con orden = null.
update public.relevamiento_candidatas
set orden = ranking
where activa = true and orden is null;

-- Índice para ordenar activas por `orden` dentro de una edición.
create index if not exists relevamiento_candidatas_edicion_orden_idx
  on public.relevamiento_candidatas (edicion_id, orden);

-- Unicidad de `orden` entre activas de una misma edición.
-- Se aplica solo cuando orden no es null (unique index parcial), para que
-- las descartadas (orden null) no choquen entre sí.
create unique index if not exists relevamiento_candidatas_edicion_orden_key
  on public.relevamiento_candidatas (edicion_id, orden)
  where orden is not null;
