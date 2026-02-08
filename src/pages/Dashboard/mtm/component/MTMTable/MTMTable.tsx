import axios from "axios";
import { useEffect, useState } from "react";
import CustomTable from "../../../../../config/component/CustomTable/CustomTable";

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

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 10;
  const [data, setData] = useState<any[]>([]);

  const fetchExportRegisterData = async (currentPage = 1) => {
    // setLoading(true);
    try {
      const response = await axios.post(
        "http://srv864630.hstgr.cloud:8000/mtm/view/",
        { condition: "", page: currentPage, limit: rowsPerPage }
      );

      console.log(response)
      const result = response.data?.data?.data || [];
      const total = response.data?.data?.total_pages || 1;
      const withSerial = result.map((item: any, idx: number) => ({
        ...item,
        sno: (currentPage - 1) * rowsPerPage + idx + 1,
      }));
      setData(withSerial);
      setTotalPages(total);
    } catch (error) {
      console.error("Error fetching export register data:", error);
    } finally {
      // setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchExportRegisterData(newPage);
  };

  useEffect(() => {
    fetchExportRegisterData(page);
  }, [])

  return (
    <>
      <CustomTable
        title="MTM"
        data={data}
        columns={BookingRegisterTableColumns}
        actions={{
          search: { show: false },
          pagination: {
            show: true,
            onClick: handlePageChange,
            currentPage: page,
            totalPages: totalPages,
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
