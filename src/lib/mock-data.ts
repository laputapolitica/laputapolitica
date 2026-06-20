export interface Noticia {
  id: string;
  orden: number;
  titulo: string;
  cuerpo: string;
  fuentes_urls: string[];
  el_pulso: {
    texto_resumen: string;
    pct_positiva: number;
    pct_negativa: number;
    pct_incierta: number;
  };
}

export interface Edicion {
  id: string;
  fecha: string;
  titulo: string;
  portada_illustracion_url: string;
  noticias: Noticia[];
}

const MOCK_NOTICIAS: Noticia[] = [
  {
    id: "noticia-transporte",
    orden: 1,
    titulo: "El transporte vuelve al centro de la pulseada fiscal",
    cuerpo:
      "El Gobierno reabrió la discusión por los subsidios al transporte en el Área Metropolitana y las provincias reclaman una fórmula más pareja. La tensión aparece en un momento de tarifas sensibles, salarios todavía rezagados y gobernadores que buscan evitar que el ajuste caiga completo sobre los usuarios. En la Casa Rosada sostienen que el esquema anterior era insostenible, mientras los intendentes advierten que un recorte brusco puede afectar la frecuencia y encarecer la vida cotidiana.",
    fuentes_urls: [
      "https://www.argentina.gob.ar/transporte",
      "https://www.boletinoficial.gob.ar/",
    ],
    el_pulso: {
      texto_resumen:
        "La comunidad leyó la medida como una corrección necesaria pero socialmente riesgosa. Predominó la idea de que el sistema necesita orden, aunque sin trasladar todo el costo a quienes viajan todos los días para trabajar o estudiar.",
      pct_positiva: 32,
      pct_negativa: 46,
      pct_incierta: 22,
    },
  },
  {
    id: "noticia-educacion",
    orden: 2,
    titulo: "Universidades y Nación negocian con las aulas llenas",
    cuerpo:
      "Rectores de universidades públicas pidieron una actualización presupuestaria y llevaron al Ministerio de Capital Humano un informe sobre gastos operativos. El oficialismo busca contener el conflicto sin abrir una paritaria política más amplia, mientras estudiantes y docentes preparan nuevas asambleas. La discusión combina números, prestigio institucional y una pregunta incómoda: cuánto margen tiene el ajuste cuando toca educación pública.",
    fuentes_urls: [
      "https://www.argentina.gob.ar/educacion",
      "https://www.cin.edu.ar/",
    ],
    el_pulso: {
      texto_resumen:
        "Entre los opinadores apareció una defensa clara de la universidad pública, mezclada con reclamos de auditoría y eficiencia. La posición dominante no niega revisar gastos, pero rechaza que el financiamiento quede atado solo a la lógica del recorte.",
      pct_positiva: 41,
      pct_negativa: 38,
      pct_incierta: 21,
    },
  },
  {
    id: "noticia-justicia",
    orden: 3,
    titulo: "La Corte queda atrapada en una disputa de poder",
    cuerpo:
      "El debate por las vacantes judiciales volvió a escalar en el Senado y dejó a la Corte Suprema en el centro de una negociación cruzada. El oficialismo necesita acuerdos amplios, la oposición mide costos y los bloques provinciales buscan garantías antes de acompañar. Detrás de los nombres, la discusión real es cuánto control político admite una institución que debería funcionar por encima de la coyuntura.",
    fuentes_urls: [
      "https://www.csjn.gov.ar/",
      "https://www.senado.gob.ar/",
    ],
    el_pulso: {
      texto_resumen:
        "El Pulso mostró desconfianza transversal. Hubo poco entusiasmo por la rosca judicial y una lectura compartida: el problema no son solo los candidatos, sino la falta de reglas creíbles para discutirlos.",
      pct_positiva: 18,
      pct_negativa: 57,
      pct_incierta: 25,
    },
  },
  {
    id: "noticia-energia",
    orden: 4,
    titulo: "Energía promete inversión, pero las tarifas pesan",
    cuerpo:
      "El Gobierno presentó nuevas metas para ampliar la producción energética y atraer capital privado al sector. Las empresas celebran señales de previsibilidad, aunque los hogares miran la boleta con menos paciencia. El desafío político es conocido: ordenar precios relativos sin convertir cada aumento en una derrota social. Las provincias productoras, mientras tanto, piden infraestructura y reglas estables.",
    fuentes_urls: [
      "https://www.argentina.gob.ar/economia/energia",
      "https://www.enargas.gob.ar/",
    ],
    el_pulso: {
      texto_resumen:
        "La reacción fue ambivalente. Muchos ven en la energía una oportunidad de crecimiento, pero el apoyo baja cuando la conversación pasa de inversiones futuras a tarifas presentes. La paciencia social aparece como el recurso más escaso.",
      pct_positiva: 44,
      pct_negativa: 34,
      pct_incierta: 22,
    },
  },
  {
    id: "noticia-relaciones-internacionales",
    orden: 5,
    titulo: "La diplomacia argentina busca socios sin red",
    cuerpo:
      "Cancillería intenta ordenar una agenda internacional marcada por gestos fuertes, prioridades económicas y vínculos todavía frágiles con aliados tradicionales. El Gobierno apuesta a mostrar alineamiento ideológico y apertura comercial, pero empresarios y diplomáticos piden bajar el ruido para convertir afinidad política en resultados concretos. La política exterior entra así en una fase menos discursiva y más medible.",
    fuentes_urls: [
      "https://www.cancilleria.gob.ar/",
      "https://www.mrec.gob.ar/",
    ],
    el_pulso: {
      texto_resumen:
        "Los opinadores valoraron la búsqueda de nuevos mercados, aunque con dudas sobre el costo de una diplomacia demasiado personalista. La palabra que más se repitió fue pragmatismo: menos épica y más resultados.",
      pct_positiva: 36,
      pct_negativa: 29,
      pct_incierta: 35,
    },
  },
];

export function getEdicionMock(fecha: string): Edicion {
  return {
    id: `edicion-${fecha}`,
    fecha,
    titulo: "Equilibrio ciego",
    portada_illustracion_url: "/placeholder.svg",
    noticias: MOCK_NOTICIAS,
  };
}
