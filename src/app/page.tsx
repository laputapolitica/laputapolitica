import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EdicionClient } from "@/app/(public)/edicion/[fecha]/EdicionClient";
import { cargarEdicion, listarEdiciones } from "@/lib/edicion";

export async function generateMetadata(): Promise<Metadata> {
  const data = await cargarEdicion();
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
    openGraph: { title, description, type: "website", images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

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
