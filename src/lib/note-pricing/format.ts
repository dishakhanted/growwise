const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(Math.round(value));
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatSignedCurrency(value: number): string {
  const formatted = formatCurrency(Math.abs(value));
  if (value < 0) {
    return `(${formatted})`;
  }
  return formatted;
}

export function formatSignedPercent(value: number): string {
  const formatted = formatPercent(Math.abs(value));
  if (value < 0) {
    return `(${formatted})`;
  }
  return formatted;
}
