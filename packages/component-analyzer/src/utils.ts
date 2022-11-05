export function formatNumberAsPercentage(count: number, total: number) {
  if (total === 0) return NaN;
  const percent = (count / total) * 100;
  return `${percent.toFixed(2)}%`;
}
