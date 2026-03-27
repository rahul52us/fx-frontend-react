import {
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import DeleteConfirmationModal from "../../../../../config/component/common/DeleteConfirmationModal/DeleteConfirmationModal";
import RestrictedAccess from "../../../../../config/component/common/RestrictedAccess/RestrictedAccess";
import { useDeleteItem } from "../../../../../config/component/customHooks/useDeleteItem";
import { usePermission } from "../../../../../config/component/customHooks/usePermission";
import CustomTable from "../../../../../config/component/CustomTable/CustomTable";
import CustomDrawer from "../../../../../config/component/Drawer/CustomDrawer";
import store from "../../../../../store/store";
import { exposureSettlementReport } from "../../../exportsRegister/component/utils/constant";
import {
  exportToExcel,
  importFromExcel,
} from "../../../exportsRegister/component/utils/function";
import ExposureSettlementForm from "../DailyExposureSheetForm/DailyExposureSheetForm";
import ExposureSettlementViewDrawer from "./ExposureSettlementViewDrawer";

const DailyExposureTable = () => {
  const [exportData, setExportData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [viewData, setViewData] = useState<any>(null);

   const [editRow, setEditRow] = useState<any | null>(null);
  const [originalRow, setOriginalRow] = useState<any | null>(null);
  const [formKey, setFormKey] = useState(0);
  
  // Permission checks
  const { canAdd, canEdit, canDelete, canView } = usePermission('dailyExposure');
  
      const {
        isOpen: isViewOpen,
        onOpen: onViewOpen,
        onClose: onViewClose,
      } = useDisclosure();

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

  function handleEdit(row: any) {
    setOriginalRow(JSON.parse(JSON.stringify(row))); // deep clone
    setEditRow(row);
    onOpen();
  }

  const handleDrawerClose = () => {
    setEditRow(null);
    setOriginalRow(null);
    setFormKey((prev) => prev + 1); // 🔥 force remount
    onClose();
  };

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
  const { viewAsUserId } = store.auth;

  const fetchExportRegisterData = useCallback(async (currentPage = 1) => {
    setLoading(true);
    try {
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
  }, [url, rowsPerPage, viewAsUserId]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchExportRegisterData(newPage);
  };

  useEffect(() => {
    if (!canView) return;
    fetchExportRegisterData(page);
  }, [viewAsUserId, canView, fetchExportRegisterData, page]);

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

  { headerName: "RM Policy Rate", key: "rmPolicyRate", label: "RM Policy Rate" },
  { headerName: "RMP vs Settlement Rate", key: "rmpRateVsSettlementRate", label: "RMP vs Settlement Rate" },

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
                editKey: {
                showEditButton: canEdit,
                function: (row: any) => {
                  handleEdit(row);
                },
              },
                 viewKey: {
                showViewButton: true,
                function: (row: any) => {
                  setViewData(row);
                  onViewOpen();
                },
              },
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
          close={handleDrawerClose}
          title="Exposure Settlement Register"
          size="xl"
          width="75%"
        >
          <ExposureSettlementForm 
          // submitForm={submitExportForm}
            submitForm={submitExportForm}
            key={formKey}
            editData={editRow}
            onClose={handleDrawerClose}
            originalData={originalRow}
          />
        </CustomDrawer>

        {/* Drawer for viewing export entry */}
        <CustomDrawer
          open={isViewOpen}
          close={onViewClose}
          title="Exposure Settlement Register"
          size="xl"
          width="75%"
        >
          <ExposureSettlementViewDrawer
            isOpen={isViewOpen}
          onClose={onViewClose}
          data={viewData} />
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
