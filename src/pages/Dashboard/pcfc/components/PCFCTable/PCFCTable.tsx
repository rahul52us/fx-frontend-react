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
import CustomTable from "../../../../../config/component/CustomTable/CustomTable";
import { dummyPcfcData } from "../../../exportsRegister/component/utils/constant";
import {
  exportToExcel,
  importFromExcel,
} from "../../../exportsRegister/component/utils/function";
import PCFCForm from "../PCFCForm/PCFCForm";
import { autoToken } from "../../../utils/constant";
import { useDeleteItem } from "../../../../../config/component/customHooks/useDeleteItem";

const PCFCTable = () => {
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
      const response = await axios.post(`${url}/pcfcregister/form/`, payload, {
        headers: {
          Authorization: autoToken,
        },
      });
        // "http://srv864630.hstgr.cloud:8000/pcfcregister/form/",

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
         `${url}/pcfcregister/view/`,
        // "http://srv864630.hstgr.cloud:8000/pcfcregister/view/",
         { userToken: "abcxyz" },
         {
           headers: {
             Authorization: autoToken,
           },
         }
         
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

 

const PCFCColumns = [
  { headerName: "Drawdown Date", key: "drawdownDate", label: "Drawdown Date" },
  { headerName: "Mode of Conversion", key: "modeOfConversion", label: "Mode of Conversion" },
  { headerName: "Bank", key: "bank", label: "Bank" },
  { headerName: "Trade Reference Number", key: "tradeReferenceNumber", label: "Trade Reference Number" },
  { headerName: "Currency", key: "currency", label: "Currency" },
  { headerName: "Drawdown Amount", key: "drawdownAmount", label: "Drawdown Amount" },
  { headerName: "Drawdown Rate", key: "drawdownRate", label: "Drawdown Rate" },
  { headerName: "Floating Interest Rate", key: "floatingInterestRate", label: "Floating Interest Rate" },
  { headerName: "Bank Spread", key: "bankSpread", label: "Bank Spread" },
  { headerName: "Total Interest Rate", key: "totalInterestRate", label: "Total Interest Rate" },
  { headerName: "Due Date", key: "dueDate", label: "Due Date" },
  { headerName: "Outstanding Amount", key: "outStandingAmount", label: "Outstanding Amount" },
  { headerName: "Outstanding Amount (INR)", key: "outstandingAmountInInr", label: "Outstanding Amount (INR)" },
  { headerName: "Amount Settled", key: "amountSettled", label: "Amount Settled" },
  {headerName:"PCFC Input Date",key:"pcfcInputDate",label:"PCFC Input Date"},
  {headerName:"PCFC Modification Date",key:"pcfcModificationDate",label:"PCFC Modification Date"},
   {
      headerName: "Actions",
      key: "table-actions",
      type: "table-actions",
      props: {
        // isSticky: true,
        row: { minW: 180, textAlign: "center" },
        column: { textAlign: "center" },
      },
    },
];
  return (
    <>
      <CustomTable
        title="PCFC Register"
        data={exportData}
        columns={PCFCColumns}
        actions={{
          search: { show: false },
          resetData: {
            show: false,
            text: "Reset Data",
            function: fetchExportRegisterData,
          },
          exportExcel: {
            show: true,
            text: "Export Excel",
            function: () =>
              exportToExcel({
                // columns: PCFCColumns,
                data: dummyPcfcData,
                fileName: "Pcfc_Register.xlsx",
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

            editKey: { showEditButton: true, function: () => {}},
            deleteKey: {
              showDeleteButton: true,
              function: (row: any) =>
                deleteItem({
                  url: `${url}/delup/deleterow/`,
                  rowId: row.rowID,
                  formType: "pcfc",
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
          <DrawerHeader>PCFC Register Form</DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody>
            <PCFCForm submitForm={submitExportForm} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default PCFCTable;
