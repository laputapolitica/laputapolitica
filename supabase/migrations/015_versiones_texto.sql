-- 015_versiones_texto.sql
-- Historial de textos editables del admin. Una fila por version, una sola
-- version vigente por campo de cada entidad. El texto visible al lector sigue
-- viviendo en las columnas actuales de noticias/el_pulso_noticia/portadas.
--
-- Semantica de entidad_id:
-- - noticia.titulo: entidad_tipo = 'noticia', campo = 'titulo', entidad_id = noticias.id
-- - noticia.cuerpo: entidad_tipo = 'noticia', campo = 'cuerpo', entidad_id = noticias.id
-- - titulo de tapa: entidad_tipo = 'portada', campo = 'titulo_tapa', entidad_id = ediciones.id
-- - resumen El Pulso: entidad_tipo = 'el_pulso', campo = 'resumen_pulso', entidad_id = noticias.id

create table if not exists public.versiones_texto (
  id uuid primary key default gen_random_uuid(),
  edicion_id uuid not null references public.ediciones(id) on delete cascade,
  entidad_tipo text not null,
  entidad_id uuid not null,
  campo text not null,
  contenido text not null,
  vigente boolean not null default true,
  origen text not null default 'ia',
  created_at timestamptz not null default now(),
  constraint versiones_texto_entidad_tipo_check check (entidad_tipo in ('noticia', 'portada', 'el_pulso')),
  constraint versiones_texto_campo_check check (campo in ('titulo', 'cuerpo', 'titulo_tapa', 'resumen_pulso')),
  constraint versiones_texto_origen_check check (origen in ('ia', 'manual'))
);

comment on table public.versiones_texto is
  'Historial de versiones de textos editables del admin. Una fila por version; una sola vigente por entidad/campo.';
comment on column public.versiones_texto.entidad_id is
  'Entidad dueña del texto: noticias.id para noticia.titulo/noticia.cuerpo; ediciones.id para portada.titulo_tapa; noticias.id para el_pulso.resumen_pulso.';

create unique index if not exists versiones_texto_entidad_campo_vigente_key
  on public.versiones_texto (entidad_tipo, entidad_id, campo)
  where vigente = true;

create index if not exists versiones_texto_entidad_campo_created_at_idx
  on public.versiones_texto (entidad_id, campo, created_at desc);

create index if not exists versiones_texto_edicion_id_idx
  on public.versiones_texto (edicion_id);

create or replace function public.demote_versiones_texto()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.vigente is true then
    update public.versiones_texto
    set vigente = false
    where entidad_tipo = new.entidad_tipo
      and entidad_id = new.entidad_id
      and campo = new.campo
      and id <> new.id;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_demote_versiones_texto_vigentes on public.versiones_texto;
create trigger trg_demote_versiones_texto_vigentes
before insert or update on public.versiones_texto
for each row
execute function public.demote_versiones_texto();

alter table public.versiones_texto enable row level security;

drop policy if exists "versiones_texto_select_staff" on public.versiones_texto;
create policy "versiones_texto_select_staff"
on public.versiones_texto
for select
to authenticated
using (
  public.has_staff_role(array['admin', 'editor'])
  and exists (
    select 1
    from public.ediciones e
    where e.id = versiones_texto.edicion_id
      and public.staff_pais_ok(e.pais)
  )
);

drop policy if exists "versiones_texto_insert_admin_editor" on public.versiones_texto;
create policy "versiones_texto_insert_admin_editor"
on public.versiones_texto
for insert
to authenticated
with check (
  public.has_staff_role(array['admin', 'editor'])
  and exists (
    select 1
    from public.ediciones e
    where e.id = versiones_texto.edicion_id
      and public.staff_pais_ok(e.pais)
  )
);

drop policy if exists "versiones_texto_update_admin_editor" on public.versiones_texto;
create policy "versiones_texto_update_admin_editor"
on public.versiones_texto
for update
to authenticated
using (
  public.has_staff_role(array['admin', 'editor'])
  and exists (
    select 1
    from public.ediciones e
    where e.id = versiones_texto.edicion_id
      and public.staff_pais_ok(e.pais)
  )
)
with check (
  public.has_staff_role(array['admin', 'editor'])
  and exists (
    select 1
    from public.ediciones e
    where e.id = versiones_texto.edicion_id
      and public.staff_pais_ok(e.pais)
  )
);

drop policy if exists "versiones_texto_delete_admin" on public.versiones_texto;
create policy "versiones_texto_delete_admin"
on public.versiones_texto
for delete
to authenticated
using (
  public.has_staff_role(array['admin'])
  and exists (
    select 1
    from public.ediciones e
    where e.id = versiones_texto.edicion_id
      and public.staff_pais_ok(e.pais)
  )
);
