# Workflows de n8n — La Puta Política

Export de los workflows de n8n (local dev) versionados junto al código.
Los archivos en `workflows/` se nombran por el **ID interno de n8n** (opaco), así que
este índice mapea cada ID a su nombre y propósito.

> Exportado con `npx n8n export:workflow --all --separate`.
> Los JSON referencian las credenciales de n8n por **ID y nombre**, no por valor.
> **Nunca** commitear `export:credentials` (eso sí tiene las claves).

### Secretos (en credenciales de n8n, no en el export)

Los nodos HTTP que pegan a Supabase con la key `service_role` (RPC en `El Pulso`,
subida a Storage en `Portada`) usan una **credencial de n8n "Custom Auth"** que
inyecta los headers `apikey` / `Authorization`. La key **no** está en estos JSON ni
en git — vive encriptada en n8n / Bitwarden.

Es la **legacy service API key** (un JWT largo), **no** la `sb_secret_` nueva:
Storage necesita la legacy. La app (Next.js) sí usa las keys nuevas (`sb_secret_` /
`sb_publishable_`); n8n va por la legacy.

> Al re-importar estos workflows en otro n8n hay que re-crear/seleccionar la
> credencial "Custom Auth" con la key, porque la credencial no se exporta.

El workflow **Web** usa, además de la Custom Auth del `service_role`, la credencial
**Query Auth "OpenWeatherMap"** (`appid`). Al re-importarlo hay que
re-crear/seleccionar ambas. El Code node "Agregar clima" duplica `owmToClave` y la
lista de ciudades; mantenerlo en sync con `src/lib/clima/condiciones.ts` y
`src/lib/clima/cities.ts`.

## Pipeline de producción

| Archivo | Nombre | Qué hace |
|---|---|---|
| `CyYEPEkDkrRqHBOR.json` | **Titulos y Resumenes** | Genera títulos y resúmenes de las noticias (lee el texto completo desde `textos_fuentes`). |
| `JfaILkRkUvfHjke0.json` | **Relevamiento** | Levanta noticias candidatas (RSS → Gemini → Supabase). |
| `tiqjLbIfjwGAVZtQ.json` | **Portada** | Genera la portada: Gemini elige estilo → Gemini genera imagen → Storage. |
| `e8KVd0IakuilqmCF.json` | **El Pulso** | Calcula el pulso (votos + síntesis IA) y deja la etapa lista para revisión. |
| `zmdH54sxTzxEbEj2.json` | **Cerrar Ventana** | Polling que cierra la ventana de opinión cuando vence `ventana_opinion_cierra_en`. |
| `DA04YHIGaX0j5TVO.json` | **Web** | Genera el clima (OpenWeatherMap, 26 ciudades × 3 días) → `clima_diario` y cierra `web_status`. No materializa `slides_web` (modelo de referencia). |

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
