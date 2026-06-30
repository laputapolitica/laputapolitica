-- Habilita Realtime (postgres_changes) para el admin en vivo. (Ya aplicado en el remoto.)
alter publication supabase_realtime add table public.pipeline_state;
alter publication supabase_realtime add table public.opiniones;
