import { notFound } from "next/navigation";

import { EdicionClient } from "@/app/(public)/edicion/[fecha]/EdicionClient";
import { cargarEdicion, listarEdiciones } from "@/lib/edicion";

export default async function HomePage() {
  const [data, ediciones] = await Promise.all([
    cargarEdicion(),
    listarEdiciones(),
  ]);

  if (!data) {
    notFound();
  }

  return (
    <EdicionClient edicion={data.edicion} clima={data.clima} ediciones={ediciones} />
  );
}
