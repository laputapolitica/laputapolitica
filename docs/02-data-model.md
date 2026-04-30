# Modelo de datos — La Puta Política

> Fuente base: `docs/00-revision-diseno.md`, sección 4. Este documento expande ese modelo con tipos exactos de PostgreSQL, foreign keys, índices y políticas RLS propuestas para Supabase.

---

## 1. Roles de aplicación

Los roles del producto viven en `profiles.role` para staff y en `opinadores` para la comunidad.

| Rol | Alcance |
|---|---|
| `admin` | Acceso total a todas las tablas y operaciones. |
| `editor` | Opera pipeline, crea y edita ediciones, gestiona opinadores y publica. |
| `director` | Lectura total, gestión de opinadores y métricas. No publica ni aprueba gates R. |
| `opinador` | Lee ediciones/noticias habilitadas para opinión o publicadas y crea/edita sus propias opiniones antes del cierre. |
| `public` | Lee únicamente contenido publicado de la web pública y crea postulaciones. |

Supabase Auth gestiona `auth.users`. Las API routes usadas por n8n deben usar service role y bypass de RLS únicamente del lado servidor.

### Helpers esperados para RLS

```sql
-- Staff actual, si existe.
exists (
  select 1
  from public.profiles p
  where p.id = auth.uid()
    and p.activo = true
)

-- Staff con rol específico.
exists (
  select 1
  from public.profiles p
  where p.id = auth.uid()
    and p.activo = true
    and p.role in ('admin', 'editor')
)

-- Opinador actual, si existe.
exists (
  select 1
  from public.opinadores o
  where o.id = auth.uid()
    and o.activo = true
)
```

---

## 2. Tablas principales

```sql
-- Auth y usuarios
auth.users                    -- gestionado por Supabase Auth
profiles                      -- 1:1 con auth.users (datos del staff: admin, editor, director)
opinadores                    -- 1:1 con auth.users (datos del opinador comunitario)

-- Postulaciones (antes de ser opinador aprobado)
postulaciones                 -- nombre, email, telefono, edad, provincia, motivacion, estado
                              -- estado: 'pending' | 'approved' | 'rejected'

-- Ediciones (núcleo del producto)
ediciones                     -- id, fecha (slug dd-mm-yyyy), titulo, portada_url, estado, publicada_en
                              -- estado: 'draft' | 'in_progress' | 'awaiting_review' | 'published'

pipeline_state                -- 1:1 con ediciones, una fila por edición
                              -- status de cada etapa: 'pending' | 'running' | 'done'
                              -- aprobaciones de relevamiento, titulos y portada por staff

noticias                      -- pertenecen a una edición, son las 5 noticias del día
el_pulso_noticia              -- 1:1 con noticias

-- Opiniones (lo que envían los opinadores)
opiniones                     -- opinador_id, noticia_id, texto, sentiment, enviada_en
                              -- sentiment: 'positiva' | 'negativa' | 'incierta'

-- Outputs por canal
publicacion_web               -- 1:1 con ediciones, contiene los 7 slides ordenados
slides_web                    -- pertenecen a publicacion_web
publicacion_instagram         -- 1:1 con ediciones, 4 slides + textos
slides_instagram              -- pertenecen a publicacion_instagram
publicacion_twitter           -- 1:1 con ediciones, 12 hilos
hilos_twitter                 -- pertenecen a publicacion_twitter

-- Operación
fuentes_noticias              -- catálogo configurable de medios fuente
clima_diario                  -- caché del widget de clima por edición + provincia
```

---

## 3. Detalle por tabla

### 3.1 `auth.users`

Tabla gestionada por Supabase Auth. No se crean políticas RLS propias sobre esta tabla desde la app.

**Uso en el modelo**

| Columna | Tipo | Notas |
|---|---|---|
| `id` | `uuid` | PK gestionada por Supabase Auth. Referenciada por `profiles.id` y `opinadores.id`. |
| `email` | `text` | Email de login para staff. En opinadores puede existir solo como dato de contacto. |

**Foreign keys**

No aplica desde `auth.users`; las FKs se definen en tablas públicas hacia `auth.users(id)`.

**Índices**

Gestionados por Supabase Auth.

**RLS**

Gestionado por Supabase Auth. La aplicación valida sesión en server con `supabase.auth.getClaims()`.

---

### 3.2 `profiles`

Staff interno: admin, editor y director.

| Columna | Tipo | Null | Default | Notas |
|---|---:|---:|---:|---|
| `id` | `uuid` | no | - | PK y FK a `auth.users(id)`. |
| `email` | `text` | no | - | Email de login. Único. |
| `nombre` | `text` | no | - | Nombre visible en admin. |
| `role` | `text` | no | - | `admin`, `editor` o `director`. |
| `activo` | `boolean` | no | `true` | Desactiva acceso sin borrar usuario. |
| `created_at` | `timestamptz` | no | `now()` | Alta del perfil. |
| `updated_at` | `timestamptz` | no | `now()` | Última edición. |

**Constraints**

```sql
primary key (id);
unique (email);
check (role in ('admin', 'editor', 'director'));
```

**Foreign keys**

