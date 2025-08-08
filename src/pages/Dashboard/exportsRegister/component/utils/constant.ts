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
    exposureType: "shipment",
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
    paymentTerms: "Net 30",
    currency: "EUR",
    amount: "750000",
    budgetRate: "1.12",
    hedgeDealRefNo: "HDR123456",
    remark: "Urgent shipment, priority clearance",
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
