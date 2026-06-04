# Adenda multi-país — Modelo de datos

> Complemento de `02-data-model.md`. Este documento describe **solo los cambios** necesarios para soportar múltiples países sobre una sola base de datos (estrategia: una base con columna `pais`). El resto del modelo original sigue vigente tal cual.
>
> **Estrategia general:** cada país es un tenant identificado por su dominio. Una sola base de datos sirve a todos; el `pais` separa los datos. El dominio determina el país (vía `middleware.ts`), el país filtra los datos (queries + RLS).

---

## 1. Principio de diseño

El `pais` vive **solo en las tablas raíz**. El resto de las tablas lo heredan a través de sus relaciones (foreign keys). Esto evita redundancia y previene inconsistencias (ej. una noticia con país distinto al de su edición sería imposible).

**Tablas raíz (llevan columna `pais`):**

- `profiles`
- `opinadores`
- `postulaciones`
- `ediciones`
- `fuentes_noticias`

**Tablas que heredan el país (NO llevan columna `pais`):**

- `noticias`, `el_pulso_noticia` → vía `edicion`.
- `opiniones` → vía `noticia` y `opinador`.
- `pipeline_state`, `publicacion_web`, `slides_web`, `publicacion_instagram`, `slides_instagram`, `publicacion_twitter`, `hilos_twitter`, `clima_diario` → vía `edicion`.

---

## 2. Nueva tabla: `paises`

Catálogo de países. Fuente única del mapa país → dominio → marca. La lee el `CountrySelector` del web público para el salto de dominio.

| Columna | Tipo | Null | Default | Notas |
|---|---|---|---|---|
| `codigo` | `text` | no | - | PK. ISO 3166-1 alpha-2: `AR`, `UY`, `US`. |
| `nombre` | `text` | no | - | Nombre visible: `Argentina`, `Uruguay`. |
| `dominio` | `text` | no | - | Dominio del país: `ar.laputapolitica.com`, `thedamnpolitics.com`. Único. |
| `marca` | `text` | no | - | Marca: `La Puta Política`, `The Damn Politics`. |
| `orden` | `integer` | no | `100` | Orden en el selector. Menor = primero. |
| `activo` | `boolean` | no | `true` | Permite desactivar un país sin borrarlo. |
| `created_at` | `timestamptz` | no | `now()` | Alta. |

**Constraints**

```sql
primary key (codigo);
unique (dominio);
check (codigo ~ '^[A-Z]{2}$');
check (orden >= 0);
```

**Índices**

| Índice | Columnas | Motivo |
|---|---|---|
| `paises_pkey` | `codigo` | PK y FK destino. |
| `paises_dominio_key` | `dominio` | Resolución dominio → país en el middleware. |
| `paises_orden_idx` | `orden asc` | Orden del CountrySelector. |

**RLS**

| Operación | Política |
|---|---|
| `SELECT` | Público puede leer países activos (lo necesita el CountrySelector). Staff activo puede leer todos. |
| `INSERT` | Solo `admin`. |
| `UPDATE` | Solo `admin`. |
| `DELETE` | Solo `admin`; preferir `activo = false`. |

**Seed inicial**

```sql
insert into public.paises (codigo, nombre, dominio, marca, orden) values
  ('AR', 'Argentina', 'ar.laputapolitica.com', 'La Puta Política', 1);
-- Países futuros (UY, US, etc.) se agregan acá cuando existan sus dominios.
```

---

## 3. Columna `pais` en las tablas raíz

En **cada una** de las 5 tablas raíz se agrega:

| Columna | Tipo | Null | Default | Notas |
|---|---|---|---|---|
| `pais` | `text` | no | - | FK a `paises.codigo`. Sin default: cada registro declara su país explícitamente. |

**Foreign key (en cada tabla raíz)**

```sql
pais references public.paises(codigo);
```

**Índice (en cada tabla raíz)**

```sql
create index <tabla>_pais_idx on public.<tabla> (pais);
-- Casi todas las queries filtran por país; el índice es necesario.
```

---

## 4. Cambio en `ediciones`: unique compuesto

El `unique (fecha)` original ya **no sirve** en multi-país: dos países pueden tener una edición del mismo día.

**Cambio:**

```sql
-- ANTES:
unique (fecha);

-- AHORA:
unique (pais, fecha);
```

La fecha es única **por país**, no globalmente. El índice `ediciones_fecha_key` pasa a ser `ediciones_pais_fecha_key` sobre `(pais, fecha)`.

> Nota para la ruta pública `/edicion/[fecha]`: el país se resuelve por el dominio (middleware), así que la query es `where pais = <pais del dominio> and fecha = <slug>`.

---

## 5. Super-admin: columna `es_global` en `profiles`

Para que el operador de la plataforma administre todos los países desde una sola cuenta, se separa el **rol** (qué podés hacer) del **alcance de país** (sobre qué países).

