import store from "../../../../../store/store";
import { normalizeDate } from "../../../exportsRegister/component/utils/function";

export const exposureRefNumberOptions = [
  { label: "123456", value: "123456" },
  { label: "123457", value: "123457" },
  { label: "123458", value: "123458" },
]

export const calculateHedgeRate = (values: any) => {
  const { exposureType, spotBooked, forwardPoints, bankMargin } = values;

  // Convert string values to numbers, handling empty strings
  const spot = parseFloat(spotBooked) || 0;
  const points = parseFloat(forwardPoints) || 0;
  const margin = parseFloat(bankMargin) || 0;

  if (exposureType && spotBooked && forwardPoints && bankMargin) {
    let calculatedRate = 0;

    if (
      exposureType.toLowerCase().includes("export") ||
      exposureType === "exports" ||
      exposureType === "export"
    ) {
      // For exports: spot booked + forward points - bank margin
      calculatedRate = spot + points - margin;
    } else if (
      exposureType.toLowerCase().includes("import") ||
      exposureType === "imports" ||
      exposureType === "import"
    ) {
      // For imports: spot booked + forward points + bank margin
      calculatedRate = spot + points + margin;
    }
    return calculatedRate.toFixed(2); // Return with precision for rates
  }

  return "";
};

export const getForwardRegisterInitialValues = (editData: any = {}) => ({
  bookingDate: normalizeDate(editData?.bookingDate) || "",
  exposureType: editData?.exposureType ?? "",
  subExposureType: editData?.subExposureType ?? "",
  bank: store.auth.banksData.find((bank: any) => bank.value === editData?.bank) || {},
  bussinessUnit: store.auth.bussinessUnitsData.find((dt: any) => dt.value === editData?.bussinessUnit) || {},
  currency: store.auth.currenciesData.find((dt: any) => dt.value === editData?.currency) || {},

  hedgeDealReferenceNumber: editData?.hedgeDealReferenceNumber ?? "",

  hedgeAmount: editData?.hedgeAmount ?? "",
  spotBooked: editData?.spotBooked ?? "",
  forwardPoints: editData?.forwardPoints ?? "",
  bankMargin: editData?.bankMargin ?? "",
  hedgeRate: editData?.hedgeRate ?? "",

  dueDateFrom: normalizeDate(editData?.dueDateFrom) || "",
  dueDateTo: normalizeDate(editData?.dueDateTo) || "",

  exposureRefs: editData?.exposureRefs ?? [],
});
