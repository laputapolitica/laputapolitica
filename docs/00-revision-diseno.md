# Revisión de diseño — La Puta Política

> Documento maestro generado a partir del análisis de las 57 pantallas del proyecto. Vive en `docs/` del repo. Codex lo consulta cuando construye cualquier feature. Es la fuente de verdad sobre qué construir y en qué orden.

---

## 1. Universo de pantallas

| Universo | Cantidad | Plataforma |
|---|---|---|
| Web pública | 12 | Mobile + Desktop responsive |
| Portal opinadores | 14 | Mobile + Desktop responsive |
| Admin | 31 | Desktop only (1440px) |
| **Total** | **57** | |

Las pantallas pendientes de diseñar (4 adaptaciones mobile de El Pulso) no están incluidas en este conteo. Se construirán en código directo con los SVGs que existan al momento de implementación, replicando los patrones de las versiones desktop.

---

## 2. Identidad visual

### Colores

```
bg/base           #FAF9F5    fondo principal
bg/card           #FFFFFF    superficies elevadas
text/primary      #1A1A1A    texto editorial principal
text/secondary    #6B6B6B    texto secundario
text/muted        #999999    deshabilitado, hints
border/default    #E5E3DD    bordes y separadores
vote/positive     #A8D5BA    voto a favor
vote/negative     #E6A8A1    voto en contra
vote/uncertain    #C7C3E6    voto incierto
state/pending     #F5C842    pendiente de revisión (amarillo)
state/required    #E85A4F    requiere atención (rojo R)
state/done        #A8D5BA    completado (verde)
state/danger      #DC2626    cerrar sesión, eliminar
accent/ink        #000000    linework editorial
```

### Tipografías

```
font-display     Playfair Display     títulos hero, portadas, identidad editorial
font-heading     Playfair Display     H1, H2 de pantalla
font-editorial   Libre Baskerville    cuerpos largos, citas, contenido de noticias
font-ui          Inter                botones, navs, inputs, labels, body de UI
```

Cargadas via `next/font/google` con variables CSS `--font-display`, `--font-editorial`, `--font-ui`.

### Sistema de espaciados

Múltiplos de 4. Los estándares del proyecto:

```
4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 128
```

Margen exterior del admin: **48px**. Separación entre sidebar y contenido: **48px**. Estos dos valores son inviolables.

---

## 3. Inventario de componentes

Componentes que aparecen en múltiples pantallas y conviene aislar como reusables. Total: **23 componentes core**.

### 3.1 Componentes globales (todos los portales)

| Componente | Dónde aparece | Notas |
|---|---|---|
| `<Logo />` | Todas las pantallas | Versión "LPP" gótico chico (header) y "La Puta Política" gótico grande (web pública) |
| `<CountrySelector />` | Todas | Por ahora solo "AR" deshabilitado, preparado para multi-país |
| `<AdminBadge />` | Solo zona admin | Pill negro con texto "ADMIN" |
| `<ElPulsoLogo />` | Todas las zonas | Logo con onda de electrocardiograma verde |

### 3.2 Componentes de la web pública

| Componente | Dónde aparece | Notas |
|---|---|---|
| `<EdicionLayout />` | Vista del día (mobile + desktop) | Wrapper que contiene navegación lateral + contenido |
| `<NoticiaCard />` | Vista del día | Tiene 2 modos: `collapsed` (con barras % y botón "Leer más") y `expanded` (modal con texto completo) |
| `<NoticiaModal />` | Click en "Leer más" | Wrapper de modal con close button "Cerrar" |
| `<FechaSelector />` | Click en chip de fecha | Slider de 3 niveles: día / mes / año, navegable con flechas |
| `<ClimaWidget />` | Última sección de portada | Selector de provincia + 3 días pronóstico con ilustración + temps |
| `<NavegacionLateral />` | Web pública mobile + desktop | Lista numerada 01-07 que indica sección actual |
| `<PortadaIllustracion />` | Slide 01 de cada edición | Imagen cuadrada centrada con título de edición |
| `<InterpretacionBars />` | NoticiaCard | Barras horizontales con %s positiva/negativa/incierta |

