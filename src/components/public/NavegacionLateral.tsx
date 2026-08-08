import { cn } from "@/lib/utils";

type NavegacionLateralProps = {
  slideActivo: number;
  className?: string;
};

const slides = [1, 2, 3, 4, 5, 6, 7];

function formatSlideNumber(slide: number) {
  return String(slide).padStart(2, "0");
}

export function NavegacionLateral({ slideActivo, className }: NavegacionLateralProps) {
  return (
    <nav
      aria-label="Navegación de la edición"
      className={cn(
        "absolute left-0 top-1/2 z-30 -translate-y-1/2 pl-3",
        className,
      )}
    >
      <ol className="flex flex-col gap-1.5">
        {slides.map((slide) => {
          const isActive = slideActivo === slide;
          return (
            <li key={slide}>
              <span
                className={cn(
                  "text-[11px] leading-none tracking-[0.04em]",
                  isActive ? "font-bold text-admin-ink" : "text-[#A7A29A]",
                )}
                style={{ fontFamily: "var(--font-nav)" }}
              >
                {formatSlideNumber(slide)}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export type { NavegacionLateralProps };
