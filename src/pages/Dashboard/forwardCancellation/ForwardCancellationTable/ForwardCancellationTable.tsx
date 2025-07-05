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
import CustomTable from "../../../../config/component/CustomTable/CustomTable";
import { dymmyForwardCancellationData } from "../../exportsRegister/component/utils/constant";
import {
  exportToExcel,
  importFromExcel,
} from "../../exportsRegister/component/utils/function";
import ForwardCancellationForm from "../ForwardCancellationForm/ForwardCancellationForm";
// import CustomTable from "../../../../../config/component/CustomTable/CustomTable";
// import { dummyForwardRegisterData } from "../../../exportsRegister/component/utils/constant";
// import { exportToExcel, importFromExcel } from "../../../exportsRegister/component/utils/function";
// import ForwardRegisterForm from "../ForwardRegisterForm/ForwardRegisterForm";
// import PCFCForm from "../PCFCForm/PCFCForm";

const ForwardCancellationTable = () => {
  const [exportData, setExportData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const submitExportForm = async (values: any, actions: any, type: string) => {
    try {
      // let payload = type === "excel" ? values : [values];
      let payload = {
        userToken: "abcxyz",
        data: type === "excel" ? values : [values],
      };
      const response = await axios.post(
        "http://srv864630.hstgr.cloud:8000/forwardCancellationpcfc/form/",
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
        "http://srv864630.hstgr.cloud:8000/forwardCancellationpcfc/view/",
        { userToken: "abcxyz" }
      );
      const result = response.data?.data?.data || [];
      const withSerial = result.map((item: any, idx: number) => ({
        ...item,
        sno: idx + 1,
      }));
      setExportData(withSerial);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExportRegisterData();
  }, []);
  const DealDataColumns = [
    { headerName: "Deal Type", key: "dealType", label: "a" },
    {
      headerName: "Exposure Type",
      key: "exposureType",
      label: "confirmed_order",
    },
    {
      headerName: "Transaction Date",
      key: "transactionDate",
      label: "2025-06-04",
    },
    { headerName: "Forward Deal ID", key: "forwardDealId", label: "43" },
    { headerName: "Bank", key: "bank", label: "bank name" },
    { headerName: "PCFC Ref Number", key: "pcfcRefNumber", label: "45" },
    { headerName: "Currency", key: "currency", label: "USD" },
    { headerName: "Amount", key: "amount", label: 56 },
    { headerName: "Booked Rate", key: "bookedRate", label: 4 },
    { headerName: "Spot Booked", key: "spotBooked", label: 344 },
    { headerName: "Forward Premium", key: "forwardPremium", label: 234 },
    { headerName: "Cash To Spot", key: "cashTomSpot", label: 234 },
    { headerName: "Bank Margin", key: "bankMargin", label: 0 },
  ];

  return (
    <>
      <CustomTable
        title="Forward Cancellation & PCFC"
        data={exportData}
        columns={DealDataColumns}
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
                columns: DealDataColumns,
                data: dymmyForwardCancellationData,
                fileName: "Forward_Cancellation.xlsx",
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
            <ForwardCancellationForm submitForm={submitExportForm} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ForwardCancellationTable;
