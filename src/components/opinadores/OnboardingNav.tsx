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
      className="fixed bottom-0 left-0 z-50 w-full bg-bg-base text-text-primary"
    >
      <div className="flex w-full items-center px-5 py-5">
        <button
          type="button"
          aria-label="Slide anterior"
          disabled={isFirstSlide}
          onClick={onPrevious}
          className="flex-1 bg-transparent p-0 disabled:pointer-events-none disabled:opacity-30"
        >
          <svg
            aria-hidden="true"
            width="100%"
            height="6"
            viewBox="0 0 139 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0 2.88672L5 5.77347V-3.26633e-05L0 2.88672ZM139 2.88672V2.38672L4.5 2.38672V2.88672V3.38672L139 3.38672V2.88672Z"
              fill="#444444"
            />
          </svg>
        </button>

        <span className="mx-4 shrink-0 text-center font-display text-base font-normal text-text-primary">
          {indicator}
        </span>

        <button
          type="button"
          aria-label="Slide siguiente"
          disabled={isLastSlide}
          onClick={onNext}
          className="flex-1 bg-transparent p-0 disabled:pointer-events-none disabled:opacity-30"
        >
          <svg
            aria-hidden="true"
            width="100%"
            height="6"
            viewBox="0 0 139 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M139 2.88672L134 -3.26633e-05V5.77347L139 2.88672ZM0 2.88672L0 3.38672L134.5 3.38672V2.88672V2.38672L0 2.38672L0 2.88672Z"
              fill="#444444"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}
