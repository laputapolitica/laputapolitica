-- 008_portadas.sql
-- Historial de portadas generadas por edición. Cada edición puede tener varias
-- versiones (generadas por IA o subidas a mano); no se borran, queda el historial.
-- La marcada `vigente` es la que usa la edición publicada (solo una por edición).
-- Guarda el prompt y el estilo usado, para análisis futuro. Idempotente.

create table if not exists public.portadas (
  id uuid primary key default gen_random_uuid(),
  edicion_id uuid not null references public.ediciones(id) on delete cascade,
  imagen_url text not null default '',
  prompt text not null default '',
  estilo_id uuid references public.estilos_portada(id) on delete set null,
  origen text not null default 'ia',
  vigente boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint portadas_origen_check check (origen in ('ia', 'manual'))
);

-- Índice para listar portadas de una edición (historial).
create index if not exists portadas_edicion_id_idx
  on public.portadas (edicion_id);

-- Unicidad de la portada vigente: solo una vigente por edición (unique index parcial).
create unique index if not exists portadas_edicion_vigente_key
  on public.portadas (edicion_id)
  where vigente = true;

-- RLS: mismo patrón que el resto de tablas del pipeline.
alter table public.portadas enable row level security;

drop policy if exists portadas_select on public.portadas;
create policy portadas_select
  on public.portadas for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.activo = true
    )
  );

drop policy if exists portadas_insert on public.portadas;
create policy portadas_insert
  on public.portadas for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.activo = true and p.role in ('admin', 'editor')
    )
  );

drop policy if exists portadas_update on public.portadas;
create policy portadas_update
  on public.portadas for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.activo = true and p.role in ('admin', 'editor')
    )
  );

drop policy if exists portadas_delete on public.portadas;
create policy portadas_delete
  on public.portadas for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.activo = true and p.role in ('admin', 'editor')
    )
  );
