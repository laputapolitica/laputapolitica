import { CopyButton, EditButton } from "../shared/ActionButtons";
import { StaticPillRow } from "../shared/StaticPillRow";
import { noticias } from "../mocks";

export function TwitterSlideContent({ activeSlide }: { activeSlide: number }) {
  if (activeSlide === 1) {
    return (
      <div className="space-y-5">
        <StaticPillRow value="Equilibrio ciego" />
        <div className="flex items-start gap-3">
          <div className="h-[150px] w-[150px] shrink-0 rounded-lg border border-admin-ink bg-gray-200" />
          <CopyButton />
        </div>
      </div>
    );
  }

  if (activeSlide === 12) {
    return (
      <StaticPillRow value="La edición completa en laputapolitica.com" />
    );
  }

  const pulsoSlides = [3, 5, 7, 9, 11];
  const noticiaIndex = pulsoSlides.includes(activeSlide)
    ? (activeSlide - 3) / 2
    : (activeSlide - 2) / 2;
  const noticia = noticias[noticiaIndex % noticias.length];
  const texto = pulsoSlides.includes(activeSlide)
    ? noticia.pulsoTwitter
    : `${noticia.titulo}.\n${noticia.resumen}`;

  return (
    <div className="flex items-start gap-2">
      <div
        className="flex items-start rounded-[3.5px] border border-admin-ink bg-white px-2 py-1"
        style={{ maxWidth: "480px" }}
      >
        <span className="font-ui text-sm font-medium whitespace-pre-line text-admin-ink">
          {texto}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-2 pt-1">
        <EditButton />
        <CopyButton />
      </div>
    </div>
  );
}