```sql
id references auth.users(id) on delete cascade;
```

**Índices**

| Índice | Columnas | Motivo |
|---|---|---|
| `profiles_pkey` | `id` | PK y lookups por usuario actual. |
| `profiles_email_key` | `email` | Login, invitaciones y gestión de usuarios. |
| `profiles_role_idx` | `role` | Filtros del panel de usuarios y helpers RLS. |
| `profiles_activo_idx` | `activo` | Helpers RLS y listados administrativos. |

**RLS**

| Operación | Política |
|---|---|
| `SELECT` | Staff activo puede leer todos los perfiles. Cada usuario staff puede leer su propio perfil. |
| `INSERT` | Solo `admin`. |
| `UPDATE` | Solo `admin`. El usuario puede actualizar campos no críticos propios mediante Server Action, nunca `role` ni `activo`. |
| `DELETE` | Solo `admin`; preferir `activo = false`. |

---

### 3.3 `opinadores`

Usuarios comunitarios aprobados para votar e interpretar noticias.

| Columna | Tipo | Null | Default | Notas |
|---|---:|---:|---:|---|
| `id` | `uuid` | no | - | PK y FK a `auth.users(id)`. |
| `postulacion_id` | `uuid` | sí | - | Postulación original, si aplica. |
| `numero_usuario` | `integer` | no | - | Identificador de login del opinador. Único. |
| `nombre` | `text` | no | - | Nombre completo. |
| `email` | `text` | no | - | Contacto. Único. |
| `telefono` | `text` | no | - | Teléfono con prefijo. |
| `edad` | `integer` | no | - | Edad declarada al postular. |
| `provincia` | `text` | no | - | Provincia argentina. |
| `activo` | `boolean` | no | `true` | Habilita/deshabilita participación. |
| `ingreso_en` | `timestamptz` | no | `now()` | Fecha de aprobación/alta. |
| `created_at` | `timestamptz` | no | `now()` | Alta del registro. |
| `updated_at` | `timestamptz` | no | `now()` | Última edición. |

**Constraints**

```sql
primary key (id);
unique (numero_usuario);
unique (email);
check (edad >= 13);
```

**Foreign keys**

```sql
id references auth.users(id) on delete cascade;
postulacion_id references public.postulaciones(id) on delete set null;
```

**Índices**

| Índice | Columnas | Motivo |
|---|---|---|
| `opinadores_pkey` | `id` | PK y lookups del usuario actual. |
| `opinadores_numero_usuario_key` | `numero_usuario` | Login de opinadores. |
| `opinadores_email_key` | `email` | Gestión administrativa y deduplicación. |
| `opinadores_activo_idx` | `activo` | Listados de activos/inactivos y helpers RLS. |
| `opinadores_provincia_idx` | `provincia` | Métricas por provincia. |

**RLS**

| Operación | Política |
|---|---|
| `SELECT` | Staff activo puede leer todos. Cada opinador puede leer su propio registro. |
| `INSERT` | Solo `admin` y `editor`, normalmente al aprobar una postulación. |
| `UPDATE` | `admin` y `editor` pueden gestionar todos. Cada opinador puede actualizar datos propios no críticos mediante Server Action. |
| `DELETE` | Solo `admin`; preferir `activo = false`. |

---

### 3.4 `postulaciones`

Formulario público previo a convertirse en opinador.

| Columna | Tipo | Null | Default | Notas |
|---|---:|---:|---:|---|
| `id` | `uuid` | no | `gen_random_uuid()` | PK. |
| `nombre` | `text` | no | - | Nombre completo. |
| `email` | `text` | no | - | Email de contacto. |
| `telefono` | `text` | no | - | Teléfono con prefijo. |
| `edad` | `integer` | no | - | Edad declarada. |
| `provincia` | `text` | no | - | Provincia argentina. |
| `motivacion` | `text` | no | - | Respuesta abierta. |
| `estado` | `text` | no | `'pending'` | `pending`, `approved` o `rejected`. |
| `revisada_por` | `uuid` | sí | - | Staff que revisó. |
| `revisada_en` | `timestamptz` | sí | - | Fecha de revisión. |
| `created_at` | `timestamptz` | no | `now()` | Fecha de postulación. |
| `updated_at` | `timestamptz` | no | `now()` | Última edición. |

**Constraints**

```sql
primary key (id);
check (estado in ('pending', 'approved', 'rejected'));
check (edad >= 13);
```

**Foreign keys**

```sql
revisada_por references public.profiles(id) on delete set null;
```

**Índices**

| Índice | Columnas | Motivo |
|---|---|---|
| `postulaciones_pkey` | `id` | PK. |
| `postulaciones_estado_idx` | `estado` | Tabs de pendientes/aprobadas/rechazadas. |
| `postulaciones_email_idx` | `email` | Búsqueda y deduplicación. |
| `postulaciones_created_at_idx` | `created_at desc` | Orden de revisión. |
| `postulaciones_revisada_por_idx` | `revisada_por` | Auditoría por staff. |

**RLS**

