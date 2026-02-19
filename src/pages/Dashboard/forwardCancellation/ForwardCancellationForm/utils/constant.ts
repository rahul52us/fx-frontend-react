import { normalizeDate } from "../../../exportsRegister/component/utils/function";

export const getForwardCancellationInitialValues = (editData: any) => ({
  dealType: editData?.dealType || "Cancellation",

  transactionDate: normalizeDate(editData?.transactionDate) || "",

  forwardDealId: editData?.forwardDealId || "",
  exposureType: editData?.exposureType || "",

  // 👇 return string directly (not object)
  bank: editData?.bank || "",
  currency: editData?.currency || "",
  businessUnit: editData?.businessUnit || "",

  outstandingAmount: editData?.outstandingAmount || "",
  bookedRate: editData?.bookedRate || "",

  deliveryDateFrom: normalizeDate(editData?.deliveryDateFrom) || "",
  deliveryDateTo: normalizeDate(editData?.deliveryDateTo) || "",

  bankMargin: editData?.bankMargin || "",
  cancellationAmount: editData?.cancellationAmount || "",

  spotBooked: editData?.spotBooked || "",
  fwdPremium: editData?.fwdPremium || "",
  cashTomSpot: editData?.cashTomSpot || "",

  netCancellationRate: editData?.netCancellationRate || "",
  plInFCY: editData?.plInFCY || "",
  washRate: editData?.washRate || "",
  plInINR: editData?.plInINR || "",
});



// export const getForwardCancellationInitialValues = (editData: any) => ({
//   dealType: editData?.dealType || "Cancellation",

//   transactionDate: normalizeDate(editData?.transactionDate) || "",

//   forwardDealId: editData?.forwardDealId || "",
//   exposureType: editData?.exposureType || "",

//   bank:
//     store.auth.banksData.find(
//       (bank: any) => bank.value === editData?.bank
//     ) || {},

//   currency:
//     store.auth.currenciesData.find(
//       (dt: any) => dt.value === editData?.currency
//     ) || {},

//   businessUnit:
//     store.auth.bussinessUnitsData.find(
//       (dt: any) => dt.value === editData?.businessUnit
//     ) || {},

//   outstandingAmount: editData?.outstandingAmount || "",
//   bookedRate: editData?.bookedRate || "",

//   deliveryDateFrom: normalizeDate(editData?.deliveryDateFrom) || "",
//   deliveryDateTo: normalizeDate(editData?.deliveryDateTo) || "",

//   bankMargin: editData?.bankMargin || "",
//   cancellationAmount: editData?.cancellationAmount || "",

//   spotBooked: editData?.spotBooked || "",
//   fwdPremium: editData?.fwdPremium || "",
//   cashTomSpot: editData?.cashTomSpot || "",

//   netCancellationRate: editData?.netCancellationRate || "",
//   plInFCY: editData?.plInFCY || "",
//   washRate: editData?.washRate || "",
//   plInINR: editData?.plInINR || "",
// });
