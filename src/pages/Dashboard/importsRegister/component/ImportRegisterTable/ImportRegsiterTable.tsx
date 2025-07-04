"use client";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import CustomTable from "../../../../../config/component/CustomTable/CustomTable";
import ImportRegistrationForm from "../ImportRegisterForm";
import {
  exportToExcel,
  importFromExcel,
} from "../../../exportsRegister/component/utils/function";
import { dummyImportRegisterData } from "../../../exportsRegister/component/utils/constant";

const ImportRegisterTable = () => {
  const [importData, setImportData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const submitImportForm = async (values: any, actions: any, type: string) => {
    // console.log('values',values)
    try {
      // let payload = type === "excel" ? values : [values];
      let payload = {
        userToken: "userId",
        data: type === "excel" ? values : [values],
      };
      const response = await axios.post(
        "http://srv864630.hstgr.cloud:8000/importregister/form/",
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
        "http://srv864630.hstgr.cloud:8000/importregister/view/",
        { condition: "" }
      );
      const result = response.data?.data || [];
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
    {
      headerName: "S.No.",
      key: "sno",
      props: { row: { textAlign: "center" } },
    },
    { headerName: "Exposure Type", key: "exposureType" },
    { headerName: "Exposure Date", key: "exposureInputDate" },
    { headerName: "PO Date", key: "poDate" },
    { headerName: "BL Date", key: "blDate" },
    { headerName: "Collection Date", key: "collectionDate" },
    { headerName: "Amount", key: "amount" },
    { headerName: "Currency", key: "currency" },
    { headerName: "Budget Rate", key: "budgetRate" },
    { headerName: "Hedged Amount", key: "hedgedAmount" },
    { headerName: "Invoice No", key: "invoiceNo" },
    { headerName: "PO No", key: "poNo" },
    { headerName: "Party Name", key: "partyName" },
    { headerName: "Bank", key: "bank" },
    { headerName: "Payment Terms", key: "paymentTerms" },
    { headerName: "Forward Contract No", key: "forwardContractNo" },
    { headerName: "Priority", key: "priority" },
    { headerName: "Booked Forward Rate", key: "bookedForwardRate" },
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
            show: true,
            text: "Reset Data",
            function: fetchImportRegisterData,
          },
          exportExcel: {
            show: true,
            text: "Export Excel",
            function: () =>
              exportToExcel({
                columns: ImportRegisterTableColumns,
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
            deleteKey: { showDeleteButton: false },
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
              // onClose={onClose}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ImportRegisterTable;
