import type { Metadata } from "next";
import { LegalDocument } from "@/components/public/LegalDocument";
import { LEGAL, LEGAL_DOCUMENTS } from "@/lib/legal";

const document = LEGAL_DOCUMENTS.terms;

export const metadata: Metadata = {
  title: `${document.title} | La Puta Política`,
  description: document.description,
  authors: [{ name: LEGAL.ownerName }],
  alternates: { canonical: document.href },
};

export default function TermsPage() {
  return <LegalDocument document="terms" />;
}
