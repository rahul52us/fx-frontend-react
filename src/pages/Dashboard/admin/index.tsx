import { useState, useEffect, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { Box, useToast } from "@chakra-ui/react";
import store from "../../../store/store";
import CustomTable from "../../../config/component/CustomTable/CustomTable";
import CustomDrawer from "../../../config/component/Drawer/CustomDrawer";
import AddForm from "./component/AddForm";
import AdminViewDetails from "./component/AdminDetailsView";

const AdminList = observer(() => {
  const { adminStore } = store;
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"add" | "view" | "edit">("add");
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminStore.getAdmins({ search, role: 'admin' });
      // Use response.data if it exists and is an array, otherwise check response itself
      // API structure might be { status: "success", data: [...] }
      const users = Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : []);

      // Flatten nested basicDetails for the table
      const formattedData = users.map((user: any) => ({
        ...user,
        ...(user.basicDetails || {}), // Spread basicDetails to top level
      }));

      setData(formattedData);
    } catch (error) {
      console.error("Failed to fetch admins", error);
      // Optional: toast error
    } finally {
      setLoading(false);
    }
  }, [adminStore, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openDrawer = (mode: "add" | "view" | "edit", row?: any) => {
    setDrawerMode(mode);
    setSelectedRow(row);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedRow(null);
  };

  const handleAfterSubmit = () => {
    closeDrawer();
    fetchData(); // Refresh list after create/update
  };

  const handleDelete = async (row: any) => {
    const name = row.userName || row.username || "this admin";
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await adminStore.deleteAdmin(row._id);
        toast({ title: "Admin deleted successfully", status: "success" });
        fetchData();
      } catch (error: any) {
        toast({ title: "Error deleting admin", description: error.message, status: "error" });
      }
    }
  };

  const columns = [
    { headerName: "Name", key: "userName" }, // Matches basicDetails.userName
    { headerName: "Email", key: "email" },
    { headerName: "Designation", key: "designation" },
    { headerName: "Actions", type: "table-actions" },
  ];

  return (
    <Box p={2}>
      <CustomTable
        title="Admin Records"
        columns={columns}
        data={data}
        loading={loading}
        serial={{ show: true }}
        actions={{
          actionBtn: {
            addKey: {
              showAddButton: true,
              function: () => openDrawer("add"),
            },
            viewKey: {
              showViewButton: true,
              function: (row: any) => openDrawer("view", row),
            },
            deleteKey: {
              showDeleteButton: true,
              function: (row: any) => handleDelete(row),
            },
          },
          search: {
            show: true,
            placeholder: "Search admins...",
            searchValue: search,
            onSearchChange: (e: any) => setSearch(e.target.value),
          },
        }}
      />

      <CustomDrawer
        open={drawerOpen}
        close={closeDrawer}
        title={
          drawerMode === "add"
            ? "Add Admin"
            : drawerMode === "view"
              ? "Admin Details"
              : "Edit Admin"
        }
        width="80vw" // Wider drawer for complex form
      >
        {drawerMode === "add" && (
          <Box p={4}>
            <AddForm onSubmit={handleAfterSubmit} onCancel={closeDrawer} />
          </Box>
        )}

        {drawerMode === "view" && selectedRow && (
          <Box p={4}>
            <AdminViewDetails data={selectedRow} />
          </Box>
        )}
      </CustomDrawer>
    </Box>
  );
});

export default AdminList;