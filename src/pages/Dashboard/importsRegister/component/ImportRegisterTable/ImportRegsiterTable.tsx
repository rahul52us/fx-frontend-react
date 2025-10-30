"use client";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDeleteItem } from "../../../../../config/component/customHooks/useDeleteItem";
import CustomTable from "../../../../../config/component/CustomTable/CustomTable";
import { dummyImportRegisterData } from "../../../exportsRegister/component/utils/constant";
import {
  exportToExcel,
  importFromExcel,
} from "../../../exportsRegister/component/utils/function";
import ImportRegistrationForm from "../ImportRegisterForm";

const ImportRegisterTable = () => {
  const [importData, setImportData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const url = process.env.REACT_APP_FX_BASE_URL
  const { deleteItem } = useDeleteItem();

  const submitImportForm = async (values: any, actions: any, type: string) => {
    // console.log('values',values)
    try {
      // let payload = type === "excel" ? values : [values];
      let payload = {
        userToken: "abcxyz",
        data: type === "excel" ? values : [values],
      };
      const response = await axios.post(
        // "http://srv864630.hstgr.cloud:8000/importregister/form/",
         `${url}/importregister/form/`,

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
        if (fetchImportRegisterData) {
          fetchImportRegisterData();
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

  const fetchImportRegisterData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        // "https://5cf5cb2fbb9b.ngrok-free.app/importregister/view/",
          `${url}/importregister/view/`,
        { userToken: "abcdxyz" }
      );
      const result = response.data?.data?.data || [];
      const withSerial = result.map((item: any, idx: number) => ({
        ...item,
        sno: idx + 1,
      }));
      setImportData(withSerial);
    } catch (error) {
      console.error("Error fetching import register data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImportRegisterData();
  }, []);

  
const ImportRegisterTableColumns = [
  { headerName: "S.No.", key: "sno", props: { row: { textAlign: "center" } } },
  { headerName: "Created On", key: "createdAt" },
  { headerName: "Exposure Type", key: "exposureType", type:"formattedString"  },
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
  { headerName: "Budget Rate", key: "budgetRate" },
  { headerName: "Hedge Deal Ref No", key: "hedgeDealRefNo" },
  { headerName: "Hedged Amount", key: "hedgedAmount" },
  { headerName: "Hedged Rate", key: "hedgedRate" },
  { headerName: "Spot on BMK Date", key: "spotOnBmkDate" },
  { headerName: "Premium on BMK Date", key: "premimumOnBmkDate" },
  { headerName: "BMK Rate", key: "bmkRate" },
  { headerName: "RM Policy Rate", key: "rmPolicyRate" },
  { headerName: "Outstanding Amount", key: "outstandingAmount" },
  { headerName: "Outstanding Amount (INR)", key: "outstandingAmountInInr" },
  { headerName: "Advance Payment", key: "advancePayment" },
  { headerName: "LC/BC Raised", key: "lc_bc_raised" },
  { headerName: "Advance Realization Rate", key: "advanceRealizationRate" },
  { headerName: "Amount Settled", key: "amountSettled" },
  { headerName: "Settlement Rate", key: "settlementRate" },
  { headerName: "P/L in INR", key: "PlInINR" },
  { headerName: "Value in INR", key: "valueInInr" },
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

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const data = await importFromExcel(file);
      await submitImportForm(data, {}, "excel");
    } catch (err) {
      console.error("Excel import failed", err);
    }
  };

  return (
    <>
      <CustomTable
        title="Import Register"
        data={importData}
        columns={ImportRegisterTableColumns}
        actions={{
          search: { show: false },
          resetData: {
            show: false,
            text: "Reset Data",
            function: fetchImportRegisterData,
          },
          exportExcel: {
            show: true,
            text: "Export Excel",
            function: () =>
              exportToExcel({
                // columns: ImportRegisterTableColumns,
                data: dummyImportRegisterData,
                fileName: "Import_Register.xlsx",
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
          deleteKey: {
              showDeleteButton: true,
              function: (row: any) =>
                deleteItem({
                  url: `${url}/delup/deleterow/`,
                  rowId: row.rowId,
                  formType: "importRegister",
                  refetch: fetchImportRegisterData,
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
          <DrawerHeader>Add Import Entry</DrawerHeader>
          <DrawerBody>
            <ImportRegistrationForm
              submitImportForm={submitImportForm}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ImportRegisterTable;
