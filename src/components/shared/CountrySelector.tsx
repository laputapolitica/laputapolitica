type CountrySelectorProps = {
  className?: string;
};

export function CountrySelector({ className }: CountrySelectorProps) {
  return (
    <button
      type="button"
      title="Próximamente: más países"
      aria-label="País: Argentina"
      className={[
        "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-bg-base shadow-[-2px_-2px_5px_#ffffff,3px_3px_6px_#E6E3DB] transition-shadow duration-150 ease-out active:shadow-[inset_2px_2px_4px_#E6E3DB,inset_-2px_-2px_4px_#ffffff]",
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
