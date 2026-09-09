# Documentos legales públicos

Las rutas `/terminos` y `/privacidad` leen los originales de `docs/legal/` desde un Server Component. Se usan `react-markdown` y `remark-gfm`, solicitados para renderizar Markdown con tablas GFM, sin habilitar HTML crudo. Las tablas tienen desplazamiento horizontal propio para conservar la lectura en mobile.

Los archivos se incluyen explícitamente en el tracing de Next.js para estar disponibles en Vercel. Editar los originales actualiza las páginas en el siguiente despliegue; no hay una copia del contenido en JSX. No se ejecutó el build durante esta implementación para preservar el servidor de desarrollo.

`src/lib/legal.ts` centraliza los datos del titular, contacto, jurisdicción, fecha de actualización, edad mínima y referencias a las rutas. Los documentos mantienen sus datos escritos literalmente: los cambios de titular o fecha requieren actualizar también los originales, sin plantillas.

El footer desktop muestra links discretos. El mobile conserva su altura y navegación: no se agregan filas que quiten espacio a los slides. En mobile los documentos son accesibles desde el login y el checkbox de postulación. Los links abren otra pestaña para preservar los formularios y la edición actual.

La Server Action `crearPostulacion` exige una edad entera de al menos 16 años y aceptación explícita antes de insertar. Tras validar, guarda `acepto_legales_en` con la hora del servidor y `legales_version` con `LEGAL.lastUpdated`, sin tomar esos valores del cliente. Las columnas nullable ya fueron agregadas por MCP; queda pendiente versionar esa migración como archivo. No se modifica el esquema ni se rellenan postulaciones históricas.
