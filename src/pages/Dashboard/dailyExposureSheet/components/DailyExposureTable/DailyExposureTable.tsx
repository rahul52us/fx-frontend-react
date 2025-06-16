import {
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerOverlay,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import CustomTable from "../../../../../config/component/CustomTable/CustomTable";
import { dummyExportRegisterData } from "../../../exportsRegister/component/utils/constant";
import { exportToExcel, importFromExcel } from "../../../exportsRegister/component/utils/function";
import DailyExposureSheetForm from "../DailyExposureSheetForm/DailyExposureSheetForm";

const DailyExposureTable = () => {
  const [exportData, setExportData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const submitExportForm = async (values: any, actions: any) => {
    try {
      const response = await axios.post(
        "http://srv864630.hstgr.cloud:8000/dailyexposure/form/",
        values
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
      await submitExportForm(data, {});
    } catch (err) {
      console.error("Excel import failed", err);
    }
  };

  const fetchExportRegisterData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://srv864630.hstgr.cloud:8000/dailyexposure/view/",
        { condition: "" }
      );
      const result = response.data?.data || [];
      const withSerial = result.map((item: any, idx: number) => ({
        ...item,
        sno: idx + 1,
      }));
      setExportData(withSerial);
    } catch (error) {
      console.error("Error fetching export register data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExportRegisterData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

 const DailyExposureColumns = [
  { headerName: "Month", key: "month", value: "february" },
  { headerName: "Exposure Type", key: "exposureType", value: "confirmed_order" },
  { headerName: "Conversion Type", key: "conversionType", value: "spot" },
  { headerName: "Settlement Type", key: "settlementType", value: "advanced" },
  { headerName: "Transaction Date", key: "transactionDate", value: "2025-06-11" },
  { headerName: "Document Due Date", key: "documentDueDate", value: "2025-06-04" },
  { headerName: "PO Number", key: "poNumber", value: "234" },
  { headerName: "Invoice LC/BC Number", key: "invoiceLcBcNumber", value: "123" },
  { headerName: "Deal Number", key: "dealNumber", value: "r3" },
  { headerName: "Bank", key: "bank", value: "23e" },
  { headerName: "Currency", key: "currency", value: "in" },
  { headerName: "Amount", key: "amount", value: "500000" },
  { headerName: "Forward Premium", key: "forwardPremium", value: "234" },
  { headerName: "Spot Booked", key: "spotBooked", value: "234" },
  { headerName: "Cash Tom Spot", key: "cashTomSpot", value: "234" },
  { headerName: "Bank Margin", key: "bankMargin", value: "0" },
  { headerName: "Benchmark Rate", key: "benchmarkRate", value: "3" }
];


  return (
    <>
      <CustomTable
        title="Daily Exposure Sheet"
        data={exportData}
        columns={DailyExposureColumns}
        actions={{
          search: { show: false },
          resetData: {
            show: true,
            text: "Reset Data",
            function: fetchExportRegisterData,
          },
          exportExcel: {
            show: true,
            text: "Export Excel",
            function: () =>
              exportToExcel({
                columns: DailyExposureColumns,
                data: dummyExportRegisterData,
                fileName: "exportregister.xlsx",
              }),
          },
          uploadFile: {
            show: true,
            text: "Upload Excel",
            function: (e: any) => handleFileUpload(e),
          },
          pagination: {
            show: false,
            onClick: () => {},
            currentPage: 1,
            totalPages: 1,
          },
          actionBtn: {
            addKey: {
              showAddButton: true,
              function: onOpen,
            },
            editKey: { showEditButton: false },
            deleteKey: { showDeleteButton: false },
          },
        }}
        loading={loading}
      />

      {/* Drawer for adding export entry */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xl">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          {/* <DrawerHeader></DrawerHeader> */}
          <DrawerBody>
            <DailyExposureSheetForm
              submitForm={submitExportForm}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default DailyExposureTable;