| Operación | Política |
|---|---|
| `SELECT` | Solo staff activo. |
| `INSERT` | Público (`anon` y `authenticated`) puede crear postulaciones nuevas con `estado = 'pending'`. |
| `UPDATE` | Solo `admin`, `editor` y `director` para revisión. |
| `DELETE` | Solo `admin`. |

---

### 3.5 `ediciones`

Núcleo editorial diario.

| Columna | Tipo | Null | Default | Notas |
|---|---:|---:|---:|---|
| `id` | `uuid` | no | `gen_random_uuid()` | PK. |
| `fecha` | `text` | no | - | Slug `dd-mm-yyyy`. Único. |
| `titulo` | `text` | no | - | Título editorial, ej. `Equilibrio ciego`. |
| `bajada` | `text` | sí | - | Resumen corto opcional. |
| `portada_url` | `text` | sí | - | Imagen principal. |
| `estado` | `text` | no | `'draft'` | `draft`, `in_progress`, `awaiting_review`, `published`. |
| `publicada_en` | `timestamptz` | sí | - | Fecha/hora de publicación web. |
| `created_by` | `uuid` | sí | - | Staff que creó la edición. |
| `created_at` | `timestamptz` | no | `now()` | Alta. |
| `updated_at` | `timestamptz` | no | `now()` | Última edición. |

**Constraints**

```sql
primary key (id);
unique (fecha);
check (fecha ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}$');
check (estado in ('draft', 'in_progress', 'awaiting_review', 'published'));
```

**Foreign keys**

```sql
created_by references public.profiles(id) on delete set null;
```

**Índices**

| Índice | Columnas | Motivo |
|---|---|---|
| `ediciones_pkey` | `id` | PK. |
| `ediciones_fecha_key` | `fecha` | Ruta pública `/edicion/[fecha]`. |
| `ediciones_estado_idx` | `estado` | Listados admin y filtros públicos. |
| `ediciones_publicada_en_idx` | `publicada_en desc` | Archivo histórico y última edición publicada. |
| `ediciones_created_by_idx` | `created_by` | Auditoría. |

**RLS**

| Operación | Política |
|---|---|
| `SELECT` | Público puede leer solo `estado = 'published'`. Staff activo puede leer todas. Opinadores activos pueden leer publicadas y la edición habilitada para opinión. |
| `INSERT` | Solo `admin` y `editor`. |
| `UPDATE` | Solo `admin` y `editor`. `director` no puede publicar ni cambiar estado vía RLS/Server Action. |
| `DELETE` | Solo `admin`; preferir archivar por estado si se agrega ese flujo. |

---

### 3.6 `pipeline_state`

Estado operativo del pipeline para una edición. Relación 1:1 con `ediciones`.

| Columna | Tipo | Null | Default | Notas |
|---|---:|---:|---:|---|
| `id` | `uuid` | no | `gen_random_uuid()` | PK. |
| `edicion_id` | `uuid` | no | - | Edición asociada. Único. |
| `relevamiento_status` | `text` | no | `'pending'` | `pending`, `running`, `done`. |
| `titulos_status` | `text` | no | `'pending'` | `pending`, `running`, `done`. |
| `portada_status` | `text` | no | `'pending'` | `pending`, `running`, `done`. |
| `ventana_opinion_status` | `text` | no | `'pending'` | `pending`, `running`, `done`. |
| `el_pulso_status` | `text` | no | `'pending'` | `pending`, `running`, `done`. |
| `web_status` | `text` | no | `'pending'` | `pending`, `running`, `done`. |
| `instagram_status` | `text` | no | `'pending'` | `pending`, `running`, `done`. |
| `twitter_status` | `text` | no | `'pending'` | `pending`, `running`, `done`. |
| `publicacion_status` | `text` | no | `'pending'` | `pending`, `running`, `done`. |
| `relevamiento_aprobado_por` | `uuid` | sí | - | Staff que aprobó gate R. |
| `relevamiento_aprobado_en` | `timestamptz` | sí | - | Fecha de aprobación. |
| `titulos_aprobado_por` | `uuid` | sí | - | Staff que aprobó gate R. |
| `titulos_aprobado_en` | `timestamptz` | sí | - | Fecha de aprobación. |
| `portada_aprobado_por` | `uuid` | sí | - | Staff que aprobó gate R. |
| `portada_aprobado_en` | `timestamptz` | sí | - | Fecha de aprobación. |
| `created_at` | `timestamptz` | no | `now()` | Alta. |
| `updated_at` | `timestamptz` | no | `now()` | Última edición. |

**Constraints**

```sql
primary key (id);
unique (edicion_id);
check (relevamiento_status in ('pending', 'running', 'done'));
check (titulos_status in ('pending', 'running', 'done'));
check (portada_status in ('pending', 'running', 'done'));
check (ventana_opinion_status in ('pending', 'running', 'done'));
check (el_pulso_status in ('pending', 'running', 'done'));
check (web_status in ('pending', 'running', 'done'));
check (instagram_status in ('pending', 'running', 'done'));
check (twitter_status in ('pending', 'running', 'done'));
check (publicacion_status in ('pending', 'running', 'done'));
```

**Foreign keys**

