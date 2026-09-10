import { useDisclosure, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import BulkUploadStatusModal from "../../../../../config/component/common/BulkUploadStatusModal/BulkUploadStatusModal";
import { useDeleteItem } from "../../../../../config/component/customHooks/useDeleteItem";
import CustomDrawer from "../../../../../config/component/Drawer/CustomDrawer";
import CustomTable from "../../../../../config/component/CustomTable/CustomTable";
import DeleteConfirmationModal from "../../../../../config/component/common/DeleteConfirmationModal/DeleteConfirmationModal";
import Loader from "../../../../../config/component/Loader/Loader";
import { dummyForwardRegisterData } from "../../../exportsRegister/component/utils/constant";
import {
  exportToExcel,
  importFromExcel,
  normalizeExcelDate,
} from "../../../exportsRegister/component/utils/function";
import ForwardRegisterForm from "../ForwardRegisterForm/ForwardRegisterForm";
import ExposureRefsCell from "./ExposureRefsCell";
import { usePermission } from "../../../../../config/component/customHooks/usePermission";
import RestrictedAccess from "../../../../../config/component/common/RestrictedAccess/RestrictedAccess";
import store from "../../../../../store/store";
import {
  RegisterFilterPanel,
  createFilterState,
  getRegisterApiFilters,
  hasActiveFilters,
} from "../../../common/registerTableFilters";
import CancelledList from "./CancelledList";
import SettledList from "./SettledList";
import { getForwardRegisterValidationSchema } from "../utils/validationSchema";
import { mainExposureTypeOptions } from "../../../importsRegister/component/utils/constant";

const ForwardRegisterTable = () => {
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

  const [exportData, setExportData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editRow, setEditRow] = useState<any | null>(null);
  const [originalRow, setOriginalRow] = useState<any | null>(null);
  const [formKey, setFormKey] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const url = process.env.REACT_APP_FX_BASE_URL;
  const { deleteItem } = useDeleteItem();

  // Permission checks
  const { canAdd, canEdit, canDelete, canView } =
    usePermission("forwardRegister");

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
      options: mainExposureTypeOptions,
    },
    {
      name: "status",
      label: "Status",
      type: "select" as const,
      placeholder: "All Statuses",
      options: [
        { label: "Open", value: "open" },
        { label: "Cancelled", value: "cancelled" },
        { label: "Settled", value: "settled" },
      ],
    },
  ];
  const [filterState, setFilterState] = useState(createFilterState(filterFields));
  const [appliedFilters, setAppliedFilters] = useState<any>(null);

  const submitExportForm = async (values: any, actions: any, type: string) => {
    if (type === "excel") setIsUploading(true);
    try {
      let payload = {
        userToken: "abcxyz",
        data: type === "excel" ? values : [values],
      };
      const response = await axios.post(
        `${url}/forwardregister/form/`,
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

  const handleFileUpload = async (event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const data = await importFromExcel(file);
      const schema = getForwardRegisterValidationSchema(false); // isEdit=false

      const validatedData = [];
      const validationErrors = [];

      for (let i = 0; i < data.length; i++) {
        const row = data[i];

        const normalizedRow: any = {
          ...row,
          bookingDate: String(normalizeExcelDate(row.bookingDate)),
          dueDateFrom: String(normalizeExcelDate(row.dueDateFrom)),
          dueDateTo: String(normalizeExcelDate(row.dueDateTo)),
        };

        // Keep exposureRefs, cancelledList, settledList empty for excel upload
        normalizedRow.exposureRefs = [];
        normalizedRow.cancelledList = [];
        normalizedRow.settledList = [];

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
  const { viewAsUserId } = store.auth;

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 10;

  const fetchForwardRegisterPage = useCallback(async (currentPage = 1, filters = appliedFilters) => {
    const response = await axios.post(`${url}/forwardregister/view/`, {
      userToken: "abcxyz",
      page: currentPage,
      limit: rowsPerPage,
      userId: viewAsUserId,
      filters: getRegisterApiFilters(filters),
    });
    const result = response.data?.data?.data || [];
    const total = response.data?.data?.total_pages || 1;
    return { result, total };
  }, [url, rowsPerPage, viewAsUserId, appliedFilters]);

  const fetchAllForwardRegisterData = useCallback(async (filters = appliedFilters) => {
    const response = await axios.post(`${url}/forwardregister/view/`, {
      userToken: "abcxyz",
      page: 1,
      limit: 1000000,
      userId: viewAsUserId,
      filters: getRegisterApiFilters(filters),
    });
    return response.data?.data?.data || [];
  }, [url, viewAsUserId, appliedFilters]);

  const fetchExportRegisterData = useCallback(async (currentPage = 1, filters = appliedFilters) => {
    setLoading(true);
    try {
      const { result, total } = await fetchForwardRegisterPage(currentPage, filters);
      setExportData(result);
      setTotalPages(total);
    } catch (error) {
      console.error("Error fetching export register data:", error);
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, fetchForwardRegisterPage]);

  const handleFilterChange = (e: any) => {
    const { name, value } = e.target;
    setFilterState((prev: any) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const nextFilters = hasActiveFilters(filterState) ? { ...filterState } : null;
    setAppliedFilters(nextFilters);
    setPage(1);
    fetchExportRegisterData(1, nextFilters);
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

        fetchExportRegisterData(1, nextFilters);
        setPage(1);
        return nextFilters;
      });
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchExportRegisterData, filterState.search]);

  const clearFilters = () => {
    const initialState = createFilterState(filterFields);
    setFilterState(initialState);
    setAppliedFilters(null);
    setPage(1);
    fetchExportRegisterData(1, null);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchExportRegisterData(newPage);
  };

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

  useEffect(() => {
    if (!canView) return;
    fetchExportRegisterData(page);
  }, [viewAsUserId, canView, fetchExportRegisterData, page]);

  const handleDownloadAll = async () => {
    setLoading(true);
    try {
      const result = await fetchAllForwardRegisterData(appliedFilters);
      if (result.length > 0) {
        // Remove unwanted fields before export
        const exportData = result.map(({ _id, __v, userId, exposureRefs, cancelledList, settledList, ...rest }: any) => rest);

        exportToExcel({
          data: exportData,
          fileName: "forward_register_all_data.xlsx",
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
      formType: "forwardRegister",
      refetch: () => fetchExportRegisterData(page),
    });

    setDeleteLoading(false);
    onDeleteClose();
    setDeleteRowData(null);
  };

  // const ForwardRegisterColumns = [
  //   { headerName: "Created On", key: "createdAt" },
  //   { headerName: "Booking Date", key: "bookingDate" },
  //   { headerName: "Exposure Type", key: "exposureType" },
  //   { headerName: "Forward Input Date", key: "forwardInputDate" },
  //   { headerName: "Forward Modification Date", key: "forwardModificationDate" },

  //   { headerName: "Bank", key: "bank" },
  //   { headerName: "Business Unit", key: "bussinessUnit" },

  //   {
  //     headerName: "Exposure Ref(s)",
  //     key: "exposureRefs",
  //     type: "component",
  //     metaData: {
  //       component: (row: any) => <ExposureRefsCell {...row} />,
  //     },
  //   },

  //   { headerName: "Hedge Deal Ref No", key: "hedgeDealReferenceNumber" },
  //   { headerName: "Currency", key: "currency" },
  //   { headerName: "Hedge Amount", key: "hedgeAmount" },
  //   { headerName: "Spot Booked", key: "spotBooked" },
  //   { headerName: "Forward Points", key: "forwardPoints" },
  //   { headerName: "Bank Margin", key: "bankMargin" },
  //   { headerName: "Hedge Rate", key: "hedgeRate" },
  //   { headerName: "Delivery Date From", key: "dueDateFrom" },
  //   { headerName: "Delivery Date To", key: "dueDateTo" },

  //   { headerName: "Outstanding Amount", key: "outstandingAmount" },
  //   { headerName: "Outstanding Amount (INR)", key: "outstandingAmountInInr" },
  //   { headerName: "Status", key: "status" },

  //   { headerName: "Settled Amount", key: "settledAmount" },
  //   { headerName: "Settlement Rate", key: "settlementdRate" },
  //   { headerName: "Cancelled Amount", key: "cancelledAmount" },
  //   { headerName: "Cancellation Rate", key: "cancellationRate" },
  //   { headerName: "P/L on Cancellation (INR)", key: "plOnCancellationInInr" },

  //   { headerName: "Allocated Amount", key: "allocatedAmount" },
  //   { headerName: "Balance Pending Allocation", key: "balancePendingAllocation" },

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

  const ForwardRegisterColumns = [
    { headerName: "Created On", key: "createdAt" },
    { headerName: "Booking Date", key: "bookingDate" },
    { headerName: "Exposure Type", key: "exposureType" },

    { headerName: "Bank", key: "bank" },
    { headerName: "Business Unit", key: "bussinessUnit" },

    {
      headerName: "Exposure Ref(s)",
      key: "exposureRefs",
      type: "component",
      metaData: {
        component: (row: any) => <ExposureRefsCell {...row} />,
      },
    },

    { headerName: "Hedge Deal Ref No", key: "hedgeDealReferenceNumber" },
    { headerName: "Currency", key: "currency" },
    { headerName: "Hedge Amount", key: "hedgeAmount" },
    { headerName: "Spot Booked", key: "spotBooked" },
    { headerName: "Forward Points", key: "forwardPoints" },
    { headerName: "Bank Margin", key: "bankMargin" },
    { headerName: "Hedge Rate", key: "hedgeRate" },

    { headerName: "Delivery Date From", key: "dueDateFrom" },
    { headerName: "Delivery Date To", key: "dueDateTo" },

    { headerName: "Outstanding Amount", key: "outstandingAmount" },
    { headerName: "Outstanding Amount (INR)", key: "outstandingAmountInInr" },
    { headerName: "Status", key: "status" },

    { headerName: "Settled Amount", key: "settledAmount" },
    { headerName: "Settlement Rate", key: "settlementdRate" },
    { headerName: "Cancelled Amount", key: "cancelledAmount" },
    { headerName: "Cancellation Rate", key: "cancellationRate" },
    { headerName: "P/L on Cancellation (INR)", key: "plOnCancellationInInr" },

    { headerName: "Allocated Amount", key: "allocatedAmount" },
    {
      headerName: "Balance Pending Allocation",
      key: "balancePendingAllocation",
    },

    {
      headerName: "Settled List",
      key: "exposureRefs",
      type: "component",
      metaData: {
        component: (row: any) => <SettledList {...row} />,
      },
    },
    {
      headerName: "Cancelled List",
      key: "exposureRefs",
      type: "component",
      metaData: {
        component: (row: any) => <CancelledList {...row} />,
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
        title="Forward Register"
        data={exportData}
        columns={ForwardRegisterColumns}
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
                // columns: ForwardRegisterColumns,
                data: dummyForwardRegisterData.map(({ exposureRefs, cancelledList, settledList, ...rest }: any) => rest),
                fileName: "Forward_Register_Sample.xlsx",
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
        title="Forward Register"
        width="75vw"
        size="xl"
      >
        <ForwardRegisterForm
          submitForm={submitExportForm}
          key={formKey}
          editData={editRow}
          onClose={handleDrawerClose}
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
        title="Forward Register Upload Results"
      />
      {isUploading && <Loader />}
    </>
  ) : (
    <RestrictedAccess />
  );
};

export default ForwardRegisterTable;
