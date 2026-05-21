import { InstagramEditablePill, InstagramTitularRow } from "./shared";

export function InstagramSlide04() {
  const titulares = [
    "Pacto con el FMI",
    "Provincias en guerra",
    "Reformas en el Congreso",
    "Clima social en alerta",
  ];

  return (
    <div className="space-y-5">
      {titulares.map((titulo) => (
        <InstagramTitularRow key={titulo} titulo={titulo} />
      ))}
      <InstagramEditablePill value="21 MAR 2026" />
    </div>
  );
}
