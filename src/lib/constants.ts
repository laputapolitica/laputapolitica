// Colores de votación — usados en El Pulso, PublicacionPanel y futuras pantallas
export const VOTE_COLORS = {
  positiva: '#A8D5BA',
  negativa: '#E6A8A1',
  incierta: '#C7C3E6',
  nula: '#E5E3DD',
} as const;

// Colores de puntaje por rango porcentual
export const POINT_COLORS = {
  low: '#FF5C60',    // 0–33%
  medium: '#FAC800', // 33–66%
  high: '#35C759',   // 66–100%
} as const;

// Colores saturados para gráficos (más vivos que los de voto, solo uso en charts)
export const CHART_COLORS = {
  positiva: '#8EDFA1',
  negativa: '#FFA3A6',
} as const;
