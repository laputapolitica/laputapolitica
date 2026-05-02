import { AdminBadge, CountrySelector, Logo } from "@/components/shared";

export function AdminHeader() {
  return (
    <header className="fixed left-0 top-0 z-50 flex h-16 w-full items-center justify-between bg-bg-base px-5 py-4">
      <Logo variant="small" className="h-8 w-auto" />
      <AdminBadge />
      <CountrySelector />
    </header>
  );
}
