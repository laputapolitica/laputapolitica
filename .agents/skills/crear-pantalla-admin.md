# Skill: crear-pantalla-admin

Usar esta skill cuando se pida crear una nueva pantalla del dashboard admin de LPP.

## Reglas obligatorias

1. **Ubicación**: `src/app/(admin)/[nombre-pantalla]/page.tsx`
2. **Layout**: usa el layout de admin que ya provee sidebar (no recrearlo).
3. **Ancho**: el contenido vive en un contenedor de 1440px máximo con 48px de margen lateral.
4. **Separación sidebar-contenido**: 48px (controlado en el layout, no en la pantalla).
5. **Server Component por defecto**: solo marcar `"use client"` si hay estado o eventos.
6. **Auth**: importar `getAuthenticatedAdmin()` de `@/lib/auth` y llamarlo al inicio. Si no hay admin, redirigir a `/admin/login`.
7. **Datos**: fetch con cliente server de Supabase (`@/lib/supabase/server`). Nunca exponer service_role key al cliente.

## Estructura mínima de la pantalla

```tsx
import { getAuthenticatedAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function NombrePantalla() {
  const admin = await getAuthenticatedAdmin();
  const supabase = await createClient();

  // fetch de datos acá

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-serif">Título</h1>
      </header>
      <main>
        {/* contenido */}
      </main>
    </div>
  );
}
```

## Componentes a reusar

- Tablas: `<DataTable />` de `components/admin/`
- Cards de métricas: `<MetricCard />` de `components/admin/`
- Botones: `<Button />` de `components/ui/` (shadcn)

## Antes de marcar terminado

- [ ] Correr `npm run type-check` sin errores
- [ ] Correr `npm run lint` sin warnings
- [ ] Verificar visualmente que respeta los 48px de margen
- [ ] Verificar que el sidebar no tiene bordes redondeados
- [ ] Si la pantalla lee/escribe tablas nuevas, actualizar `docs/02-data-model.md`
