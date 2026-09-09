import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EdicionClient } from "@/app/(public)/edicion/[fecha]/EdicionClient";
import { cargarEdicion, listarEdiciones } from "@/lib/edicion";

export const metadata: Metadata = {
  title: "La Puta Política | Noticias de política argentina",
  description:
    "Las noticias de política argentina, claras y sin vueltas. Leé la edición diaria de La Puta Política, explorá el archivo y conocé El Pulso de nuestra comunidad.",
};

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
