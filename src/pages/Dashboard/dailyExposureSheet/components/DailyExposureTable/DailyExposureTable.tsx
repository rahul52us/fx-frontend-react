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
import {
  RegisterFilterPanel,
  createFilterState,
  filterTableData,
  hasActiveFilters,
  paginateRows,
} from "../../../common/registerTableFilters";
import ExposureSettlementForm from "../DailyExposureSheetForm/DailyExposureSheetForm";
import ExposureSettlementViewDrawer from "./ExposureSettlementViewDrawer";
import {
  exposureTypeOptions,
  settlementTypeOptions,
} from "../../../exportsRegister/component/utils/constant";

const DailyExposureTable = () => {
  const [exportData, setExportData] = useState<any[]>([]);
  const [filteredRows, setFilteredRows] = useState<any[] | null>(null);
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
  const filterFields = [
    { name: "startDate", label: "Start Date" },
    { name: "endDate", label: "End Date" },
    {
      name: "exposureType",
      label: "Exposure Type",
      type: "select" as const,
      placeholder: "All Types",
      options: exposureTypeOptions,
    },
    {
      name: "settlementType",
      label: "Settlement Type",
      type: "select" as const,
      placeholder: "All Types",
      options: settlementTypeOptions,
    },
  ];
  const [filterState, setFilterState] = useState(createFilterState(filterFields));
  const [appliedFilters, setAppliedFilters] = useState<any>(null);

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
        // "https://kzen.co.in/crudapi/exposuresettlementreport/form/",
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
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
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

  const fetchExposureSettlementPage = useCallback(async (currentPage = 1) => {
    const response = await axios.post(
      `${url}/exposuresettlementreport/view/`,
      { userToken: "abcxyz", page: currentPage, limit: rowsPerPage, userId: viewAsUserId }
    );
    const result = response.data?.data?.data || [];
    const total = response.data?.data?.total_pages || 1;
    return { result, total };
  }, [url, rowsPerPage, viewAsUserId]);

  const fetchAllExposureSettlementData = useCallback(async () => {
    const response = await axios.post(
      `${url}/exposuresettlementreport/view/`,
      { userToken: "abcxyz", page: 1, limit: 1000000, userId: viewAsUserId }
    );
    return response.data?.data?.data || [];
  }, [url, viewAsUserId]);

  const fetchExportRegisterData = useCallback(async (currentPage = 1, filters = appliedFilters) => {
    setLoading(true);
    try {
      if (hasActiveFilters(filters)) {
        const allRows = await fetchAllExposureSettlementData();
        const filtered = filterTableData(allRows, filters, {
          dateKeys: ["createdAt", "settlementDate", "settlementInputDate", "dueDate"],
          searchKeys: [
            "poNumber",
            "invoiceBcNumber",
            "partyName",
            "bussinessUnit",
            "bank",
            "currency",
          ],
        });
        setFilteredRows(filtered);
        setExportData(paginateRows(filtered, currentPage, rowsPerPage));
        setTotalPages(Math.max(1, Math.ceil(filtered.length / rowsPerPage)));
        return;
      }

      const { result, total } = await fetchExposureSettlementPage(currentPage);
      setFilteredRows(null);
      setExportData(result);
      setTotalPages(total);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, fetchAllExposureSettlementData, fetchExposureSettlementPage, rowsPerPage]);

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
    setFilteredRows(null);
    setPage(1);
    fetchExportRegisterData(1, null);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    if (filteredRows) {
      setExportData(paginateRows(filteredRows, newPage, rowsPerPage));
      return;
    }
    fetchExportRegisterData(newPage);
  };

  useEffect(() => {
    if (!canView) return;
    fetchExportRegisterData(page);
  }, [viewAsUserId, canView, fetchExportRegisterData, page]);

  const handleDownloadAll = async () => {
    setLoading(true);
    try {
      const result = filteredRows ?? (await fetchAllExposureSettlementData());
      if (result.length > 0) {
        // Remove unwanted fields before export
        const exportData = result.map(({ _id, __v, userId, hedgeDeals, amountSettled, amountSettledList, ...rest }: any) => rest);

        exportToExcel({
          data: exportData,
          fileName: "exposure_settlement_all_data.xlsx",
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
        <RegisterFilterPanel
          fields={filterFields}
          filterState={filterState}
          hasAppliedFilters={hasActiveFilters(appliedFilters)}
          onChange={(e: any) => {
            const { name, value } = e.target;
            setFilterState((prev: any) => ({ ...prev, [name]: value }));
          }}
          onApply={applyFilters}
          onClear={clearFilters}
        />

        <CustomTable
          title="Exposure Settlement Register"
          data={exportData}
          columns={DailyExposureColumns}
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
                  // columns: DailyExposureColumns,
                  data: exposureSettlementReport.map(({ hedgeDeals, ...rest }: any) => rest),
                  fileName: "Exposure_Settlement_Sample.xlsx",
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
