// Convierte cualquier error (Error, string, objeto de plugin) en texto.
export function errorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === 'string') return e;
  const maybe = (e as { message?: string } | null)?.message;
  return maybe ?? 'Error desconocido';
}
