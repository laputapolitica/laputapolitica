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
      className="fixed bottom-0 left-0 z-50 w-full bg-bg-base text-text-primary lg:static lg:z-auto"
    >
      <div className="flex w-full items-center px-5 py-5 lg:px-8">
        <button
          type="button"
          aria-label="Slide anterior"
          disabled={isFirstSlide}
          onClick={onPrevious}
          className="flex flex-1 items-center bg-transparent p-0 transition-opacity duration-300 ease-out disabled:pointer-events-none disabled:opacity-20"
        >
          <svg aria-hidden="true" width="7" height="8" viewBox="0 0 7 8" fill="none" className="shrink-0">
            <path d="M0 4L7 0V8L0 4Z" fill="#444444" />
          </svg>
          <span aria-hidden="true" className="h-px flex-1 bg-[#444444]" />
        </button>

        <span className="mx-4 shrink-0 text-center font-display text-base font-normal text-text-primary">
          {indicator}
        </span>

        <button
          type="button"
          aria-label="Slide siguiente"
          disabled={isLastSlide}
          onClick={onNext}
          className="flex flex-1 items-center bg-transparent p-0 transition-opacity duration-300 ease-out disabled:pointer-events-none disabled:opacity-20"
        >
          <span aria-hidden="true" className="h-px flex-1 bg-[#444444]" />
          <svg aria-hidden="true" width="7" height="8" viewBox="0 0 7 8" fill="none" className="shrink-0">
            <path d="M7 4L0 0V8L7 4Z" fill="#444444" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
