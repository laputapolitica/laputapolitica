# Decisión — Nodo Web: modelo de REFERENCIA, no materialización

**Fecha:** 21-06-2026
**Estado:** aceptada
**Reemplaza:** la decisión previa (19-06-2026) de "materializar `slides_web`" descrita en `diseno-etapa-web.md`.

## Contexto

El pipeline genera el contenido del día en tablas organizadas **por nodo / por producción**
(`ediciones`, `noticias`, `el_pulso_noticia`, `portadas`, `clima_diario`), no por el formato
publicado (slides). La web pública compone los 7 slides de la edición leyendo en vivo esas
tablas (`src/app/(public)/edicion/[fecha]/page.tsx`).

El diseño original preveía que el nodo Web "materializara" `slides_web` (copiar portada +
noticias + pulso + clima en filas ordenadas) como fuente única para el sitio e IG/X.

## Decisión

El nodo Web **NO materializa `slides_web`**. Se adopta un modelo de **referencia en vivo**:

- El sitio (y el admin) componen los slides leyendo las tablas fuente por-nodo. Es lo que el
  código ya hace hoy.
- El nodo Web se reduce a: **generar el clima → `clima_diario`** y marcar `web_status = 'done'`.
- "Publicar" (etapa Publicación, futura) = `ediciones.estado = 'published'`.

## Razón

La función de **editar una edición ya publicada** existe para **corregir errores** que se
escaparon. Con referencia en vivo, la corrección se hace en la tabla fuente y se refleja sola,
sin duplicar contenido ni tener que editar dos lugares. Materializar copias obligaría a
re-arreglar la copia en cada corrección.

## Consecuencias

- **Una sola fuente por campo:** el lugar donde se *muestra* y donde se *edita* un campo deben
  ser la **misma columna**. Pendiente: definir el título del slide 1 (`ediciones.titulo` vs
  `portadas.titulo`) y que display + edición apunten a la misma.
- **Tradeoff aceptado:** no hay archivo histórico inmutable; una edición publicada refleja
  ediciones posteriores. Aceptable porque el caso de uso es corrección de errores.
- **IG / X son distintos:** transforman el contenido (caption, hilos con emojis, pulso
  formateado) → eso sí es contenido nuevo que escriben en sus tablas. No es referencia pura
  como Web. Se resuelve al diseñar esos nodos.
- **Gap de correcciones (a resolver en Publicación / editar-publicada):** el editor de edición
  publicada (`admin/ediciones/[fecha]` → `PublicacionPanel` + `actions.ts`) hoy permite corregir
  noticia (título/cuerpo), resumen de El Pulso y `ediciones.titulo`, pero **no** la portada
  (imagen/título) ni el clima.
- `publicacion_web` / `slides_web` quedan en el esquema pero **sin uso** por ahora.
