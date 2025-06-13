import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import DepartmentDetails from "../Departmentdetails/DepartmentDetails";
import DeleteCategory from "./Category/component/DeleteCategory";
import AddCategory from "./Category/component/AddCategory";
import EditCategory from "./Category/component/EditCategory";
import { tablePageLimit } from "../../../../../config/constant/variable";
import CustomTable from "../../../../../config/component/CustomTable/CustomTable";
import store from "../../../../../store/store";
import { employDropdownData } from "../../../Users/component/UserDetails/utils/constant";
import { Box } from "@chakra-ui/react";

const DepartmentCategories = observer(() => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<any>({
    id: null,
    open: false,
    data: null,
  });
  const [openModel, setOpenModel] = useState<any>({
    open: false,
    data: null,
    type: "add",
    loading: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const dropdowns = useState(employDropdownData)[0];
  const [selectedOptions, setSelectedOptions] = useState({});
  const [pageLimit, setPageLimit] = useState(tablePageLimit);
  const [date, setDate] = useState<any>({
    startDate: new Date(),
    endDate: new Date(),
  });

  const {
    auth: { openNotification },
    DepartmentStore: {
      getAllDepartmentCategories,
      departmentCategories,
      deleteDepartmentCategory,
    },
  } = store;

  useEffect(() => {
    getAllDepartmentCategories({ page: 1, limit: tablePageLimit })
      .then(() => {})
      .catch((err: any) => {
        openNotification({
          type: "error",
          title: "Failed to get Department Categories",
          message: err?.message,
        });
      });
  }, [getAllDepartmentCategories, openNotification]);

  // function to get the data from backend on the page, limit, date and others
  const applyGetRecords = ({ page, limit, reset }: any) => {
    const query: any = {};
    if (reset) {
      query["page"] = 1;
      query["limit"] = tablePageLimit;
    } else {
      if (searchValue?.length > 0 && searchValue?.trim()) {
        query["search"] = searchValue;
      }
      query["page"] = page || currentPage;
      query["limit"] = limit || pageLimit;
      query["startDate"] = date?.startDate ? date?.startDate : undefined;
      query["endDate"] = date?.endDate ? date?.endDate : undefined;
    }
    getAllDepartmentCategories(query)
      .then(() => {})
      .catch((err: any) => {
        openNotification({
          type: "error",
          title: "Failed to get Department Categories",
          message: err?.message,
        });
      });
  };

  const onDateChange = (e: any, type: string) => {
    setDate((prev: any) => ({ ...prev, [type]: e }));
  };

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
    applyGetRecords({ page, limit: pageLimit });
  };

  const resetTableData = () => {
    setCurrentPage(1);
    setPageLimit(tablePageLimit);
    setDate({
      startDate: new Date(),
      endDate: new Date(),
    });
    setSelectedOptions({});
    setSearchValue("");
    applyGetRecords({ reset: true });
  };

  const categoriesColumns = [
    {
      headerName: "title",
      key: "title",
      type: "link",
      function: (e: any) => {
        setSelectedCategory({
          id: e?._id,
          open: true,
          data: e,
        });
      },
      props: {
        column: { textAlign: "center" },
        row: {
          minW: 120,
          textAlign: "center",
          fontWeight: 500,
          textDecoration: "none",
        },
      },
    },
    {
      headerName: "Code",
      key: "code",
      props: { row: { minW: 100, textAlign: "center" } },
    },
    {
      headerName: "Created At",
      key: "createdAt",
      type: "date",
      props: { row: { minW: 120, textAlign: "center" } },
    },
    {
      headerName: "Department Count",
      key: "departmentCount",
      props: { row: { minW: 180, textAlign: "center" } },
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

  const deleteRecord = (id: any) => {
    setOpenModel((prev : any) => ({...prev,loading : true}))
    deleteDepartmentCategory(id)
      .then(() => {
        openNotification({
          type: "success",
          title: "Successfully Deleted",
          message: "Record Deleted Successfully",
        });
        applyGetRecords({});
        setOpenModel({
          loading : false,
          data : null,
          open : false,
          type : 'add'
        })
      })
      .catch((err) => {
        openNotification({
          type: "error",
          title: "Failed to get Department Categories",
          message: err?.message,
        });
      }).finally(() => {
        setOpenModel((prev : any) => ({
          ...prev,loading : false

        }))
      });
  };

  return (
    <Box>
      <CustomTable
        actions={{
          applyFilter: {
            show: true,
            function: () => applyGetRecords({ page: currentPage }),
          },
          resetData: {
            show: true,
            text: "Reset Data",
            function: () => resetTableData(),
          },
          actionBtn: {
            addKey: {
              showAddButton: true,
              function: () => {
                setOpenModel({
                  type : 'add',
                  data : null,
                  open : true
                })
              },
            },
            editKey: {
              showEditButton: true,
              function: (e: any) => {
                setOpenModel({
                  type : 'edit',
                  data : e,
                  open : true
                })
              },
            },
            viewKey: {
              showViewButton: false,
              function: (dt: string) => {
                alert(dt);
              },
            },
            deleteKey: {
              showDeleteButton: true,
              function: (dt: string) => {
                setOpenModel({
                  type : 'delete',
                  data : dt,
                  open : true
                })
              },
            },
          },
          pagination: {
            show: true,
            onClick: handleChangePage,
            currentPage: currentPage,
            totalPages:departmentCategories.totalPages
          },
          datePicker: {
            show: true,
            isMobile: true,
            date: {
              startDate: date.startDate,
              endDate: date.endDate,
            },
            onDateChange: (e: string, type: string) => onDateChange(e, type),
          },
          multidropdown: {
            show: true,
            title: "Apply Filters",
            placeholder: "Apply Filters",
            search: {
              searchValue: "",
              visible: true,
              placeholder: "Search Value here",
              onSearchChange: (e: string) => setSearchValue(e),
            },
            dropdowns: dropdowns,
            onApply: () => applyGetRecords({}),
            selectedOptions: selectedOptions,
            onDropdownChange: (value: any, label: string) => {
              setSelectedOptions((prev: any) => ({ ...prev, [label]: value }));
            },
          },
        }}
        title="Departments"
        data={departmentCategories.data}
        columns={categoriesColumns}
        loading={departmentCategories.loading}
        serial={{ show: false, text: "S.No.", width: "10px" }}
      />
      {selectedCategory.open && (
        <DepartmentDetails
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      )}
      {openModel?.open && openModel?.type === "delete" && (
        <DeleteCategory openModel={openModel} deleteRecord={deleteRecord} setOpenModel={setOpenModel} />
      )}
      {openModel?.open && openModel?.type === "add" && (
        <AddCategory openModel={openModel} setOpenModel={setOpenModel} getAllRecords={applyGetRecords}/>
      )}
      {openModel?.open && openModel?.type === "edit" && (
        <EditCategory openModel={openModel} setOpenModel={setOpenModel} getAllRecords={applyGetRecords}/>
      )}
    </Box>
  );
});

export default DepartmentCategories;
