import { StaticPillRow } from "../shared/StaticPillRow";
import { InstagramBulletRows } from "./shared";
import { noticias } from "../mocks";

export function InstagramSlide02() {
  const noticia = noticias[0];
  const bullets = [
    "El Gobierno reabrió la discusión por los subsidios al transporte.",
    "Las provincias buscan evitar que el ajuste caiga sobre los usuarios.",
    "La tarifa volvió al centro de la agenda económica.",
    "El costo político se reparte entre Nación y gobernadores.",
    "El impacto diario se concentra en quienes viajan para trabajar.",
  ];

  return (
    <div className="space-y-5">
      <StaticPillRow value="EXPEDIENTE Nº: 2026_080-AR-01" />
      <StaticPillRow value={noticia.titulo} />
      <InstagramBulletRows bullets={bullets} />
      <StaticPillRow value="21 MAR 2026" />
    </div>
  );
}
