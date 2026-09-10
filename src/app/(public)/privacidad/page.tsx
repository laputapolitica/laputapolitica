import type { Metadata } from "next";
import { LegalDocument } from "@/components/public/LegalDocument";
import { LEGAL, LEGAL_DOCUMENTS } from "@/lib/legal";

export const dynamic = "force-static";

const document = LEGAL_DOCUMENTS.privacy;

export const metadata: Metadata = {
  title: `${document.title} | La Puta Política`,
  description: document.description,
  authors: [{ name: LEGAL.ownerName }],
  alternates: { canonical: document.href },
};

export default function PrivacyPage() {
  return <LegalDocument document="privacy" />;
}
