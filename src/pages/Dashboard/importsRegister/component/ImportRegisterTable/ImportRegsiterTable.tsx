"use client";
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDeleteItem } from "../../../../../config/component/customHooks/useDeleteItem";
import CustomDrawer from "../../../../../config/component/Drawer/CustomDrawer";
import CustomTable from "../../../../../config/component/CustomTable/CustomTable";
import DeleteConfirmationModal from "../../../../../config/component/common/DeleteConfirmationModal/DeleteConfirmationModal";
import { dummyImportRegisterData } from "../../../exportsRegister/component/utils/constant";
import {
  exportToExcel,
  importFromExcel,
} from "../../../exportsRegister/component/utils/function";
import ImportRegistrationForm from "../ImportRegisterForm";
import HedgeDealsCell from "../../../exportsRegister/component/ExportRegisterTable/HedgeDealsPopover";
import store from "../../../../../store/store";
import { toJS } from "mobx";
import { LockIcon } from "@chakra-ui/icons";

const ImportRegisterTable = () => {
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
  const canAdd = store.auth.checkPermission('importRegister', 'add');
  const canEdit = store.auth.checkPermission('importRegister', 'edit');
  const canDelete = store.auth.checkPermission('importRegister', 'delete');
  const canView = store.auth.checkPermission('importRegister', 'view');
  // Delete Confirmation State
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [deleteRowData, setDeleteRowData] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDrawerClose = () => {
    setEditRow(null);
    setOriginalRow(null);
    setFormKey((prev) => prev + 1); // 🔥 force remount
    onClose();
  };

  const submitImportForm = async (values: any, actions: any, type: string) => {
    // console.log('values',values)
    try {
      // let payload = type === "excel" ? values : [values];
      let payload = {
        userToken: "abcxyz",
        data: type === "excel" ? values : [values],
      };
      const response = await axios.post(
        // "http://srv864630.hstgr.cloud:8000/importregister/form/",
        `${url}/importregister/form/`,

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
        if (fetchImportRegisterData) {
          fetchImportRegisterData();
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

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 10;

  const fetchImportRegisterData = async (currentPage = 1) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${url}/importregister/view/`,
        { userToken: "abcdxyz", page: currentPage, limit: rowsPerPage }
      );
      const result = response.data?.data?.data || [];
      const total = response.data?.data?.total_pages || 1;
      const withSerial = result.map((item: any, idx: number) => ({
        ...item,
        sno: (currentPage - 1) * rowsPerPage + idx + 1,
      }));
      setImportData(withSerial);
      setTotalPages(total);
    } catch (error) {
      console.error("Error fetching import register data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchImportRegisterData(newPage);
  };

  useEffect(() => {
    fetchImportRegisterData(page);
  }, []);

  const ImportRegisterTableColumns = [
    {
      headerName: "S.No.",
      key: "sno",
      props: { row: { textAlign: "center" } },
    },
    { headerName: "Created On", key: "createdAt" },
    {
      headerName: "Exposure Type",
      key: "exposureType",
      type: "formattedString",
    },
    { headerName: "Exposure Date", key: "exposureInputDate" },
    { headerName: "Exposure Modification Date", key: "exposureModificationDate" },
    { headerName: "PO Date", key: "poDate" },
    { headerName: "PO No", key: "poNo" },
    { headerName: "Invoice No", key: "invoiceNo" },
    { headerName: "Invoice Date", key: "invoiceDate" },
    { headerName: "Party Name", key: "partyName" },
    { headerName: "Bank", key: "bank" },
    { headerName: "Business Unit", key: "businessUnit" },
    { headerName: "BL Date", key: "blDate" },
    { headerName: "Payment Terms", key: "paymentTerms" },
    { headerName: "Due Date", key: "dueDate" },
    { headerName: "Currency", key: "currency" },
    { headerName: "Amount", key: "amount" },
    { headerName: "Budget Rate", key: "budgetRate" },
    // { headerName: "Hedge Deal Ref No", key: "hedgeDealRefNo" },
    // { headerName: "Hedged Amount", key: "hedgedAmount" },
    // { headerName: "Hedged Rate", key: "hedgedRate" },
    { headerName: "Spot on BMK Date", key: "spotOnBmkDate" },
    { headerName: "Premium on BMK Date", key: "premiumOnBmkDate" },
    { headerName: "BMK Rate", key: "bmkRate" },
    { headerName: "RM Policy Rate", key: "rmPolicyRate" },
    { headerName: "Outstanding Amount", key: "outstandingAmount" },
    { headerName: "Outstanding Amount (INR)", key: "outstandingAmountInInr" },
    { headerName: "Advance Payment", key: "advancePayment" },
    { headerName: "LC/BC Raised", key: "lc_bc_raised" },
    { headerName: "Advance Realization Rate", key: "advanceRealizationRate" },
    { headerName: "Amount Settled", key: "amountSettled" },
    { headerName: "Settlement Rate", key: "settlementRate" },
    { headerName: "P/L in INR", key: "PlInINR" },
    { headerName: "Value in INR", key: "valueInInr" },
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

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const data = await importFromExcel(file);
      await submitImportForm(data, {}, "excel");
    } catch (err) {
      console.error("Excel import failed", err);
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

  return (
    canView ? (
      <>
      <CustomTable
        title="Import Register"
        data={importData}
        columns={ImportRegisterTableColumns}
        actions={{
          search: { show: false },
          resetData: {
            show: true,
            text: "Reset Data",
            function: () => fetchImportRegisterData(1),
          },
          exportExcel: {
            show: true,
            text: "Export Excel",
            function: () =>
              exportToExcel({
                data: dummyImportRegisterData,
                fileName: "Import_Register.xlsx",
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
    </>)
    : <Flex
  minH="70vh"
  align="center"
  justify="center"
>
  <Box
    p={8}
    textAlign="center"
    w="100%"
  >
    <Flex direction="column" align="center" gap={3}>
      <Icon as={LockIcon} boxSize={10} color="gray.400" />

      <Text fontSize="lg" fontWeight="semibold">
        Restricted Access
      </Text>

      <Text fontSize="sm" color="gray.600">
        This section isn’t available for your account yet.
        If you believe this is a mistake, please contact support.
      </Text>

      <Button
        mt={3}
        size="sm"
        colorScheme="blue"
        onClick={() => window.history.back()}
      >
        Go Back
      </Button>
    </Flex>
  </Box>
</Flex>


  );
};

export default ImportRegisterTable;
