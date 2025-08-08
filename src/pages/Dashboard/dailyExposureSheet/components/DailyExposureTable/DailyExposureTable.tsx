import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import CustomTable from "../../../../../config/component/CustomTable/CustomTable";
import { exposureSettlementReport } from "../../../exportsRegister/component/utils/constant";
import {
  exportToExcel,
  importFromExcel,
} from "../../../exportsRegister/component/utils/function";
import DailyExposureSheetForm from "../DailyExposureSheetForm/DailyExposureSheetForm";

const DailyExposureTable = () => {
  const [exportData, setExportData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const submitExportForm = async (values: any, actions: any, type: string) => {
    try {
      // let payload = type === "excel" ? values : [values];
      let payload = {
        userToken: "abcxyz",
        data: type === "excel" ? values : [values],
      };
      const response = await axios.post(
        "http://srv864630.hstgr.cloud:8000/exposuresettlementreport/form/",
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

  const fetchExportRegisterData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://srv864630.hstgr.cloud:8000/exposuresettlementreport/view/",
       { userToken: "abcxyz" }
      );
      const result = response.data?.data?.data || [];
      const withSerial = result.map((item: any, idx: number) => ({
        ...item,
        sno: idx + 1,
      }));
      setExportData(withSerial);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExportRegisterData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const DailyExposureColumns = [
  // { headerName: "Month", key: "month", label: "Month" },
  { headerName: "Settlement Date", key: "settlementDate", label: "Settlement Date" },
  { headerName: "Settlement Input Date", key: "settlementInputDate", label: "Settlement Input Date" },
  { headerName: "Exposure Type", key: "exposureType", label: "Exposure Type" },
  { headerName: "Settlement Type", key: "settlementType", label: "Settlement Type" },
  { headerName: "PO Number", key: "poNumber", label: "PO Number" },
  { headerName: "Invoice BC Number", key: "invoiceBcNumber", label: "Invoice BC No" },
  { headerName: "Party Name", key: "partyName", label: "Party Name" },
  { headerName: "Business Unit", key: "bussinessUnit", label: "Business Unit" },
  { headerName: "Mode of Conversion", key: "modeOfConversion", label: "Mode of Conversion" },
  { headerName: "Conversion Reference Number", key: "conversionReferenceNumber", label: "Conv Ref No" },
  { headerName: "Bank", key: "bank", label: "Bank" },
  { headerName: "Currency", key: "currency", label: "Currency" },
  { headerName: "Settled Amount", key: "settledAmount", label: "Settled Amount" },
  { headerName: "Booked Rate", key: "bookedRate", label: "Booked Rate" },
  { headerName: "Forward Premium Reversed", key: "forwardPremiumReveresed", label: "Fwd Premium Reversed" },
  { headerName: "Spot Booked", key: "spotBooked", label: "Spot Booked" },
  { headerName: "Cash to Spot", key: "cashTomSpot", label: "Cash to Spot" },
  { headerName: "Bank Margin", key: "bankMargin", label: "Bank Margin" },
  { headerName: "Settlement Rate", key: "settlementRate", label: "Settlement Rate" },
  { headerName: "Document Due Date", key: "documentDueDate", label: "Doc Due Date" },
  { headerName: "Settled Amount in INR", key: "settledAmountInInr", label: "Settled INR" },
  { headerName: "Benchmark Rate", key: "benchmarkRate", label: "Benchmark Rate" },
  { headerName: "Bmk Vs Settlement Rate", key: "bmkVsSettlementRate", label: "Bmk vs Sett Rate" },
  { headerName: "Spot on Settlement Date", key: "spotOnSettlementDate", label: "Spot on Sett Date" },
  { headerName: "Market Vs Settlement Rate", key: "marketVsSettlementRate", label: "Market vs Sett Rate" },
];

  return (
    <>
      <CustomTable
        title="Exposure Settlement Register"
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
                // columns: DailyExposureColumns,
                data: exposureSettlementReport,
                fileName: "Exposure_Settlement_Report.xlsx",
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
            <DailyExposureSheetForm submitForm={submitExportForm} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default DailyExposureTable;
