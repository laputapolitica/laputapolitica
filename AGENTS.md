# AGENTS.md — La Puta Política (LPP)

> Este archivo es el contexto maestro del proyecto. Codex lo lee automáticamente al iniciar sesión. Mantenerlo conciso y actualizado: cada palabra acá ahorra tokens en cada prompt.

---

## 1. Qué es LPP

La Puta Política es una plataforma argentina de noticias políticas dirigida a jóvenes. Publica una edición diaria a las 22:00 simultáneamente en web e Instagram. La identidad editorial está inspirada en The Economist: ilustración de tinta clara, paleta visual definida, tono editorial serio pero accesible.

Hay tres portales:
1. **Web pública** — lectores anónimos consumen la edición del día y el archivo histórico (mobile y desktop).
2. **Portal de opinadores** — comunidad cerrada que vota e interpreta las noticias del día (solo mobile).
3. **Dashboard admin** — back office del editor (solo desktop, 1440px, márgenes de 48px).

---

## 2. Stack técnico

- **Framework**: Next.js 15 (App Router, TypeScript estricto, Server Components por defecto).
- **Base de datos + auth**: Supabase (Postgres + RLS + Auth con `@supabase/ssr`).
- **Hosting**: Vercel.
- **Estilos**: Tailwind CSS + shadcn/ui (componentes base).
- **Analytics**: PostHog.
- **Pipeline de contenido**: n8n (self-hosted en Railway) consume API routes de la app.
- **IA**: Claude API (texto), Gemini API (imágenes).

**Regla**: usar siempre `@supabase/ssr` (no el deprecated `@supabase/auth-helpers`). Para validar sesión en server, usar `supabase.auth.getClaims()`, nunca `getSession()`.

---

## 3. Estructura de carpetas

```
src/
├── app/
│   ├── (public)/        # web pública mobile + desktop
│   ├── (opinadores)/    # portal opinadores (mobile-first)
│   ├── (admin)/         # dashboard admin (desktop-only, 1440px)
│   └── api/             # endpoints que consume n8n
├── components/
│   ├── ui/              # shadcn/ui base
│   ├── shared/          # componentes compartidos entre portales
│   └── [portal]/        # específicos de cada portal
├── lib/
│   └── supabase/        # client.ts (browser) + server.ts (RSC) + middleware.ts
└── styles/

docs/                    # documentación viva del proyecto
.agents/skills/          # skills reusables para Codex
prompts/                 # prompts probados que funcionan
```

---

## 4. Identidad visual (constantes inviolables)

- **Background base**: `#FAF9F5`
- **Voto positivo**: `#A8D5BA`
- **Voto negativo**: `#E6A8A1`
- **Voto incierto**: `#C7C3E6`
- **Linework**: negro tinta, estilo editorial
- **Tipografía**: serif editorial para títulos, sans para UI (definir en `tailwind.config.ts`)

Estas constantes viven como variables CSS en `src/styles/globals.css` y como tokens en `tailwind.config.ts`. **Nunca hardcodear colores en componentes** — siempre vía token.

---

## 5. Reglas de UI específicas

- **Sidebar admin**: NO usar bordes redondeados ni card-style. Tiene que parecer interfaz de trabajo sólida, no contenido flotante.
- **Admin desktop-only**: 1440px de ancho, 48px de margen exterior, 48px de separación entre sidebar y contenido.
- **Opinadores mobile-only**: diseñar mobile-first, no responsive desde desktop.
- **Onboarding opinadores**: 3 slides con copy fijo:
  1. "La política del día, interpretada por vos"
  2. "Tu opinión construye El Pulso"
  3. "5 minutos. Todos los días. Tu voz importa."

---

## 6. Convenciones de código

- **TypeScript estricto**: no `any`, no `// @ts-ignore` sin justificar en comentario.
- **Server Components por defecto**: marcar `"use client"` solo cuando se necesita interactividad o hooks.
- **Server Actions** para mutaciones (no API routes excepto para n8n).
- **Naming**: componentes en `PascalCase`, archivos de componentes también (`EdicionDelDia.tsx`).
- **Slugs de ediciones**: formato `dd-mm-yyyy` (ej: `30-04-2026`).
- **Idioma**: UI y contenido en español (rioplatense). Comentarios y nombres de variables en inglés.

---

## 7. Reglas del agente

1. **Antes de crear un archivo nuevo, listar lo que existe** en la carpeta destino. Evitar duplicados.
2. **Antes de tocar Supabase**, leer `docs/02-data-model.md`.
3. **Cuando se cree o modifique una tabla**, actualizar `docs/02-data-model.md` en el mismo commit.
4. **Cuando se tome una decisión técnica nueva** (ej: elegir librería X sobre Y), crear un archivo en `docs/decisiones/` con fecha y razón.
5. **No instalar dependencias sin avisar**. Mostrar qué se va a instalar y por qué antes de correr `npm install`.
6. **Commits**: en español, formato `tipo: descripción corta`. Tipos: `feat`, `fix`, `refactor`, `docs`, `style`, `chore`.
7. **Si un cambio afecta a más de 5 archivos**, parar y resumir antes de continuar.

---

## 8. Comandos del proyecto

```bash
npm run dev          # servidor de desarrollo
npm run build        # build de producción
npm run lint         # eslint
npm run type-check   # tsc --noEmit
```

Antes de declarar terminado un cambio, correr `npm run lint` y `npm run type-check`.

---

## 9. Qué NO hacer

- No usar `localStorage` o `sessionStorage` para datos de auth (Supabase maneja cookies via SSR).
- No mezclar componentes entre portales sin pasar por `components/shared/`.
- No usar `<form>` sin Server Action.
- No commitear archivos `.env*`.
- No sugerir cambios en el stack sin discutirlo en una decisión documentada.

---

## 10. Estado del proyecto

Ver `docs/00-vision.md` para el contexto completo del producto y `roadmap_lpp.md` para el estado de avance. La fase actual es **Desarrollo (paso 5 del roadmap)**.
