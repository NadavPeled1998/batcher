export const formatNumber = (
  number: number,
  decimals: number = 2,
  locale: string = "en-US"
): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(number);
};