### 3.3 Componentes del portal de opinadores

| Componente | Dónde aparece | Notas |
|---|---|---|
| `<OnboardingSlide />` | 4 slides previos a postulación | Con título, ilustración acuarela, copy y paginación X/04 |
| `<AuthFormOpinadores />` | Login mobile y desktop | Campos: número de usuario + contraseña |
| `<PostulacionForm />` | Pantalla de postulación | Nombre, email, teléfono (+54), edad, provincia, motivación |
| `<OpinionForm />` | Vista del día | Textarea + 3 radio buttons (Positiva/Negativa/Incierta) + botón "Enviar opinión" |
| `<NoticiaSwiper />` | Vista del día | Navegación horizontal "Noticia 01/05" con flechas |
| `<TimerCierre />` | Header del portal | Cuenta regresiva en rojo "Cierre: 01:36:15" |

### 3.4 Componentes del admin

| Componente | Dónde aparece | Notas |
|---|---|---|
| `<SidebarAdmin />` | Todas las pantallas admin | 5 ítems, sin bordes redondeados, item activo con fondo negro |
| `<PipelineDiagram />` | Edición del día + Lista de ediciones | Diagrama de estado en tiempo real con nodos y gates de revisión |
| `<NodeStatus />` | Dentro de PipelineDiagram | Punto: gris/amarillo/verde + R roja/verde |
| `<EditableAIBlock />` | Editores Web/IG/X | Bloque de texto con 3 botones: Editar / Rehacer / Copiar |
| `<DataTable />` | Opinadores, Usuarios, Lista de ediciones | Filas con datos + acciones a la derecha |
| `<MetricCard />` | Métricas | Card con label, número grande y subtítulo |
| `<ChartBar />` y `<ChartLine />` | Métricas | Gráficos con Recharts |
| `<TabSwitcher />` | Edición del día (Web/IG/X) y Opinadores (Activos/Rechazados/Pendientes) | Toggle de pestañas |
| `<SlideTabs />` | Editores | Numeración Slide 01...07 o Hilo 01...12 con estado activo/inactivo |

---

## 4. Modelo de datos (Supabase)

### Tablas principales

```sql
-- Auth y usuarios
auth.users                    -- gestionado por Supabase Auth
profiles                      -- 1:1 con auth.users (datos del staff: admin, editor, director)
opinadores                    -- 1:1 con auth.users (datos del opinador comunitario)

-- Postulaciones (antes de ser opinador aprobado)
postulaciones                 -- nombre, email, telefono, edad, provincia, motivacion, estado
                              -- estado: 'pending' | 'approved' | 'rejected'

-- Ediciones (núcleo del producto)
ediciones                     -- id, fecha (slug dd-mm-yyyy), titulo (ej "Equilibrio ciego"), 
                              -- portada_url, estado, publicada_en
                              -- estado: 'draft' | 'in_progress' | 'awaiting_review' | 'published'

pipeline_state                -- 1:1 con ediciones, una fila por edición
                              -- relevamiento_status, titulos_status, portada_status, 
                              -- ventana_opinion_status, el_pulso_status, web_status, 
                              -- instagram_status, twitter_status, publicacion_status
                              -- (cada uno: 'pending' | 'running' | 'done')
                              -- relevamiento_aprobado_por, titulos_aprobado_por, 
                              -- portada_aprobado_por (FK a profiles, NULL si pendiente)

noticias                      -- pertenecen a una edición, son las 5 noticias del día
                              -- id, edicion_id, orden (1-5), titulo, cuerpo, fuentes_urls[]

el_pulso_noticia              -- 1:1 con noticias
                              -- id, noticia_id, texto_resumen, pct_positiva, pct_negativa, 
                              -- pct_incierta

-- Opiniones (lo que envían los opinadores)
opiniones                     -- id, opinador_id, noticia_id, texto, sentiment, enviada_en
                              -- sentiment: 'positiva' | 'negativa' | 'incierta'

-- Outputs por canal
publicacion_web               -- 1:1 con ediciones, contiene los 7 slides ordenados
slides_web                    -- pertenecen a publicacion_web
publicacion_instagram         -- 1:1 con ediciones, 4 slides + textos
slides_instagram              -- pertenecen a publicacion_instagram
publicacion_twitter           -- 1:1 con ediciones, 12 hilos
hilos_twitter                 -- pertenecen a publicacion_twitter

-- Operación
fuentes_noticias              -- catálogo configurable de medios fuente (Infobae, Clarín, etc)
                              -- DECISIÓN PENDIENTE: opción A/B/C en sección 8
clima_diario                  -- caché del widget de clima por edición + provincia
```

