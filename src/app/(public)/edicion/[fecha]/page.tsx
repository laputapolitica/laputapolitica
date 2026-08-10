import { notFound } from "next/navigation";

import { cargarEdicion, listarEdiciones, toDbSlug } from "@/lib/edicion";
import { EdicionClient } from "./EdicionClient";

type EdicionPageProps = {
  params: Promise<{
    fecha: string;
  }>;
};

export default async function EdicionPage({ params }: EdicionPageProps) {
  const { fecha } = await params;
  const [data, ediciones] = await Promise.all([
    cargarEdicion(toDbSlug(fecha)),
    listarEdiciones(),
  ]);

  if (!data) {
    notFound();
  }

  return (
    <EdicionClient edicion={data.edicion} clima={data.clima} ediciones={ediciones} />
  );
}
