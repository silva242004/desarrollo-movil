// Props comunes de las tres misiones: la pagina contenedora les pasa que
// hacer al completarse (despachar al contexto y mostrar el resultado).
export interface MissionProps {
  onComplete: () => void;
}