```sql
edicion_id references public.ediciones(id) on delete cascade;
relevamiento_aprobado_por references public.profiles(id) on delete set null;
titulos_aprobado_por references public.profiles(id) on delete set null;
portada_aprobado_por references public.profiles(id) on delete set null;
```

**Índices**

| Índice | Columnas | Motivo |
|---|---|---|
| `pipeline_state_pkey` | `id` | PK. |
| `pipeline_state_edicion_id_key` | `edicion_id` | Relación 1:1 y render del pipeline. |
| `pipeline_state_publicacion_status_idx` | `publicacion_status` | Monitoreo de publicación. |
| `pipeline_state_ventana_opinion_status_idx` | `ventana_opinion_status` | Portal de opinadores. |

**RLS**

| Operación | Política |
|---|---|
| `SELECT` | Staff activo puede leer todos. Opinadores activos pueden leer solo estados de ediciones habilitadas para opinión o publicadas si la UI lo necesita. Público no lee esta tabla directamente. |
| `INSERT` | Solo `admin` y `editor`. |
| `UPDATE` | Solo `admin` y `editor`. `director` no actualiza gates ni publicación. |
| `DELETE` | Solo `admin`. |

---

### 3.7 `noticias`

Cinco noticias principales de cada edición.

| Columna | Tipo | Null | Default | Notas |
|---|---:|---:|---:|---|
| `id` | `uuid` | no | `gen_random_uuid()` | PK. |
| `edicion_id` | `uuid` | no | - | Edición dueña. |
| `orden` | `integer` | no | - | Posición 1 a 5. |
| `titulo` | `text` | no | - | Título de noticia. |
| `cuerpo` | `text` | no | - | Texto completo. |
| `fuentes_urls` | `text[]` | no | `'{}'` | URLs fuente usadas por IA/editor. |
| `metadata` | `jsonb` | no | `'{}'::jsonb` | Datos auxiliares de pipeline. |
| `created_at` | `timestamptz` | no | `now()` | Alta. |
| `updated_at` | `timestamptz` | no | `now()` | Última edición. |

**Constraints**

```sql
primary key (id);
unique (edicion_id, orden);
check (orden between 1 and 5);
```

**Foreign keys**

```sql
edicion_id references public.ediciones(id) on delete cascade;
```

**Índices**

| Índice | Columnas | Motivo |
|---|---|---|
| `noticias_pkey` | `id` | PK. |
| `noticias_edicion_orden_key` | `edicion_id, orden` | Render ordenado de la edición. |
| `noticias_edicion_id_idx` | `edicion_id` | Join frecuente con edición. |
| `noticias_fuentes_urls_gin_idx` | `fuentes_urls` con `gin` | Búsqueda/auditoría por fuente URL. |
| `noticias_metadata_gin_idx` | `metadata` con `gin` | Consultas operativas sobre metadatos. |

**RLS**

| Operación | Política |
|---|---|
| `SELECT` | Público puede leer noticias de ediciones publicadas. Staff activo puede leer todas. Opinadores activos pueden leer noticias de ediciones habilitadas para opinión o publicadas. |
| `INSERT` | Solo `admin` y `editor`. |
| `UPDATE` | Solo `admin` y `editor`. |
| `DELETE` | Solo `admin` y `editor`. |

---

### 3.8 `el_pulso_noticia`

Resumen agregado de opiniones por noticia.

| Columna | Tipo | Null | Default | Notas |
|---|---:|---:|---:|---|
| `id` | `uuid` | no | `gen_random_uuid()` | PK. |
| `noticia_id` | `uuid` | no | - | Noticia asociada. Única. |
| `texto_resumen` | `text` | no | - | Interpretación editorial agregada. |
| `pct_positiva` | `integer` | no | `0` | Porcentaje 0 a 100. |
| `pct_negativa` | `integer` | no | `0` | Porcentaje 0 a 100. |
| `pct_incierta` | `integer` | no | `0` | Porcentaje 0 a 100. |
| `total_opiniones` | `integer` | no | `0` | Base de cálculo. |
| `generated_at` | `timestamptz` | sí | - | Momento de generación. |
| `created_at` | `timestamptz` | no | `now()` | Alta. |
| `updated_at` | `timestamptz` | no | `now()` | Última edición. |

**Constraints**

```sql
primary key (id);
unique (noticia_id);
check (pct_positiva between 0 and 100);
check (pct_negativa between 0 and 100);
check (pct_incierta between 0 and 100);
check (total_opiniones >= 0);
```

**Foreign keys**

```sql
noticia_id references public.noticias(id) on delete cascade;
```

**Índices**

| Índice | Columnas | Motivo |
|---|---|---|
| `el_pulso_noticia_pkey` | `id` | PK. |
| `el_pulso_noticia_noticia_id_key` | `noticia_id` | Relación 1:1. |
| `el_pulso_noticia_generated_at_idx` | `generated_at desc` | Auditoría de generación. |

**RLS**

| Operación | Política |
|---|---|
| `SELECT` | Público puede leer pulsos de noticias publicadas. Staff activo puede leer todos. Opinadores activos pueden leer pulsos de ediciones publicadas. |
| `INSERT` | Solo `admin` y `editor`; n8n vía service role. |
| `UPDATE` | Solo `admin` y `editor`; n8n vía service role. |
| `DELETE` | Solo `admin`. |

