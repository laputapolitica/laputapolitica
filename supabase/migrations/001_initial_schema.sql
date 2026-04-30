-- Initial schema for La Puta Politica.
-- Compatible with PostgreSQL 15 and Supabase.

create extension if not exists pgcrypto with schema extensions;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  nombre text not null,
  role text not null,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_email_key unique (email),
  constraint profiles_role_check check (role in ('admin', 'editor', 'director'))
);

create table if not exists public.postulaciones (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text not null,
  telefono text not null,
  edad integer not null,
  provincia text not null,
  motivacion text not null,
  estado text not null default 'pending',
  revisada_por uuid references public.profiles(id) on delete set null,
  revisada_en timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint postulaciones_estado_check check (estado in ('pending', 'approved', 'rejected')),
  constraint postulaciones_edad_check check (edad >= 13)
);

create table if not exists public.opinadores (
  id uuid primary key references auth.users(id) on delete cascade,
  postulacion_id uuid references public.postulaciones(id) on delete set null,
  numero_usuario integer not null,
  nombre text not null,
  email text not null,
  telefono text not null,
  edad integer not null,
  provincia text not null,
  activo boolean not null default true,
  ingreso_en timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint opinadores_numero_usuario_key unique (numero_usuario),
  constraint opinadores_email_key unique (email),
  constraint opinadores_edad_check check (edad >= 13)
);

create table if not exists public.ediciones (
  id uuid primary key default gen_random_uuid(),
  fecha text not null,
  titulo text not null,
  bajada text,
  portada_url text,
  estado text not null default 'draft',
  publicada_en timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ediciones_fecha_key unique (fecha),
  constraint ediciones_fecha_check check (fecha ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}$'),
  constraint ediciones_estado_check check (estado in ('draft', 'in_progress', 'awaiting_review', 'published'))
);

create table if not exists public.pipeline_state (
  id uuid primary key default gen_random_uuid(),
  edicion_id uuid not null references public.ediciones(id) on delete cascade,
  relevamiento_status text not null default 'pending',
  titulos_status text not null default 'pending',
  portada_status text not null default 'pending',
  ventana_opinion_status text not null default 'pending',
  el_pulso_status text not null default 'pending',
  web_status text not null default 'pending',
  instagram_status text not null default 'pending',
  twitter_status text not null default 'pending',
  publicacion_status text not null default 'pending',
  relevamiento_aprobado_por uuid references public.profiles(id) on delete set null,
  relevamiento_aprobado_en timestamptz,
  titulos_aprobado_por uuid references public.profiles(id) on delete set null,
  titulos_aprobado_en timestamptz,
  portada_aprobado_por uuid references public.profiles(id) on delete set null,
  portada_aprobado_en timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pipeline_state_edicion_id_key unique (edicion_id),
  constraint pipeline_state_relevamiento_status_check check (relevamiento_status in ('pending', 'running', 'done')),
  constraint pipeline_state_titulos_status_check check (titulos_status in ('pending', 'running', 'done')),
  constraint pipeline_state_portada_status_check check (portada_status in ('pending', 'running', 'done')),
  constraint pipeline_state_ventana_opinion_status_check check (ventana_opinion_status in ('pending', 'running', 'done')),
  constraint pipeline_state_el_pulso_status_check check (el_pulso_status in ('pending', 'running', 'done')),
  constraint pipeline_state_web_status_check check (web_status in ('pending', 'running', 'done')),
  constraint pipeline_state_instagram_status_check check (instagram_status in ('pending', 'running', 'done')),
  constraint pipeline_state_twitter_status_check check (twitter_status in ('pending', 'running', 'done')),
  constraint pipeline_state_publicacion_status_check check (publicacion_status in ('pending', 'running', 'done'))
);

create table if not exists public.noticias (
  id uuid primary key default gen_random_uuid(),
  edicion_id uuid not null references public.ediciones(id) on delete cascade,
  orden integer not null,
  titulo text not null,
  cuerpo text not null,
  fuentes_urls text[] not null default '{}',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint noticias_edicion_orden_key unique (edicion_id, orden),
  constraint noticias_orden_check check (orden between 1 and 5)
);