`profiles` suma:

| Columna | Tipo | Null | Default | Notas |
|---|---|---|---|---|
| `es_global` | `boolean` | no | `false` | Si `true`, el staff opera sobre **todos** los países (super-admin). Si `false`, solo sobre su `pais`. |

- Un `admin` con `es_global = true` → cuenta del operador de la plataforma (ve AR, UY, US...).
- Un `admin`/`editor`/`director` con `es_global = false` → staff de un país, contenido a su `pais`.

> El rol y el alcance de país son dimensiones independientes. No se crea un rol `superadmin`; se usa el flag, que es más limpio.

---

## 6. Helpers de RLS por país

Helpers nuevos que devuelven el país del usuario actual y si es global.

```sql
-- País del staff actual (null si no es staff activo).
create or replace function public.current_staff_pais()
returns text
language sql
security definer
stable
as $$
  select p.pais
  from public.profiles p
  where p.id = auth.uid()
    and p.activo = true
  limit 1
$$;

-- ¿El staff actual es global (super-admin)?
create or replace function public.current_staff_es_global()
returns boolean
language sql
security definer
stable
as $$
  select coalesce(
    (select p.es_global
     from public.profiles p
     where p.id = auth.uid()
       and p.activo = true
     limit 1),
    false
  )
$$;

-- País del opinador actual (null si no es opinador activo).
create or replace function public.current_opinador_pais()
returns text
language sql
security definer
stable
as $$
  select o.pais
  from public.opinadores o
  where o.id = auth.uid()
    and o.activo = true
  limit 1
$$;
```

---

## 7. Patrón de RLS con país

Todas las políticas de staff que hoy filtran por rol suman la dimensión país. El patrón general:

```sql
-- Staff puede operar sobre un dato si: es global, O es de su mismo país.
exists (
  select 1 from public.profiles p
  where p.id = auth.uid()
    and p.activo = true
    and p.role in ('admin', 'editor')   -- el rol que aplique a la operación
    and (p.es_global = true or p.pais = <tabla>.pais)
)
```

Para tablas que **heredan** el país (no tienen columna `pais`), el `<tabla>.pais` se reemplaza por un join a la tabla raíz correspondiente. Ejemplo para `noticias` (hereda de `ediciones`):

```sql
exists (
  select 1
  from public.profiles p
  join public.ediciones e on e.id = noticias.edicion_id
  where p.id = auth.uid()
    and p.activo = true
    and p.role in ('admin', 'editor')
    and (p.es_global = true or p.pais = e.pais)
)
```

**Opinadores:** el patrón equivalente usa `current_opinador_pais()` y compara con el país de la edición/noticia. Un opinador solo ve y opina sobre contenido de su país.

**Lectura pública:** el público lee contenido `published`, y el país se filtra por el dominio desde la app (la RLS pública puede no filtrar país si el contenido publicado es de acceso libre, pero la query SÍ filtra por el país del dominio). Decisión a confirmar en Fase 1: si el contenido publicado de un país debe ser invisible desde el dominio de otro país, la RLS pública también filtra país.

---

## 8. Capas de control de país (no solo RLS)

El filtro de país vive en **varias capas**, no solo en RLS (regla transversal 5 del documento original):

1. **Middleware** (`middleware.ts`): lee el dominio → determina el país → lo inyecta en la request.
2. **Server Actions / queries**: filtran por el país del dominio.
3. **RLS**: última red de seguridad a nivel base de datos.

La RLS sola no alcanza; la RLS sin las otras capas tampoco. Defensa en profundidad.

---

## 9. Resumen de cambios respecto de `02-data-model.md`

| Cambio | Detalle |
|---|---|
| Nueva tabla `paises` | Catálogo país → dominio → marca. |
| `pais` en 5 tablas raíz | profiles, opinadores, postulaciones, ediciones, fuentes_noticias. FK a `paises.codigo` + índice. |
| `ediciones` unique | De `(fecha)` a `(pais, fecha)`. |
| `profiles.es_global` | Flag de super-admin (acceso a todos los países). |
| Helpers RLS nuevos | `current_staff_pais()`, `current_staff_es_global()`, `current_opinador_pais()`. |
| Patrón RLS | Todas las políticas de staff/opinador suman `es_global OR pais coincide`. |
| Capas de control | País validado en middleware + server actions + RLS. |

---

## 10. Pendiente de decidir en Fase 1 (al escribir el SQL)

- Confirmar si la lectura pública debe aislar país (¿el dominio AR puede ver contenido publicado de UY?). Por defecto: la query filtra por país del dominio; evaluar si además la RLS lo fuerza.
- Definir el orden de creación de las migraciones (primero `paises`, luego las raíz con su FK, luego el resto).
- Seed de países reales según qué dominios existan al momento de lanzar.
