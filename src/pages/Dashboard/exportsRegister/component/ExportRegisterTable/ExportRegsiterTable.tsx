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
import ExposureForm from "../ExportsRegisterForm";
import { dummyExportRegisterData } from "../utils/constant";
import { exportToExcel, importFromExcel } from "../utils/function";

const ExportRegisterTable = () => {
  const [exportData, setExportData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const url = process.env.REACT_APP_FX_BASE_URL
  const toast = useToast();
  const { deleteItem } = useDeleteItem();
  

  const submitExportForm = async (values: any, actions: any, type: string) => {
    try {
      let payload = {
        userToken: "abcxyz",
        data: type === "excel" ? values : [values],
      };
      // let payload = type === "excel" ? values : [values];
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
      console.error("Error submitting form", error.message);
      // toast({
      //   title: "Error",
      //   description: error?.response?.data?.message,
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
        // "https://5cf5cb2fbb9b.ngrok-free.app/exportregister/view/",
        `${url}/exportregister/view/`,
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

// const ExportRegisterTableColumns = [
//   { headerName: "Created On", key: "createdAt" },
//   { headerName: "S.No.", key: "sno", props: { row: { textAlign: "center" } } },
//   { headerName: "Exposure Type", key: "exposureType"},
//   { headerName: "Exposure Date", key: "exposureInputDate" },
//   { headerName: "Exposure Modification Date", key: "exposureModificationDate" },
//   { headerName: "PO Date", key: "poDate" },
//   { headerName: "PO No", key: "poNo" },
//   { headerName: "Invoice No", key: "invoiceNo" },
//   { headerName: "Invoice Date", key: "invoiceDate" },
//   { headerName: "Party Name", key: "partyName" },
//   { headerName: "Bank", key: "bank" },
//   { headerName: "Business Unit", key: "businessUnit" },
//   { headerName: "BL Date", key: "blDate" },
//   { headerName: "Payment Terms", key: "paymentTerms" },
//   { headerName: "Due Date", key: "dueDate" },
//   { headerName: "Currency", key: "currency" },
//   { headerName: "Amount", key: "amount" },
//   { headerName: "Budget Rate", key: "budgetRate" },
//   { headerName: "Hedge Deal Ref No", key: "hedgeDealRefNo" },
//   { headerName: "Outstanding Amount Forward", key: "outstandingAmountForwardReg" },
//   { headerName: "Balance Amount Forward", key: "balanceAmountForwardReg" },
//   { headerName: "Hedged Amount", key: "hedgedAmount" },
//   { headerName: "Hedged Rate", key: "hedgetRate" },
//   { headerName: "Spot on BMK Date", key: "spotOnBmkDate" },
//   { headerName: "Premium on BMK Date", key: "premiumOnBmkDate" },
//   { headerName: "BMK Rate", key: "bmkRate" },
//   { headerName: "RM Policy Rate", key: "rmPolicyRate" },
//   { headerName: "Outstanding Amount", key: "outstandingAmount" },
//   { headerName: "Outstanding Amount (INR)", key: "outstandingAmountInINR" },
//   { headerName: "Invoice Raised", key: "invoiceRaised" },
//   { headerName: "Advance Payment", key: "advancePayment" },
//   { headerName: "Advance Realization Rate", key: "advanceRealizationRate" },
//   { headerName: "Amount Settled", key: "amountSettled" },
//   { headerName: "Settlement Rate", key: "settlementRate" },
//   { headerName: "P/L in INR", key: "PlInINR" },
//   { headerName: "Advance Allotment", key: "advaceAllotment" },
//   { headerName: "Advance Rate", key: "advanceRate" },
//   { headerName: "Invoice Settlement", key: "invoiceSettlement" },
//   { headerName: "INR Amount", key: "inrAmount" },
//    {
//       headerName: "Actions",
//       key: "table-actions",
//       type: "table-actions",
//       props: {
//         row: { minW: 180, textAlign: "center" },
//         column: { textAlign: "center" },
//       },
//   },
// ];

const ExportRegisterTableColumns = [
  { headerName: "Created On", key: "createdAt" },
  { headerName: "Exposure Type", key: "exposureType",type:"formattedString" },
  { headerName: "PO No", key: "poNo" },
  { headerName: "PO Date", key: "poDate" },
  { headerName: "Party Name", key: "partyName" },
  { headerName: "Bank", key: "bank" },
  { headerName: "Business Unit", key: "businessUnit" },
  { headerName: "Invoice No", key: "invoiceNo" },
  { headerName: "Invoice Date", key: "invoiceDate" },
  { headerName: "BL Date", key: "blDate" },
  { headerName: "Payment Terms", key: "paymentTerms" },
  { headerName: "Due Date", key: "dueDate" },
  { headerName: "Currency", key: "currency" },
  { headerName: "Amount", key: "amount" },
  { headerName: "Budget Rate", key: "budgetRate" },
  { headerName: "Hedge Deal Ref No", key: "hedgeDealRefNo" },
  { headerName: "Outstanding Amount Forward", key: "outstandingAmountForwardReg" },
  { headerName: "Balance Amount Forward", key: "balanceAmountForwardReg" },
  { headerName: "Hedged Amount", key: "hedgedAmount" },
  { headerName: "Hedged Rate", key: "hedgetRate" },
  { headerName: "Spot on BMK Date", key: "spotOnBmkDate" },
  { headerName: "Premium on BMK Date", key: "premiumOnBmkDate" },
  { headerName: "BMK Rate", key: "bmkRate" },
  { headerName: "RM Policy Rate", key: "rmPolicyRate" },
  { headerName: "Outstanding Amount", key: "outstandingAmount" },
  { headerName: "Outstanding Amount (INR)", key: "outstandingAmountInINR" },
  { headerName: "Invoice Raised", key: "invoiceRaised",type:"number" },
  { headerName: "Advance Payment", key: "advancePayment" },
  { headerName: "Advance Realization Rate", key: "advanceRealizationRate" },
  { headerName: "Amount Settled", key: "amountSettled" },
  { headerName: "Settlement Rate 1", key: "settlementRate1" },
  { headerName: "P/L in INR", key: "PlInINR" },
  { headerName: "Advance Allotment", key: "advaceAllotment" },
  { headerName: "Advance Rate", key: "advanceRate" },
  { headerName: "Invoice Settlement", key: "invoiceSettlement" },
  { headerName: "Settlement Rate", key: "settlementRate" },
  { headerName: "INR Amount", key: "inrAmount" },
  { headerName: "Delivery Date From", key: "deliveryDateFrom" },
  { headerName: "Delivery Date To", key: "deliveryDateTo" },
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
    <>
      <CustomTable
        title="Export Register"
        data={exportData}
        columns={ExportRegisterTableColumns}
        actions={{
          search: { show: false },
          resetData: {
            show: true,
            // text: "Reset Data",
            function: fetchExportRegisterData,
          },
          exportExcel: {
            show: true,
            text: "Export Excel",
            function: () =>
              exportToExcel({
                // columns: ExportRegisterTableColumns,
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
        loading={loading}
      />

      {/* Drawer for adding export entry */}
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