create table if not exists public.el_pulso_noticia (
  id uuid primary key default gen_random_uuid(),
  noticia_id uuid not null references public.noticias(id) on delete cascade,
  texto_resumen text not null,
  pct_positiva integer not null default 0,
  pct_negativa integer not null default 0,
  pct_incierta integer not null default 0,
  total_opiniones integer not null default 0,
  generated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint el_pulso_noticia_noticia_id_key unique (noticia_id),
  constraint el_pulso_noticia_pct_positiva_check check (pct_positiva between 0 and 100),
  constraint el_pulso_noticia_pct_negativa_check check (pct_negativa between 0 and 100),
  constraint el_pulso_noticia_pct_incierta_check check (pct_incierta between 0 and 100),
  constraint el_pulso_noticia_total_opiniones_check check (total_opiniones >= 0)
);

create table if not exists public.opiniones (
  id uuid primary key default gen_random_uuid(),
  opinador_id uuid not null references public.opinadores(id) on delete cascade,
  noticia_id uuid not null references public.noticias(id) on delete cascade,
  texto text not null,
  sentiment text not null,
  enviada_en timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint opiniones_opinador_noticia_key unique (opinador_id, noticia_id),
  constraint opiniones_sentiment_check check (sentiment in ('positiva', 'negativa', 'incierta')),
  constraint opiniones_texto_check check (length(trim(texto)) > 0)
);

create table if not exists public.publicacion_web (
  id uuid primary key default gen_random_uuid(),
  edicion_id uuid not null references public.ediciones(id) on delete cascade,
  titulo text not null,
  estado text not null default 'draft',
  published_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint publicacion_web_edicion_id_key unique (edicion_id),
  constraint publicacion_web_estado_check check (estado in ('draft', 'ready', 'published'))
);

create table if not exists public.slides_web (
  id uuid primary key default gen_random_uuid(),
  publicacion_web_id uuid not null references public.publicacion_web(id) on delete cascade,
  orden integer not null,
  tipo text not null,
  titulo text,
  cuerpo text,
  imagen_url text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint slides_web_publicacion_orden_key unique (publicacion_web_id, orden),
  constraint slides_web_orden_check check (orden between 1 and 7)
);

create table if not exists public.publicacion_instagram (
  id uuid primary key default gen_random_uuid(),
  edicion_id uuid not null references public.ediciones(id) on delete cascade,
  caption text,
  estado text not null default 'draft',
  published_manual_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint publicacion_instagram_edicion_id_key unique (edicion_id),
  constraint publicacion_instagram_estado_check check (estado in ('draft', 'ready', 'published_manual'))
);

create table if not exists public.slides_instagram (
  id uuid primary key default gen_random_uuid(),
  publicacion_instagram_id uuid not null references public.publicacion_instagram(id) on delete cascade,
  orden integer not null,
  texto text,
  imagen_url text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint slides_instagram_publicacion_orden_key unique (publicacion_instagram_id, orden),
  constraint slides_instagram_orden_check check (orden between 1 and 4)
);

create table if not exists public.publicacion_twitter (
  id uuid primary key default gen_random_uuid(),
  edicion_id uuid not null references public.ediciones(id) on delete cascade,
  estado text not null default 'draft',
  published_manual_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint publicacion_twitter_edicion_id_key unique (edicion_id),
  constraint publicacion_twitter_estado_check check (estado in ('draft', 'ready', 'published_manual'))
);

create table if not exists public.hilos_twitter (
  id uuid primary key default gen_random_uuid(),
  publicacion_twitter_id uuid not null references public.publicacion_twitter(id) on delete cascade,
  orden integer not null,
  texto text not null,
  imagen_url text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hilos_twitter_publicacion_orden_key unique (publicacion_twitter_id, orden),
  constraint hilos_twitter_orden_check check (orden between 1 and 12)
);

create table if not exists public.fuentes_noticias (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  url text not null,
  rss_url text,
  tipo text not null default 'medio',
  activa boolean not null default true,
  prioridad integer not null default 100,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint fuentes_noticias_url_key unique (url),
  constraint fuentes_noticias_tipo_check check (tipo in ('medio', 'agencia', 'oficial', 'otro')),
  constraint fuentes_noticias_prioridad_check check (prioridad >= 0)
);

