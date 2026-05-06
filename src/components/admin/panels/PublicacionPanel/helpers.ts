import { getStatusColor } from "@/lib/colors";

export { getStatusColor };

// Re-export con nombre legacy para no romper importaciones existentes
export const getPointColor = getStatusColor;
