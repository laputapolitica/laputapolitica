type CountrySelectorProps = {
  className?: string;
};

export function CountrySelector({ className }: CountrySelectorProps) {
  return (
    <button
      type="button"
      disabled
      title="Próximamente: más países"
      className={[
        "inline-flex h-8 min-w-12 items-center justify-center rounded-full border border-black px-3 font-ui text-sm font-medium text-text-primary opacity-50 cursor-not-allowed",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      AR
    </button>
  );
}