create table if not exists public.clima_diario (
  id uuid primary key default gen_random_uuid(),
  edicion_id uuid not null references public.ediciones(id) on delete cascade,
  provincia text not null,
  fecha date not null,
  temperatura_min integer,
  temperatura_max integer,
  condicion text,
  icono text,
  payload jsonb not null default '{}'::jsonb,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint clima_diario_edicion_provincia_fecha_key unique (edicion_id, provincia, fecha)
);

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_activo_idx on public.profiles(activo);

create index if not exists postulaciones_estado_idx on public.postulaciones(estado);
create index if not exists postulaciones_email_idx on public.postulaciones(email);
create index if not exists postulaciones_created_at_idx on public.postulaciones(created_at desc);
create index if not exists postulaciones_revisada_por_idx on public.postulaciones(revisada_por);

create index if not exists opinadores_activo_idx on public.opinadores(activo);
create index if not exists opinadores_provincia_idx on public.opinadores(provincia);

create index if not exists ediciones_estado_idx on public.ediciones(estado);
create index if not exists ediciones_publicada_en_idx on public.ediciones(publicada_en desc);
create index if not exists ediciones_created_by_idx on public.ediciones(created_by);

create index if not exists pipeline_state_publicacion_status_idx on public.pipeline_state(publicacion_status);
create index if not exists pipeline_state_ventana_opinion_status_idx on public.pipeline_state(ventana_opinion_status);

create index if not exists noticias_edicion_id_idx on public.noticias(edicion_id);
create index if not exists noticias_fuentes_urls_gin_idx on public.noticias using gin(fuentes_urls);
create index if not exists noticias_metadata_gin_idx on public.noticias using gin(metadata);

create index if not exists el_pulso_noticia_generated_at_idx on public.el_pulso_noticia(generated_at desc);

create index if not exists opiniones_noticia_id_idx on public.opiniones(noticia_id);
create index if not exists opiniones_opinador_id_idx on public.opiniones(opinador_id);
create index if not exists opiniones_sentiment_idx on public.opiniones(sentiment);
create index if not exists opiniones_enviada_en_idx on public.opiniones(enviada_en desc);

create index if not exists publicacion_web_estado_idx on public.publicacion_web(estado);
create index if not exists publicacion_web_published_at_idx on public.publicacion_web(published_at desc);
create index if not exists slides_web_publicacion_web_id_idx on public.slides_web(publicacion_web_id);
create index if not exists slides_web_payload_gin_idx on public.slides_web using gin(payload);

create index if not exists publicacion_instagram_estado_idx on public.publicacion_instagram(estado);
create index if not exists slides_instagram_publicacion_instagram_id_idx on public.slides_instagram(publicacion_instagram_id);
create index if not exists slides_instagram_payload_gin_idx on public.slides_instagram using gin(payload);

create index if not exists publicacion_twitter_estado_idx on public.publicacion_twitter(estado);
create index if not exists hilos_twitter_publicacion_twitter_id_idx on public.hilos_twitter(publicacion_twitter_id);
create index if not exists hilos_twitter_payload_gin_idx on public.hilos_twitter using gin(payload);

create index if not exists fuentes_noticias_activa_idx on public.fuentes_noticias(activa);
create index if not exists fuentes_noticias_prioridad_idx on public.fuentes_noticias(prioridad asc);
create index if not exists fuentes_noticias_metadata_gin_idx on public.fuentes_noticias using gin(metadata);

create index if not exists clima_diario_edicion_id_idx on public.clima_diario(edicion_id);
create index if not exists clima_diario_provincia_idx on public.clima_diario(provincia);
create index if not exists clima_diario_expires_at_idx on public.clima_diario(expires_at);
create index if not exists clima_diario_payload_gin_idx on public.clima_diario using gin(payload);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_postulaciones_updated_at on public.postulaciones;
create trigger set_postulaciones_updated_at
before update on public.postulaciones
for each row execute function public.set_updated_at();

drop trigger if exists set_opinadores_updated_at on public.opinadores;
create trigger set_opinadores_updated_at
before update on public.opinadores
for each row execute function public.set_updated_at();

