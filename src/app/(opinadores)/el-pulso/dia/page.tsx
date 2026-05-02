import { DiaClient } from "./DiaClient";

import { getEdicionMock } from "@/lib/mock-data";

function getBuenosAiresToday(): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(new Date());
}

export default function DiaPage(): React.ReactElement {
  const edicion = getEdicionMock(getBuenosAiresToday());

  return <DiaClient edicion={edicion} />;
}
