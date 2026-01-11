import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { Box } from "@chakra-ui/react";
import store from "../../../store/store";
import CustomTable from "../../../config/component/CustomTable/CustomTable";
import CustomDrawer from "../../../config/component/Drawer/CustomDrawer";
import AddForm from "./component/AddForm";
import EditForm from "./component/EditForm";
import AdminViewDetails from "./component/AdminDetailsView";

/* -------------------- LocalStorage Key -------------------- */
export const STORAGE_KEY = "addUserFormData";

/* -------------------- Debounce Helper -------------------- */
function debounce(fn: Function, delay = 500) {
  let timer: any;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const UserList = observer(() => {
  const {
    TestimonialStore: { getTestimonials, testimonials },
    auth: { openNotification },
  } = store;

  /* -------------------- State -------------------- */
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"add" | "view" | "edit">("add");
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [localData, setLocalData] = useState<any[]>([]);

  /* -------------------- Load from LocalStorage -------------------- */
  const loadLocalData = () => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

      const normalized = stored.map((item: any, index: number) => ({
        ...item,
        ...item.basicDetails,
        _originalIndex: index,
      }));

      setLocalData(normalized);
    } catch (e) {
      console.error("LocalStorage read failed", e);
      setLocalData([]);
    }
  };

  useEffect(() => {
    loadLocalData();
  }, []);

  /* -------------------- Keep testimonials logic -------------------- */
  useEffect(() => {
    if (!testimonials.hasFetch) {
      getTestimonials({ page: 1 }).catch((err) => {
        openNotification({
          title: "Failed to get testimonials",
          message: err.message,
          type: "error",
        });
      });
    }
  }, [getTestimonials, openNotification, testimonials.hasFetch]);

  /* -------------------- Drawer Controls -------------------- */
  const openDrawer = (mode: "add" | "view" | "edit", row?: any) => {
    setDrawerMode(mode);
    setSelectedRow(row || null);

    if (mode === "edit" && row) {
      setEditIndex(row._originalIndex);
    } else {
      setEditIndex(null);
    }

    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedRow(null);
    setEditIndex(null);
  };

  const handleAfterSubmit = () => {
    loadLocalData();
    closeDrawer();
  };

  /* -------------------- Debounced Search (kept for API) -------------------- */
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        getTestimonials({ page: 1, search: value });
      }, 500),
    [getTestimonials]
  );

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
        data={localData}
        loading={false}
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
              showEditButton: true,
              function: (row: any) => openDrawer("edit", row),
            },
          },
          search: {
            show: true,
            placeholder: "Search users...",
            searchValue: search,
            onSearchChange: (e: any) => {
              const value = e.target.value;
              setSearch(value);
              debouncedSearch(value);
            },
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

        {drawerMode === "edit" && editIndex !== null && (
          <Box p={4}>
            <EditForm
              recordIndex={editIndex}
              onUpdate={handleAfterSubmit}
              onCancel={closeDrawer}
            />
          </Box>
        )}
      </CustomDrawer>
    </Box>
  );
});

export default UserList;
