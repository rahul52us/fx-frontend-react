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
import { dummyPcfcData } from "../../../exportsRegister/component/utils/constant";
import {
  exportToExcel,
  importFromExcel,
} from "../../../exportsRegister/component/utils/function";
import { autoToken } from "../../../utils/constant";
import PCFCForm from "../PCFCForm/PCFCForm";
import PCFCViewDrawer from "./PCFCViewDrawer";

const PCFCTable = () => {
  const [exportData, setExportData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editRow, setEditRow] = useState<any | null>(null);
const [originalRow, setOriginalRow] = useState<any | null>(null);
const [formKey, setFormKey] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const url = process.env.REACT_APP_FX_BASE_URL
  const { deleteItem } = useDeleteItem();

  const [viewData, setViewData] = useState<any>(null);
const {
  isOpen: isViewOpen,
  onOpen: onViewOpen,
  onClose: onViewClose,
} = useDisclosure();

  
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

  function handleEdit(row: any) {
  setOriginalRow(JSON.parse(JSON.stringify(row))); // deep clone
  setEditRow(row);
  onOpen();
}

  const fetchExportRegisterData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
         `${url}/pcfcregister/view/`,
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

    const handleDrawerClose = () => {
  setEditRow(null);
  setOriginalRow(null);
  setFormKey((prev) => prev + 1); // 🔥 force remount
  onClose();
};


  useEffect(() => {
    fetchExportRegisterData();
  }, []);

    const PCFCColumns = [
      { headerName: "Created On", key: "createdAt" },
      { headerName: "Bank Spread", key: "bankSpread", label: "Bank Spread" },
      { headerName: "PCFC Input Date", key: "pcfcInputDate" },
      { headerName: "Drawdown Date", key: "drawdownDate" },
      { headerName: "Due Date", key: "dueDate" },
      { headerName: "Bank", key: "bank" , props: { row: { textAlign: "center",textTransform: "capitalize" } } },
      { headerName: "Trade Ref No", key: "tradeReferenceNumber" },
      { headerName: "Currency", key: "currency" },
      { headerName: "Floating Interest Rate", key: "floatingInterestRate", label: "Floating Interest Rate" },
      { headerName: "Amount Settled", key: "amountSettled", label: "Amount Settled" },
      { headerName: "Outstanding Amount", key: "outStandingAmount", label: "Outstanding Amount" },
      { headerName: "Trade Reference Number", key: "tradeReferenceNumber", label: "Trade Reference Number" },
      { headerName: "Outstanding Amount (INR)", key: "outstandingAmountInInr", label: "Outstanding Amount (INR)" },
      { headerName: "Drawdown Amount", key: "drawdownAmount" },
      { headerName: "Drawdown Rate", key: "drawdownRate" },
      { headerName: "Total Interest Rate", key: "totalInterestRate" },
      {
        headerName: "Actions",
        key: "table-actions",
        type: "table-actions",
        props: {
          row: { minW: 200, textAlign: "center" },
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
            show: true,
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
             editKey:{
              showEditButton: true,
              function: (row: any) => {
                handleEdit(row);
                // onOpen();
              },
            },
            viewKey: {
    showViewButton: true,
    function: (row: any) => {
      setViewData(row);
      onViewOpen();
    },
  },

            // editKey: { showEditButton: true, function: () => {}},
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

      <Drawer isOpen={isOpen} placement="right" onClose={handleDrawerClose} size="xl">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>PCFC Register Form</DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody>
            <PCFCForm submitForm={submitExportForm}
            
            key={formKey}          
    editData={editRow}
    originalData={originalRow}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <PCFCViewDrawer
  isOpen={isViewOpen}
  onClose={onViewClose}
  data={viewData}
/>

    </>
  );
};

export default PCFCTable;
