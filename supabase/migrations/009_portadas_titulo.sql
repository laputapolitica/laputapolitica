-- 009_portadas_titulo.sql
-- Agrega columna `titulo` a portadas: el título editorial de la tapa (corto y
-- conceptual, estilo tapa de revista), generado por IA a partir de las noticias
-- del día. Es propio de la portada, distinto de los títulos de cada noticia.
-- Idempotente.

alter table public.portadas
  add column if not exists titulo text not null default '';
