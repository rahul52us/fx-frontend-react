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

const getSelectedValue = (value: any) =>
  typeof value === "string" ? value : value?.value;

export const getBankSpreadFromForm = (
  businessUnit: string | { value?: string } | null | undefined,
  bank: string | { value?: string } | null | undefined,
  businessUnits: Array<{ unitCode?: string; banks?: Array<{ bankName?: string; bankSpread?: string }> }> = []
): string => {
  const unitValue = getSelectedValue(businessUnit);
  if (!unitValue) return "";

  const unit = businessUnits.find(
    (item) => item?.unitCode === unitValue || (item as any)?.value === unitValue
  );
  const banks = Array.isArray(unit?.banks) ? unit?.banks ?? [] : [];
  if (!banks.length) return "";

  const bankValue = getSelectedValue(bank);
  const matchedBank =
    banks.find((item) => item?.bankName === bankValue) || banks[0];

  return matchedBank?.bankSpread ?? "";
};

export const createEmptySpotRow = (bankMargin = "") => ({
  conversionRefNo: "",
  amountConverted: "",
  spotBooked: "",
  cashTomSpot: "",
  bankMargin: String(bankMargin),
  netConversionRate: computeSpotNetRate("", "", bankMargin),
});
