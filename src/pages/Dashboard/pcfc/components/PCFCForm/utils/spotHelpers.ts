export const computeSpotNetRate = (
  spotBooked: string | number,
  cashTomSpot: string | number,
  bankMargin: string | number
): string => {
  const spot = parseFloat(String(spotBooked)) || 0;
  const cashTom = parseFloat(String(cashTomSpot)) || 0;
  const margin = parseFloat(String(bankMargin)) || 0;
  const netRate = spot - cashTom - margin;
  return netRate ? netRate.toFixed(4) : "0.0000";
};

export const getBankMarginFromForm = (
  bank: string | { value?: string } | null | undefined,
  banksData: Array<{ value: string; bankMargin?: string }>
): string => {
  const bankValue = typeof bank === "string" ? bank : bank?.value;
  const found = banksData.find((b) => b.value === bankValue);
  return found?.bankMargin ?? "";
};

export const createEmptySpotRow = (bankMargin = "") => ({
  conversionRefNo: "",
  amountConverted: "",
  spotBooked: "",
  cashTomSpot: "",
  bankMargin: String(bankMargin),
  netConversionRate: computeSpotNetRate("", "", bankMargin),
});
