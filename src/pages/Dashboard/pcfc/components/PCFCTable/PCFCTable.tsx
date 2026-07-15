import {
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useDeleteItem } from "../../../../../config/component/customHooks/useDeleteItem";
import CustomDrawer from "../../../../../config/component/Drawer/CustomDrawer";
import CustomTable from "../../../../../config/component/CustomTable/CustomTable";
import DeleteConfirmationModal from "../../../../../config/component/common/DeleteConfirmationModal/DeleteConfirmationModal";
import { dummyPcfcData } from "../../../exportsRegister/component/utils/constant";
import {
  exportToExcel,
  importFromExcel,
} from "../../../exportsRegister/component/utils/function";
import { autoToken } from "../../../utils/constant";
import PCFCForm from "../PCFCForm/PCFCForm";
import PCFCViewDrawer from "./PCFCViewDrawer";
import { usePermission } from "../../../../../config/component/customHooks/usePermission";
import RestrictedAccess from "../../../../../config/component/common/RestrictedAccess/RestrictedAccess";
import store from "../../../../../store/store";
import {
  RegisterFilterPanel,
  createFilterState,
  getRegisterApiFilters,
  hasActiveFilters,
} from "../../../common/registerTableFilters";

const PCFCTable = () => {
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
  const { canAdd, canEdit, canDelete, canView } = usePermission('pcfc');

  const [viewData, setViewData] = useState<any>(null);
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();

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
  ];
  const [filterState, setFilterState] = useState(createFilterState(filterFields));
  const [appliedFilters, setAppliedFilters] = useState<any>(null);

  const submitExportForm = async (values: any, actions: any, type: string) => {
    try {
      // let payload = type === "excel" ? values : [values];
      let payload = {
        userToken: "abcxyz",
        data: type === "excel" ? values : [values],
      };
      const response = await axios.post(`${url}/pcfcregister/form/`, payload, {
        headers: {
          Authorization: autoToken,
        },
      });
      // "https://kzen.co.in/crudapi/pcfcregister/form/",

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

  const fetchPcfcPage = useCallback(async (currentPage = 1, filters = appliedFilters) => {
    const response = await axios.post(
      `${url}/pcfcregister/view/`,
      {
        userToken: "abcxyz",
        page: currentPage,
        limit: rowsPerPage,
        userId: viewAsUserId,
        filters: getRegisterApiFilters(filters),
      },
      {
        headers: {
          Authorization: autoToken,
        },
      }
    );
    const result = response.data?.data?.data || [];
    const total = response.data?.data?.total_pages || 1;
    return { result, total };
  }, [url, rowsPerPage, viewAsUserId, appliedFilters]);

  const fetchAllPcfcData = useCallback(async (filters = appliedFilters) => {
    const response = await axios.post(
      `${url}/pcfcregister/view/`,
      {
        userToken: "abcxyz",
        page: 1,
        limit: 1000000,
        userId: viewAsUserId,
        filters: getRegisterApiFilters(filters),
      },
      {
        headers: {
          Authorization: autoToken,
        },
      }
    );
    return response.data?.data?.data || [];
  }, [url, viewAsUserId, appliedFilters]);

  const fetchExportRegisterData = useCallback(async (currentPage = 1, filters = appliedFilters) => {
    setLoading(true);
    try {
      const { result, total } = await fetchPcfcPage(currentPage, filters);
      setExportData(result);
      setTotalPages(total);
    } catch (error) {
      console.error("Error fetching export register data:", error);
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, fetchPcfcPage]);

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
          search: filterState.search,
          startDate: filterState.startDate,
          endDate: filterState.endDate,
        })
          ? {
              ...(prev || {}),
              search: filterState.search,
              startDate: filterState.startDate,
              endDate: filterState.endDate,
            }
          : null;

        fetchExportRegisterData(1, nextFilters);
        setPage(1);
        return nextFilters;
      });
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchExportRegisterData, filterState.endDate, filterState.search, filterState.startDate]);

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
      const result = await fetchAllPcfcData(appliedFilters);
      if (result.length > 0) {
        // Remove unwanted fields before export
        const exportData = result.map(({ _id, __v, userId, hedgeDeals, amountSettled, amountSettledList, ...rest }: any) => rest);

        exportToExcel({
          data: exportData,
          fileName: "pcfc_register_all_data.xlsx",
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
      rowId: deleteRowData.rowId, // Check rowID vs rowId from your previous context, assuming rowId is correct based on deleteItem usually needing it
      formType: "pcfc",
      refetch: () => fetchExportRegisterData(page),
    });

    setDeleteLoading(false);
    onDeleteClose();
    setDeleteRowData(null);
  };

  // const PCFCColumns = [
  //   { headerName: "Created On", key: "createdAt" },
  //   { headerName: "Bank Spread", key: "bankSpread", label: "Bank Spread" },
  //   { headerName: "PCFC Input Date", key: "pcfcInputDate" },
  //   { headerName: "Drawdown Date", key: "drawdownDate" },
  //   { headerName: "Due Date", key: "dueDate" },
  //   {
  //     headerName: "Bank",
  //     key: "bank",
  //     props: { row: { textAlign: "center", textTransform: "capitalize" } },
  //   },
  //   { headerName: "Trade Ref No", key: "tradeReferenceNumber" },
  //   { headerName: "Currency", key: "currency" },
  //   {
  //     headerName: "Floating Interest Rate",
  //     key: "floatingInterestRate",
  //     label: "Floating Interest Rate",
  //   },
  //   {
  //     headerName: "Amount Settled",
  //     key: "amountSettled",
  //     label: "Amount Settled",
  //   },
  //   {
  //     headerName: "Outstanding Amount",
  //     key: "outStandingAmount",
  //     label: "Outstanding Amount",
  //   },
  //   {
  //     headerName: "Trade Reference Number",
  //     key: "tradeReferenceNumber",
  //     label: "Trade Reference Number",
  //   },
  //   {
  //     headerName: "Outstanding Amount (INR)",
  //     key: "outstandingAmountInInr",
  //     label: "Outstanding Amount (INR)",
  //   },
  //   { headerName: "Drawdown Amount", key: "drawdownAmount" },
  //   { headerName: "Drawdown Rate", key: "drawdownRate" },
  //   { headerName: "Total Interest Rate", key: "totalInterestRate" },
  //   {
  //     headerName: "Actions",
  //     key: "table-actions",
  //     type: "table-actions",
  //     props: {
  //       row: { minW: 200, textAlign: "center" },
  //       column: { textAlign: "center" },
  //     },
  //   },
  // ];

  const PCFCColumns = [
  { headerName: "Created On", key: "createdAt" },

  { headerName: "Bank Spread", key: "bankSpread" },
  { headerName: "PCFC Input Date", key: "pcfcInputDate" },
  { headerName: "Drawdown Date", key: "drawdownDate" },
  { headerName: "Due Date", key: "dueDate" },

  {
    headerName: "Bank",
    key: "bank",
    props: { row: { textAlign: "center", textTransform: "capitalize" } },
  },

  { headerName: "Trade Reference Number", key: "tradeReferenceNumber" },
  { headerName: "Currency", key: "currency" },

  { headerName: "Floating Interest Rate", key: "floatingInterestRate" },
  { headerName: "Total Interest Rate", key: "totalInterestRate" },

  { headerName: "Drawdown Amount", key: "drawdownAmount" },
  { headerName: "Drawdown Rate", key: "drawdownRate" },

  { headerName: "Amount Settled", key: "amountSettled" },
  { headerName: "Outstanding Amount", key: "outStandingAmount" },
  {
    headerName: "Outstanding Amount (INR)",
    key: "outstandingAmountInInr",
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
          title="PCFC Register"
          data={exportData}
          columns={PCFCColumns}
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
                  data: dummyPcfcData.map(({ hedgeDeals, ...rest }: any) => rest),
                  fileName: "Pcfc_Register_Sample.xlsx",
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

              // editKey: { showEditButton: true, function: () => {}},
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
          title="PCFC Register Form"
          size="xl"
          width="75vw"
        >
          <PCFCForm
           submitForm={submitExportForm}
            key={formKey}
            editData={editRow}
            onClose={handleDrawerClose}
            originalData={originalRow}
          />
        </CustomDrawer>
        <PCFCViewDrawer
          isOpen={isViewOpen}
          onClose={onViewClose}
          data={viewData}
        />

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

export default PCFCTable;
