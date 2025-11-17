export function useCurrency() {
  const formatCurrency = (value: number, currency: string = "BRL"): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat("pt-BR").format(value);
  };

  return {
    formatCurrency,
    formatNumber,
  };
}
