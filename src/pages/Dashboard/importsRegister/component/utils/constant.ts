export const currencyOptions = [
  { label: 'IND', value: 'IND' },
  { label: 'USD', value: 'USD' },
  { label: 'EUR', value: 'EUR' },
  { label: 'GBP', value: 'GBP' },
];

export const exposureTypeOptions = [
  { label: 'Shipment', value: 'shipment' },
  { label: 'Confirmed Order', value: 'confirmed_order' },
]

export const importExposureTypeOptions = [
  { label: 'DA/DP', value: 'da_dp' },
  { label: 'LC/BC Shifting', value: 'lc_bc_shifting' },
  { label: 'LC/BC Direct', value: 'lc_bc_direct' },
]


export const priorityOptions = [
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
]

export const monthsOptions = [
  { label: 'January', value: 'january' },
  { label: 'February', value: 'february' },
  { label: 'March', value: 'march' },
  { label: 'April', value: 'april' },
  { label: 'May', value: 'may' },
  { label: 'June', value: 'june' },
  { label: 'July', value: 'july' },
  { label: 'August', value: 'august' },
  { label: 'September', value: 'september' },
  { label: 'October', value: 'october' },
  { label: 'November', value: 'november' },
  { label: 'December', value: 'december' },
]

export const settlementTypeOptions = [
  { label: 'Advanced', value: 'advanced' },
  { label: 'General', value: 'general' },
]
export const conversionTypeOptions = [
  { label: 'Spot', value: 'spot' },
  { label: 'EEFC', value: 'eefc' },
]

export const dealTypeOptions = [
  { label: 'A', value: 'a' },
  { label: 'B', value: 'b' },
]



export const dummyPoData = [
  {
    sno: 1,
    poNo: "PO001",
    poDate: "2025-09-10",
    partyName: "ABC Exports Pvt Ltd",
    bank: "HDFC Bank",
    businessUnit: "Import Division A",
    paymentTerms: "30 Days",
    currency: "USD",
    budgetRate: "83.25",
    label: "PO001",
    value: "PO001",
  },
  {
    sno: 2,
    poNo: "PO002",
    poDate: "2025-09-15",
    partyName: "Global Traders Co",
    bank: "ICICI Bank",
    businessUnit: "Import Division B",
    paymentTerms: "60 Days",
    currency: "EUR",
    budgetRate: "89.75",
    label: "PO002",
    value: "PO002",
  },
  {
    sno: 3,
    poNo: "PO003",
    poDate: "2025-09-20",
    partyName: "Zenith International",
    bank: "SBI",
    businessUnit: "Import Division C",
    paymentTerms: "45 Days",
    currency: "JPY",
    budgetRate: "0.57",
    label: "PO003",
    value: "PO003",
  },
]