import { cn } from "@/lib/utils";

type NavegacionLateralProps = {
  slideActivo: number;
};

const slides = [1, 2, 3, 4, 5, 6, 7];

function formatSlideNumber(slide: number) {
  return String(slide).padStart(2, "0");
}

export function NavegacionLateral({ slideActivo }: NavegacionLateralProps) {
  return (
    <nav
      aria-label="Navegación de la edición"
      className="fixed left-0 top-1/2 z-30 -translate-y-1/2 pl-3"
    >
      <ol className="flex flex-col gap-2">
        {slides.map((slide) => (
          <li key={slide}>
            <span
              className={cn(
                "font-ui text-sm leading-none text-text-secondary",
                slideActivo === slide && "text-base font-bold text-text-primary",
              )}
            >
              {formatSlideNumber(slide)}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export type { NavegacionLateralProps };
