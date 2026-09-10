"use client";
import { useDisclosure, useToast } from "@chakra-ui/react";
import axios from "axios";
import { toJS } from "mobx";
import { useEffect, useState, useCallback } from "react";
import BulkUploadStatusModal from "../../../../../config/component/common/BulkUploadStatusModal/BulkUploadStatusModal";
import DeleteConfirmationModal from "../../../../../config/component/common/DeleteConfirmationModal/DeleteConfirmationModal";
import RestrictedAccess from "../../../../../config/component/common/RestrictedAccess/RestrictedAccess";
import { useDeleteItem } from "../../../../../config/component/customHooks/useDeleteItem";
import { usePermission } from "../../../../../config/component/customHooks/usePermission";
import CustomTable from "../../../../../config/component/CustomTable/CustomTable";
import CustomDrawer from "../../../../../config/component/Drawer/CustomDrawer";
import Loader from "../../../../../config/component/Loader/Loader";
import store from "../../../../../store/store";
import {
  RegisterFilterPanel,
  createFilterState,
  getRegisterApiFilters,
  hasActiveFilters,
} from "../../../common/registerTableFilters";
import HedgeDealsCell from "../../../exportsRegister/component/ExportRegisterTable/HedgeDealsPopover";
import { dummyImportRegisterData } from "../../../exportsRegister/component/utils/constant";
import {
  calculateDueDate,
  exportToExcel,
  importFromExcel,
  normalizeExcelDate,
} from "../../../exportsRegister/component/utils/function";
import ImportRegistrationForm from "../ImportRegisterForm";
import AmountSettledList from "../../../exportsRegister/component/ExportRegisterTable/AmountSettledList";
import {
  exposureTypeOptions as importExposureBaseOptions,
  importExposureTypeOptions,
} from "../utils/constant";
import { getImportRegisterValidationSchema } from "../utils/validationSchema";

