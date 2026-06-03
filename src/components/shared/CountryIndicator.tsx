type CountryIndicatorProps = {
  pais?: string;
  className?: string;
};

export function CountryIndicator({ pais = "ar", className = "" }: CountryIndicatorProps) {
  const code = pais.toLowerCase();
  const label = pais.toUpperCase();

  return (
    <span className={`inline-flex flex-col items-center gap-0.5 ${className}`}>
      <img
        src={`/cockades/${code}.svg`}
        alt={`País: ${label}`}
        className="h-[15px] w-[15px] md:h-[18px] md:w-[18px]"
      />
      <span className="font-ui text-[8px] md:text-[10px] font-semibold leading-none text-admin-ink">
        {label}
      </span>
    </span>
  );
}
