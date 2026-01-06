// src/pages/admin/TestimonialList.tsx (or wherever your file is)

import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { Box } from "@chakra-ui/react";
import store from "../../../store/store";
import CustomTable from "../../../config/component/CustomTable/CustomTable";
import CustomDrawer from "../../../config/component/Drawer/CustomDrawer";
import AddForm from "./component/AddForm";
import EditForm from "./component/EditForm"; // Import the separate EditForm
import AdminViewDetails from "./component/AdminDetailsView";

/* -------------------- Debounce Helper -------------------- */
function debounce(fn: Function, delay = 500) {
  let timer: any;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const TestimonialList = observer(() => {
  const {
    TestimonialStore: { getTestimonials, testimonials },
    auth: { openNotification },
  } = store;

  /* -------------------- State -------------------- */
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"add" | "view" | "edit">("add");
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null); // Track original index

  /* -------------------- LocalStorage Data -------------------- */
  const [localData, setLocalData] = useState<any[]>([]);

  const loadLocalData = () => {
    try {
      const stored = JSON.parse(localStorage.getItem("addFormData") || "[]");

      // Flatten basicDetails and attach original index for editing
      setLocalData(
        stored.map((item: any, index: number) => ({
          ...item,
          ...item.basicDetails,
          _originalIndex: index, // Critical: used to update correct record
        }))
      );
    } catch (error) {
      console.error("Failed to load local data:", error);
      setLocalData([]);
    }
  };

  useEffect(() => {
    loadLocalData();
  }, []);

  /* -------------------- Initial API Load (kept for testimonials) -------------------- */
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

  /* -------------------- Submit Handler (Add or Edit) -------------------- */
  const handleAfterSubmit = () => {
    loadLocalData(); // Refresh table data
    closeDrawer();
  };

  /* -------------------- Debounced Search (for testimonials API) -------------------- */
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
    { headerName: "Organisation", key: "organisationName" },
    { headerName: "Benchmarking", key: "benchmarking" },
    { headerName: "Actions", type: "table-actions" },
  ];

  return (
    <Box p={2}>
      <CustomTable
        title="Admin Records (Local)"
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
            placeholder: "Search admins...",
            searchValue: search,
            onSearchChange: (e: any) => {
              const value = e.target.value;
              setSearch(value);
              debouncedSearch(value);
            },
          },
        }}
      />

      {/* ==================== Custom Drawer ==================== */}
      <CustomDrawer
        open={drawerOpen}
        close={closeDrawer}
        title={
          drawerMode === "add"
            ? "Add Admin"
            : drawerMode === "edit"
            ? "Edit Admin"
            : "View Admin"
        }
        width="80vw"
      >
        {/* View Mode */}
        {drawerMode === "view" && selectedRow && (
          <Box p={4}>
            <AdminViewDetails data={selectedRow} />
          </Box>
        )}

        {/* Add Mode */}
        {drawerMode === "add" && (
          <Box p={4}>
            <AddForm onSubmit={handleAfterSubmit} onCancel={closeDrawer} />
          </Box>
        )}

        {/* Edit Mode */}
        {drawerMode === "edit" && editIndex !== null && (
          <Box>
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

export default TestimonialList;