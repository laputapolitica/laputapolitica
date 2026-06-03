type AdminBadgeProps = {
  className?: string;
};

export function AdminBadge({ className }: AdminBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-[4px] bg-[#111111] px-2 py-0.5 font-ui text-xs font-semibold uppercase tracking-wider text-white",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      ADMIN
    </span>
  );
}
