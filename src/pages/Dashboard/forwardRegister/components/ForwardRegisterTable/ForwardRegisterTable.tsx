import {
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDeleteItem } from "../../../../../config/component/customHooks/useDeleteItem";
import CustomDrawer from "../../../../../config/component/Drawer/CustomDrawer";
import CustomTable from "../../../../../config/component/CustomTable/CustomTable";
import DeleteConfirmationModal from "../../../../../config/component/common/DeleteConfirmationModal/DeleteConfirmationModal";
import { dummyForwardRegisterData } from "../../../exportsRegister/component/utils/constant";
import {
  exportToExcel,
  importFromExcel,
} from "../../../exportsRegister/component/utils/function";
import ForwardRegisterForm from "../ForwardRegisterForm/ForwardRegisterForm";
import ExposureRefsCell from "./ExposureRefsCell";
import { usePermission } from "../../../../../config/component/customHooks/usePermission";
import RestrictedAccess from "../../../../../config/component/common/RestrictedAccess/RestrictedAccess";

const ForwardRegisterTable = () => {
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
  const { canAdd, canEdit, canDelete, canView } = usePermission('forwardRegister');

  // Delete Confirmation State
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [deleteRowData, setDeleteRowData] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const submitExportForm = async (values: any, actions: any, type: string) => {
    try {
      // let payload = type === "excel" ? values : [values];
      let payload = {
        userToken: "abcxyz",
        data: type === "excel" ? values : [values],
      };
      const response = await axios.post(
        // "http://srv864630.hstgr.cloud:8000/forwardregister/form/",
        `${url}/forwardregister/form/`,
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
      const response = await axios.post(
        `${url}/forwardregister/view/`,
        { userToken: "abcxyz", page: currentPage, limit: rowsPerPage }
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
      console.error("Error fetching export register data:", error);
    } finally {
      setLoading(false);
    }
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
  }, []);

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

  const ForwardRegisterColumns = [
    { headerName: "Created On", key: "createdAt" },
    { headerName: "Booking Date", key: "bookingDate" },
    { headerName: "Exposure Type", key: "exposureType" },
    { headerName: "Forward Input Date", key: "forwardInputDate" },
    { headerName: "Forward Modification Date", key: "forwardModificationDate" },

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
    { headerName: "Balance Pending Allocation", key: "balancePendingAllocation" },

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
          title="Forward Register"
          data={exportData}
          columns={ForwardRegisterColumns}
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
                  // columns: ForwardRegisterColumns,
                  data: dummyForwardRegisterData,
                  fileName: "Forward_Register.xlsx",
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
      </>) : <RestrictedAccess />
  );
};

export default ForwardRegisterTable;
