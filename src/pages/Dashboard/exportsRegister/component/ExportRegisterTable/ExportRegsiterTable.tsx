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
import ExposureForm from "../ExportsRegisterForm";
import CustomTable from "../../../../../config/component/CustomTable/CustomTable";

const ExportRegisterTable = () => {
  const [exportData, setExportData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchExportRegisterData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://srv864630.hstgr.cloud:8000/exportregister/view/",
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

  const ExportRegisterTableColumns = [
    { headerName: "S.No.", key: "sno", props: { row: { textAlign: "center" } } },
    { headerName: "Exposure Type", key: "exposureType" },
    { headerName: "Exposure Date", key: "exposureInputDate" },
    { headerName: "PO Date", key: "poDate" },
    { headerName: "BL Date", key: "blDate" },
    { headerName: "Collection Date", key: "collectionDate" },
    { headerName: "Amount", key: "amount" },
    { headerName: "Adjustment Amount", key: "adjustmentAmount" },
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
        title="Export Register"
        data={exportData}
        columns={ExportRegisterTableColumns}
        actions={{
          search: { show: false },
          resetData: {
            show: true,
            text: "Reset Data",
            function: fetchExportRegisterData,
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
          <DrawerHeader>Add Export Entry</DrawerHeader>
          <DrawerBody>
            <ExposureForm
              fetchData={fetchExportRegisterData}
              onClose={onClose}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ExportRegisterTable;
