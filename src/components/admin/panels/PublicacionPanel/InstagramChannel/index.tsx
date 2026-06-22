import { InstagramSlide01 } from "./Slide01";
import { InstagramSlide02 } from "./Slide02";
import { InstagramSlide03 } from "./Slide03";
import { InstagramSlide04 } from "./Slide04";
import type { SlideInstagram } from "@/app/(admin)/admin/actions";

export function InstagramSlideContent({
  activeSlide,
  instagram,
}: {
  activeSlide: number;
  instagram: SlideInstagram[];
}) {
  if (instagram.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="font-ui text-sm text-text-secondary">
          Sin contenido de Instagram
        </span>
      </div>
    );
  }

  const slide = instagram.find((item) => item.orden === activeSlide);

  if (!slide) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="font-ui text-sm text-text-secondary">
          Sin contenido de Instagram
        </span>
      </div>
    );
  }

  if (activeSlide === 1) {
    return <InstagramSlide01 slide={slide} />;
  }

  if (activeSlide === 2) {
    return <InstagramSlide02 slide={slide} />;
  }

  if (activeSlide === 3) {
    return <InstagramSlide03 slide={slide} />;
  }

  return <InstagramSlide04 slide={slide} />;
}