### Roles y permisos (RLS)

```
admin       acceso total a todo
editor      puede operar pipeline, ver/editar ediciones, gestionar opinadores
director    puede ver todo (lectura), gestionar opinadores, ver métricas, NO publicar
opinador    solo puede leer ediciones públicas y enviar sus propias opiniones
public      solo lee ediciones publicadas en la web pública
```

**Pendiente de confirmación con Marcos:** los permisos exactos del rol Director.

---

## 5. Mapa de dependencias entre pantallas

Indica qué hay que construir antes de qué para que cada pieza tenga lo que necesita.

```
NIVEL 0 — Andamiaje
└── Layout root + AGENTS.md + tokens + fonts + Supabase client

NIVEL 1 — Auth y permisos (bloquea todo lo demás)
├── Login admin (email + password)
├── Login opinador (numero + password)
└── RLS policies en Supabase

NIVEL 2 — Componentes base compartidos
├── <Logo /> (las 2 variantes)
├── <CountrySelector />
├── <ElPulsoLogo />
├── <Button />, <Input />, <Card /> (shadcn/ui)
└── <NoticiaCard /> (el componente más reutilizado del proyecto)

NIVEL 3 — Web pública (más simple, sirve de validación temprana)
├── /edicion/[fecha] (página única que renderiza todo)
├── <FechaSelector />
├── <ClimaWidget />
├── <NoticiaModal />
└── /  (redirect a edición de hoy)

NIVEL 4 — Portal de opinadores
├── 4 onboarding slides (estáticos, sin lógica)
├── /opinadores/postulacion (form que crea fila en `postulaciones`)
├── /opinadores/login
└── /opinadores/dia (vista del día con OpinionForm)

NIVEL 5 — Admin "estático" (CRUDs simples)
├── /admin/login
├── /admin/usuarios-y-roles
├── /admin/opinadores (con sus 3 tabs)
├── /admin/opinadores/[id] (perfil con historial)
└── /admin/metricas (gráficos)

NIVEL 6 — Admin "dinámico" (lo más complejo)
├── /admin/edicion-del-dia
│   ├── <PipelineDiagram /> con Supabase Realtime
│   ├── <EditableAIBlock /> con webhooks a n8n
│   └── Editores Web / Instagram / X
├── /admin/lista-de-ediciones
└── /admin/lista-de-ediciones/[fecha] (mismo componente que Edición del día con mode='archived')

NIVEL 7 — Integración n8n
├── Webhooks que la app llama a n8n
├── Endpoints que n8n llama a la app
└── Subscripciones Realtime que actualizan PipelineDiagram
```

---

## 6. Decisiones técnicas confirmadas

| Decisión | Valor |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript estricto) |
| Estilos | Tailwind + shadcn/ui |
| Auth + DB | Supabase con `@supabase/ssr` |
| Hosting | Vercel |
| Realtime | Supabase Realtime (canales pub/sub) |
| Charts | Recharts |
| Pipeline | n8n self-hosted en Railway |
| IA | Claude API (texto), Gemini API (imágenes) |
| Analytics | PostHog |
| Idioma código | TypeScript en inglés, UI en español rioplatense |

### Arquitectura de URLs

