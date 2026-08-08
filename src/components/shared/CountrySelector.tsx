type CountrySelectorProps = {
  className?: string;
};

export function CountrySelector({ className }: CountrySelectorProps) {
  return (
    <button
      type="button"
      disabled
      title="Próximamente: más países"
      aria-label="País: Argentina"
      className={[
        "inline-flex h-8 w-8 items-center justify-center rounded-full cursor-not-allowed",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/cockades/ar.svg" alt="Argentina" className="h-6 w-6" />
    </button>
  );
}
