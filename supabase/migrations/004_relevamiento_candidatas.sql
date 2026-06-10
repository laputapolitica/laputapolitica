-- 004_relevamiento_candidatas.sql
-- Tabla de candidatas del Relevamiento: las N noticias rankeadas del día,
-- antes de promover las 5 elegidas a `noticias`. Idempotente.

create table if not exists public.relevamiento_candidatas (
  id uuid primary key default gen_random_uuid(),
  edicion_id uuid not null references public.ediciones(id) on delete cascade,
  titulo text not null,
  fuente_url text,
  ranking integer not null,
  activa boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (edicion_id, ranking)
);

create index if not exists relevamiento_candidatas_edicion_id_idx
  on public.relevamiento_candidatas (edicion_id);

create index if not exists relevamiento_candidatas_edicion_ranking_idx
  on public.relevamiento_candidatas (edicion_id, ranking);

-- RLS: mismo patrón que el resto de tablas de pipeline.
alter table public.relevamiento_candidatas enable row level security;

-- Staff activo puede leer.
drop policy if exists relevamiento_candidatas_select on public.relevamiento_candidatas;
create policy relevamiento_candidatas_select
  on public.relevamiento_candidatas for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.activo = true
    )
  );

-- Solo admin y editor pueden insertar.
drop policy if exists relevamiento_candidatas_insert on public.relevamiento_candidatas;
create policy relevamiento_candidatas_insert
  on public.relevamiento_candidatas for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.activo = true and p.role in ('admin', 'editor')
    )
  );

-- Solo admin y editor pueden actualizar (reordenar ranking, activar/descartar).
drop policy if exists relevamiento_candidatas_update on public.relevamiento_candidatas;
create policy relevamiento_candidatas_update
  on public.relevamiento_candidatas for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.activo = true and p.role in ('admin', 'editor')
    )
  );

-- Solo admin y editor pueden borrar.
drop policy if exists relevamiento_candidatas_delete on public.relevamiento_candidatas;
create policy relevamiento_candidatas_delete
  on public.relevamiento_candidatas for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.activo = true and p.role in ('admin', 'editor')
    )
  );
