-- 002_multipais.sql
-- Adenda multi-pais sobre 001_initial_schema.sql.
-- Agrega tabla paises, columna pais en las 5 tablas raiz, profiles.es_global,
-- helpers de pais y actualiza las policies de staff de las tablas raiz.
-- Compatible con PostgreSQL 15 y Supabase. Idempotente (se puede re-correr).

-- 1. Tabla paises
create table if not exists public.paises (
  codigo text primary key,
  nombre text not null,
  dominio text not null,
  marca text not null,
  orden integer not null default 100,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  constraint paises_codigo_check check (codigo ~ '^[A-Z]{2}$'),
  constraint paises_dominio_key unique (dominio)
);

-- 2. Seed pais AR (debe existir antes de las FKs y los defaults).
insert into public.paises (codigo, nombre, dominio, marca, orden, activo)
values ('AR', 'Argentina', 'ar.laputapolitica.com', 'La Puta Politica', 1, true)
on conflict (codigo) do nothing;

-- 3. Columna pais + es_global en las 5 tablas raiz.
-- Default 'AR' transitorio: no rompe el flujo AR actual; la app setea el pais
-- real por dominio. Se puede quitar el default cuando entre el 2do pais.

alter table public.profiles add column if not exists pais text not null default 'AR';
alter table public.profiles add column if not exists es_global boolean not null default false;
alter table public.profiles drop constraint if exists profiles_pais_fkey;
alter table public.profiles add constraint profiles_pais_fkey
  foreign key (pais) references public.paises(codigo);
create index if not exists profiles_pais_idx on public.profiles(pais);

alter table public.opinadores add column if not exists pais text not null default 'AR';
alter table public.opinadores drop constraint if exists opinadores_pais_fkey;
alter table public.opinadores add constraint opinadores_pais_fkey
  foreign key (pais) references public.paises(codigo);
create index if not exists opinadores_pais_idx on public.opinadores(pais);

alter table public.postulaciones add column if not exists pais text not null default 'AR';
alter table public.postulaciones drop constraint if exists postulaciones_pais_fkey;
alter table public.postulaciones add constraint postulaciones_pais_fkey
  foreign key (pais) references public.paises(codigo);
create index if not exists postulaciones_pais_idx on public.postulaciones(pais);

alter table public.ediciones add column if not exists pais text not null default 'AR';
alter table public.ediciones drop constraint if exists ediciones_pais_fkey;
alter table public.ediciones add constraint ediciones_pais_fkey
  foreign key (pais) references public.paises(codigo);
create index if not exists ediciones_pais_idx on public.ediciones(pais);

alter table public.fuentes_noticias add column if not exists pais text not null default 'AR';
alter table public.fuentes_noticias drop constraint if exists fuentes_noticias_pais_fkey;
alter table public.fuentes_noticias add constraint fuentes_noticias_pais_fkey
  foreign key (pais) references public.paises(codigo);
create index if not exists fuentes_noticias_pais_idx on public.fuentes_noticias(pais);

-- 4. ediciones: unique (fecha) -> unique (pais, fecha).
alter table public.ediciones drop constraint if exists ediciones_fecha_key;
alter table public.ediciones drop constraint if exists ediciones_pais_fecha_key;
alter table public.ediciones add constraint ediciones_pais_fecha_key unique (pais, fecha);

-- 5. Helpers de pais (mismo patron security definer que la 001).
create or replace function public.current_staff_pais()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select p.pais
  from public.profiles p
  where p.id = auth.uid()
    and p.activo = true
  limit 1
$$;

create or replace function public.current_staff_es_global()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select p.es_global
      from public.profiles p
      where p.id = auth.uid()
        and p.activo = true
      limit 1
    ),
    false
  )
$$;

create or replace function public.current_opinador_pais()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select o.pais
  from public.opinadores o
  where o.id = auth.uid()
    and o.activo = true
  limit 1
$$;

