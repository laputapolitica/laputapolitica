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