---

### 3.9 `opiniones`

Opiniones enviadas por opinadores sobre noticias.

| Columna | Tipo | Null | Default | Notas |
|---|---:|---:|---:|---|
| `id` | `uuid` | no | `gen_random_uuid()` | PK. |
| `opinador_id` | `uuid` | no | - | Opinador autor. |
| `noticia_id` | `uuid` | no | - | Noticia opinada. |
| `texto` | `text` | no | - | Opinión escrita. |
| `sentiment` | `text` | no | - | `positiva`, `negativa` o `incierta`. |
| `enviada_en` | `timestamptz` | no | `now()` | Fecha de envío. |
| `updated_at` | `timestamptz` | no | `now()` | Última edición antes del cierre. |

**Constraints**

```sql
primary key (id);
unique (opinador_id, noticia_id);
check (sentiment in ('positiva', 'negativa', 'incierta'));
check (length(trim(texto)) > 0);
```

**Foreign keys**

```sql
opinador_id references public.opinadores(id) on delete cascade;
noticia_id references public.noticias(id) on delete cascade;
```

**Índices**

| Índice | Columnas | Motivo |
|---|---|---|
| `opiniones_pkey` | `id` | PK. |
| `opiniones_opinador_noticia_key` | `opinador_id, noticia_id` | Evita doble voto por noticia. |
| `opiniones_noticia_id_idx` | `noticia_id` | Agregación de El Pulso. |
| `opiniones_opinador_id_idx` | `opinador_id` | Historial del opinador. |
| `opiniones_sentiment_idx` | `sentiment` | Métricas/agregados por sentimiento. |
| `opiniones_enviada_en_idx` | `enviada_en desc` | Métricas temporales. |

**RLS**

| Operación | Política |
|---|---|
| `SELECT` | Staff activo puede leer todas. Cada opinador puede leer sus propias opiniones. Público no lee opiniones individuales. |
| `INSERT` | Opinadores activos pueden insertar solo con `opinador_id = auth.uid()` y sobre noticias habilitadas para opinión. |
| `UPDATE` | Opinadores activos pueden actualizar solo sus propias opiniones mientras la ventana de opinión esté abierta. Staff no edita contenido de opinión salvo moderación mediante flujo dedicado. |
| `DELETE` | Solo `admin`. Opinadores no eliminan; pueden editar antes del cierre. |

---

### 3.10 `publicacion_web`

Publicación web final de una edición. Relación 1:1 con `ediciones`.

| Columna | Tipo | Null | Default | Notas |
|---|---:|---:|---:|---|
| `id` | `uuid` | no | `gen_random_uuid()` | PK. |
| `edicion_id` | `uuid` | no | - | Edición asociada. Única. |
| `titulo` | `text` | no | - | Título de publicación. |
| `estado` | `text` | no | `'draft'` | `draft`, `ready`, `published`. |
| `published_at` | `timestamptz` | sí | - | Publicación web. |
| `metadata` | `jsonb` | no | `'{}'::jsonb` | Datos auxiliares. |
| `created_at` | `timestamptz` | no | `now()` | Alta. |
| `updated_at` | `timestamptz` | no | `now()` | Última edición. |

**Constraints**

```sql
primary key (id);
unique (edicion_id);
check (estado in ('draft', 'ready', 'published'));
```

**Foreign keys**

```sql
edicion_id references public.ediciones(id) on delete cascade;
```

**Índices**

| Índice | Columnas | Motivo |
|---|---|---|
| `publicacion_web_pkey` | `id` | PK. |
| `publicacion_web_edicion_id_key` | `edicion_id` | Relación 1:1. |
| `publicacion_web_estado_idx` | `estado` | Filtros de publicación. |
| `publicacion_web_published_at_idx` | `published_at desc` | Archivo público. |

**RLS**

| Operación | Política |
|---|---|
| `SELECT` | Público puede leer publicaciones con `estado = 'published'` y edición publicada. Staff activo puede leer todas. |
| `INSERT` | Solo `admin` y `editor`; n8n vía service role. |
| `UPDATE` | Solo `admin` y `editor`; publicar requiere Server Action. |
| `DELETE` | Solo `admin`. |

---

### 3.11 `slides_web`

Slides ordenados de la publicación web.

| Columna | Tipo | Null | Default | Notas |
|---|---:|---:|---:|---|
| `id` | `uuid` | no | `gen_random_uuid()` | PK. |
| `publicacion_web_id` | `uuid` | no | - | Publicación dueña. |
| `orden` | `integer` | no | - | Posición 1 a 7. |
| `tipo` | `text` | no | - | `portada`, `noticia`, `el_pulso`, `clima` u otro tipo futuro. |
| `titulo` | `text` | sí | - | Título del slide. |
| `cuerpo` | `text` | sí | - | Texto principal. |
| `imagen_url` | `text` | sí | - | Imagen renderizada/asociada. |
| `payload` | `jsonb` | no | `'{}'::jsonb` | Estructura flexible por tipo de slide. |
| `created_at` | `timestamptz` | no | `now()` | Alta. |
| `updated_at` | `timestamptz` | no | `now()` | Última edición. |

