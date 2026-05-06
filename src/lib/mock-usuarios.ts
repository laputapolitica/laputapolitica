export type Usuario = {
  id: number;
  nombre: string;
  email: string;
  fechaDesde: string;
  rol: "Admin" | "Editor" | "Director";
};

export const mockUsuarios: Usuario[] = [
  { id: 1, nombre: "Marcos Buz", email: "marcosbuz@email.com", fechaDesde: "01/01/2026", rol: "Admin" },
  { id: 2, nombre: "Juan Perez", email: "juanperez@email.com", fechaDesde: "15/02/2026", rol: "Editor" },
  { id: 3, nombre: "Ana Garcia", email: "anagarcia@email.com", fechaDesde: "15/02/2026", rol: "Editor" },
  { id: 4, nombre: "Carlos Ruiz", email: "carlosruiz@email.com", fechaDesde: "15/02/2026", rol: "Director" },
];
