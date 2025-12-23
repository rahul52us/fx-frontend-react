export const pcfcInitialValues = {
  drawdownDate: "",
  dueDate: "",
  pcfcInputDate: new Date().toISOString().split("T")[0],
  bank: "",
  tradeReferenceNumber: "",
  currency: "",
  businessUnit: "",

  // 👇 separate values
  enteredDrawdownAmount: "",
  drawdownAmount: 0,

  // Toggles
  isSpotEnabled: false,
  isForwardEnabled: false,

  // Arrays
  spotList: [],
  forwardList: [],

  // Auto-calculated
  drawdownRate: 0,
  floatingInterestRate: "",
  bankSpread: "",
  totalInterestRate: 0,
}