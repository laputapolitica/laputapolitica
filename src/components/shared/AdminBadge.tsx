type AdminBadgeProps = {
  className?: string;
};

export function AdminBadge({ className }: AdminBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-lg bg-[#111111] px-4 py-2 font-ui text-xs font-semibold uppercase tracking-wider text-white",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      ADMIN
    </span>
  );
}
