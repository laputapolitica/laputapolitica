-- 016_watchdog_etapas_trabadas.sql
-- Watchdog / auto-recuperacion del pipeline.
-- Resetea a 'pending' las etapas de poller que quedaron colgadas en 'running'
-- mas alla del umbral (default 8 minutos), para que el poller las vuelva a tomar.
-- La invoca el workflow n8n "Watchdog - Auto-recuperacion" (7OUEc6HzvFsigjQN)
-- por RPC cada 1 minuto, con service role.
--
-- Aplicada originalmente por MCP; este archivo la deja versionada.
-- Incluye el fix del 05-09-2026: 'relevamiento_status' faltaba en el array, asi que
-- un Relevamiento cortado a mitad quedaba en 'running' para siempre.

create or replace function public.resetear_etapas_trabadas(p_umbral_min integer default 8)
 returns integer
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  v_total integer := 0;
  v_n integer;
  v_col text;
  -- ventana_opinion_status queda FUERA a proposito: dura horas por diseno
  -- y la cierra el workflow "Cerrar Ventana".
  v_cols text[] := array['relevamiento_status','titulos_status','portada_status','el_pulso_status','web_status','instagram_status','twitter_status'];
begin
  foreach v_col in array v_cols loop
    execute format(
      'update public.pipeline_state set %I = ''pending'', updated_at = now() where %I = ''running'' and updated_at < now() - make_interval(mins => $1)',
      v_col, v_col
    ) using p_umbral_min;
    get diagnostics v_n = row_count;
    v_total := v_total + v_n;
  end loop;
  return v_total;
end;
$function$;

comment on function public.resetear_etapas_trabadas(integer) is 'Watchdog: resetea a pending las etapas de poller trabadas en running mas alla del umbral en minutos. Devuelve cuantas reseteto.';
