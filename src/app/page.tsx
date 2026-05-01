import { redirect } from "next/navigation";

function getBuenosAiresToday() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(new Date());
}

export default function HomePage() {
  redirect(`/edicion/${getBuenosAiresToday()}`);
}
