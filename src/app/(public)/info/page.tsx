import type { Metadata } from "next";

import { LegalDocument } from "@/components/public/LegalDocument";
import { LEGAL } from "@/lib/legal";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Qué es La Puta Política | La Puta Política",
  description: "Conocé cómo se arma La Puta Política, cómo funciona El Pulso y quién está detrás del proyecto.",
  authors: [{ name: LEGAL.ownerName }],
  alternates: { canonical: "/info" },
};

export default function InfoPage() {
  return <LegalDocument document="info" />;
}
