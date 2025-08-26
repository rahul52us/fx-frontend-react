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
import { dummyEefcData } from "../../../exportsRegister/component/utils/constant";
import {
  exportToExcel,
  importFromExcel,
} from "../../../exportsRegister/component/utils/function";
import EEFCForm from "../EEFCForm/EEFCForm";
import { useDeleteItem } from "../../../../../config/component/customHooks/useDeleteItem";
// import PCFCForm from "../PCFCForm/PCFCForm";

const EEFCTable = () => {
  const [exportData, setExportData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const url = process.env.REACT_APP_FX_BASE_URL
  const { deleteItem } = useDeleteItem();

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

  const fetchExportRegisterData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://5cf5cb2fbb9b.ngrok-free.app/eefcregister/view/",
        // "http://srv864630.hstgr.cloud:8000/eefcregister/view/",
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

 const EEFCColumns = [
  {headerName:"Month", key:"month", label:"Month"},
  { headerName: "Settlement Date", key: "settlementDate", label: "Settlement Date" },
  { headerName: "Exposure Type", key: "exposureType", label: "Exposure Type" },
  { headerName: "Exposure Reference Number", key: "exposureReferenceNumber", label: "Reference Number" },
  { headerName: "Business Unit", key: "bussinessUnit", label: "Business Unit" },
  { headerName: "Bank", key: "bank", label: "Bank" },
  { headerName: "Currency", key: "currency", label: "Currency" },
  { headerName: "Amount", key: "amount", label: "Amount" },
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
            function: fetchExportRegisterData,
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
            show: false,
            onClick: () => {},
            currentPage: 1,
            totalPages: 1,
          },
          actionBtn: {
            addKey: {
              showAddButton: false,
              function: onOpen,
            },
            editKey: { showEditButton: false },
               deleteKey: {
              showDeleteButton: true,
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

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xl">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody>
            <EEFCForm submitForm={submitExportForm} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default EEFCTable;
