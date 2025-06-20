import CustomTable from "../../../../../config/component/CustomTable/CustomTable";
const bookingRegisterDummyData = [
  {
    sno: 2,
    bookingDate: "2025-02-05",
    dealId: "125036000823",
    exposureType: "Exports",
    bank: "Citi",
    currency: "INR",
    osAmount: 108500,
    rateBooked: 87.7950,
    deliveryDateFrom: "2025-05-20",
    deliveryDateTo: "2025-05-20",
    currentFwdRate: 86.0798,
    mtmInr: 186096,
  },
  {
    sno: 3,
    bookingDate: "2025-02-12",
    dealId: "6122425FP0B00052",
    exposureType: "Exports",
    bank: "SBI",
    currency: "INR",
    osAmount: 156000,
    rateBooked: 87.6000,
    deliveryDateFrom: "2025-06-30",
    deliveryDateTo: "2025-06-30",
    currentFwdRate: 86.2966,
    mtmInr: 203326,
  },
  {
    sno: 4,
    bookingDate: "2025-02-21",
    dealId: "125052001862",
    exposureType: "Exports",
    bank: "Citi",
    currency: "INR",
    osAmount: 24000,
    rateBooked: 87.0260,
    deliveryDateFrom: "2025-04-30",
    deliveryDateTo: "2025-04-30",
    currentFwdRate: 85.9741,
    mtmInr: 25246,
  },
];

const MTMTable = () => {
const BookingRegisterTableColumns = [
  { headerName: "S.No.", key: "sno", props: { row: { textAlign: "center" } } },
  { headerName: "Booking Date", key: "bookingDate" },
  { headerName: "Deal ID", key: "dealId" },
  { headerName: "Exposure Type", key: "exposureType" },
  { headerName: "Bank", key: "bank" },
  { headerName: "Currency", key: "currency" },
  { headerName: "O/S Amount", key: "osAmount" },
  { headerName: "Rate Booked", key: "rateBooked" },
  { headerName: "Delivery Date From", key: "deliveryDateFrom" },
  { headerName: "Delivery Date To", key: "deliveryDateTo" },
  { headerName: "Current Fwd. Rate", key: "currentFwdRate" },
  { headerName: "MTM in INR", key: "mtmInr" },
];

  return (
    <>
      <CustomTable
        title="MTM"
        data={bookingRegisterDummyData}
        columns={BookingRegisterTableColumns}
        actions={{
          search: { show: false },
          pagination: {
            show: false,
            onClick: () => {},
            currentPage: 1,
            totalPages: 1,
          },
          actionBtn: {
            editKey: { showEditButton: false },
            deleteKey: { showDeleteButton: false },
          },
        }}
        loading={false}
      />
    </>
  );
};

export default MTMTable;
