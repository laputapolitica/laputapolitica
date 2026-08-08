import { notFound } from "next/navigation";

import { EdicionClient } from "@/app/(public)/edicion/[fecha]/EdicionClient";
import { cargarEdicion } from "@/lib/edicion";

export default async function HomePage() {
  const data = await cargarEdicion();
  if (!data) {
    notFound();
  }
  return <EdicionClient edicion={data.edicion} clima={data.clima} />;
}
