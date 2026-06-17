import {
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import RestrictedAccess from "../../../../config/component/common/RestrictedAccess/RestrictedAccess";
import { useDeleteItem } from "../../../../config/component/customHooks/useDeleteItem";
import { usePermission } from "../../../../config/component/customHooks/usePermission";
import CustomTable from "../../../../config/component/CustomTable/CustomTable";
import CustomDrawer from "../../../../config/component/Drawer/CustomDrawer";
import store from "../../../../store/store";
import { dymmyForwardCancellationData } from "../../exportsRegister/component/utils/constant";
import {
  exportToExcel,
  importFromExcel,
} from "../../exportsRegister/component/utils/function";
import {
  RegisterFilterPanel,
  createFilterState,
  filterTableData,
  hasActiveFilters,
  paginateRows,
} from "../../common/registerTableFilters";
import ForwardCancellationForm from "../ForwardCancellationForm/ForwardCancellationForm";
import { dealTypeOptions } from "../../exportsRegister/component/utils/constant";
import { mainExposureTypeOptions } from "../../importsRegister/component/utils/constant";

const ForwardCancellationTable = () => {
  const [exportData, setExportData] = useState<any[]>([]);
  const [filteredRows, setFilteredRows] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
   const [editRow, setEditRow] = useState<any | null>(null);
  const [originalRow, setOriginalRow] = useState<any | null>(null);
  const [formKey, setFormKey] = useState(0);
  const url = process.env.REACT_APP_FX_BASE_URL
  const { deleteItem } = useDeleteItem();
  const filterFields = [
    { name: "startDate", label: "Start Date" },
    { name: "endDate", label: "End Date" },
    {
      name: "dealType",
      label: "Deal Type",
      type: "select" as const,
      placeholder: "All Deal Types",
      options: dealTypeOptions,
    },
    {
      name: "exposureType",
      label: "Exposure Type",
      type: "select" as const,
      placeholder: "All Types",
      options: mainExposureTypeOptions,
    },
  ];
  const [filterState, setFilterState] = useState(createFilterState(filterFields));
  const [appliedFilters, setAppliedFilters] = useState<any>(null);

  // Permission checks
  const { canAdd, canEdit, canDelete, canView } = usePermission('forwardCancellation');

  const submitExportForm = async (values: any, actions: any, type: string) => {
    try {
      let payload = {
        userToken: "abcxyz",
        data: type === "excel" ? values : [values],
      };
      const response = await axios.post(
        `${url}/forwardCancellationpcfc/form/`,
        payload
      );
      console.log('response-------', response)

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

  const fetchForwardCancellationPage = useCallback(async (currentPage = 1) => {
    const response = await axios.post(
      `${url}/forwardCancellationpcfc/view/`,
      { userToken: "abcxyz", page: currentPage, limit: rowsPerPage, userId: viewAsUserId }
    );
    const result = response.data?.data?.data || [];
    const total = response.data?.data?.total_pages || 1;
    return { result, total };
  }, [url, rowsPerPage, viewAsUserId]);

  const fetchAllForwardCancellationData = useCallback(async () => {
    const response = await axios.post(
      `${url}/forwardCancellationpcfc/view/`,
      { userToken: "abcxyz", page: 1, limit: 1000000, userId: viewAsUserId }
    );
    return response.data?.data?.data || [];
  }, [url, viewAsUserId]);

  const fetchExportRegisterData = useCallback(async (currentPage = 1, filters = appliedFilters) => {
    setLoading(true);
    try {
      if (hasActiveFilters(filters)) {
        const allRows = await fetchAllForwardCancellationData();
        const filtered = filterTableData(allRows, filters, {
          dateKeys: ["createdAt", "transactionDate", "deliveryDateFrom", "deliveryDateTo"],
          searchKeys: [
            "forwardDealId",
            "bank",
            "businessUnit",
            "currency",
            "washRate",
          ],
        });
        setFilteredRows(filtered);
        setExportData(paginateRows(filtered, currentPage, rowsPerPage));
        setTotalPages(Math.max(1, Math.ceil(filtered.length / rowsPerPage)));
        return;
      }

      const { result, total } = await fetchForwardCancellationPage(currentPage);
      setFilteredRows(null);
      setExportData(result);
      setTotalPages(total);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, fetchAllForwardCancellationData, fetchForwardCancellationPage, rowsPerPage]);

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
      const result = filteredRows ?? (await fetchAllForwardCancellationData());
      if (result.length > 0) {
        // Remove unwanted fields before export
        const exportData = result.map(({ _id, __v, userId, hedgeDeals, amountSettled, amountSettledList, ...rest }: any) => rest);

        exportToExcel({
          data: exportData,
          fileName: "forward_cancellation_all_data.xlsx",
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


  // const DealDataColumns = [
  //   { headerName: "Deal Type", key: "dealType" },
  //   { headerName: "Exposure Type", key: "exposureType" },
  //   { headerName: "Transaction Date", key: "transactionDate" },
  //   { headerName: "Created Date", key: "createdAt" },

  //   { headerName: "Forward Deal ID", key: "forwardDealId" },
  //   { headerName: "PO Number", key: "poNumber" },

  //   { headerName: "Bank", key: "bank" },
  //   { headerName: "Business Unit", key: "businessUnit" },
  //   { headerName: "Currency", key: "currency" },

  //   { headerName: "Outstanding Amount", key: "outstandingAmount" },
  //   { headerName: "Cancellation Amount", key: "cancellationAmount" },

  //   { headerName: "Booked Rate", key: "bookedRate" },
  //   { headerName: "Spot Booked", key: "spotBooked" },
  //   { headerName: "Forward Premium", key: "fwdPremium" },
  //   { headerName: "Cash Tom Spot", key: "cashTomSpot" },
  //   { headerName: "Bank Margin", key: "bankMargin" },

  //   { headerName: "Delivery Date From", key: "deliveryDateFrom" },
  //   { headerName: "Delivery Date To", key: "deliveryDateTo" },

  //   { headerName: "Net Cancellation Rate", key: "netCancellationRate" },
  //   { headerName: "P/L in FCY", key: "plInFCY" },
  //   { headerName: "P/L in INR", key: "plInINR" },
  //   { headerName: "Wash Rate", key: "washRate" },

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

  const DealDataColumns = [
  { headerName: "Deal Type", key: "dealType" },
  { headerName: "Exposure Type", key: "exposureType" },
  { headerName: "Transaction Date", key: "transactionDate" },
  { headerName: "Created Date", key: "createdAt" },

  { headerName: "Forward Deal ID", key: "forwardDealId" },

  { headerName: "Bank", key: "bank" },
  { headerName: "Business Unit", key: "businessUnit" },
  { headerName: "Currency", key: "currency" },

  { headerName: "Outstanding Amount", key: "outstandingAmount" },
  { headerName: "Cancellation Amount", key: "cancellationAmount" },

  { headerName: "Booked Rate", key: "bookedRate" },
  { headerName: "Spot Booked", key: "spotBooked" },
  { headerName: "Forward Premium", key: "fwdPremium" },
  { headerName: "Cash Tom Spot", key: "cashTomSpot" },
  { headerName: "Bank Margin", key: "bankMargin" },

  { headerName: "Delivery Date From", key: "deliveryDateFrom" },
  { headerName: "Delivery Date To", key: "deliveryDateTo" },

  { headerName: "Net Cancellation Rate", key: "netCancellationRate" },
  { headerName: "P/L in FCY", key: "plInFCY" },
  { headerName: "P/L in INR", key: "plInINR" },
  { headerName: "Wash Rate", key: "washRate" },
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

   const handleDrawerClose = () => {
    setEditRow(null);
    setOriginalRow(null);
    setFormKey((prev) => prev + 1); // 🔥 force remount
    onClose();
  };

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
          title="Forward Cancellation"
          data={exportData}
          columns={DealDataColumns}
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
                  // columns: DealDataColumns,
                  data: dymmyForwardCancellationData.map(({ hedgeDeals, ...rest }: any) => rest),
                  fileName: "Forward_Cancellation_Sample.xlsx",
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
                  // onOpen();
                },
              },
              deleteKey: {
                showDeleteButton: canDelete,
                function: (row: any) =>
                  deleteItem({
                    url: `${url}/delup/deleterow/`,
                    rowId: row.rowId,
                    formType: "forwardCancellationPcfc",
                    refetch: fetchExportRegisterData,
                  }),
              },
            },
          }}
          loading={loading}
        />

        <CustomDrawer
          open={isOpen}
          close={onClose}
          title="Add Forward Cancellation Entry"
          size="xl"
          width="75vw"
        >
          
          <ForwardCancellationForm 
          // submitForm={submitExportForm}
            submitForm={submitExportForm}
            key={formKey}
            editData={editRow}
            onClose={handleDrawerClose}
            originalData={originalRow}
          />
          {/* <ForwardCancellationForm submitForm={submitExportForm} /> */}
        </CustomDrawer>
      </>) : <RestrictedAccess />
  );
};

export default ForwardCancellationTable;
