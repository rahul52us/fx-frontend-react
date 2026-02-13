import {
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import CustomDrawer from "../../../../config/component/Drawer/CustomDrawer";
import CustomTable from "../../../../config/component/CustomTable/CustomTable";
import { dymmyForwardCancellationData } from "../../exportsRegister/component/utils/constant";
import {
  exportToExcel,
  importFromExcel,
} from "../../exportsRegister/component/utils/function";
import ForwardCancellationForm from "../ForwardCancellationForm/ForwardCancellationForm";
import { useDeleteItem } from "../../../../config/component/customHooks/useDeleteItem";
import { usePermission } from "../../../../config/component/customHooks/usePermission";
import RestrictedAccess from "../../../../config/component/common/RestrictedAccess/RestrictedAccess";

const ForwardCancellationTable = () => {
  const [exportData, setExportData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const url = process.env.REACT_APP_FX_BASE_URL
  const { deleteItem } = useDeleteItem();

  // Permission checks
  // Permission checks
  const { canAdd, canEdit, canDelete, canView } = usePermission('forwardCancellation');

  const submitExportForm = async (values: any, actions: any, type: string) => {
    try {
      let payload = {
        userToken: "abcxyz",
        data: type === "excel" ? values : [values],
      };
      const response = await axios.post(
        `${url}/forwardCancellationpcfc/form/`,
        payload
      );
      console.log('response-------', response)

      if (response.status === 200 && response.data.status === "success") {
        toast({
          title: "Success",
          description: response.data.message,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        if (onClose) {
          onClose();
        }
        if (fetchExportRegisterData) {
          fetchExportRegisterData();
        }
        actions.resetForm();
      } else {
        toast({
          title: "Submission failed",
          description: "Unexpected server response.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      actions.setSubmitting(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const data = await importFromExcel(file);
      await submitExportForm(data, {}, "excel");
    } catch (err) {
      console.error("Excel import failed", err);
    }
  };

  /* ---------------- Fetch Data ---------------- */

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 10;

  const fetchExportRegisterData = async (currentPage = 1) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${url}/forwardCancellationpcfc/view/`,
        { userToken: "abcxyz", page: currentPage, limit: rowsPerPage }
      );
      const result = response.data?.data?.data || [];
      const total = response.data?.data?.total_pages || 1;
      const withSerial = result.map((item: any, idx: number) => ({
        ...item,
        sno: (currentPage - 1) * rowsPerPage + idx + 1,
      }));
      setExportData(withSerial);
      setTotalPages(total);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchExportRegisterData(newPage);
  };

  useEffect(() => {
    if (!canView) return;
    fetchExportRegisterData(page);
  }, []);

  const DealDataColumns = [
    { headerName: "Deal Type", key: "dealType" },
    { headerName: "Exposure Type", key: "exposureType" },
    { headerName: "Transaction Date", key: "transactionDate" },
    { headerName: "Created Date", key: "createdAt" },

    { headerName: "Forward Deal ID", key: "forwardDealId" },
    { headerName: "PO Number", key: "poNumber" },

    { headerName: "Bank", key: "bank" },
    { headerName: "Business Unit", key: "businessUnit" },
    { headerName: "Currency", key: "currency" },

    { headerName: "Outstanding Amount", key: "outstandingAmount" },
    { headerName: "Cancellation Amount", key: "cancellationAmount" },

    { headerName: "Booked Rate", key: "bookedRate" },
    { headerName: "Spot Booked", key: "spotBooked" },
    { headerName: "Forward Premium", key: "fwdPremium" },
    { headerName: "Cash Tom Spot", key: "cashTomSpot" },
    { headerName: "Bank Margin", key: "bankMargin" },

    { headerName: "Delivery Date From", key: "deliveryDateFrom" },
    { headerName: "Delivery Date To", key: "deliveryDateTo" },

    { headerName: "Net Cancellation Rate", key: "netCancellationRate" },
    { headerName: "P/L in FCY", key: "plInFCY" },
    { headerName: "P/L in INR", key: "plInINR" },
    { headerName: "Wash Rate", key: "washRate" },

    {
      headerName: "Actions",
      key: "table-actions",
      type: "table-actions",
      props: {
        row: { minW: 180, textAlign: "center" },
        column: { textAlign: "center" },
      },
    },
  ];

  return (
    canView ? (
      <>
        <CustomTable
          title="Forward Cancellation"
          data={exportData}
          columns={DealDataColumns}
          actions={{
            search: { show: false },
            resetData: {
              show: false,
              text: "Reset Data",
              function: () => fetchExportRegisterData(1),
            },
            exportExcel: {
              show: true,
              text: "Export Excel",
              function: () =>
                exportToExcel({
                  // columns: DealDataColumns,
                  data: dymmyForwardCancellationData,
                  fileName: "Forward_Cancellation.xlsx",
                }),
            },
            uploadFile: {
              show: true,
              text: "Upload Excel",
              function: (e: any) => handleFileUpload(e),
            },
            pagination: {
              show: true,
              onClick: handlePageChange,
              currentPage: page,
              totalPages: totalPages,
            },
            actionBtn: {
              addKey: {
                showAddButton: canAdd,
                function: onOpen,
              },
              editKey: { showEditButton: canEdit },
              deleteKey: {
                showDeleteButton: canDelete,
                function: (row: any) =>
                  deleteItem({
                    url: `${url}/delup/deleterow/`,
                    rowId: row.rowId,
                    formType: "forwardCancellationPcfc",
                    refetch: fetchExportRegisterData,
                  }),
              },
            },
          }}
          loading={loading}
        />

        <CustomDrawer
          open={isOpen}
          close={onClose}
          title="Add Forward Cancellation Entry"
          size="xl"
          width="75vw"
        >
          <ForwardCancellationForm submitForm={submitExportForm} />
        </CustomDrawer>
      </>) : <RestrictedAccess />
  );
};

export default ForwardCancellationTable;