drop trigger if exists set_ediciones_updated_at on public.ediciones;
create trigger set_ediciones_updated_at
before update on public.ediciones
for each row execute function public.set_updated_at();

drop trigger if exists set_pipeline_state_updated_at on public.pipeline_state;
create trigger set_pipeline_state_updated_at
before update on public.pipeline_state
for each row execute function public.set_updated_at();

drop trigger if exists set_noticias_updated_at on public.noticias;
create trigger set_noticias_updated_at
before update on public.noticias
for each row execute function public.set_updated_at();

drop trigger if exists set_el_pulso_noticia_updated_at on public.el_pulso_noticia;
create trigger set_el_pulso_noticia_updated_at
before update on public.el_pulso_noticia
for each row execute function public.set_updated_at();

drop trigger if exists set_opiniones_updated_at on public.opiniones;
create trigger set_opiniones_updated_at
before update on public.opiniones
for each row execute function public.set_updated_at();

drop trigger if exists set_publicacion_web_updated_at on public.publicacion_web;
create trigger set_publicacion_web_updated_at
before update on public.publicacion_web
for each row execute function public.set_updated_at();

drop trigger if exists set_slides_web_updated_at on public.slides_web;
create trigger set_slides_web_updated_at
before update on public.slides_web
for each row execute function public.set_updated_at();

drop trigger if exists set_publicacion_instagram_updated_at on public.publicacion_instagram;
create trigger set_publicacion_instagram_updated_at
before update on public.publicacion_instagram
for each row execute function public.set_updated_at();

drop trigger if exists set_slides_instagram_updated_at on public.slides_instagram;
create trigger set_slides_instagram_updated_at
before update on public.slides_instagram
for each row execute function public.set_updated_at();

drop trigger if exists set_publicacion_twitter_updated_at on public.publicacion_twitter;
create trigger set_publicacion_twitter_updated_at
before update on public.publicacion_twitter
for each row execute function public.set_updated_at();

drop trigger if exists set_hilos_twitter_updated_at on public.hilos_twitter;
create trigger set_hilos_twitter_updated_at
before update on public.hilos_twitter
for each row execute function public.set_updated_at();

drop trigger if exists set_fuentes_noticias_updated_at on public.fuentes_noticias;
create trigger set_fuentes_noticias_updated_at
before update on public.fuentes_noticias
for each row execute function public.set_updated_at();

drop trigger if exists set_clima_diario_updated_at on public.clima_diario;
create trigger set_clima_diario_updated_at
before update on public.clima_diario
for each row execute function public.set_updated_at();

create or replace function public.current_staff_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select p.role
  from public.profiles p
  where p.id = auth.uid()
    and p.activo = true
  limit 1
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_staff_role() is not null
$$;

create or replace function public.has_staff_role(allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_staff_role() = any(allowed_roles)
$$;

create or replace function public.is_opinador()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.opinadores o
    where o.id = auth.uid()
      and o.activo = true
  )