**Constraints**

```sql
primary key (id);
unique (publicacion_web_id, orden);
check (orden between 1 and 7);
```

**Foreign keys**

```sql
publicacion_web_id references public.publicacion_web(id) on delete cascade;
```

**Índices**

| Índice | Columnas | Motivo |
|---|---|---|
| `slides_web_pkey` | `id` | PK. |
| `slides_web_publicacion_orden_key` | `publicacion_web_id, orden` | Render ordenado. |
| `slides_web_publicacion_web_id_idx` | `publicacion_web_id` | Join con publicación. |
| `slides_web_payload_gin_idx` | `payload` con `gin` | Búsqueda operativa sobre estructura flexible. |

**RLS**

| Operación | Política |
|---|---|
| `SELECT` | Público puede leer slides de publicaciones web publicadas. Staff activo puede leer todos. |
| `INSERT` | Solo `admin` y `editor`; n8n vía service role. |
| `UPDATE` | Solo `admin` y `editor`. |
| `DELETE` | Solo `admin` y `editor`. |

---

### 3.12 `publicacion_instagram`

Output manual para Instagram.

| Columna | Tipo | Null | Default | Notas |
|---|---:|---:|---:|---|
| `id` | `uuid` | no | `gen_random_uuid()` | PK. |
| `edicion_id` | `uuid` | no | - | Edición asociada. Única. |
| `caption` | `text` | sí | - | Texto sugerido para post. |
| `estado` | `text` | no | `'draft'` | `draft`, `ready`, `published_manual`. |
| `published_manual_at` | `timestamptz` | sí | - | Registro manual de publicación. |
| `metadata` | `jsonb` | no | `'{}'::jsonb` | Datos auxiliares. |
| `created_at` | `timestamptz` | no | `now()` | Alta. |
| `updated_at` | `timestamptz` | no | `now()` | Última edición. |

**Constraints**

```sql
primary key (id);
unique (edicion_id);
check (estado in ('draft', 'ready', 'published_manual'));
```

**Foreign keys**

```sql
edicion_id references public.ediciones(id) on delete cascade;
```

**Índices**

| Índice | Columnas | Motivo |
|---|---|---|
| `publicacion_instagram_pkey` | `id` | PK. |
| `publicacion_instagram_edicion_id_key` | `edicion_id` | Relación 1:1. |
| `publicacion_instagram_estado_idx` | `estado` | Panel editorial. |

**RLS**

| Operación | Política |
|---|---|
| `SELECT` | Solo staff activo. No es público porque Instagram se publica manualmente fuera de la web. |
| `INSERT` | Solo `admin` y `editor`; n8n vía service role. |
| `UPDATE` | Solo `admin` y `editor`. |
| `DELETE` | Solo `admin`. |

---

### 3.13 `slides_instagram`

Slides del carrusel de Instagram.

| Columna | Tipo | Null | Default | Notas |
|---|---:|---:|---:|---|
| `id` | `uuid` | no | `gen_random_uuid()` | PK. |
| `publicacion_instagram_id` | `uuid` | no | - | Publicación dueña. |
| `orden` | `integer` | no | - | Posición 1 a 4. |
| `texto` | `text` | sí | - | Copy del slide. |
| `imagen_url` | `text` | sí | - | Imagen final o candidata. |
| `payload` | `jsonb` | no | `'{}'::jsonb` | Datos flexibles de composición. |
| `created_at` | `timestamptz` | no | `now()` | Alta. |
| `updated_at` | `timestamptz` | no | `now()` | Última edición. |

**Constraints**

```sql
primary key (id);
unique (publicacion_instagram_id, orden);
check (orden between 1 and 4);
```

**Foreign keys**

```sql
publicacion_instagram_id references public.publicacion_instagram(id) on delete cascade;
```

**Índices**

| Índice | Columnas | Motivo |
|---|---|---|
| `slides_instagram_pkey` | `id` | PK. |
| `slides_instagram_publicacion_orden_key` | `publicacion_instagram_id, orden` | Render ordenado. |
| `slides_instagram_publicacion_instagram_id_idx` | `publicacion_instagram_id` | Join con publicación. |
| `slides_instagram_payload_gin_idx` | `payload` con `gin` | Búsqueda operativa. |

**RLS**

| Operación | Política |
|---|---|
| `SELECT` | Solo staff activo. |
| `INSERT` | Solo `admin` y `editor`; n8n vía service role. |
| `UPDATE` | Solo `admin` y `editor`. |
| `DELETE` | Solo `admin` y `editor`. |

---

### 3.14 `publicacion_twitter`

Output manual para X/Twitter.

| Columna | Tipo | Null | Default | Notas |
|---|---:|---:|---:|---|
| `id` | `uuid` | no | `gen_random_uuid()` | PK. |
| `edicion_id` | `uuid` | no | - | Edición asociada. Única. |
| `estado` | `text` | no | `'draft'` | `draft`, `ready`, `published_manual`. |
| `published_manual_at` | `timestamptz` | sí | - | Registro manual de publicación. |
| `metadata` | `jsonb` | no | `'{}'::jsonb` | Datos auxiliares. |
| `created_at` | `timestamptz` | no | `now()` | Alta. |
| `updated_at` | `timestamptz` | no | `now()` | Última edición. |