```
laputapolitica.com/                          → redirect a /edicion/[fecha-hoy]
laputapolitica.com/edicion/21-03-2026        → web pública (mobile + desktop)
laputapolitica.com/edicion/21-03-2026?n=02   → modal de noticia 02 abierto

laputapolitica.com/opinadores                → onboarding (slide 1)
laputapolitica.com/opinadores/postulacion    → form de postulación
laputapolitica.com/opinadores/login          → login (numero + password)
laputapolitica.com/opinadores/dia            → vista del día (post-login)

laputapolitica.com/admin/login               → login admin
laputapolitica.com/admin                     → redirect a /admin/edicion-del-dia
laputapolitica.com/admin/edicion-del-dia
laputapolitica.com/admin/lista-de-ediciones
laputapolitica.com/admin/lista-de-ediciones/21-03-2026
laputapolitica.com/admin/opinadores
laputapolitica.com/admin/opinadores/[id]
laputapolitica.com/admin/metricas
laputapolitica.com/admin/usuarios-y-roles
```

---

## 7. Decisiones que tomamos durante la revisión

| Tema | Decisión |
|---|---|
| Toggle "AR" arriba | Componente real desde el día uno (`<CountrySelector />` con un solo país disponible) |
| Vista expandida de noticia | Modal/overlay con state en URL (`?n=02`) para shareable y back-button friendly |
| Portal opinadores | Responsive (mobile + desktop), no mobile-only |
| Login opinador | Número de usuario + contraseña (no email) |
| Login admin | Email + contraseña |
| Sexta pantalla admin | No existe — son 5: Edición del día, Lista de ediciones, Opinadores, Métricas, Usuarios y roles |
| Estados R en pipeline | Solo 2 estados: rojo (pendiente de aprobación) y verde (aprobada). NO existe "rechazado" — si el editor quiere cambiar algo, hace "Rehacer" |
| Publicación automática | Solo Web. Instagram y X se entregan como contenido para copy-paste manual |
| Lista de ediciones detalle | Reutiliza el mismo componente que Edición del día con prop `mode='archived'` |
| Clima placeholder | Es placeholder de Figma — se conecta con OpenWeatherMap en construcción |

---

## 8. Decisiones pendientes (no bloquean construcción)

### 8.1 Fuentes de noticias (resolver antes de Fase 7)

Marcos no tiene definido cómo el agente busca noticias. Hay 3 opciones:

- **A. Búsqueda web abierta:** el agente usa SerpAPI o similar. Más cobertura, menos predecible.
- **B. Lista curada de RSS/scraping:** definir Infobae, Clarín, La Nación, etc. Menos flexible, más auditable.
- **C. Híbrida:** lista curada + búsqueda web complementaria.

**Recomendación:** comenzar con B (Infobae, Clarín, La Nación, Página/12, Perfil, C5N, TN como mínimo) y agregar A como fallback en V2. La opción B además habilita el componente "íconos de fuentes" que aparece al pie del editor de Títulos y Resúmenes.

### 8.2 Permisos exactos del rol Director

Marcos definió 3 roles (admin, editor, director) pero falta especificar qué puede hacer cada uno. Propuesta inicial:

- **admin:** todo
- **editor:** operar pipeline, autorizar gates R, publicar, gestionar opinadores
- **director:** lectura de todo + ver métricas + aprobar opinadores nuevos. NO puede publicar ni autorizar gates R.

### 8.3 Métricas del opinador (`d/o` y `n/o`)

Lectura inferida:
- **d/o = días que opinó / días desde que ingresó**
- **n/o = noticias opinadas / noticias totales del período**

Si esto es así, el punto amarillo al lado indica baja participación. **Confirmar con Marcos.**

---

## 9. Plan de construcción priorizado

Estimación: **9-13 semanas** trabajando 2-3 horas por día con Codex.

### Sprint 0 — Setup (1 semana)
- Fase 0: instalación local de Codex + Node + Git + GitHub
- Fase 0.5: ya resuelta (sistema de diseño definido)
- Fase 1: andamiaje del proyecto (Next.js + Supabase + Vercel + AGENTS.md + tokens + fonts)
- Primer deploy a Vercel funcionando con "hola mundo"

### Sprint 1 — Modelo de datos + Auth (1 semana)
- Crear todas las tablas en Supabase
- RLS policies para los 4 roles (public, opinador, editor, director, admin)
- Login admin
- Login opinador
- Middleware de protección de rutas

### Sprint 2 — Componentes base (1 semana)
- Setup de shadcn/ui
- Logo (2 variantes)
- CountrySelector
- ElPulsoLogo
- NoticiaCard (el más reusado, prioridad máxima)
- Botones, inputs, cards base

