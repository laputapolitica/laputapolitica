-- 007_estilos_portada.sql
-- Banco de estilos de portada: biblioteca de referencias visuales (una imagen
-- por estilo) que la IA razonadora usa para decidir y construir la portada del día.
-- Cada estilo guarda una imagen de referencia (ej. portada editorial) cuyo
-- "lenguaje visual" la IA analiza (multimodal) y aplica a las noticias del día.
-- Idempotente.

create table if not exists public.estilos_portada (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text not null default '',
  imagen_url text not null default '',
  notas_estilo text not null default '',
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Índice para listar rápido los estilos activos.
create index if not exists estilos_portada_activo_idx
  on public.estilos_portada (activo);

-- RLS: mismo patrón que el resto de tablas del pipeline.
alter table public.estilos_portada enable row level security;

-- Staff activo puede leer.
drop policy if exists estilos_portada_select on public.estilos_portada;
create policy estilos_portada_select
  on public.estilos_portada for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.activo = true
    )
  );

-- Solo admin y editor pueden insertar.
drop policy if exists estilos_portada_insert on public.estilos_portada;
create policy estilos_portada_insert
  on public.estilos_portada for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.activo = true and p.role in ('admin', 'editor')
    )
  );

-- Solo admin y editor pueden actualizar.
drop policy if exists estilos_portada_update on public.estilos_portada;
create policy estilos_portada_update
  on public.estilos_portada for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.activo = true and p.role in ('admin', 'editor')
    )
  );

-- Solo admin y editor pueden borrar.
drop policy if exists estilos_portada_delete on public.estilos_portada;
create policy estilos_portada_delete
  on public.estilos_portada for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.activo = true and p.role in ('admin', 'editor')
    )
  );