const ImportRegisterTable = () => {
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
  const [importData, setImportData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editRow, setEditRow] = useState<any | null>(null);
  const [originalRow, setOriginalRow] = useState<any | null>(null);
  const [formKey, setFormKey] = useState(0);
  const toast = useToast();
  const url = process.env.REACT_APP_FX_BASE_URL;
  // const url = "https://7b0fa03efa8d.ngrok-free.app"
  const { deleteItem } = useDeleteItem();

  console.log("User Permissions:", toJS(store.auth.user?.permissions));

  // Permission checks
  const { canAdd, canEdit, canDelete, canView } =
    usePermission("importRegister");

  // Delete Confirmation State
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [deleteRowData, setDeleteRowData] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const filterFields = [
    { name: "startDate", label: "Start Date" },
    { name: "endDate", label: "End Date" },
    {
      name: "exposureType",
      label: "Exposure Type",
      type: "select" as const,
      placeholder: "All Types",
      options: [...importExposureBaseOptions, ...importExposureTypeOptions],
    },
    {
      name: "status",
      label: "Status",
      type: "select" as const,
      placeholder: "All Statuses",
      options: [
        { label: "Open", value: "open" },
        { label: "Closed", value: "closed" },
        { label: "Settled", value: "settled" },
      ],
    },
  ];
  const [filterState, setFilterState] = useState(createFilterState(filterFields));
  const [appliedFilters, setAppliedFilters] = useState<any>(null);

  const handleDrawerClose = () => {
    setEditRow(null);
    setOriginalRow(null);
    setFormKey((prev) => prev + 1); // 🔥 force remount
    onClose();
  };

  const submitImportForm = async (values: any, actions: any, type: string) => {
    if (type === "excel") setIsUploading(true);
    try {
      let payload = {
        userToken: "abcxyz",
        data: type === "excel" ? values : [values],
      };
      const response = await axios.post(
        `${url}/importregister/form/`,
        payload,
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
        fetchImportRegisterData();
        actions?.resetForm?.();
      } else {
        if (type === "excel") {
          setUploadResults({
            success: 0,
            failures: values.length,
            errors: [{ row: 0, message: response.data.message || "Failed to upload excel data" }],
          });
          onStatusOpen();
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
      } else {
        toast({
          title: "Error",
          description: error?.response?.data?.message || "Something went wrong.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
    } finally {
      setIsUploading(false);
      actions?.setSubmitting?.(false);
    }
  };

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 10;
  const { viewAsUserId } = store.auth;

  const fetchImportRegisterPage = useCallback(async (currentPage = 1, filters = appliedFilters) => {
    const response = await axios.post(`${url}/importregister/view/`, {
      userToken: "abcdxyz",
      page: currentPage,
      limit: rowsPerPage,
      userId: viewAsUserId,
      filters: getRegisterApiFilters(filters),
    });
    const result = response.data?.data?.data || [];
    const total = response.data?.data?.total_pages || 1;
    return { result, total };
  }, [url, rowsPerPage, viewAsUserId, appliedFilters]);

  const fetchAllImportRegisterData = useCallback(async (filters = appliedFilters) => {
    const response = await axios.post(`${url}/importregister/view/`, {
      userToken: "abcdxyz",
      page: 1,
      limit: 1000000,
      userId: viewAsUserId,
      filters: getRegisterApiFilters(filters),
    });
    return response.data?.data?.data || [];
  }, [url, viewAsUserId, appliedFilters]);

  const fetchImportRegisterData = useCallback(async (currentPage = 1, filters = appliedFilters) => {
    setLoading(true);
    try {
      const { result, total } = await fetchImportRegisterPage(currentPage, filters);
      setImportData(result);
      setTotalPages(total);
    } catch (error) {
      console.error("Error fetching import register data:", error);
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, fetchImportRegisterPage]);

  const handleFilterChange = (e: any) => {
    const { name, value } = e.target;
    setFilterState((prev: any) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const nextFilters = hasActiveFilters(filterState) ? { ...filterState } : null;
    setAppliedFilters(nextFilters);
    setPage(1);
    fetchImportRegisterData(1, nextFilters);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setAppliedFilters((prev: any) => {
        if ((prev?.search || "") === filterState.search) return prev;
        const nextFilters = hasActiveFilters({
          ...(prev || {}),
          ...filterState,
          search: filterState.search,
        })
          ? {
              ...(prev || {}),
              ...filterState,
              search: filterState.search,
            }
          : null;

        fetchImportRegisterData(1, nextFilters);
        setPage(1);
        return nextFilters;
      });
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchImportRegisterData, filterState.search]);

  const clearFilters = () => {
    const initialState = createFilterState(filterFields);
    setFilterState(initialState);
    setAppliedFilters(null);
    setPage(1);
    fetchImportRegisterData(1, null);
  };

  useEffect(() => {
    if (!canView) {
      return;
    }
    fetchImportRegisterData(page);
  }, [viewAsUserId, canView, fetchImportRegisterData, page]);

  const handleDownloadAll = async () => {
    setLoading(true);
    try {
      const result = await fetchAllImportRegisterData(appliedFilters);
      if (result.length > 0) {
        // Remove unwanted fields before export
        const exportData = result.map(({ _id, __v, userId, hedgeDeals, amountSettled, amountSettledList, ...rest }: any) => rest);

        exportToExcel({
          data: exportData,
          fileName: "import_register_all_data.xlsx",
        });
      } else {
        toast({
          title: "No Data",
          description: "No data available to download",
          status: "info",
          duration: 3000,
          isClosable: true,
          position: "top-right"
        });
      }
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Error",
        description: "Failed to download data",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchImportRegisterData(newPage);
  };


  // const ImportRegisterTableColumns = [
  //   {
  //     headerName: "S.No.",
  //     key: "sno",
  //     props: { row: { textAlign: "center" } },
  //   },
  //   { headerName: "Created On", key: "createdAt" },
  //   {
  //     headerName: "Exposure Type",
  //     key: "exposureType",
  //     type: "formattedString",
  //   },
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
  //   { headerName: "Spot on BMK Date", key: "spotOnBmkDate" },
  //   { headerName: "Premium on BMK Date", key: "premiumOnBmkDate" },
  //   { headerName: "BMK Rate", key: "bmkRate" },
  //   { headerName: "RM Policy Rate", key: "rmPolicyRate" },
  //   { headerName: "Outstanding Amount", key: "outstandingAmount" },
  //   { headerName: "Outstanding Amount (INR)", key: "outstandingAmountInInr" },
  //   { headerName: "Advance Payment", key: "advancePayment" },
  //   { headerName: "LC/BC Raised", key: "lc_bc_raised" },
  //   { headerName: "Advance Realization Rate", key: "advanceRealizationRate" },
  //   { headerName: "Amount Settled", key: "amountSettled" },
  //   { headerName: "Settlement Rate", key: "settlementRate" },
  //   { headerName: "P/L in INR", key: "PlInINR" },
  //   { headerName: "Value in INR", key: "valueInInr" },
  //   {
  //     headerName: "Hedge Deals",
  //     key: "hedgeDeals",
  //     type: "component",
  //     metaData: {
  //       component: (row: any) => <HedgeDealsCell {...row} />,
  //     },
  //   },
  //   {
  //     headerName: "Actions",
  //     key: "table-actions",
  //     type: "table-actions",
  //     props: {
  //       row: { minW: 180, textAlign: "center" },
  //       column: { textAlign: "center" },
  //     },
  //   },
  // ];

  const ImportRegisterTableColumns = [
    { headerName: "Created On", key: "createdAt" },

    {
      headerName: "Exposure Type",
      key: "exposureType",
      type: "formattedString",
    },

    { headerName: "PO Date", key: "poDate" },
    { headerName: "PO No", key: "poNo" },

    { headerName: "Invoice No", key: "invoiceNo" },
    { headerName: "Invoice Date", key: "invoiceDate" },
    { headerName: "Invoice Raised", key: "invoiceRaised" },

    { headerName: "Party Name", key: "partyName" },
    { headerName: "Bank", key: "bank" },
    { headerName: "Business Unit", key: "businessUnit" },

    { headerName: "BL Date", key: "blDate" },
    { headerName: "Payment Terms", key: "paymentTerms" },
    { headerName: "Due Date", key: "dueDate" },

    { headerName: "Currency", key: "currency" },
    { headerName: "Amount", key: "amount" },
    { headerName: "Budget Rate", key: "budgetRate" },

    { headerName: "Spot on BMK Date", key: "spotOnBmkDate" },
    { headerName: "Premium on BMK Date", key: "premiumOnBmkDate" },
    { headerName: "BMK Rate", key: "bmkRate" },
    { headerName: "RM Policy Rate", key: "rmPolicyRate" },

    { headerName: "Outstanding Amount", key: "outstandingAmount" },
    { headerName: "Outstanding Amount (INR)", key: "outstandingAmountInInr" },
    { headerName: "Import Reg Hedge Amount", key: "importRegHedgeAmount" },

    { headerName: "Advance Payment", key: "advancePayment" },
    { headerName: "Advance Realization Rate", key: "advanceRealizationRate" },

    { headerName: "Amount Settled", key: "amountSettled" },
    { headerName: "Settlement Rate", key: "settlementRate" },
    { headerName: "P/L in INR", key: "PlInINR" },

    { headerName: "Value in INR", key: "valueInInr" },
    { headerName: "Import Hedged Rate", key: "importHedgedRate" },
    { headerName: "Remark", key: "remark" },
    { headerName: "Status", key: "status" },

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
        component: (row: any) => <HedgeDealsCell {...row} />,
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

  function handleEdit(row: any) {
    setOriginalRow(JSON.parse(JSON.stringify(row))); // deep clone
    setEditRow(row);
    onOpen();
  }

  const handleFileUpload = async (event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const data = await importFromExcel(file);
      const schema = getImportRegisterValidationSchema(false); // isEdit=false

      const validatedData = [];
      const validationErrors = [];

      for (let i = 0; i < data.length; i++) {
        const row = data[i];

        const paymentTerms = Number(row.paymentTerms);

        // Convert Excel dates BEFORE validation
        const poDate = normalizeExcelDate(row.poDate);
        const invoiceDate = normalizeExcelDate(row.invoiceDate);
        const blDate = normalizeExcelDate(row.blDate);

        const dueDate = row.dueDate
          ? normalizeExcelDate(row.dueDate)
          : calculateDueDate(blDate, paymentTerms);

        const normalizedRow: any = {
          ...row,
          poDate: String(poDate),
          invoiceDate: String(invoiceDate),
          blDate: String(blDate),
          dueDate: String(dueDate || ""),
          paymentTerms,
          hedgeDeals: [],
        };

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
        await submitImportForm(validatedData, {}, "excel");
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
      formType: "importRegister", // Ensure correct formType
      refetch: () => fetchImportRegisterData(page),
    });

    setDeleteLoading(false);
    onDeleteClose();
    setDeleteRowData(null);
  };

  return canView ? (
    <>
      <RegisterFilterPanel
        fields={filterFields}
        filterState={filterState}
        hasAppliedFilters={hasActiveFilters(appliedFilters)}
        onChange={handleFilterChange}
        onApply={applyFilters}
        onClear={clearFilters}
      />

      <CustomTable
        title="Import Register"
        data={importData}
        columns={ImportRegisterTableColumns}
        actions={{
          search: {
            show: true,
            searchValue: filterState.search,
            onSearchChange: (e: any) =>
              setFilterState((prev: any) => ({ ...prev, search: e.target.value })),
          },
          resetData: {
            show: true,
            text: "Reset Data",
            function: () => clearFilters(),
          },
          exportExcel: {
            show: true,
            label: "Download Sample",
            function: () =>
              exportToExcel({
                data: dummyImportRegisterData.map(({ hedgeDeals, ...rest }: any) => rest),
                fileName: "Import_Register_Sample.xlsx",
              }),
          },
          downloadExcel: {
            show: true,
            label: "Download Data",
            function: handleDownloadAll,
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
            deleteKey: {
              showDeleteButton: canDelete,
              function: handleDeleteClick,
            },
          },
        }}
        loading={loading}
      />

      <CustomDrawer
        open={isOpen}
        close={handleDrawerClose}
        title="Add Import Entry"
        width="75vw"
        size="xl"
      >
        <ImportRegistrationForm
          submitImportForm={submitImportForm}
          key={formKey}
          onClose={onClose}
          editData={editRow}
          originalData={originalRow}
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
        title="Import Register Upload Results"
      />
      {isUploading && <Loader />}
    </>
  ) : (
    <RestrictedAccess />
  );
};

export default ImportRegisterTable;
