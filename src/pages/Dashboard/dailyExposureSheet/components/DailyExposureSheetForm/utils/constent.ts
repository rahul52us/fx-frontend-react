import { normalizeDate } from "../../../../exportsRegister/component/utils/function";

export const dummyForwardRegister = [
  {
    hedgeDealRefNo: "FWD001",
    outstandingAmount: "40000",
    hedgeRate: "82.55",
    deliveryDateFrom: "2025-05-10",
    deliveryDateTo: "2025-05-20",
  },
  {
    hedgeDealRefNo: "FWD002",
    outstandingAmount: "25000",
    hedgeRate: "82.15",
    deliveryDateFrom: "2025-06-01",
    deliveryDateTo: "2025-06-10",
  },
];

export const getExposureSettlementInitialValues = (editData: any) => ({
  settlementDate: normalizeDate(editData?.settlementDate) || "",

  settlementInputDate:
    normalizeDate(editData?.settlementInputDate) ||
    new Date().toISOString().split("T")[0],

  settlementType: editData?.settlementType || "",
  outstandingAmount: editData?.outstandingAmount || "",
  dueDate: normalizeDate(editData?.dueDate) || "",
  exposureType: editData?.exposureType || "",
  poNumber: editData?.poNumber || "", 
  
  invoiceBcNumber: editData?.invoiceBcNumber || "",
  partyName: editData?.partyName || "",

  // 👇 strings only (no objects)
  businessUnit: editData?.businessUnit || "",
  bank: editData?.bank || "",
  currency: editData?.currency || "",

  settledAmount: editData?.settledAmount || "",
  settlementAmount: editData?.settlementAmount || "",

  // === TOGGLES ===
  isSpotEnabled: editData?.isSpotEnabled || false,
  isEEFCExportsEnabled: editData?.isEEFCExportsEnabled || false,
  isEEFCImportsEnabled: editData?.isEEFCImportsEnabled || false,
  isPCFCEnabled: editData?.isPCFCEnabled || false,
  isForwardEnabled: editData?.isForwardEnabled || false,

  // === LISTS ===
  spotList: editData?.spotList || [],
  eefcExportsList: editData?.eefcExportsList || [],
  eefcImportsList: editData?.eefcImportsList || [],
  pcfcList: editData?.pcfcList || [],
  forwardList: editData?.forwardList || [],

  // === SUMMARY ===
  settlementRate: editData?.settlementRate || "",
  settledAmountInINR: editData?.settledAmountInINR || "",
});
