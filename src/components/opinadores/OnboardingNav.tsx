import { ChevronLeft, ChevronRight } from "lucide-react";

export interface OnboardingNavProps {
  activeSlide: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function OnboardingNav({
  activeSlide,
  total,
  onPrevious,
  onNext,
}: OnboardingNavProps): React.ReactElement {
  const isFirstSlide = activeSlide === 1;
  const isLastSlide = activeSlide === total;
  const indicator = `${String(activeSlide).padStart(2, "0")}/${String(total).padStart(2, "0")}`;

  return (
    <nav
      aria-label="Navegación del onboarding"
      className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-between bg-bg-base px-5 py-5 text-text-primary"
    >
      <button
        type="button"
        aria-label="Slide anterior"
        disabled={isFirstSlide}
        onClick={onPrevious}
        className="group flex min-w-0 flex-1 items-center gap-2 disabled:pointer-events-none disabled:opacity-30"
      >
        <ChevronLeft aria-hidden="true" size={24} strokeWidth={1.5} />
        <span aria-hidden="true" className="h-px flex-1 bg-text-primary" />
      </button>

      <span className="shrink-0 px-5 text-center font-display text-base font-normal text-text-primary">
        {indicator}
      </span>

      <button
        type="button"
        aria-label="Slide siguiente"
        disabled={isLastSlide}
        onClick={onNext}
        className="group flex min-w-0 flex-1 items-center gap-2 disabled:pointer-events-none disabled:opacity-30"
      >
        <span aria-hidden="true" className="h-px flex-1 bg-text-primary" />
        <ChevronRight aria-hidden="true" size={24} strokeWidth={1.5} />
      </button>
    </nav>
  );
}
