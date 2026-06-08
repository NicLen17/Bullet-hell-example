export function formatScore(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }
  return value.toLocaleString("es-ES");
}
