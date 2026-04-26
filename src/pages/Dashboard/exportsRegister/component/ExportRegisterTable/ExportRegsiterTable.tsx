import {
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import BulkUploadStatusModal from "../../../../../config/component/common/BulkUploadStatusModal/BulkUploadStatusModal";
import DeleteConfirmationModal from "../../../../../config/component/common/DeleteConfirmationModal/DeleteConfirmationModal";
import RestrictedAccess from "../../../../../config/component/common/RestrictedAccess/RestrictedAccess";
import { useDeleteItem } from "../../../../../config/component/customHooks/useDeleteItem";
import { usePermission } from "../../../../../config/component/customHooks/usePermission";
import CustomTable from "../../../../../config/component/CustomTable/CustomTable";
import CustomDrawer from "../../../../../config/component/Drawer/CustomDrawer";
import Loader from "../../../../../config/component/Loader/Loader";
import store from "../../../../../store/store";
import ExposureForm from "../ExportsRegisterForm";
import { dummyExportRegisterData } from "../utils/constant";
import { calculateDueDate, exportToExcel, importFromExcel, normalizeDate } from "../utils/function";
import { getExportRegisterValidationSchema } from "../utils/validationSchema";
import AmountSettledList from "./AmountSettledList";
import HedgeDealsDrawer from "./HedgeDealsDrawer";

const ExportRegisterTable = () => {
  const [exportData, setExportData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editRow, setEditRow] = useState<any | null>(null);
  const [originalRow, setOriginalRow] = useState<any | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [uploadResults, setUploadResults] = useState<{
    success: number;
    failures: number;
    errors: any[];
  }>({ success: 0, failures: 0, errors: [] });
  const {
    isOpen: isStatusOpen,
    onOpen: onStatusOpen,
    onClose: onStatusClose,
  } = useDisclosure();
  const [isUploading, setIsUploading] = useState(false);

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
    if (type === "excel") setIsUploading(true);
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
        if (type === "excel") {
          const successCount = response.data.data?.success_count || values.length;
          const failureCount = response.data.data?.failure_count || 0;
          const apiErrors = response.data.data?.errors || [];

          setUploadResults({
            success: successCount,
            failures: failureCount,
            errors: apiErrors,
          });
          onStatusOpen();
        } else {
          toast({
            title: "Success",
            description: response.data.message,
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
          onClose();
        }
        fetchExportRegisterData();
        actions?.resetForm?.();
      } else {
        if (type === "excel") {
          setUploadResults({
            success: 0,
            failures: values.length,
            errors: [{ row: 0, message: response.data.message || "Failed to upload excel data" }],
          });
          onStatusOpen();
        }
      }
    } catch (error: any) {
      console.error("Submit error", error.message);
      if (type === "excel") {
        setUploadResults({
          success: 0,
          failures: values.length,
          errors: [{ row: 0, message: error.response?.data?.message || error.message || "An error occurred during upload" }],
        });
        onStatusOpen();
      }
    } finally {
      setIsUploading(false);
      actions?.setSubmitting?.(false);
    }
  };

  /* ---------------- Excel Upload ---------------- */

  const handleFileUpload = async (event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const data = await importFromExcel(file);
      const schema = getExportRegisterValidationSchema(false); // isEdit=false

      const validatedData = [];
      const validationErrors = [];

      for (let i = 0; i < data.length; i++) {
        const row = data[i];

        // Normalize dates before validation
        const normalizedRow: any = {
          ...row,
          poDate: normalizeDate(row.poDate),
          invoiceDate: normalizeDate(row.invoiceDate),
          blDate: normalizeDate(row.blDate),
          paymentTerms: Number(row.paymentTerms),
          dueDate: normalizeDate(row.dueDate) || calculateDueDate(normalizeDate(row.blDate), Number(row.paymentTerms)),
        };

        // Keep hedgeDeals empty for excel upload
        normalizedRow.hedgeDeals = [];

        try {
          await schema.validate(normalizedRow, { abortEarly: false });
          validatedData.push(normalizedRow);
        } catch (error: any) {
          validationErrors.push({
            row: i + 1,
            message: error.errors.join(", "),
          });
        }
      }

      if (validationErrors.length > 0) {
        setUploadResults({
          success: validatedData.length,
          failures: validationErrors.length,
          errors: validationErrors,
        });
        onStatusOpen();
        setIsUploading(false);
        return;
      }

      if (validatedData.length > 0) {
        await submitExportForm(validatedData, {}, "excel");
      }
    } catch (err: any) {
      console.error("Excel import failed", err);
      setUploadResults({
        success: 0,
        failures: 0,
        errors: [{ row: 0, message: err.message || "Failed to process excel file" }],
      });
      onStatusOpen();
    } finally {
      setIsUploading(false);
      // Reset input value so same file can be uploaded again if needed
      event.target.value = "";
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
  }, [url, rowsPerPage, viewAsUserId]);

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
  }, [viewAsUserId, canView, fetchExportRegisterData, page]); // Initial load only, subsequent loads handled by pagination click

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
  { headerName: "Budget Rate", key: "budgetRate" },

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
    headerName: "Amount Settled",
    key: "amountSettledList",
    type: "component",
    metaData: {
      component: (row: any) => <AmountSettledList {...row} />,
    },
  },
  {
    headerName: "Hedge Deals",
    key: "hedgeDeals",
    type: "component",
    metaData: {
      component: (row: any) => <HedgeDealsDrawer {...row} />,
    },
  },
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

        <BulkUploadStatusModal
          isOpen={isStatusOpen}
          onClose={onStatusClose}
          results={uploadResults}
          title="Export Register Upload Results"
        />
        {isUploading && <Loader />}
      </>) : <RestrictedAccess />
  );
};

export default ExportRegisterTable;