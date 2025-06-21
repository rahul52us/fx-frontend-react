import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import CustomTable from "../../../../../config/component/CustomTable/CustomTable";
import { dummyForwardRegisterData } from "../../../exportsRegister/component/utils/constant";
import { exportToExcel, importFromExcel } from "../../../exportsRegister/component/utils/function";
import ForwardRegisterForm from "../ForwardRegisterForm/ForwardRegisterForm";

const ForwardRegisterTable = () => {
  const [exportData, setExportData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

const submitExportForm = async (values: any, actions: any,type:string) => {
    try {
        let payload = type === "excel" ? values : [values];
      const response = await axios.post(
        "http://srv864630.hstgr.cloud:8000/forwardregister/form/",
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
      await submitExportForm(data, {},"excel");
    } catch (err) {
      console.error("Excel import failed", err);
    }
  };

  const fetchExportRegisterData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://srv864630.hstgr.cloud:8000/forwardregister/view/",
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

const ForwardRegisterColumns = [
  { headerName: "Month", key: "month", label: "march" },
  { headerName: "Exposure Type", key: "exposureType", label: "shipment" },
  { headerName: "Delivery Date From", key: "deliveryDateFrom", label: "2025-06-03" },
  { headerName: "Booking Date", key: "bookingDate", label: "2025-06-12" },
  { headerName: "Delivery Date To", key: "deliveryDateTo", label: "2025-06-05" },
  { headerName: "Bank", key: "bank", label: "23e" },
  { headerName: "Deal ID", key: "dealId", label: "234" },
  { headerName: "Currency", key: "currency", label: "USD" },
  { headerName: "Original Amount", key: "originalAmount", label: 23 },
  { headerName: "Spot Booked", key: "spotBooked", label: "234" },
  { headerName: "Bank Margin", key: "bankMargin", label: "6" },
  { headerName: "Forward Points", key: "forwardPoints", label: "45" },
  { headerName: "Priority", key: "priority", label: "medium" }
];

  return (
    <>
      <CustomTable
        title="Forward Register"
        data={exportData}
        columns={ForwardRegisterColumns}
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
                columns: ForwardRegisterColumns,
                data: dummyForwardRegisterData,
                fileName: "Forward_Register.xlsx",
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
          <DrawerBody>
            <ForwardRegisterForm
              submitForm={submitExportForm}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ForwardRegisterTable;
