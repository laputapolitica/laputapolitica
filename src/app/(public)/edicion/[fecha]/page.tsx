import { getClimaMock, getEdicionMock } from "@/lib/mock-data";

import { EdicionClient } from "./EdicionClient";

type EdicionPageProps = {
  params: Promise<{
    fecha: string;
  }>;
};

export default async function EdicionPage({ params }: EdicionPageProps) {
  const { fecha } = await params;
  const edicion = getEdicionMock(fecha);
  const clima = getClimaMock();

  return <EdicionClient clima={clima} edicion={edicion} />;
}
