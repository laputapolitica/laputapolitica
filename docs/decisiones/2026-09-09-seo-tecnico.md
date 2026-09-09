# SEO técnico

- La resolución de URL conserva la precedencia del layout: `NEXT_PUBLIC_SITE_URL`, `VERCEL_PROJECT_PRODUCTION_URL`, `VERCEL_URL`, localhost. Se comparte desde `src/lib/site-url.ts`.
- El sitemap es dinámico y consulta solamente `fecha` y `publicada_en` de ediciones `published`, con paginación. `listarEdiciones` descarta `publicada_en` y no pagina; se mantiene intacta para sus consumidores actuales. Ante errores se falla la respuesta en lugar de servir un archivo incompleto como exitoso.
- Las URLs usan el slug de la base `dd-mm-yyyy`, igual que el enlace de compartir en `EdicionClient`. La compatibilidad de la ruta con ISO no cambia el formato publicado. `lastModified` usa `publicada_en`; si un registro histórico carece de ese dato, se omite sin inventar una fecha.
- La home tiene metadata estable del medio; se conserva sin cambios la metadata de cada edición. Los layouts de admin y opinadores propagan `noindex, nofollow`, también a login y postulación.
- La imagen OG se genera con `next/og`, sin dependencias nuevas ni imágenes externas. Lee los tokens de `globals.css` porque ImageResponse no resuelve variables CSS. Se incluye Playfair Display Bold en TTF, la familia display del layout, para no depender de red al generar la imagen.
- Fuente: Google Fonts, `https://fonts.gstatic.com/s/playfairdisplay/v40/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKeiukDQ.ttf`. Licencia SIL Open Font License en `src/app/fonts/OFL.txt`.
- `robots.txt` bloquea el rastreo de los portales privados, API y demo. El meta noindex requiere que el buscador pueda leer la página: combinarlo con Disallow no garantiza eliminar URLs previamente indexadas. La autenticación existente sigue protegiendo el contenido privado.
