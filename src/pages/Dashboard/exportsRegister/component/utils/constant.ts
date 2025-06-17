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
    exposureType: "Export",
    exposureInputDate: "2025-06-01",
    poDate: "2025-05-15",
    blDate: "2025-05-20",
    collectionDate: "2025-06-05",
    amount: "100000",
    adjustmentAmount: "5000",
    currency: "USD",
    budgetRate: "74.5",
    hedgedAmount: "95000",
    invoiceNo: "INV-001",
    poNo: "PO-001",
    partyName: "ABC Exports Pvt Ltd",
    bank: "HDFC Bank",
    paymentTerms: "NET30",
    forwardContractNo: "FC-001",
    priority: "High",
    bookedForwardRate: "75.2",
    remark: "First export shipment",
  },
  {
    exposureType: "Import",
    exposureInputDate: "2025-06-03",
    poDate: "2025-05-18",
    blDate: "2025-05-23",
    collectionDate: "2025-06-08",
    amount: "75000",
    adjustmentAmount: "2000",
    currency: "EUR",
    budgetRate: "80.1",
    hedgedAmount: "73000",
    invoiceNo: "INV-002",
    poNo: "PO-002",
    partyName: "XYZ Imports Ltd",
    bank: "ICICI Bank",
    paymentTerms: "NET45",
    forwardContractNo: "FC-002",
    priority: "Medium",
    bookedForwardRate: "81.0",
    remark: "Urgent delivery required",
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
    month: "March",
    exposureType: "shipment",
    deliveryDateFrom: "2025-06-03",
    bookingDate: "2025-06-12",
    deliveryDateTo: "2025-06-05",
    bank: "23e",
    dealId: "234",
    currency: "USD",
    originalAmount: 23,
    spotBooked: 234,
    bankMargin: 6,
    forwardPoints: 45,
    priority: "medium",
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
