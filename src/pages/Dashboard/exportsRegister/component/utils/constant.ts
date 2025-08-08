export const currencyOptions = [
  { label: "IND", value: "IND" },
  { label: "USD", value: "USD" },
  { label: "EUR", value: "EUR" },
  { label: "GBP", value: "GBP" },
];

export const exposureTypeOptions = [
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
  { label: "Advanced", value: "advanced" },
  { label: "General", value: "general" },
];
export const conversionTypeOptions = [
  { label: "Spot", value: "spot" },
  { label: "EEFC", value: "eefc" },
];

export const dealTypeOptions = [
  { label: "A", value: "a" },
  { label: "B", value: "b" },
];

// dummy data export register

export const dummyExportRegisterData = [
  {
    month: "december",
    exposureType: "shipment",
    settlementType: "general",
    conversionType: "eefc",
    transactionDate: "2025-07-02",
    documentDueDate: "2025-07-02",
    poNumber: "1342343",
    invoiceLcBcNumber: "1342332",
    dealNumber: "13123",
    bank: "PNB",
    currency: "1312344",
    amount: "13423344",
    forwardPremium: "1233244",
    spotBooked: "13423344",
    cashTomSpot: "1323144",
    bankMargin: "134123",
    benchmarkRate: "234",
  },
];

export const dummyPcfcData = [
  {
    month: "March",
    drawdownDate: "2025-06-10",
    bank: "23e3",
    currency: "USD",
    dealId: "2343",
    originalAmount: 232000,
    drawdownRate: 2343,
    maturity: "2025-06-24",
    interestRate: 5.3,
    conversionBasic: "asd",
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
    bankMargin: "1.2"
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
    amount: "56",
    adjustmentAmount: "3",
    currency: "IND",
    budgetRate: "4",
    hedgedAmount: "8",
    poNo: "234234",
    invoiceNo: "5",
    partyName: "ABC Corp",
    bank: "23e",
    paymentTerms: "Net 30",
    forwardContractNo: "3259887478",
    priority: "high",
    bookedForwardRate: 0,
    remark: "Sample remark for shipment",
  },
];
