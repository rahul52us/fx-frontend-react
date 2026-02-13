import {
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDeleteItem } from "../../../../../config/component/customHooks/useDeleteItem";
import CustomDrawer from "../../../../../config/component/Drawer/CustomDrawer";
import CustomTable from "../../../../../config/component/CustomTable/CustomTable";
import { exposureSettlementReport } from "../../../exportsRegister/component/utils/constant";
import {
  exportToExcel,
  importFromExcel,
} from "../../../exportsRegister/component/utils/function";
import ExposureSettlementForm from "../DailyExposureSheetForm/DailyExposureSheetForm";
import DeleteConfirmationModal from "../../../../../config/component/common/DeleteConfirmationModal/DeleteConfirmationModal";
import { usePermission } from "../../../../../config/component/customHooks/usePermission";
import RestrictedAccess from "../../../../../config/component/common/RestrictedAccess/RestrictedAccess";
import store from "../../../../../store/store";

const DailyExposureTable = () => {
  const [exportData, setExportData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Permission checks
  const { canAdd, canEdit, canDelete, canView } = usePermission('dailyExposure');

  // Delete Confirmation State
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose
  } = useDisclosure();
  const [deleteRowData, setDeleteRowData] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
        // "http://srv864630.hstgr.cloud:8000/exposuresettlementreport/form/",
        `${url}/exposuresettlementreport/form/`,
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

  /* ---------------- Fetch Data ---------------- */

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 10;

  const fetchExportRegisterData = async (currentPage = 1) => {
    setLoading(true);
    try {
      const { viewAsUserId } = store.auth;
      const response = await axios.post(
        `${url}/exposuresettlementreport/view/`,
        { userToken: "abcxyz", page: currentPage, limit: rowsPerPage, userId: viewAsUserId }
      );
      const result = response.data?.data?.data || [];
      const total = response.data?.data?.total_pages || 1;
      const withSerial = result.map((item: any, idx: number) => ({
        ...item,
        sno: (currentPage - 1) * rowsPerPage + idx + 1,
      }));
      setExportData(withSerial);
      setTotalPages(total);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchExportRegisterData(newPage);
  };

  useEffect(() => {
    if (!canView) return;
    fetchExportRegisterData(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.auth.viewAsUserId]);

  /* ---------------- Delete Handlers ---------------- */

  const handleDeleteClick = (row: any) => {
    setDeleteRowData(row);
    onDeleteOpen();
  };

  const onConfirmDelete = async () => {
    if (!deleteRowData) return;
    setDeleteLoading(true);

    await deleteItem({
      url: `${url}/delup/deleterow/`,
      rowId: deleteRowData.rowId,
      formType: "exposureSettlementReport",
      refetch: () => fetchExportRegisterData(page),
    });

    setDeleteLoading(false);
    onDeleteClose();
    setDeleteRowData(null);
  };

  //   const DailyExposureColumns = [
  //   { headerName: "Settlement Date", key: "settlementDate", label: "Settlement Date" },
  //   { headerName: "Settlement Input Date", key: "settlementInputDate", label: "Settlement Input Date" },
  //   { headerName: "Exposure Type", key: "exposureType", label: "Exposure Type" },
  //   { headerName: "Settlement Type", key: "settlementType", label: "Settlement Type" },
  //   { headerName: "PO Number", key: "poNumber", label: "PO Number" },
  //   { headerName: "Invoice BC Number", key: "invoiceBcNumber", label: "Invoice BC No" },
  //   { headerName: "Party Name", key: "partyName", label: "Party Name" },
  //   { headerName: "Business Unit", key: "bussinessUnit", label: "Business Unit" },
  //   { headerName: "Mode of Conversion", key: "modeOfConversion", label: "Mode of Conversion" },
  //   { headerName: "Conversion Reference Number", key: "conversionReferenceNumber", label: "Conv Ref No" },
  //   { headerName: "Bank", key: "bank", label: "Bank" },
  //   { headerName: "Currency", key: "currency", label: "Currency" },
  //   { headerName: "Settled Amount", key: "settledAmount", label: "Settled Amount" },
  //   { headerName: "Booked Rate", key: "bookedRate", label: "Booked Rate" },
  //   { headerName: "Forward Premium Reversed", key: "forwardPremiumReveresed", label: "Fwd Premium Reversed" },
  //   { headerName: "Spot Booked", key: "spotBooked", label: "Spot Booked" },
  //   { headerName: "Cash to Spot", key: "cashTomSpot", label: "Cash to Spot" },
  //   { headerName: "Bank Margin", key: "bankMargin", label: "Bank Margin" },
  //   { headerName: "Settlement Rate", key: "settlementRate", label: "Settlement Rate" },
  //   { headerName: "Document Due Date", key: "documentDueDate", label: "Doc Due Date" },
  //   { headerName: "Settled Amount in INR", key: "settledAmountInInr", label: "Settled INR" },
  //   { headerName: "Benchmark Rate", key: "benchmarkRate", label: "Benchmark Rate" },
  //   { headerName: "Bmk Vs Settlement Rate", key: "bmkVsSettlementRate", label: "Bmk vs Sett Rate" },
  //   { headerName: "Spot on Settlement Date", key: "spotOnSettlementDate", label: "Spot on Sett Date" },
  //   { headerName: "Market Vs Settlement Rate", key: "marketVsSettlementRate", label: "Market vs Sett Rate" },
  //    {
  //       headerName: "Actions",
  //       key: "table-actions",
  //       type: "table-actions",
  //       props: {
  //         row: { minW: 180, textAlign: "center" },
  //         column: { textAlign: "center" },
  //       },
  //     },
  // ];

  const DailyExposureColumns = [
    { headerName: "Created At", key: "createdAt", label: "Created At" },
    { headerName: "Settlement Date", key: "settlementDate", label: "Settlement Date" },
    { headerName: "Settlement Input Date", key: "settlementInputDate", label: "Settlement Input Date" },

    { headerName: "Exposure Type", key: "exposureType", label: "Exposure Type" },
    { headerName: "Settlement Type", key: "settlementType", label: "Settlement Type" },

    { headerName: "PO Number", key: "poNumber", label: "PO Number" },
    { headerName: "Invoice / BC Number", key: "invoiceBcNumber", label: "Invoice / BC No" },

    { headerName: "Party Name", key: "partyName", label: "Party Name" },
    { headerName: "Business Unit", key: "bussinessUnit", label: "Business Unit" },

    { headerName: "Bank", key: "bank", label: "Bank" },
    { headerName: "Currency", key: "currency", label: "Currency" },

    { headerName: "Outstanding Amount", key: "outStandingAmount", label: "Outstanding Amount" },
    { headerName: "Due Date", key: "dueDate", label: "Due Date" },

    { headerName: "Settled Amount", key: "settledAmount", label: "Settled Amount" },

    { headerName: "Settlement Rate", key: "settlementRate", label: "Settlement Rate" },
    { headerName: "Settled Amount (INR)", key: "settledAmountInInr", label: "Settled Amount INR" },

    { headerName: "Benchmark Rate", key: "benchmarkRate", label: "Benchmark Rate" },
    { headerName: "Bmk vs Settlement Rate", key: "bmkVsSettlementRate", label: "Bmk vs Sett Rate" },

    { headerName: "Spot on Settlement Date", key: "spotOnSettlementDate", label: "Spot on Sett Date" },
    { headerName: "Market vs Settlement Rate", key: "marketVsSettlementRate", label: "Market vs Sett Rate" },


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
    canView ? (
      <>
        <CustomTable
          title="Exposure Settlement Register"
          data={exportData}
          columns={DailyExposureColumns}
          actions={{
            search: { show: false },
            resetData: {
              show: true,
              text: "Reset Data",
              function: () => fetchExportRegisterData(1),
            },
            exportExcel: {
              show: true,
              text: "Export Excel",
              function: () =>
                exportToExcel({
                  // columns: DailyExposureColumns,
                  data: exposureSettlementReport,
                  fileName: "Exposure_Settlement_Report.xlsx",
                }),
            },
            uploadFile: {
              show: true,
              text: "Upload Excel",
              function: (e: any) => handleFileUpload(e),
            },
            pagination: {
              show: true,
              onClick: handlePageChange,
              currentPage: page,
              totalPages: totalPages,
            },
            actionBtn: {
              addKey: {
                showAddButton: canAdd,
                function: onOpen,
              },
              editKey: { showEditButton: canEdit },
              deleteKey: {
                showDeleteButton: canDelete,
                function: handleDeleteClick,
              },
            },
          }}
          loading={loading}
        />

        {/* Drawer for adding export entry */}
        <CustomDrawer
          open={isOpen}
          close={onClose}
          title="Exposure Settlement Register"
          size="xl"
          width="75%"
        >
          <ExposureSettlementForm submitForm={submitExportForm} />
        </CustomDrawer>

        {/* Delete Confirmation Alert */}
        <DeleteConfirmationModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          onConfirm={onConfirmDelete}
          title="Delete Entry"
          description="Are you sure? You can't undo this action afterwards."
          isLoading={deleteLoading}
        />
      </>) : <RestrictedAccess />
  );
};

export default DailyExposureTable;
