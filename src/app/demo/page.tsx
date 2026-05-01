import {
  AdminBadge,
  CountrySelector,
  ElPulsoLogo,
  InterpretacionBars,
  Logo,
  NoticiaCard,
} from "@/components/shared";

const noticiaEjemplo = {
  id: "1",
  orden: 2,
  titulo: "Ajustes y subsidios al transporte",
  cuerpo:
    "El Gobierno presentó una modificación en el sistema de subsidios al transporte público que afectará principalmente a las áreas metropolitanas y a algunas provincias. Según lo informado, la medida busca redistribuir recursos y reducir el gasto fiscal, aunque distintos sectores advirtieron que podría traducirse en aumentos de tarifas...",
  fuentes_urls: ["https://infobae.com", "https://clarin.com"],
  el_pulso: {
    texto_resumen:
      "Predominó una lectura crítica de la medida, marcada por la preocupación por su impacto social.",
    pct_positiva: 17,
    pct_negativa: 52,
    pct_incierta: 31,
  },
};

export default function DemoPage() {
  return (
    <main className="min-h-dvh bg-bg-base px-5 py-10">
      <div className="mx-auto flex w-full max-w-[800px] flex-col items-start gap-8">
        <Logo variant="small" />
        <Logo variant="large" className="max-w-full" />
        <ElPulsoLogo />
        <CountrySelector />
        <AdminBadge />
        <NoticiaCard noticia={noticiaEjemplo} />
        <InterpretacionBars
          className="w-full max-w-xl"
          pct_positiva={17}
          pct_negativa={52}
          pct_incierta={31}
        />
      </div>
    </main>
  );
}