### Sprint 3 — Web pública (2 semanas)
- Página /edicion/[fecha] mobile-first
- Adaptación desktop
- FechaSelector
- ClimaWidget (con conexión a OpenWeatherMap)
- NoticiaModal
- SEO (meta tags, OG tags, sitemap)

### Sprint 4 — Portal opinadores (1.5 semanas)
- Onboarding 4 slides
- Postulación
- Vista del día con OpinionForm
- TimerCierre
- Notificación al editor cuando llega postulación

### Sprint 5 — Admin estático (1.5 semanas)
- Métricas (4 KPIs + 2 charts + tabla)
- Usuarios y roles
- Opinadores (3 tabs + perfil individual)
- Lista de ediciones (sin abrir el detalle todavía)

### Sprint 6 — Admin dinámico (3 semanas)
- PipelineDiagram con Supabase Realtime
- Edición del día con todos los editores (Web, Instagram, X)
- EditableAIBlock con webhooks a n8n
- Lista de ediciones detalle (reusa componente)
- Botón Publicar real

### Sprint 7 — Integración n8n (1.5 semanas)
- Webhooks bidireccionales
- Pipeline completo end-to-end
- Tests del flujo a las 19:00

### Sprint 8 — Pulido (0.5-1.5 semanas)
- Performance (Lighthouse > 90)
- SEO técnico
- Edge cases
- Tests de la beta cerrada

---

## 10. Patrones de UI consistentes detectados

Documentados acá para que el agente los aplique sin tener que inferirlos cada vez.

### Botones del editor de IA (aparecen en todos lados)

```
[Editar]   ←  ícono de lápiz, abre el bloque en modo edición
[Copiar]   ←  ícono circular, copia al portapapeles
[Rehacer]  ←  ícono circular, vuelve a llamar a la IA
```

Siempre con borde fino, sin background, espaciados a 12px del texto que acompañan.

### Card "container" del admin

Caja con borde negro fino (1.5px), border-radius medio (8-12px), padding interno generoso (24-32px). Sin sombras. Fondo `bg/base` o `bg/card`.

### Estado de loading

Cuando una etapa del pipeline está corriendo, se muestra una caja vacía centrada con el texto "Creando portada..." / "Creando El Pulso..." / etc. El nodo correspondiente del PipelineDiagram queda en amarillo.

### Botón primary

Borde verde (`vote/positive`), fondo transparente, texto negro. Ejemplo: "Publicar", "Aceptar", "Autorizar".

### Botón danger

Borde rojo (`state/danger`), fondo transparente, texto rojo. Ejemplo: "Cerrar Sesión", "Eliminar", "Rechazar".

### Botón neutral

Borde negro fino, fondo transparente, texto negro. Es el default.

---

## 11. Anti-patrones detectados (cosas a NO hacer)

- **No mezclar bordes redondeados con elementos estructurales.** La sidebar admin no tiene rounded; los botones sí.
- **No usar gradientes ni sombras.** El proyecto es plano, editorial. Cualquier sombra rompe la estética.
- **No usar emojis en UI.** El único elemento decorativo permitido son las ilustraciones acuarela del onboarding y las portadas.
- **No agregar microinteracciones de "delight" (confetti, animaciones grandes).** El producto es serio. Las únicas animaciones permitidas son: fade in/out de modales, transición suave del estado de los nodos del pipeline, y carga progresiva de imágenes.
- **No reemplazar las tipografías por defaults del sistema** "para mejorar performance". Son parte de la identidad.

---

## 12. Conclusión

El diseño está **muy bien resuelto**. La complejidad del proyecto está concentrada en el admin (especialmente el pipeline en tiempo real), y el resto es más estándar. La decisión de Marcos de no automatizar publicación a Instagram y X simplifica significativamente el alcance.

El proyecto es ambicioso pero realista. Con disciplina de sprints y el agente bien dirigido, es viable tenerlo en beta cerrada en 9-13 semanas.

---

**Última actualización:** 30 de abril de 2026
**Próxima revisión:** al cierre de Fase 1 (cuando esté el primer deploy)
