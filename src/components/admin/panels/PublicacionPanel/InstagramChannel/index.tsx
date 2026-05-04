import { InstagramSlide01 } from "./Slide01";
import { InstagramSlide02 } from "./Slide02";
import { InstagramSlide03 } from "./Slide03";
import { InstagramSlide04 } from "./Slide04";

export function InstagramSlideContent({ activeSlide }: { activeSlide: number }) {
  if (activeSlide === 1) {
    return <InstagramSlide01 />;
  }

  if (activeSlide === 2) {
    return <InstagramSlide02 />;
  }

  if (activeSlide === 3) {
    return <InstagramSlide03 />;
  }

  return <InstagramSlide04 />;
}
