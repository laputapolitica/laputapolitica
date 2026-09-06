-- 018_alerta_edicion_atrasada.sql
-- Alerta al editor: devuelve una fila si la edicion de HOY (zona AR) no esta publicada,
-- con el detalle de que etapas quedaron sin terminar. Si no hay edicion para hoy, o si
-- ya esta publicada, no devuelve nada (silencio en testing / dias sin tirada).
--
-- Parte del sistema de mails, POSPUESTO a proposito: la consume el workflow n8n
-- "AlertaEdicion", que todavia NO esta importado ni publicado.
-- Ver doc claude/sistema-mails-pendiente.md.
--
-- Aplicada originalmente por MCP; este archivo la deja versionada.

create or replace function public.alertar_edicion_atrasada()
 returns table(fecha text, estado text, detalle text)
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  v_fecha text := to_char(timezone('America/Argentina/Buenos_Aires', now()), 'DD-MM-YYYY');
  v_id uuid;
  v_estado text;
  v_rel text; v_tit text; v_por text; v_ven text; v_pul text; v_web text; v_ig text; v_tw text; v_pub text;
  v_pend text;
begin
  select e.id, e.estado,
         ps.relevamiento_status, ps.titulos_status, ps.portada_status, ps.ventana_opinion_status,
         ps.el_pulso_status, ps.web_status, ps.instagram_status, ps.twitter_status, ps.publicacion_status
    into v_id, v_estado, v_rel, v_tit, v_por, v_ven, v_pul, v_web, v_ig, v_tw, v_pub
  from public.ediciones e
  left join public.pipeline_state ps on ps.edicion_id = e.id
  where e.fecha = v_fecha and coalesce(e.pais, 'AR') = 'AR'
  order by e.created_at desc
  limit 1;

  -- No hay edicion para hoy: no alertar (silencio en testing / dias sin tirada).
  if v_id is null then
    return;
  end if;

  -- Edicion publicada: todo bien, no alertar.
  if v_estado = 'published' then
    return;
  end if;

  v_pend := concat_ws(', ',
    case when coalesce(v_rel,'') <> 'done' then 'relevamiento(' || coalesce(v_rel,'?') || ')' end,
    case when coalesce(v_tit,'') <> 'done' then 'titulos(' || coalesce(v_tit,'?') || ')' end,
    case when coalesce(v_por,'') <> 'done' then 'portada(' || coalesce(v_por,'?') || ')' end,
    case when coalesce(v_ven,'') <> 'done' then 'ventana_opinion(' || coalesce(v_ven,'?') || ')' end,
    case when coalesce(v_pul,'') <> 'done' then 'el_pulso(' || coalesce(v_pul,'?') || ')' end,
    case when coalesce(v_web,'') <> 'done' then 'web(' || coalesce(v_web,'?') || ')' end,
    case when coalesce(v_ig,'')  <> 'done' then 'instagram(' || coalesce(v_ig,'?') || ')' end,
    case when coalesce(v_tw,'')  <> 'done' then 'twitter(' || coalesce(v_tw,'?') || ')' end,
    case when coalesce(v_pub,'') <> 'done' then 'publicacion(' || coalesce(v_pub,'?') || ')' end
  );

  return query select
    v_fecha,
    v_estado,
    ('La edicion de hoy (' || v_fecha || ') no esta publicada. Estado: ' || v_estado ||
     '. Etapas sin terminar: ' || coalesce(nullif(v_pend, ''), 'ninguna (revisar publicacion)') || '.')::text;
end;
$function$;

comment on function public.alertar_edicion_atrasada() is 'Alerta: devuelve una fila si la edicion de hoy (zona AR) no esta publicada, con las etapas pendientes. Silencio si no hay edicion o si ya se publico.';
