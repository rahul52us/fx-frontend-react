import { useEffect, useState, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { Box, useToast } from "@chakra-ui/react";
import store from "../../../store/store";
import CustomTable from "../../../config/component/CustomTable/CustomTable";
import CustomDrawer from "../../../config/component/Drawer/CustomDrawer";
import AddForm from "./component/AddForm";
import AdminViewDetails from "./component/AdminDetailsView";


const UserList = observer(() => {
  const {
    User, // Changed from userStore to User
  } = store;
  const toast = useToast(); // Moved toast declaration here

  /* -------------------- State -------------------- */
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"add" | "view" | "edit">("add");
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  /* -------------------- Fetch Users from API -------------------- */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await User.getUsersWithAuth({ search, role: 'user' });
      const users = Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : []);

      const formattedData = users.map((user: any) => ({
        ...user,
        ...(user.basicDetails || {}),
      }));

      setData(formattedData);
    } catch (error: any) {
      console.error("Failed to fetch users", error);
      toast({
        title: "Error fetching users",
        description: error?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [User, search, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* -------------------- Drawer Controls -------------------- */
  const openDrawer = (mode: "add" | "view" | "edit", row?: any) => {
    setDrawerMode(mode);
    setSelectedRow(row || null);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedRow(null);
  };

  const handleAfterSubmit = () => {
    fetchData();
    closeDrawer();
  };

  /* -------------------- Delete User -------------------- */
  const handleDelete = async (row: any) => {
    const name = row.userName || row.username || "this user";
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await User.deleteUserWithAuth(row._id); // Changed from userStore.deleteUserWithAuth
        toast({
          title: "User deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchData();
      } catch (error: any) {
        toast({
          title: "Error deleting user",
          description: error.message || "Something went wrong",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  /* -------------------- Table Columns -------------------- */
  const columns = [
    { headerName: "Name", key: "userName" },
    { headerName: "Email", key: "email" },
    { headerName: "Contact", key: "contact" },
    { headerName: "Designation", key: "designation" },
    { headerName: "Actions", type: "table-actions" },
  ];

  return (
    <Box p={2}>
      <CustomTable
        title="Users Records"
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
            editKey: {
              showEditButton: false,
              function: (row: any) => openDrawer("edit", row),
            },
            deleteKey: {
              showDeleteButton: true,
              function: (row: any) => handleDelete(row),
            },
          },
          search: {
            show: true,
            placeholder: "Search users...",
            searchValue: search,
            onSearchChange: (e: any) => setSearch(e.target.value),
          },
        }}
      />

      {/* ==================== Drawer ==================== */}
      <CustomDrawer
        open={drawerOpen}
        close={closeDrawer}
        title={
          drawerMode === "add"
            ? "Add User"
            : drawerMode === "edit"
              ? "Edit User"
              : "View User"
        }
        width="80vw"
      >
        {drawerMode === "view" && selectedRow && (
          <Box p={4}>
            <AdminViewDetails data={selectedRow} />
          </Box>
        )}

        {drawerMode === "add" && (
          <Box p={4}>
            <AddForm onSubmit={handleAfterSubmit} onCancel={closeDrawer} />
          </Box>
        )}
      </CustomDrawer>
    </Box>
  );
});

export default UserList;
