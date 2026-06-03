import { AdminBadge, CountryIndicator, Logo } from "@/components/shared";

export function AdminHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between bg-bg-base px-5 py-4">
      <Logo variant="small" className="h-8 w-auto" />
      <AdminBadge />
      <CountryIndicator />
    </header>
  );
}
