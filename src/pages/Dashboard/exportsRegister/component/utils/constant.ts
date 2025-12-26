export const currencyOptions = [
  { label: "USDINR", value: "USDINR" },
  { label: "EURINR", value: "EURINR" },
  { label: "CNYINR", value: "CNYINR" },
  { label: "GBPINR", value: "GBPINR" },
  { label: "JPYINR", value: "JPYINR" },
  { label: "CHFINR", value: "CHFINR" },
  { label: "RUBINR", value: "RUBINR" },
  { label: "AEDINR", value: "AEDINR" },
  { label: "SEKINR", value: "SEKINR" },
  { label: "SGDINR", value: "SGDINR" },
  { label: "BRLINR", value: "BRLINR" },
  { label: "CADINR", value: "CADINR" },
  { label: "INRKRW", value: "INRKRW" },
  { label: "AUDINR", value: "AUDINR" },
  { label: "TRYINR", value: "TRYINR" },
  { label: "INRIDR", value: "INRIDR" },
  { label: "ZARINR", value: "ZARINR" },
  { label: "INRARS", value: "INRARS" },
  { label: "SARINR", value: "SARINR" },
  { label: "MXNINR", value: "MXNINR" },
];


export const exposureTypeOptions = [
  { label: "Exports", value: "export" },
  { label: "Imports", value: "import" },
];

export const exportRegisterexposureTypeOptions = [
  { label: "Shipment", value: "shipment" },
  { label: "Confirmed Order", value: "confirmed_order" },
];