$$;

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
        or public.is_staff()
        or (
          public.is_opinador()
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

create or replace function public.can_opine_noticia(p_noticia_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.noticias n
    join public.pipeline_state ps on ps.edicion_id = n.edicion_id
    where n.id = p_noticia_id
      and ps.ventana_opinion_status = 'running'
  )
$$;

create or replace function public.can_read_noticia(p_noticia_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.noticias n
    where n.id = p_noticia_id
      and public.can_read_edicion(n.edicion_id)
  )
$$;

create or replace function public.is_publicacion_web_public(p_publicacion_web_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.publicacion_web pw
    join public.ediciones e on e.id = pw.edicion_id
    where pw.id = p_publicacion_web_id
      and pw.estado = 'published'
      and e.estado = 'published'
  )
$$;

alter table public.profiles enable row level security;
alter table public.postulaciones enable row level security;
alter table public.opinadores enable row level security;
alter table public.ediciones enable row level security;
alter table public.pipeline_state enable row level security;
alter table public.noticias enable row level security;
alter table public.el_pulso_noticia enable row level security;
alter table public.opiniones enable row level security;
alter table public.publicacion_web enable row level security;
alter table public.slides_web enable row level security;
alter table public.publicacion_instagram enable row level security;
alter table public.slides_instagram enable row level security;
alter table public.publicacion_twitter enable row level security;
alter table public.hilos_twitter enable row level security;
alter table public.fuentes_noticias enable row level security;
alter table public.clima_diario enable row level security;

drop policy if exists "profiles_select_staff_or_self" on public.profiles;
create policy "profiles_select_staff_or_self"
on public.profiles
for select
to authenticated
using (public.is_staff() or id = auth.uid());

drop policy if exists "profiles_insert_admin" on public.profiles;
create policy "profiles_insert_admin"
on public.profiles
for insert
to authenticated
with check (public.has_staff_role(array['admin']));

drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_admin"
on public.profiles
for update
to authenticated
using (public.has_staff_role(array['admin']))
with check (public.has_staff_role(array['admin']));

drop policy if exists "profiles_delete_admin" on public.profiles;
create policy "profiles_delete_admin"
on public.profiles
for delete
to authenticated
using (public.has_staff_role(array['admin']));

drop policy if exists "postulaciones_select_staff" on public.postulaciones;
create policy "postulaciones_select_staff"
on public.postulaciones
for select
to authenticated
using (public.is_staff());

drop policy if exists "postulaciones_insert_public_pending" on public.postulaciones;
create policy "postulaciones_insert_public_pending"
on public.postulaciones
for insert
to anon, authenticated
with check (
  estado = 'pending'
  and revisada_por is null
  and revisada_en is null
);

drop policy if exists "postulaciones_update_staff_review" on public.postulaciones;
create policy "postulaciones_update_staff_review"
on public.postulaciones
for update
to authenticated
using (public.has_staff_role(array['admin', 'editor', 'director']))
with check (public.has_staff_role(array['admin', 'editor', 'director']));

drop policy if exists "postulaciones_delete_admin" on public.postulaciones;
create policy "postulaciones_delete_admin"
on public.postulaciones
for delete
to authenticated
using (public.has_staff_role(array['admin']));

drop policy if exists "opinadores_select_staff_or_self" on public.opinadores;
create policy "opinadores_select_staff_or_self"
on public.opinadores
for select
to authenticated
using (public.is_staff() or id = auth.uid());

drop policy if exists "opinadores_insert_admin_editor" on public.opinadores;
create policy "opinadores_insert_admin_editor"
on public.opinadores
for insert
to authenticated
with check (public.has_staff_role(array['admin', 'editor']));

drop policy if exists "opinadores_update_admin_editor_or_self" on public.opinadores;
create policy "opinadores_update_admin_editor_or_self"
on public.opinadores
for update
to authenticated
using (
  public.has_staff_role(array['admin', 'editor'])
  or id = auth.uid()
)
with check (
  public.has_staff_role(array['admin', 'editor'])
  or id = auth.uid()
);

drop policy if exists "opinadores_delete_admin" on public.opinadores;
create policy "opinadores_delete_admin"
on public.opinadores
for delete
to authenticated
using (public.has_staff_role(array['admin']));

drop policy if exists "ediciones_select_public_staff_opinador" on public.ediciones;
create policy "ediciones_select_public_staff_opinador"
on public.ediciones
for select
to anon, authenticated
using (public.can_read_edicion(id));

drop policy if exists "ediciones_insert_admin_editor" on public.ediciones;
create policy "ediciones_insert_admin_editor"
on public.ediciones
for insert
to authenticated
with check (public.has_staff_role(array['admin', 'editor']));

drop policy if exists "ediciones_update_admin_editor" on public.ediciones;
create policy "ediciones_update_admin_editor"
on public.ediciones
for update
to authenticated
using (public.has_staff_role(array['admin', 'editor']))
with check (public.has_staff_role(array['admin', 'editor']));

drop policy if exists "ediciones_delete_admin" on public.ediciones;
create policy "ediciones_delete_admin"
on public.ediciones
for delete
to authenticated
using (public.has_staff_role(array['admin']));

drop policy if exists "pipeline_state_select_staff_opinador" on public.pipeline_state;
create policy "pipeline_state_select_staff_opinador"
on public.pipeline_state
for select
to authenticated
using (public.is_staff() or (public.is_opinador() and public.can_read_edicion(edicion_id)));

drop policy if exists "pipeline_state_insert_admin_editor" on public.pipeline_state;
create policy "pipeline_state_insert_admin_editor"
on public.pipeline_state
for insert
to authenticated
with check (public.has_staff_role(array['admin', 'editor']));

drop policy if exists "pipeline_state_update_admin_editor" on public.pipeline_state;
create policy "pipeline_state_update_admin_editor"
on public.pipeline_state
for update
to authenticated
using (public.has_staff_role(array['admin', 'editor']))
with check (public.has_staff_role(array['admin', 'editor']));

drop policy if exists "pipeline_state_delete_admin" on public.pipeline_state;
create policy "pipeline_state_delete_admin"
on public.pipeline_state
for delete
to authenticated
using (public.has_staff_role(array['admin']));

drop policy if exists "noticias_select_public_staff_opinador" on public.noticias;
create policy "noticias_select_public_staff_opinador"
on public.noticias
for select
to anon, authenticated
using (public.can_read_edicion(edicion_id));

drop policy if exists "noticias_insert_admin_editor" on public.noticias;
create policy "noticias_insert_admin_editor"
on public.noticias
for insert
to authenticated
with check (public.has_staff_role(array['admin', 'editor']));

drop policy if exists "noticias_update_admin_editor" on public.noticias;
create policy "noticias_update_admin_editor"
on public.noticias
for update
to authenticated
using (public.has_staff_role(array['admin', 'editor']))
with check (public.has_staff_role(array['admin', 'editor']));

drop policy if exists "noticias_delete_admin_editor" on public.noticias;
create policy "noticias_delete_admin_editor"
on public.noticias
for delete
to authenticated
using (public.has_staff_role(array['admin', 'editor']));

drop policy if exists "el_pulso_noticia_select_published_or_staff" on public.el_pulso_noticia;
create policy "el_pulso_noticia_select_published_or_staff"
on public.el_pulso_noticia
for select
to anon, authenticated
using (
  public.is_staff()
  or exists (
    select 1
    from public.noticias n
    join public.ediciones e on e.id = n.edicion_id
    where n.id = noticia_id
      and e.estado = 'published'
  )
);

drop policy if exists "el_pulso_noticia_insert_admin_editor" on public.el_pulso_noticia;
create policy "el_pulso_noticia_insert_admin_editor"
on public.el_pulso_noticia
for insert
to authenticated
with check (public.has_staff_role(array['admin', 'editor']));

drop policy if exists "el_pulso_noticia_update_admin_editor" on public.el_pulso_noticia;
create policy "el_pulso_noticia_update_admin_editor"
on public.el_pulso_noticia
for update
to authenticated
using (public.has_staff_role(array['admin', 'editor']))
with check (public.has_staff_role(array['admin', 'editor']));

drop policy if exists "el_pulso_noticia_delete_admin" on public.el_pulso_noticia;
create policy "el_pulso_noticia_delete_admin"
on public.el_pulso_noticia
for delete
to authenticated
using (public.has_staff_role(array['admin']));

drop policy if exists "opiniones_select_staff_or_self" on public.opiniones;
create policy "opiniones_select_staff_or_self"
on public.opiniones
for select
to authenticated
using (public.is_staff() or opinador_id = auth.uid());

drop policy if exists "opiniones_insert_own_open_window" on public.opiniones;
create policy "opiniones_insert_own_open_window"
on public.opiniones
for insert
to authenticated
with check (
  public.is_opinador()
  and opinador_id = auth.uid()
  and public.can_opine_noticia(noticia_id)
);

drop policy if exists "opiniones_update_own_open_window" on public.opiniones;
create policy "opiniones_update_own_open_window"
on public.opiniones
for update
to authenticated
using (
  public.is_opinador()
  and opinador_id = auth.uid()
  and public.can_opine_noticia(noticia_id)
)
with check (
  public.is_opinador()
  and opinador_id = auth.uid()
  and public.can_opine_noticia(noticia_id)
);

drop policy if exists "opiniones_delete_admin" on public.opiniones;
create policy "opiniones_delete_admin"
on public.opiniones
for delete
to authenticated
using (public.has_staff_role(array['admin']));

drop policy if exists "publicacion_web_select_public_or_staff" on public.publicacion_web;
create policy "publicacion_web_select_public_or_staff"
on public.publicacion_web
for select
to anon, authenticated
using (
  public.is_staff()
  or (
    estado = 'published'
    and exists (
      select 1
      from public.ediciones e
      where e.id = edicion_id
        and e.estado = 'published'
    )
  )
);

drop policy if exists "publicacion_web_insert_admin_editor" on public.publicacion_web;
create policy "publicacion_web_insert_admin_editor"
on public.publicacion_web
for insert
to authenticated
with check (public.has_staff_role(array['admin', 'editor']));

drop policy if exists "publicacion_web_update_admin_editor" on public.publicacion_web;
create policy "publicacion_web_update_admin_editor"
on public.publicacion_web
for update
to authenticated
using (public.has_staff_role(array['admin', 'editor']))
with check (public.has_staff_role(array['admin', 'editor']));

drop policy if exists "publicacion_web_delete_admin" on public.publicacion_web;
create policy "publicacion_web_delete_admin"
on public.publicacion_web
for delete
to authenticated
using (public.has_staff_role(array['admin']));

drop policy if exists "slides_web_select_public_or_staff" on public.slides_web;
create policy "slides_web_select_public_or_staff"
on public.slides_web
for select
to anon, authenticated
using (public.is_staff() or public.is_publicacion_web_public(publicacion_web_id));

drop policy if exists "slides_web_insert_admin_editor" on public.slides_web;
create policy "slides_web_insert_admin_editor"
on public.slides_web
for insert
to authenticated
with check (public.has_staff_role(array['admin', 'editor']));

drop policy if exists "slides_web_update_admin_editor" on public.slides_web;
create policy "slides_web_update_admin_editor"
on public.slides_web
for update
to authenticated
using (public.has_staff_role(array['admin', 'editor']))
with check (public.has_staff_role(array['admin', 'editor']));

drop policy if exists "slides_web_delete_admin_editor" on public.slides_web;
create policy "slides_web_delete_admin_editor"
on public.slides_web
for delete
to authenticated
using (public.has_staff_role(array['admin', 'editor']));

drop policy if exists "publicacion_instagram_select_staff" on public.publicacion_instagram;
create policy "publicacion_instagram_select_staff"
on public.publicacion_instagram
for select
to authenticated
using (public.is_staff());

drop policy if exists "publicacion_instagram_insert_admin_editor" on public.publicacion_instagram;
create policy "publicacion_instagram_insert_admin_editor"
on public.publicacion_instagram
for insert
to authenticated
with check (public.has_staff_role(array['admin', 'editor']));

drop policy if exists "publicacion_instagram_update_admin_editor" on public.publicacion_instagram;
create policy "publicacion_instagram_update_admin_editor"
on public.publicacion_instagram
for update
to authenticated
using (public.has_staff_role(array['admin', 'editor']))
with check (public.has_staff_role(array['admin', 'editor']));

drop policy if exists "publicacion_instagram_delete_admin" on public.publicacion_instagram;
create policy "publicacion_instagram_delete_admin"
on public.publicacion_instagram
for delete
to authenticated
using (public.has_staff_role(array['admin']));

drop policy if exists "slides_instagram_select_staff" on public.slides_instagram;
create policy "slides_instagram_select_staff"
on public.slides_instagram
for select
to authenticated
using (public.is_staff());

drop policy if exists "slides_instagram_insert_admin_editor" on public.slides_instagram;
create policy "slides_instagram_insert_admin_editor"
on public.slides_instagram
for insert
to authenticated
with check (public.has_staff_role(array['admin', 'editor']));

drop policy if exists "slides_instagram_update_admin_editor" on public.slides_instagram;
create policy "slides_instagram_update_admin_editor"
on public.slides_instagram
for update
to authenticated
using (public.has_staff_role(array['admin', 'editor']))
with check (public.has_staff_role(array['admin', 'editor']));

drop policy if exists "slides_instagram_delete_admin_editor" on public.slides_instagram;
create policy "slides_instagram_delete_admin_editor"
on public.slides_instagram
for delete
to authenticated
using (public.has_staff_role(array['admin', 'editor']));

drop policy if exists "publicacion_twitter_select_staff" on public.publicacion_twitter;
create policy "publicacion_twitter_select_staff"
on public.publicacion_twitter
for select
to authenticated
using (public.is_staff());

drop policy if exists "publicacion_twitter_insert_admin_editor" on public.publicacion_twitter;
create policy "publicacion_twitter_insert_admin_editor"
on public.publicacion_twitter
for insert
to authenticated
with check (public.has_staff_role(array['admin', 'editor']));

drop policy if exists "publicacion_twitter_update_admin_editor" on public.publicacion_twitter;
create policy "publicacion_twitter_update_admin_editor"
on public.publicacion_twitter
for update
to authenticated
using (public.has_staff_role(array['admin', 'editor']))
with check (public.has_staff_role(array['admin', 'editor']));

drop policy if exists "publicacion_twitter_delete_admin" on public.publicacion_twitter;
create policy "publicacion_twitter_delete_admin"
on public.publicacion_twitter
for delete
to authenticated
using (public.has_staff_role(array['admin']));

drop policy if exists "hilos_twitter_select_staff" on public.hilos_twitter;
create policy "hilos_twitter_select_staff"
on public.hilos_twitter
for select
to authenticated
using (public.is_staff());

drop policy if exists "hilos_twitter_insert_admin_editor" on public.hilos_twitter;
create policy "hilos_twitter_insert_admin_editor"
on public.hilos_twitter
for insert
to authenticated
with check (public.has_staff_role(array['admin', 'editor']));

drop policy if exists "hilos_twitter_update_admin_editor" on public.hilos_twitter;
create policy "hilos_twitter_update_admin_editor"
on public.hilos_twitter
for update
to authenticated
using (public.has_staff_role(array['admin', 'editor']))
with check (public.has_staff_role(array['admin', 'editor']));

drop policy if exists "hilos_twitter_delete_admin_editor" on public.hilos_twitter;
create policy "hilos_twitter_delete_admin_editor"
on public.hilos_twitter
for delete
to authenticated
using (public.has_staff_role(array['admin', 'editor']));

drop policy if exists "fuentes_noticias_select_staff" on public.fuentes_noticias;
create policy "fuentes_noticias_select_staff"
on public.fuentes_noticias
for select
to authenticated
using (public.is_staff());

drop policy if exists "fuentes_noticias_insert_admin_editor" on public.fuentes_noticias;
create policy "fuentes_noticias_insert_admin_editor"
on public.fuentes_noticias
for insert
to authenticated
with check (public.has_staff_role(array['admin', 'editor']));

drop policy if exists "fuentes_noticias_update_admin_editor" on public.fuentes_noticias;
create policy "fuentes_noticias_update_admin_editor"
on public.fuentes_noticias
for update
to authenticated
using (public.has_staff_role(array['admin', 'editor']))
with check (public.has_staff_role(array['admin', 'editor']));

drop policy if exists "fuentes_noticias_delete_admin" on public.fuentes_noticias;
create policy "fuentes_noticias_delete_admin"
on public.fuentes_noticias
for delete
to authenticated
using (public.has_staff_role(array['admin']));

drop policy if exists "clima_diario_select_public_staff_opinador" on public.clima_diario;
create policy "clima_diario_select_public_staff_opinador"
on public.clima_diario
for select
to anon, authenticated
using (public.can_read_edicion(edicion_id));

drop policy if exists "clima_diario_insert_admin_editor" on public.clima_diario;
create policy "clima_diario_insert_admin_editor"
on public.clima_diario
for insert
to authenticated
with check (public.has_staff_role(array['admin', 'editor']));

drop policy if exists "clima_diario_update_admin_editor" on public.clima_diario;
create policy "clima_diario_update_admin_editor"
on public.clima_diario
for update
to authenticated
using (public.has_staff_role(array['admin', 'editor']))
with check (public.has_staff_role(array['admin', 'editor']));

drop policy if exists "clima_diario_delete_admin_editor" on public.clima_diario;
create policy "clima_diario_delete_admin_editor"
on public.clima_diario
for delete
to authenticated
using (public.has_staff_role(array['admin', 'editor']));
