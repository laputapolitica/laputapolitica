import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { LegalLinks } from "@/components/shared/LegalLinks";
import { Logo } from "@/components/shared/Logo";
import { LEGAL, LEGAL_DOCUMENTS } from "@/lib/legal";

export async function LegalDocument({ document }: { document: keyof typeof LEGAL_DOCUMENTS }) {
  const markdown = await readFile(path.join(process.cwd(), "docs/legal", LEGAL_DOCUMENTS[document].fileName), "utf8");

  return (
    <div className="min-h-dvh bg-bg-base text-text-primary">
      <header className="border-b border-border-default px-5 py-5 sm:px-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-6">
          <Link href="/" aria-label="La Puta Política — ir a la edición del día">
            <Logo variant="large" className="h-auto w-44 sm:w-60" />
          </Link>
          <Link href="/" className="font-ui text-xs underline underline-offset-4 sm:text-sm">Volver a la edición</Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-5 py-10 sm:px-10 sm:py-16">
        <article className="min-w-0 break-words font-editorial text-[15px] leading-[1.9] sm:text-base">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
            h1: ({ children }) => <h1 className="mb-6 font-display text-4xl leading-tight sm:text-5xl">{children}</h1>,
            h2: ({ children }) => <h2 className="mb-4 mt-10 border-t border-border-default pt-6 font-display text-2xl leading-snug sm:text-3xl">{children}</h2>,
            h3: ({ children }) => <h3 className="mb-3 mt-7 font-display text-xl leading-snug sm:text-2xl">{children}</h3>,
            p: ({ children }) => <p className="my-4">{children}</p>,
            ul: ({ children }) => <ul className="my-4 list-disc space-y-2 pl-6">{children}</ul>,
            ol: ({ children }) => <ol className="my-4 list-decimal space-y-2 pl-6">{children}</ol>,
            a: ({ children, href }) => <a href={href} className="underline underline-offset-4 hover:text-text-secondary">{children}</a>,
            blockquote: ({ children }) => <blockquote className="my-6 border-l-2 border-text-primary pl-5 italic">{children}</blockquote>,
            hr: () => <hr className="my-8 border-border-default" />,
            table: ({ children }) => (
              <div role="region" aria-label="Tabla del documento legal" tabIndex={0} className="my-6 overflow-x-auto border-y border-border-default focus-visible:outline focus-visible:outline-text-primary">
                <table className="w-full min-w-[32rem] border-collapse text-left font-ui text-sm leading-relaxed">{children}</table>
              </div>
            ),
            th: ({ children }) => <th scope="col" className="border-b border-text-primary px-3 py-3 align-top font-semibold">{children}</th>,
            td: ({ children }) => <td className="border-b border-border-default px-3 py-3 align-top">{children}</td>,
          }}>
            {markdown}
          </ReactMarkdown>
        </article>
      </main>
      <footer className="border-t border-border-default px-5 py-8 text-center">
        <LegalLinks />
        <a href={`mailto:${LEGAL.contactEmail}`} className="mt-4 inline-block font-ui text-xs text-text-secondary underline underline-offset-4">{LEGAL.contactEmail}</a>
      </footer>
    </div>
  );
}
