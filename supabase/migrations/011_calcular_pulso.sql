-- 011_calcular_pulso.sql
-- Función que calcula, para cada noticia de una edición, los porcentajes de
-- opiniones por sentiment (positiva/negativa/incierta) y el total, y los guarda
-- en el_pulso_noticia. Los porcentajes suman exactamente 100 (método del resto
-- mayor: se reparten las unidades faltantes a los sentimientos con mayor resto
-- decimal). NO modifica texto_resumen (eso es un paso aparte con IA).
-- Idempotente (reemplaza la función si existe).

create or replace function public.calcular_pulso_edicion(p_edicion_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  r_noticia record;
  v_pos integer;
  v_neg integer;
  v_inc integer;
  v_total integer;
  v_pct_pos integer;
  v_pct_neg integer;
  v_pct_inc integer;
  v_resto_pos numeric;
  v_resto_neg numeric;
  v_resto_inc numeric;
  v_falta integer;
begin
  -- Recorrer cada noticia de la edición.
  for r_noticia in
    select id from public.noticias where edicion_id = p_edicion_id
  loop
    -- Contar opiniones por sentiment para esta noticia.
    select
      count(*) filter (where sentiment = 'positiva'),
      count(*) filter (where sentiment = 'negativa'),
      count(*) filter (where sentiment = 'incierta')
    into v_pos, v_neg, v_inc
    from public.opiniones
    where noticia_id = r_noticia.id;

    v_total := coalesce(v_pos, 0) + coalesce(v_neg, 0) + coalesce(v_inc, 0);

    if v_total = 0 then
      -- Sin opiniones: todo en cero.
      v_pct_pos := 0;
      v_pct_neg := 0;
      v_pct_inc := 0;
    else
      -- Porcentaje exacto (con decimales) y parte entera (floor).
      v_pct_pos := floor(v_pos::numeric * 100 / v_total);
      v_pct_neg := floor(v_neg::numeric * 100 / v_total);
      v_pct_inc := floor(v_inc::numeric * 100 / v_total);

      -- Restos decimales (para el método del resto mayor).
      v_resto_pos := (v_pos::numeric * 100 / v_total) - v_pct_pos;
      v_resto_neg := (v_neg::numeric * 100 / v_total) - v_pct_neg;
      v_resto_inc := (v_inc::numeric * 100 / v_total) - v_pct_inc;

      -- Cuántas unidades faltan para llegar a 100.
      v_falta := 100 - (v_pct_pos + v_pct_neg + v_pct_inc);

      -- Repartir las unidades faltantes a los de mayor resto decimal.
      while v_falta > 0 loop
        if v_resto_pos >= v_resto_neg and v_resto_pos >= v_resto_inc then
          v_pct_pos := v_pct_pos + 1;
          v_resto_pos := -1;
        elsif v_resto_neg >= v_resto_pos and v_resto_neg >= v_resto_inc then
          v_pct_neg := v_pct_neg + 1;
          v_resto_neg := -1;
        else
          v_pct_inc := v_pct_inc + 1;
          v_resto_inc := -1;
        end if;
        v_falta := v_falta - 1;
      end loop;
    end if;

    -- Upsert en el_pulso_noticia (una fila por noticia, unique noticia_id).
    insert into public.el_pulso_noticia (
      noticia_id, texto_resumen, pct_positiva, pct_negativa, pct_incierta, total_opiniones
    )
    values (
      r_noticia.id, '', v_pct_pos, v_pct_neg, v_pct_inc, v_total
    )
    on conflict (noticia_id) do update set
      pct_positiva = excluded.pct_positiva,
      pct_negativa = excluded.pct_negativa,
      pct_incierta = excluded.pct_incierta,
      total_opiniones = excluded.total_opiniones,
      updated_at = now();
  end loop;
end;
$$;
