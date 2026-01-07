import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDeleteItem } from "../../../../../config/component/customHooks/useDeleteItem";
import CustomTable from "../../../../../config/component/CustomTable/CustomTable";
import ExposureForm from "../ExportsRegisterForm";
import { dummyExportRegisterData } from "../utils/constant";
import { exportToExcel, importFromExcel } from "../utils/function";

const ExportRegisterTable = () => {
  const [exportData, setExportData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { deleteItem } = useDeleteItem();

  const url = process.env.REACT_APP_FX_BASE_URL;

  /* ---------------- Submit Form ---------------- */

  const submitExportForm = async (values: any, actions: any, type: string) => {
    try {
      const payload = {
        userToken: "abcxyz",
        data: type === "excel" ? values : [values],
      };

      const response = await axios.post(
        `${url}/exportregister/form/`,
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

        onClose();
        fetchExportRegisterData();
        actions?.resetForm?.();
      }
    } catch (error: any) {
      console.error("Submit error", error.message);
    } finally {
      actions?.setSubmitting?.(false);
    }
  };

  /* ---------------- Excel Upload ---------------- */

  const handleFileUpload = async (event: any) => {
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

  const fetchExportRegisterData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${url}/exportregister/view/`,
        { userToken: "abcxyz" }
      );

      const result = response.data?.data?.data || [];
      setExportData(result);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExportRegisterData();
  }, []);

  /* ---------------- Columns ---------------- */

  const ExportRegisterTableColumns = [
    { headerName: "Created On", key: "createdAt" },
    { headerName: "Exposure Type", key: "exposureType" },
    { headerName: "PO No", key: "poNo" },
    { headerName: "PO Date", key: "poDate" },
    { headerName: "Party Name", key: "partyName" },
    { headerName: "Bank", key: "bank" },
    { headerName: "Business Unit", key: "businessUnit" },
    { headerName: "Invoice No", key: "invoiceNo" },
    { headerName: "Invoice Date", key: "invoiceDate" },
    { headerName: "Currency", key: "currency" },
    { headerName: "Amount", key: "amount" },
    { headerName: "Outstanding Amount", key: "outstandingAmount" },
    {
      headerName: "Actions",
      key: "table-actions",
      type: "table-actions",
      props: {
        row: { minW: 180, textAlign: "center" },
      },
    },
  ];

  /* ---------------- Render ---------------- */

  return (
    <>
      <CustomTable
        title="Export Register"
        data={exportData}
        columns={ExportRegisterTableColumns}
        loading={loading}
        actions={{
          search: { show: false },

          resetData: {
            show: true,
            function: fetchExportRegisterData,
          },

          exportExcel: {
            show: true,
            function: () =>
              exportToExcel({
                data: dummyExportRegisterData,
                fileName: "exportregister.xlsx",
              }),
          },

          uploadFile: {
            show: true,
            function: handleFileUpload,
          },

          pagination: {
            show: false,
            currentPage: 1,
            totalPages: 1,
            onClick: () => {},
          },

          actionBtn: {
            addKey: {
              showAddButton: true,
              function: onOpen,
            },

            deleteKey: {
              showDeleteButton: true,
              function: (row: any) =>
                deleteItem({
                  url: `${url}/delup/deleterow/`,
                  rowId: row.rowId,
                  formType: "exportRegister",
                  refetch: fetchExportRegisterData,
                }),
            },
          },
        }}
      />

      {/* ---------- Drawer ---------- */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xl">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Add Export Entry</DrawerHeader>
          <DrawerBody>
            <ExposureForm
              fetchData={fetchExportRegisterData}
              onClose={onClose}
              submitExportForm={submitExportForm}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ExportRegisterTable;
