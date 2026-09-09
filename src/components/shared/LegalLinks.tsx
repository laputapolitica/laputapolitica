import Link from "next/link";
import { LEGAL_DOCUMENTS } from "@/lib/legal";
import { cn } from "@/lib/utils";

export function LegalLinks({ className }: { className?: string }) {
  return (
    <nav aria-label="Información legal" className={cn("flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-ui text-[11px] font-normal text-text-secondary", className)}>
      {Object.values(LEGAL_DOCUMENTS).map((document) => (
        <Link key={document.href} href={document.href} target="_blank" rel="noopener noreferrer" className="py-1 underline-offset-4 hover:text-text-primary hover:underline focus-visible:underline">
          {document.title}
          <span className="sr-only"> (abre en una pestaña nueva)</span>
        </Link>
      ))}
    </nav>
  );
}
