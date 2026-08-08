import { notFound } from "next/navigation";

import { cargarEdicion, toDbSlug } from "@/lib/edicion";
import { EdicionClient } from "./EdicionClient";

type EdicionPageProps = {
  params: Promise<{
    fecha: string;
  }>;
};

export default async function EdicionPage({ params }: EdicionPageProps) {
  const { fecha } = await params;
  const data = await cargarEdicion(toDbSlug(fecha));
  if (!data) {
    notFound();
  }
  return <EdicionClient edicion={data.edicion} clima={data.clima} />;
}
