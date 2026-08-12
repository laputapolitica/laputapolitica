import { HeaderElPulso, PostulacionForm } from "@/components/opinadores";

export default function PostulacionPage(): React.ReactElement {
  return (
    <main className="flex h-[100dvh] flex-col overflow-hidden bg-bg-base text-text-primary">
      <header className="flex w-full flex-none items-center justify-between px-5 py-4">
        <HeaderElPulso />
      </header>
      <div className="min-h-0 flex-1">
        <PostulacionForm />
      </div>
    </main>
  );
}
