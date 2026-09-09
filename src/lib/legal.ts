// The documents retain their own literal text; update them separately when these details change.
export const LEGAL = {
  ownerName: "Marcos Buzolich",
  contactEmail: "hola@laputapolitica.com",
  jurisdiction: "Ciudad Autónoma de Buenos Aires, República Argentina",
  lastUpdated: "2026-09-09",
  minimumAge: 16,
} as const;

export const LEGAL_DOCUMENTS = {
  terms: {
    href: "/terminos",
    title: "Términos y Condiciones",
    fileName: "terminos-y-condiciones.md",
    description: "Condiciones de uso de La Puta Política y requisitos para participar como opinador en El Pulso.",
  },
  privacy: {
    href: "/privacidad",
    title: "Política de Privacidad",
    fileName: "politica-de-privacidad.md",
    description: "Cómo La Puta Política trata tus datos personales, con quién los comparte y cómo ejercer tus derechos.",
  },
} as const;
