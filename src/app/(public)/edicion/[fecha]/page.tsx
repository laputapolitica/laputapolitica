import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { cargarEdicion, listarEdiciones, toDbSlug } from "@/lib/edicion";
import { EdicionClient } from "./EdicionClient";

type EdicionPageProps = {
  params: Promise<{
    fecha: string;
  }>;
};

export async function generateMetadata({
  params,
}: EdicionPageProps): Promise<Metadata> {
  const { fecha } = await params;
  const data = await cargarEdicion(toDbSlug(fecha));
  if (!data) {
    return { title: "La Puta Política" };
  }
  const { edicion } = data;
  const title = `${edicion.titulo} · La Puta Política`;
  const description =
    edicion.noticias[0]?.titulo ??
    "La actualidad política argentina del día, clara, visual y sin vueltas.";
  const portada = edicion.portada_illustracion_url;
  const images = portada && !portada.endsWith(".svg") ? [portada] : undefined;
  return {
    title,
    description,
    openGraph: { title, description, type: "article", images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

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
