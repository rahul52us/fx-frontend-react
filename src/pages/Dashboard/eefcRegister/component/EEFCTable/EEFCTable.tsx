import {
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import CustomDrawer from "../../../../../config/component/Drawer/CustomDrawer";
import CustomTable from "../../../../../config/component/CustomTable/CustomTable";
import { dummyEefcData } from "../../../exportsRegister/component/utils/constant";
import {
  exportToExcel,
  importFromExcel,
} from "../../../exportsRegister/component/utils/function";
import EEFCForm from "../EEFCForm/EEFCForm";
import { useDeleteItem } from "../../../../../config/component/customHooks/useDeleteItem";
import store from "../../../../../store/store";
// import PCFCForm from "../PCFCForm/PCFCForm";

const EEFCTable = () => {
  const [exportData, setExportData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const url = process.env.REACT_APP_FX_BASE_URL
  const { deleteItem } = useDeleteItem();

  // Permission checks
  const canAdd = store.auth.canPerformTableAction('add', 'eefc');
  const canEdit = store.auth.canPerformTableAction('edit', 'eefc');
  const canDelete = store.auth.canPerformTableAction('delete', 'eefc');

  const submitExportForm = async (values: any, actions: any, type: string) => {
    try {
      // let payload = type === "excel" ? values : [values];
      let payload = {
        userToken: "abcxyz",
        data: type === "excel" ? values : [values],
      };
      const response = await axios.post(
        "http://srv864630.hstgr.cloud:8000/eefcregister/form/",
        payload
      );

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
      // toast({
      //   title: "Error",
      //   description: error?.response?.data?.message || "Something went wrong.",
      //   status: "error",
      //   duration: 5000,
      //   isClosable: true,
      //   position: "top-right",
      // });
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
        `${url}/eefcregister/view/`,
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
      console.error("Error fetching export register data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchExportRegisterData(newPage);
  };

  useEffect(() => {
    fetchExportRegisterData(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const EEFCColumns = [
    // {headerName:"Month", key:"month", label:"Month"},
    { headerName: "Settlement Date", key: "settlementDate", label: "Settlement Date" },
    { headerName: "Created At", key: "createdAt", label: "Created At" },
    { headerName: "Exposure Type", key: "exposureType", label: "Exposure Type" },
    { headerName: "Exposure Reference Number", key: "exposureReferenceNumber", label: "Reference Number" },
    { headerName: "Business Unit", key: "bussinessUnit", label: "Business Unit" },
    { headerName: "Bank", key: "bank", label: "Bank" },
    { headerName: "Currency", key: "currency", label: "Currency" },
    { headerName: "Amount", key: "amount", label: "Amount" },
    { headerName: "Amount in INR", key: "amountInInr", label: "Amount (INR)" },
    { headerName: "Reference Rate", key: "referenceRate", label: "Reference Rate" },
    { headerName: "Closing Balance", key: "closingBalance", label: "Closing Balance" },
    { headerName: "Weighted Average Rate", key: "weightedAverageRate", label: "Weighted Avg Rate" },
    { headerName: "Closing Balance in INR", key: "closingBalanceInIn", label: "Closing Balance (INR)" }
  ];

  return (
    <>
      <CustomTable
        title="EEFC Register"
        data={exportData}
        columns={EEFCColumns}
        actions={{
          search: { show: false },
          resetData: {
            show: true,
            text: "Reset Data",
            function: () => fetchExportRegisterData(1),
          },
          exportExcel: {
            show: false,
            text: "Export Excel",
            function: () =>
              exportToExcel({
                // columns: EEFCColumns,

                data: dummyEefcData,
                fileName: "EEFC_Register.xlsx",
              }),
          },
          uploadFile: {
            show: false,
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
                  formType: "eefcRegister",
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
        title="EEFC Register Form"
        size="xl"
        width="75vw"
      >
        <EEFCForm submitForm={submitExportForm} />
      </CustomDrawer>
    </>
  );
};

export default EEFCTable;
