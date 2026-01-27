import { normalizeDate } from "../../../../exportsRegister/component/utils/function"

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

export const getPcfcInitialValues = (editData:any) => ({
  drawdownDate: normalizeDate(editData?.drawdownDate) || "",
  dueDate:normalizeDate(editData?.dueDate) || "",
  pcfcInputDate:
    normalizeDate(editData?.pcfcInputDate) ||
   "",

  bank: editData?.bank || "",
  tradeReferenceNumber: editData?.tradeReferenceNumber || "",
  currency: editData?.currency || "",
  businessUnit: editData?.businessUnit || "",

  // 👇 separate values
  enteredDrawdownAmount: editData?.enteredDrawdownAmount || "",
  drawdownAmount: editData?.drawdownAmount || 0,

  // Toggles
  isSpotEnabled: editData?.isSpotEnabled || false,
  isForwardEnabled: editData?.isForwardEnabled || false,

  // Arrays
  spotList: editData?.spotList || [],
  // forwardList:
  //   editData.forwardList?.map((f: any) => ({
  //     ...f,
  //     deliveryDateFrom: normalizeDate(f.deliveryDateFrom),
  //     deliveryDateTo: normalizeDate(f.deliveryDateTo),
  //   })) ?? [],
  forwardList: editData?.forwardList || [],

  // Auto-calculated
  drawdownRate: editData?.drawdownRate || 0,
  floatingInterestRate: editData?.floatingInterestRate || "",
  bankSpread: editData?.bankSpread || "",
  totalInterestRate: editData?.totalInterestRate || 0,
});