**Constraints**

```sql
primary key (id);
unique (edicion_id);
check (estado in ('draft', 'ready', 'published_manual'));
```

**Foreign keys**

```sql
edicion_id references public.ediciones(id) on delete cascade;
```

**Índices**

| Índice | Columnas | Motivo |
|---|---|---|
| `publicacion_twitter_pkey` | `id` | PK. |
| `publicacion_twitter_edicion_id_key` | `edicion_id` | Relación 1:1. |
| `publicacion_twitter_estado_idx` | `estado` | Panel editorial. |

**RLS**

| Operación | Política |
|---|---|
| `SELECT` | Solo staff activo. |
| `INSERT` | Solo `admin` y `editor`; n8n vía service role. |
| `UPDATE` | Solo `admin` y `editor`. |
| `DELETE` | Solo `admin`. |

---

### 3.15 `hilos_twitter`

Hilos/tweets ordenados para X/Twitter.

| Columna | Tipo | Null | Default | Notas |
|---|---:|---:|---:|---|
| `id` | `uuid` | no | `gen_random_uuid()` | PK. |
| `publicacion_twitter_id` | `uuid` | no | - | Publicación dueña. |
| `orden` | `integer` | no | - | Posición 1 a 12. |
| `texto` | `text` | no | - | Texto del tweet/hilo. |
| `imagen_url` | `text` | sí | - | Imagen opcional. |
| `payload` | `jsonb` | no | `'{}'::jsonb` | Datos flexibles. |
| `created_at` | `timestamptz` | no | `now()` | Alta. |
| `updated_at` | `timestamptz` | no | `now()` | Última edición. |

**Constraints**

```sql
primary key (id);
unique (publicacion_twitter_id, orden);
check (orden between 1 and 12);
```

**Foreign keys**

```sql
publicacion_twitter_id references public.publicacion_twitter(id) on delete cascade;
```

**Índices**

| Índice | Columnas | Motivo |
|---|---|---|
| `hilos_twitter_pkey` | `id` | PK. |
| `hilos_twitter_publicacion_orden_key` | `publicacion_twitter_id, orden` | Render ordenado. |
| `hilos_twitter_publicacion_twitter_id_idx` | `publicacion_twitter_id` | Join con publicación. |
| `hilos_twitter_payload_gin_idx` | `payload` con `gin` | Búsqueda operativa. |

**RLS**

| Operación | Política |
|---|---|
| `SELECT` | Solo staff activo. |
| `INSERT` | Solo `admin` y `editor`; n8n vía service role. |
| `UPDATE` | Solo `admin` y `editor`. |
| `DELETE` | Solo `admin` y `editor`. |

---

### 3.16 `fuentes_noticias`

Catálogo configurable de medios fuente.

| Columna | Tipo | Null | Default | Notas |
|---|---:|---:|---:|---|
| `id` | `uuid` | no | `gen_random_uuid()` | PK. |
| `nombre` | `text` | no | - | Nombre del medio. |
| `url` | `text` | no | - | Sitio principal. Único. |
| `rss_url` | `text` | sí | - | Feed RSS si existe. |
| `tipo` | `text` | no | `'medio'` | `medio`, `agencia`, `oficial`, `otro`. |
| `activa` | `boolean` | no | `true` | Disponible para relevamiento. |
| `prioridad` | `integer` | no | `100` | Menor número = mayor prioridad. |
| `metadata` | `jsonb` | no | `'{}'::jsonb` | Configuración por fuente. |
| `created_at` | `timestamptz` | no | `now()` | Alta. |
| `updated_at` | `timestamptz` | no | `now()` | Última edición. |

**Constraints**

```sql
primary key (id);
unique (url);
check (tipo in ('medio', 'agencia', 'oficial', 'otro'));
check (prioridad >= 0);
```

**Foreign keys**

No tiene foreign keys.

**Índices**

| Índice | Columnas | Motivo |
|---|---|---|
| `fuentes_noticias_pkey` | `id` | PK. |
| `fuentes_noticias_url_key` | `url` | Deduplicación. |
| `fuentes_noticias_activa_idx` | `activa` | Relevamiento solo de fuentes activas. |
| `fuentes_noticias_prioridad_idx` | `prioridad asc` | Orden de procesamiento. |
| `fuentes_noticias_metadata_gin_idx` | `metadata` con `gin` | Configuración flexible. |

**RLS**

| Operación | Política |
|---|---|
| `SELECT` | Staff activo puede leer todas. n8n vía service role. Público y opinadores no leen esta tabla. |
| `INSERT` | Solo `admin` y `editor`. |
| `UPDATE` | Solo `admin` y `editor`. |
| `DELETE` | Solo `admin`; preferir `activa = false`. |

---

### 3.17 `clima_diario`

Caché del widget de clima por edición y provincia.