export const priorityOptions = [
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

export const monthsOptions = [
  { label: "January", value: "january" },
  { label: "February", value: "february" },
  { label: "March", value: "march" },
  { label: "April", value: "april" },
  { label: "May", value: "may" },
  { label: "June", value: "june" },
  { label: "July", value: "july" },
  { label: "August", value: "august" },
  { label: "September", value: "september" },
  { label: "October", value: "october" },
  { label: "November", value: "november" },
  { label: "December", value: "december" },
];

export const settlementTypeOptions = [
  { label: "Advance", value: "advance" },
  { label: "Regular", value: "regular" },
];
export const conversionTypeOptions = [
  { label: "Spot", value: "spot" },
  { label: "EEFC", value: "eefc" },
];

export const modeOfConversionOptions = [
  { label: "Spot Conversion", value: "spotConversion" },
  { label: "EEFC Conversion", value: "eefcConversion" },
  { label: "PCFC Repayment", value: "pcfcRepayment" },
  { label: "Forward Contract", value: "forwardContract" },
];

export const pcfcModeOfConversionOptions = [
  { label: "Spot Conversion", value: "spot" },
  { label: "Forward", value: "forward" },
];

export const dealTypeOptions = [
  { label: "A", value: "a" },
  { label: "B", value: "b" },
];

// dummy data export register

export const dummyExportRegisterData = [
  {
    exposureType: "imports",
    exposureInputDate: "2025-07-10",
    exposureModificationDate: "2025-07-15",
    poDate: "2025-07-12",
    poNo: "PO987654",
    invoiceNo: "INV54321",
    invoiceDate: "2025-07-13",
    partyName: "Acme Trading Co.",
    bank: "HDFC Bank",
    businessUnit: "Export Division",
    blDate: "2025-07-14",
    paymentTerms: "30",
    currency: "EUR",
    amount: "750000",
    budgetRate: "1.12",
    hedgeDealRefNo: "HDR123456",
    remark: "Urgent shipment, priority clearance",
  },
];

export const exposureSettlementReport = [
  {
    settlementDate: "2025-08-08",
    settlementInputDate: "2025-08-09",
    exposureType: "Export",
    settlementType: "Partial",
    poNumber: "PO123456",
    invoiceBcNumber: "INV789012",
    modeOfConversion: "eefc",
    conversionReferenceNumber: "CRN456789",
    settledAmount: "150000.50",
    forwardPremiumReveresed: "500.00",
    spotBooked: "149500.50",
    cashTomSpot: "100.00",
    bankMargin: "0.50",
  },
];

export const dummyPcfcData = [
  {
    drawdownDate: "2025-06-10",
    modeOfConversion: "Spot",
    bank: "ABC Bank",
    tradeReferenceNumber: "TRN12345",
    currency: "USD",
    drawdownAmount: 250000,
    drawdownRate: 83.45,
    floatingInterestRate: 2.5,
    bankSpread: 0.5,
    totalInterestRate: 3.0,
    dueDate: "2025-06-24",
  },
];

export const dummyEefcData = [
  {
    bussinessUnit: "5",
    exposureReferenceNumber: "6787",
    exposureType: "exports",
    settlementDate: "2025-08-19",
    bank: "bank name",
    referenceRate: "3",
    currency: "IND",
    amount: "4000",
    closingBalance: "7",
    closingBalanceInInr: "700",
    weightedAverageRate: "4",
  },
];

export const dummyForwardRegisterData = [
  {
    exposureType: "import",
    bookingDate: "2025-07-10",
    dueDateFrom: "2025-07-20",
    dueDateTo: "2025-07-25",
    bank: "HDFC Bank",
    bussinessUnit: "1",
    exposureRefNumber: "REF-001",
    currency: "USD",
    hedgeAmount: "50000",
    hedgeDealReferenceNumber: "HDR-1001",
    hedgeRate: "83.5",
    spotBooked: "82.9",
    forwardPoints: "0.6",
    bankMargin: "1.2",
  },
];

export const dymmyForwardCancellationData = [
  {
    dealType: "a",
    exposureType: "confirmed_order",
    transactionDate: "2025-06-04",
    forwardDealId: "43",
    bank: "bank name",
    pcfcRefNumber: "45",
    currency: "USD",
    amount: 56,
    bookedRate: 4,
    spotBooked: 344,
    forwardPremium: 234,
    cashTomSpot: 234,
    bankMargin: 0,
  },
];

export const dummyImportRegisterData = [
  {
    exposureType: "shipment",
    exposureInputDate: "2025-06-11",
    poDate: "2025-06-12",
    blDate: "2025-06-11",
    collectionDate: "2025-06-20",
    exposureModificationDate: "2025-06-15",
    amount: "56",
    adjustmentAmount: "3",
    currency: "IND",
    budgetRate: "4",
    hedgedAmount: "8",
    dueDate: "2025-06-24",
    hedgeDealRefNo: "234",
    poNo: "234234",
    invoiceNo: "5",
    invoiceDate: "2025-06-15",
    businessUnit: "-",
    partyName: "ABC Corp",
    bank: "23e",
    paymentTerms: "Net 30",
    forwardContractNo: "3259887478",
    priority: "high",
    bookedForwardRate: 0,
    remark: "Sample remark for shipment",
  },
];

export const dummyExporPOtData = [
  {
    poNo: "899",
    poDate: "15.10.2025",
    partyName: "name",
    bank: "bank name",
    businessUnit: "7",
    paymentTerms: "100",
    currency: "USD",
    budgetRate: "8",
    outStandingAmount: "100000",
  },
  {
    poNo: "8996666",
    poDate: "15.10.2025",
    partyName: "name",
    bank: "bank name",
    businessUnit: "7",
    paymentTerms: "200",
    currency: "USD",
    budgetRate: "8",
    outStandingAmount: "2300",
  },
]







// const validationSchema = Yup.object({
//     exposureType: Yup.string().required("Exposure Type is required"),
//     poNo: Yup.string().required("PO No is required"),
//     invoiceNo: Yup.string().when("exposureType", {
//       is: (val: string) => val !== "confirmed_order",
//       then: (schema) => schema.required("Invoice No is required"),
//       otherwise: (schema) => schema.notRequired(),
//     }),
//     partyName: Yup.string().required("Party Name is required"),
//     bank: Yup.string().required("Bank is required"),
//     businessUnit: Yup.string().required("Business Unit is required"),
//     paymentTerms: Yup.number().required("Payment terms is required"),
//     currency: Yup.string().required("Currency is required"),

//     amount: Yup.number()
//       .required("Amount is required")
//       .when(["exposureType", "outStandingAmount"], {
//         is: (exposureType: string, outStandingAmount: any) =>
//           exposureType === "shipment" && !!outStandingAmount,
//         then: (schema) =>
//           schema.test("max-outStandingAmount", function (value) {
//             const { outStandingAmount } = this.parent;
//             if (value && outStandingAmount && value > outStandingAmount) {
//               return this.createError({
//                 message: `Amount must be less than or equal to Outstanding Amount (${outStandingAmount})`,
//               });
//             }
//             return true;
//           }),
//         otherwise: (schema) => schema,
//       }),

//     budgetRate: Yup.string().required("Budget Rate is required"),

//     // Date Validations
//     poDate: Yup.string().required("PO Date is required"),
//     invoiceDate: Yup.date()
//       .transform((value, originalValue) => originalValue ? new Date(originalValue) : value)
//       .when("exposureType", {
//         is: (val: string) => val !== "confirmed_order",
//         then: (schema) => schema.required("Invoice Date is required"),
//         otherwise: (schema) => schema.notRequired(),
//       })
//       .when("poDate", (poDate: any, schema: any) => {
//         if (!poDate || !Date.parse(poDate)) return schema;
//         return schema.min(new Date(poDate), "Invoice Date must be after PO Date");
//       }),
      
//     blDate: Yup.string()
//       .required("BL Date is required")
//       .test(
//         "bl-date-range",
//         "BL Date must be between PO Date and Due Date",
//         function (value) {
//           const { poDate, dueDate } = this.parent;
//           if (!value || !poDate || !dueDate) return true;
//           const blDate = new Date(value);
//           const poDateObj = new Date(poDate);
//           const dueDateObj = new Date(dueDate);
//           if(isNaN(blDate.getTime()) || isNaN(poDateObj.getTime()) || isNaN(dueDateObj.getTime())) return true;
//           return blDate >= poDateObj && blDate <= dueDateObj;
//         }
//       ),
//     dueDate: Yup.date()
//       .transform((value, originalValue) => originalValue ? new Date(originalValue) : value)
//       .required("Due Date is required")
//       .when("blDate", (blDate: any, schema: any) => {
//         if (!blDate || !Date.parse(blDate)) return schema;
//         return schema.min(new Date(blDate), "Due Date must be after BL Date");
//       })
//       .when("poDate", (poDate: any, schema: any) => {
//         if (!poDate || !Date.parse(poDate)) return schema;
//         return schema.min(new Date(poDate), "Due Date must be after PO Date");
//       }),
//   });