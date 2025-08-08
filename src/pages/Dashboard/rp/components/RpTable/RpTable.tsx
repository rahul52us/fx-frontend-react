import {
    Tooltip,
    useToast
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import CustomTable from "../../../../../config/component/CustomTable/CustomTable";
import { exportToExcel } from "../../../exportsRegister/component/utils/function";

const RpTable = () => {
  const [exportData, setExportData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [_, setFileBase64] = useState<string>("");

  const toast = useToast();
  
const handleFileUpload = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    // Convert file to Base64
    const base64 = await convertFileToBase64(file);
    setFileBase64(base64);

    // Send Base64 to API
    await submitExportForm(base64);
  } catch (err) {
    console.error("Excel upload failed", err);
  }
};

// Convert file to Base64
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); // Converts to Base64
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const submitExportForm = async (base64: string) => {
  try {
    const payload = {
      userToken: "abcxyz",
      data: base64,
    };

    const response = await axios.post(
      "http://srv864630.hstgr.cloud:8000/rp/form/",
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

      fetchExportRegisterData();
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
    console.error("Error submitting form", error.message);
  }
};


  const fetchExportRegisterData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://srv864630.hstgr.cloud:8000/rp/view/",
        { userToken: "abcxyz" }
      );

      const result = response.data?.data?.data || [];
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

  const ExportRegisterTableColumns = [
  { headerName: "S.No.", key: "sno", props: { row: { textAlign: "center" } } },
  { headerName: "Month", key: "month" },
  { headerName: "Exposure Type", key: "exposureType" },
  { headerName: "Exposure Date", key: "exposureInputDate" },
  { headerName: "Exposure Modification Date", key: "exposureModificationDate" },
  { headerName: "PO Date", key: "poDate" },
  { headerName: "PO No", key: "poNo" },
  { headerName: "Invoice No", key: "invoiceNo" },
  { headerName: "Invoice Date", key: "invoiceDate" },
  { headerName: "Party Name", key: "partyName" },
  { headerName: "Bank", key: "bank" },
  { headerName: "Business Unit", key: "businessUnit" },
  { headerName: "BL Date", key: "blDate" },
  { headerName: "Payment Terms", key: "paymentTerms" },
  { headerName: "Due Date", key: "dueDate" },
  { headerName: "Currency", key: "currency" },
  { headerName: "Amount", key: "amount" },
  { headerName: "Adjustment Amount", key: "adjustmentAmount" }, // keep if used, or remove if unused
  {
    headerName: "Remark",
    key: "remark",
    type: "tooltip",
    function: (row: any) =>
      row.remark ? (
        <Tooltip label={row.remark} hasArrow>
          <span>{row.remark.slice(0, 20)}...</span>
        </Tooltip>
      ) : (
        "-"
      ),
  },
];

  return (
    <>
      <CustomTable
        title="RP table"
        data={exportData}
        columns={ExportRegisterTableColumns}
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
                columns: ExportRegisterTableColumns,
                data: exportData,
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
              showAddButton: false,
            //   function: onOpen,
            },
            editKey: { showEditButton: false },
            deleteKey: { showDeleteButton: false },
          },
        }}
        loading={loading}
      />
    </>
  );
};

export default RpTable;
