import {
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDeleteItem } from "../../../../../config/component/customHooks/useDeleteItem";
import CustomDrawer from "../../../../../config/component/Drawer/CustomDrawer";
import CustomTable from "../../../../../config/component/CustomTable/CustomTable";
import ExposureForm from "../ExportsRegisterForm";
import { dummyExportRegisterData } from "../utils/constant";
import { exportToExcel, importFromExcel } from "../utils/function";
import HedgeDealsDrawer from "./HedgeDealsDrawer";
import DeleteConfirmationModal from "../../../../../config/component/common/DeleteConfirmationModal/DeleteConfirmationModal";
import store from "../../../../../store/store";
import { usePermission } from "../../../../../config/component/customHooks/usePermission";
import RestrictedAccess from "../../../../../config/component/common/RestrictedAccess/RestrictedAccess";

const ExportRegisterTable = () => {
  const [exportData, setExportData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editRow, setEditRow] = useState<any | null>(null);
  const [originalRow, setOriginalRow] = useState<any | null>(null);
  const [formKey, setFormKey] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { deleteItem } = useDeleteItem();

  // Permission checks
  const { canAdd, canEdit, canDelete, canView } = usePermission('exportRegister');

  // Delete Confirmation State
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [deleteRowData, setDeleteRowData] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const url = process.env.REACT_APP_FX_BASE_URL;

  function handleEdit(row: any) {
    setOriginalRow(JSON.parse(JSON.stringify(row))); // deep clone
    setEditRow(row);
    onOpen();
  }

  const submitExportForm = async (values: any, actions: any, type: string) => {
    try {
      const payload = {
        userToken: "abcxyz",
        data: type === "excel" ? values : [values],
      };

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

        onClose();
        fetchExportRegisterData();
        actions?.resetForm?.();
      }
    } catch (error: any) {
      console.error("Submit error", error.message);
    } finally {
      actions?.setSubmitting?.(false);
    }
  };

  /* ---------------- Excel Upload ---------------- */

  const handleFileUpload = async (event: any) => {
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
        `${url}/exportregister/view/`,
        { userToken: "abcxyz", page: currentPage, limit: rowsPerPage, userId: viewAsUserId }
      );

      const result = response.data?.data?.data || [];
      const total = response.data?.data?.total_pages || 1;

      setExportData(result);
      setTotalPages(total);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchExportRegisterData(newPage);
  };

  const handleDrawerClose = () => {
    setEditRow(null);
    setOriginalRow(null);
    setFormKey((prev) => prev + 1); // 🔥 force remount
    onClose();
  };

  useEffect(() => {
    if (!canView) return;
    fetchExportRegisterData(page);
  }, [store.auth.viewAsUserId]); // Initial load only, subsequent loads handled by pagination click

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
      formType: "exportRegister",
      refetch: () => fetchExportRegisterData(page), // Refetch current page
    });

    setDeleteLoading(false);
    onDeleteClose();
    setDeleteRowData(null);
  };

  // const ExportRegisterTableColumns = [
  //   { headerName: "Created On", key: "createdAt" },
  //   { headerName: "Exposure Type", key: "exposureType" },

  //   { headerName: "PO No", key: "poNo" },
  //   { headerName: "PO Date", key: "poDate" },

  //   { headerName: "Party Name", key: "partyName" },
  //   { headerName: "Bank", key: "bank" },
  //   { headerName: "Business Unit", key: "businessUnit" },

  //   { headerName: "Invoice No", key: "invoiceNo" },
  //   { headerName: "Invoice Date", key: "invoiceDate" },
  //   { headerName: "BL Date", key: "blDate" },

  //   { headerName: "Payment Terms", key: "paymentTerms" },
  //   { headerName: "Due Date", key: "dueDate" },

  //   { headerName: "Currency", key: "currency" },
  //   { headerName: "Amount", key: "amount" },
  //   { headerName: "INR Amount", key: "inrAmount" },

  //   { headerName: "Outstanding Amount", key: "outstandingAmount" },
  //   { headerName: "Outstanding INR", key: "outstandingAmountInINR" },

  //   { headerName: "Spot on BMK Date", key: "spotOnBmkDate" },
  //   { headerName: "Premium on BMK Date", key: "premiumOnBmkDate" },
  //   { headerName: "BMK Rate", key: "bmkRate" },
  //   { headerName: "RM Policy Rate", key: "rmPolicyRate" },

  //   { headerName: "Invoice Raised", key: "invoiceRaised" },
  //   { headerName: "Advance Payment", key: "advancePayment" },
  //   { headerName: "Advance Realization Rate", key: "advanceRealizationRate" },

  //   { headerName: "Amount Settled", key: "amountSettled" },
  //   { headerName: "Settlement Rate", key: "settlementRate" },
  //   { headerName: "Settlement Rate 1", key: "settlementRate1" },

  //   { headerName: "P/L in INR", key: "PlInINR" },

  //   { headerName: "Advance Allotment", key: "advaceAllotment" },
  //   { headerName: "Advance Rate", key: "advanceRate" },
  //   { headerName: "Invoice Settlement", key: "invoiceSettlement" },

  //   { headerName: "Remark", key: "remark" },
  //   {
  //     headerName: "Hedge Deals",
  //     key: "hedgeDeals",
  //     type: "component",
  //     metaData: {
  //       component: (row: any) => <HedgeDealsDrawer {...row} />,
  //     },
  //   },
  //   {
  //     headerName: "Actions",
  //     key: "table-actions",
  //     type: "table-actions",
  //     props: {
  //       row: { minW: 180, textAlign: "center" },
  //     },
  //   },
  // ];

  const ExportRegisterTableColumns = [
  { headerName: "Created On", key: "createdAt" },
  { headerName: "Exposure Type", key: "exposureType" },

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
  { headerName: "INR Amount", key: "inrAmount" },

  { headerName: "Outstanding Amount", key: "outstandingAmount" },
  { headerName: "Outstanding INR", key: "outstandingAmountInINR" },

  { headerName: "Spot on BMK Date", key: "spotOnBmkDate" },
  { headerName: "Premium on BMK Date", key: "premiumOnBmkDate" },
  { headerName: "BMK Rate", key: "bmkRate" },
  { headerName: "RM Policy Rate", key: "rmPolicyRate" },

  { headerName: "Invoice Raised", key: "invoiceRaised" },
  { headerName: "Advance Payment", key: "advancePayment" },
  { headerName: "Advance Realization Rate", key: "advanceRealizationRate" },

  { headerName: "Amount Settled", key: "amountSettled" },
  { headerName: "Settlement Rate", key: "settlementRate" },
  { headerName: "Settlement Rate 1", key: "settlementRate1" },

  { headerName: "P/L in INR", key: "PlInINR" },

  { headerName: "Advance Allotment", key: "advaceAllotment" },
  { headerName: "Advance Rate", key: "advanceRate" },
  { headerName: "Invoice Settlement", key: "invoiceSettlement" },

  { headerName: "Remark", key: "remark" },

  {
    headerName: "Hedge Deals",
    key: "hedgeDeals",
    type: "component",
    metaData: {
      component: (row: any) => <HedgeDealsDrawer {...row} />,
    },
  },
];

  return (
    canView ? (
      <>
        <CustomTable
          title="Export Register"
          data={exportData}
          columns={ExportRegisterTableColumns}
          loading={loading}
          actions={{
            search: { show: false },

            resetData: {
              show: true,
              function: () => fetchExportRegisterData(1), // Reset to page 1
            },

            exportExcel: {
              show: true,
              function: () =>
                exportToExcel({
                  data: dummyExportRegisterData,
                  fileName: "exportregister.xlsx",
                }),
            },

            uploadFile: {
              show: true,
              function: handleFileUpload,
            },

            pagination: {
              show: true,
              currentPage: page,
              totalPages: totalPages,
              onClick: handlePageChange,
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
                  // onOpen();
                },
              },

              deleteKey: {
                showDeleteButton: canDelete,
                function: handleDeleteClick,
              },
            },
          }}
        />

        {/* ---------- Drawer ---------- */}
        <CustomDrawer
          open={isOpen}
          close={handleDrawerClose}
          title="Add Export Entry"
          width="75vw"
          size="xl"
        >
          <ExposureForm
            submitExportForm={submitExportForm}
            key={formKey}
            editData={editRow}
            originalData={originalRow}
            onClose={onClose}
          />
        </CustomDrawer>

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

export default ExportRegisterTable;