-- Conveniencia: staff global ve todo; staff comun solo su pais.
create or replace function public.staff_pais_ok(p_pais text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_staff_es_global() or p_pais = public.current_staff_pais()
$$;

-- 6. can_read_edicion: sumar pais a las ramas staff y opinador.
create or replace function public.can_read_edicion(p_edicion_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.ediciones e
    where e.id = p_edicion_id
      and (
        e.estado = 'published'
        or (public.is_staff() and public.staff_pais_ok(e.pais))
        or (
          public.is_opinador()
          and public.current_opinador_pais() = e.pais
          and exists (
            select 1
            from public.pipeline_state ps
            where ps.edicion_id = e.id
              and ps.ventana_opinion_status = 'running'
          )
        )
      )
  )
$$;

-- 7. RLS de paises.
alter table public.paises enable row level security;

drop policy if exists "paises_select_all" on public.paises;
create policy "paises_select_all"
on public.paises
for select
to anon, authenticated
using (true);

drop policy if exists "paises_insert_global_admin" on public.paises;
create policy "paises_insert_global_admin"
on public.paises
for insert
to authenticated
with check (public.has_staff_role(array['admin']) and public.current_staff_es_global());

drop policy if exists "paises_update_global_admin" on public.paises;
create policy "paises_update_global_admin"
on public.paises
for update
to authenticated
using (public.has_staff_role(array['admin']) and public.current_staff_es_global())
with check (public.has_staff_role(array['admin']) and public.current_staff_es_global());

drop policy if exists "paises_delete_global_admin" on public.paises;
create policy "paises_delete_global_admin"
on public.paises
for delete
to authenticated
using (public.has_staff_role(array['admin']) and public.current_staff_es_global());

-- 8. Policies de staff de las tablas raiz: sumar filtro de pais.

drop policy if exists "profiles_select_staff_or_self" on public.profiles;
create policy "profiles_select_staff_or_self"
on public.profiles
for select
to authenticated
using ((public.is_staff() and public.staff_pais_ok(pais)) or id = auth.uid());

drop policy if exists "profiles_insert_admin" on public.profiles;
create policy "profiles_insert_admin"
on public.profiles
for insert
to authenticated
with check (public.has_staff_role(array['admin']) and public.staff_pais_ok(pais));

drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_admin"
on public.profiles
for update
to authenticated
using (public.has_staff_role(array['admin']) and public.staff_pais_ok(pais))
with check (public.has_staff_role(array['admin']) and public.staff_pais_ok(pais));

drop policy if exists "profiles_delete_admin" on public.profiles;
create policy "profiles_delete_admin"
on public.profiles
for delete
to authenticated
using (public.has_staff_role(array['admin']) and public.staff_pais_ok(pais));

-- postulaciones (el insert publico no cambia; el pais lo setea la app por dominio)
drop policy if exists "postulaciones_select_staff" on public.postulaciones;
create policy "postulaciones_select_staff"
on public.postulaciones
for select
to authenticated
using (public.is_staff() and public.staff_pais_ok(pais));

drop policy if exists "postulaciones_update_staff_review" on public.postulaciones;
create policy "postulaciones_update_staff_review"
on public.postulaciones
for update
to authenticated
using (public.has_staff_role(array['admin', 'editor', 'director']) and public.staff_pais_ok(pais))
with check (public.has_staff_role(array['admin', 'editor', 'director']) and public.staff_pais_ok(pais));

drop policy if exists "postulaciones_delete_admin" on public.postulaciones;
create policy "postulaciones_delete_admin"
on public.postulaciones
for delete
to authenticated
using (public.has_staff_role(array['admin']) and public.staff_pais_ok(pais));

drop policy if exists "opinadores_select_staff_or_self" on public.opinadores;
create policy "opinadores_select_staff_or_self"
on public.opinadores
for select
to authenticated
using ((public.is_staff() and public.staff_pais_ok(pais)) or id = auth.uid());

drop policy if exists "opinadores_insert_admin_editor" on public.opinadores;
create policy "opinadores_insert_admin_editor"
on public.opinadores
for insert
to authenticated
with check (public.has_staff_role(array['admin', 'editor']) and public.staff_pais_ok(pais));

drop policy if exists "opinadores_update_admin_editor_or_self" on public.opinadores;
create policy "opinadores_update_admin_editor_or_self"
on public.opinadores
for update
to authenticated
using (
  (public.has_staff_role(array['admin', 'editor']) and public.staff_pais_ok(pais))
  or id = auth.uid()
)
with check (
  (public.has_staff_role(array['admin', 'editor']) and public.staff_pais_ok(pais))
  or id = auth.uid()
);

drop policy if exists "opinadores_delete_admin" on public.opinadores;
create policy "opinadores_delete_admin"
on public.opinadores
for delete
to authenticated
using (public.has_staff_role(array['admin']) and public.staff_pais_ok(pais));

-- ediciones (el SELECT usa can_read_edicion, ya actualizado; no se recrea)
drop policy if exists "ediciones_insert_admin_editor" on public.ediciones;
create policy "ediciones_insert_admin_editor"
on public.ediciones
for insert
to authenticated
with check (public.has_staff_role(array['admin', 'editor']) and public.staff_pais_ok(pais));

drop policy if exists "ediciones_update_admin_editor" on public.ediciones;
create policy "ediciones_update_admin_editor"
on public.ediciones
for update
to authenticated
using (public.has_staff_role(array['admin', 'editor']) and public.staff_pais_ok(pais))
with check (public.has_staff_role(array['admin', 'editor']) and public.staff_pais_ok(pais));

drop policy if exists "ediciones_delete_admin" on public.ediciones;
create policy "ediciones_delete_admin"
on public.ediciones
for delete
to authenticated
using (public.has_staff_role(array['admin']) and public.staff_pais_ok(pais));

drop policy if exists "fuentes_noticias_select_staff" on public.fuentes_noticias;
create policy "fuentes_noticias_select_staff"
on public.fuentes_noticias
for select
to authenticated
using (public.is_staff() and public.staff_pais_ok(pais));

drop policy if exists "fuentes_noticias_insert_admin_editor" on public.fuentes_noticias;
create policy "fuentes_noticias_insert_admin_editor"
on public.fuentes_noticias
for insert
to authenticated
with check (public.has_staff_role(array['admin', 'editor']) and public.staff_pais_ok(pais));

drop policy if exists "fuentes_noticias_update_admin_editor" on public.fuentes_noticias;
create policy "fuentes_noticias_update_admin_editor"
on public.fuentes_noticias
for update
to authenticated
using (public.has_staff_role(array['admin', 'editor']) and public.staff_pais_ok(pais))
with check (public.has_staff_role(array['admin', 'editor']) and public.staff_pais_ok(pais));

drop policy if exists "fuentes_noticias_delete_admin" on public.fuentes_noticias;
create policy "fuentes_noticias_delete_admin"
on public.fuentes_noticias
for delete
to authenticated
using (public.has_staff_role(array['admin']) and public.staff_pais_ok(pais));
