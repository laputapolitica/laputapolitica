import type { MockOpinador } from "../types";
import { mockOpiniones } from "../mocks";

export function ElPulsoDetailView({
  opinador,
  noticiaIndex,
}: {
  opinador: MockOpinador;
  noticiaIndex: number;
}) {
  const opinion = mockOpiniones[noticiaIndex];
  // Nota: el voto del opinador para esta noticia se muestra en el header del panel,
  // no acá adentro. Igual lo dejamos referenciado para mantener el shape original.
  void opinador;

  return (
    <div className="space-y-4">
      <div className="inline-flex items-center rounded-[3.5px] border border-admin-ink px-2 py-1">
        <span className="font-ui text-sm font-medium text-admin-ink">{opinion.noticia}</span>
      </div>

      <div className="flex items-start rounded-[3.5px] border border-admin-ink bg-white px-2 py-1" style={{ maxWidth: '480px' }}>
        <span className="font-ui text-sm font-medium text-admin-ink">{opinion.texto}</span>
      </div>

      <div className="inline-flex flex-col gap-2">
        <div className="inline-flex items-center rounded-[3.5px] border border-admin-ink px-2 py-1">
          <span className="font-ui text-sm font-medium text-admin-ink">Interpretación</span>
        </div>
        <div className="inline-flex h-[28px] w-fit items-center gap-2 rounded-[3.5px] border border-admin-ink bg-white px-2">
          <span className="font-ui text-sm font-medium text-admin-ink">{opinion.interpretacion}</span>
          <span className="h-[8px] w-[8px] rounded-full" style={{ backgroundColor: opinion.color }} />
        </div>
      </div>
    </div>
  );
}
