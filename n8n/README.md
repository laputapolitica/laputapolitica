# Workflows de n8n — La Puta Política

Export de los workflows de n8n (local dev) versionados junto al código.
Los archivos en `workflows/` se nombran por el **ID interno de n8n** (opaco), así que
este índice mapea cada ID a su nombre y propósito.

> Exportado con `npx n8n export:workflow --all --separate`.
> Los JSON referencian las credenciales de n8n por **ID y nombre**, no por valor.
> **Nunca** commitear `export:credentials` (eso sí tiene las claves).

### Secretos redactados

Los nodos **HTTP Request** de `El Pulso` y `Portada` tenían la key
`service_role` de Supabase **hardcodeada** en los headers `apikey` / `Authorization`
(para subir a Storage). En este snapshot versionado fue reemplazada por
`REDACTED_SUPABASE_SERVICE_ROLE_KEY`. La key real vive en n8n / Bitwarden — **no** en git.

> **Pendiente (fix de fondo):** mover esa key del nodo HTTP a una **credencial de n8n
> (Header Auth)** en la UI, así los exports futuros nunca arrastran el secreto. Hasta
> que se haga, re-importar estos JSON requiere volver a poner la key a mano.

## Pipeline de producción

| Archivo | Nombre | Qué hace |
|---|---|---|
| `CyYEPEkDkrRqHBOR.json` | **Titulos y Resumenes** | Genera títulos y resúmenes de las noticias (lee el texto completo desde `textos_fuentes`). |
| `JfaILkRkUvfHjke0.json` | **Relevamiento** | Levanta noticias candidatas (RSS → Gemini → Supabase). |
| `tiqjLbIfjwGAVZtQ.json` | **Portada** | Genera la portada: Gemini elige estilo → Gemini genera imagen → Storage. |
| `e8KVd0IakuilqmCF.json` | **El Pulso** | Calcula el pulso (votos + síntesis IA) y deja la etapa lista para revisión. |
| `zmdH54sxTzxEbEj2.json` | **Cerrar Ventana** | Polling que cierra la ventana de opinión cuando vence `ventana_opinion_cierra_en`. |

## Pruebas / scratch

| Archivo | Nombre |
|---|---|
| `BU8iq0Npptb5WvWD.json` | Prueba razonadora (Gemini) |
| `Dk5pu0YDe4yiuPDi.json` | Prueba imagen (Gemini) |
| `oGK0lKZvT86mZEFs.json` | Prueba extracción (HTTP + Gemini) |
| `u5LqXKF9uEAvyt4F.json` | Prueba conexión Supabase |
| `wdtJMrTrEYBkt0lV.json` | Prueba Pulso Resumen |

## Patrón de polling (referencia)

Cada workflow es independiente (sin orquestador central). El patrón es:

`Schedule Trigger (1 min)` → `Supabase Get Many (status=pending)` → `n8n Filter
(precondiciones)` → `Supabase Update status=running` (lock anti-duplicado) → resto del
workflow con `edicion_id` dinámico.

### Contrato del gate de El Pulso (importante)

El Pulso termina marcando `el_pulso_status = "done"`, lo que **dispara la revisión
humana** en el admin (no avanza solo). La aprobación queda registrada aparte en
`el_pulso_aprobado_en`.

**Las etapas downstream (Web, Instagram, Twitter) deben arrancar mirando
`el_pulso_aprobado_en` (no vacío) — NO `el_pulso_status = "done"`** — porque `done` se
prende automáticamente al terminar el cálculo, antes de la revisión. Disparar sobre
`done` saltearía el gate de revisión.

> Precondición de El Pulso: `ventana_opinion_status = done` **Y** `portada_aprobado_en`
> no vacío (corren en paralelo, por eso son dos condiciones).