| Columna | Tipo | Null | Default | Notas |
|---|---:|---:|---:|---|
| `id` | `uuid` | no | `gen_random_uuid()` | PK. |
| `edicion_id` | `uuid` | no | - | Edición asociada. |
| `provincia` | `text` | no | - | Provincia seleccionable. |
| `fecha` | `date` | no | - | Día del pronóstico. |
| `temperatura_min` | `integer` | sí | - | Mínima en Celsius. |
| `temperatura_max` | `integer` | sí | - | Máxima en Celsius. |
| `condicion` | `text` | sí | - | Texto normalizado de clima. |
| `icono` | `text` | sí | - | Código de ícono/ilustración. |
| `payload` | `jsonb` | no | `'{}'::jsonb` | Respuesta original normalizada. |
| `expires_at` | `timestamptz` | sí | - | Vencimiento de caché. |
| `created_at` | `timestamptz` | no | `now()` | Alta. |
| `updated_at` | `timestamptz` | no | `now()` | Última edición. |

**Constraints**

```sql
primary key (id);
unique (edicion_id, provincia, fecha);
```

**Foreign keys**

```sql
edicion_id references public.ediciones(id) on delete cascade;
```

**Índices**

| Índice | Columnas | Motivo |
|---|---|---|
| `clima_diario_pkey` | `id` | PK. |
| `clima_diario_edicion_provincia_fecha_key` | `edicion_id, provincia, fecha` | Caché por edición/provincia/día. |
| `clima_diario_edicion_id_idx` | `edicion_id` | Join con edición. |
| `clima_diario_provincia_idx` | `provincia` | Selector de provincia. |
| `clima_diario_expires_at_idx` | `expires_at` | Limpieza/refresco de caché. |
| `clima_diario_payload_gin_idx` | `payload` con `gin` | Auditoría de respuesta externa. |

**RLS**

| Operación | Política |
|---|---|
| `SELECT` | Público puede leer clima de ediciones publicadas. Staff activo puede leer todo. Opinadores activos pueden leer clima de ediciones habilitadas para opinión o publicadas. |
| `INSERT` | Solo `admin` y `editor`; n8n/API server vía service role. |
| `UPDATE` | Solo `admin` y `editor`; n8n/API server vía service role. |
| `DELETE` | Solo `admin` y `editor` para limpieza de caché. |

---

## 4. Relaciones principales

| Relación | Cardinalidad | FK |
|---|---:|---|
| `profiles` -> `auth.users` | 1:1 | `profiles.id references auth.users(id)` |
| `opinadores` -> `auth.users` | 1:1 | `opinadores.id references auth.users(id)` |
| `opinadores` -> `postulaciones` | 0/1:1 | `opinadores.postulacion_id references postulaciones(id)` |
| `postulaciones` -> `profiles` | N:1 | `postulaciones.revisada_por references profiles(id)` |
| `ediciones` -> `profiles` | N:1 | `ediciones.created_by references profiles(id)` |
| `pipeline_state` -> `ediciones` | 1:1 | `pipeline_state.edicion_id references ediciones(id)` |
| `noticias` -> `ediciones` | N:1 | `noticias.edicion_id references ediciones(id)` |
| `el_pulso_noticia` -> `noticias` | 1:1 | `el_pulso_noticia.noticia_id references noticias(id)` |
| `opiniones` -> `opinadores` | N:1 | `opiniones.opinador_id references opinadores(id)` |
| `opiniones` -> `noticias` | N:1 | `opiniones.noticia_id references noticias(id)` |
| `publicacion_web` -> `ediciones` | 1:1 | `publicacion_web.edicion_id references ediciones(id)` |
| `slides_web` -> `publicacion_web` | N:1 | `slides_web.publicacion_web_id references publicacion_web(id)` |
| `publicacion_instagram` -> `ediciones` | 1:1 | `publicacion_instagram.edicion_id references ediciones(id)` |
| `slides_instagram` -> `publicacion_instagram` | N:1 | `slides_instagram.publicacion_instagram_id references publicacion_instagram(id)` |
| `publicacion_twitter` -> `ediciones` | 1:1 | `publicacion_twitter.edicion_id references ediciones(id)` |
| `hilos_twitter` -> `publicacion_twitter` | N:1 | `hilos_twitter.publicacion_twitter_id references publicacion_twitter(id)` |
| `clima_diario` -> `ediciones` | N:1 | `clima_diario.edicion_id references ediciones(id)` |

---

## 5. Reglas de RLS transversales

1. Todas las tablas públicas deben tener RLS habilitado: `alter table public.<tabla> enable row level security;`.
2. Las lecturas públicas se limitan a contenido de ediciones con `estado = 'published'`.
3. Los opinadores solo pueden insertar opiniones propias: `opinador_id = auth.uid()`.
4. Las operaciones de n8n se ejecutan desde API routes server-side con service role, nunca desde cliente.
5. Las restricciones finas de negocio, como impedir que `director` publique o que un opinador edite después del cierre, deben duplicarse en Server Actions además de RLS.
6. No usar `localStorage` ni `sessionStorage` para auth; Supabase SSR maneja cookies.
