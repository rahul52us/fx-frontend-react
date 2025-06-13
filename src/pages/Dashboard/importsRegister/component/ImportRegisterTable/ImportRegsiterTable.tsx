"use client";
import { useEffect, useState } from "react";
import {
  Tooltip,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import ImportRegistrationForm from "../ImportRegisterForm";
import CustomTable from "../../../../../config/component/CustomTable/CustomTable";

const ImportRegisterTable = () => {
  const [importData, setImportData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

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
              fetchData={fetchImportRegisterData}
              onClose={onClose}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ImportRegisterTable;
