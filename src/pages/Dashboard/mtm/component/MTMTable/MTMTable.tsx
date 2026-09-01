import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import CustomTable from "../../../../../config/component/CustomTable/CustomTable";
import RestrictedAccess from "../../../../../config/component/common/RestrictedAccess/RestrictedAccess";
import { usePermission } from "../../../../../config/component/customHooks/usePermission";

import store from "../../../../../store/store";

const MTMTable = () => {
  // Permission checks
  const { canView } = usePermission('mtm');


  // const BookingRegisterTableColumns = [
  //   { headerName: "S.No.", key: "sno", props: { row: { textAlign: "center" } } },
  //   { headerName: "Booking Date", key: "bookingDate" },
  //   { headerName: "Deal ID", key: "dealId" },
  //   { headerName: "Exposure Type", key: "exposureType" },
  //   { headerName: "Bank", key: "bank" },
  //   { headerName: "Currency", key: "currency" },
  //   { headerName: "O/S Amount", key: "osAmount" },
  //   { headerName: "Rate Booked", key: "rateBooked" },
  //   { headerName: "Delivery Date From", key: "deliveryDateFrom" },
  //   { headerName: "Delivery Date To", key: "deliveryDateTo" },
  //   { headerName: "Current Fwd. Rate", key: "currentFwdRate" },
  //   { headerName: "MTM in INR", key: "mtmInr" },
  //   {
  //     headerName: "Actions",
  //     key: "table-actions",
  //     type: "table-actions",
  //     props: {
  //       row: { minW: 180, textAlign: "center" },
  //       column: { textAlign: "center" },
  //     },
  //   },
  // ];

const BookingRegisterTableColumns = [
  { headerName: "S.No.", key: "sno", props: { row: { textAlign: "center" } } },

  { headerName: "Booking Date", key: "bookingDate" },

  { headerName: "Deal Ref No.", key: "hedgeDealReferenceNumber" },

  { headerName: "Exposure Type", key: "exposureType" },

  { headerName: "Bank", key: "bank" },

  { headerName: "Business Unit", key: "bussinessUnit" },

  { headerName: "Currency", key: "currency" },

  { headerName: "O/S Amount", key: "outstandingAmount" },

  { headerName: "Rate Booked", key: "hedgeRate" },

  { headerName: "Delivery Date From", key: "dueDateFrom" },

  { headerName: "Delivery Date To", key: "dueDateTo" },

  { headerName: "Current Fwd. Rate", key: "currentForwardRate" },

  { headerName: "MTM in INR", key: "mtmInInr" },

  { headerName: "Created At", key: "createdAt" },

  // {
  //   headerName: "Actions",
  //   key: "table-actions",
  //   type: "table-actions",
  //   props: {
  //     row: { minW: 180, textAlign: "center" },
  //     column: { textAlign: "center" },
  //   },
  // },
];


  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 10;
  const [data, setData] = useState<any[]>([]);
  const { viewAsUserId } = store.auth;

  const fetchmtmData = useCallback(async (currentPage = 1) => {
    // setLoading(true);
    try {
      const baseUrl = process.env.REACT_APP_FX_BASE_URL;
      const response = await axios.post(
        `${baseUrl}/mtmview/view/`,
        { condition: "", page: currentPage, limit: rowsPerPage, userId: viewAsUserId }
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
  }, [rowsPerPage, viewAsUserId]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchmtmData(newPage);
  };

  useEffect(() => {
    fetchmtmData(page);
  }, [viewAsUserId, fetchmtmData, page]);

  return (
    canView ? (
      <>
        <CustomTable
          title="MTM"
          data={data}
          columns={BookingRegisterTableColumns}
          actions={{
            search: { show: false },
              resetData: {
              show: true,
              function: () => fetchmtmData(1), // Reset to page 1
            },
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
    ) : <RestrictedAccess />
  );
};

export default MTMTable;
