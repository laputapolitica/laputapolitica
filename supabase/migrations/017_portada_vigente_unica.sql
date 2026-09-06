-- 017_portada_vigente_unica.sql
-- Garantiza UNA SOLA portada vigente por edicion.
-- Al insertar o actualizar una portada con vigente = true, baja a false las
-- demas portadas vigentes de esa misma edicion. Evita el choque que aparecia
-- al re-ejecutar la etapa Portada (re-runs dejaban dos vigentes).
--
-- Aplicado originalmente por MCP; este archivo lo deja versionado.

create or replace function public.demote_portadas_vigentes()
 returns trigger
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
begin
  if NEW.vigente is true then
    update public.portadas
      set vigente = false
      where edicion_id = NEW.edicion_id
        and vigente = true
        and id is distinct from NEW.id;
  end if;
  return NEW;
end;
$function$;

drop trigger if exists trg_demote_portadas_vigentes on public.portadas;

create trigger trg_demote_portadas_vigentes
  before insert or update on public.portadas
  for each row execute function public.demote_portadas_vigentes();

comment on function public.demote_portadas_vigentes() is 'Trigger: al marcar una portada como vigente, baja las demas vigentes de la misma edicion.';
