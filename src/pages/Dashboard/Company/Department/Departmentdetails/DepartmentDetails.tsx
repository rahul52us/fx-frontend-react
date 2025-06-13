import { useEffect, useState } from "react";
import DeleteDepartment from "./component/DeleteCategory";
import AddDepartment from "./component/AddDepartment";
import EditDepartment from "./component/EditDepartment";
import store from "../../../../../store/store";
import { tablePageLimit } from "../../../../../config/constant/variable";
import FormModel from "../../../../../config/component/common/FormModel/FormModel";
import CustomTable from "../../../../../config/component/CustomTable/CustomTable";

const DepartmentDetails = ({ selectedCategory, setSelectedCategory }: any) => {
  const [openModel, setOpenModel] = useState<any>({
    open: false,
    data: null,
    type: "add",
    loading: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const {
    DepartmentStore: { getAllDepartment, departments, deleteDepartment },
    auth: { openNotification },
  } = store;

  useEffect(() => {
    setLoading(true);
    getAllDepartment(selectedCategory?.data?._id, {
      page: 1,
      limit: tablePageLimit,
    })
      .then((data) => {
        setData(data?.data || []);
        setTotalPages(data.totalPages);
      })
      .catch((err: any) => {
        openNotification({
          type: "error",
          title: "Failed to get Departments",
          message: err?.message,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [getAllDepartment, openNotification, selectedCategory]);

  // function to get the data from backend on the page, limit, date and others
  const applyGetAllRecords = ({ page, limit, reset }: any) => {
    const query: any = {};
    if (reset) {
      query["page"] = 1;
      query["limit"] = tablePageLimit;
    } else {
      query["page"] = page || currentPage;
      query["limit"] = limit || tablePageLimit;
    }
    setLoading(true);
    getAllDepartment(selectedCategory?.data?._id, query)
      .then((data) => {
        setData(data?.data || []);
        setTotalPages(data.totalPages);
      })
      .catch((err: any) => {
        openNotification({
          type: "error",
          title: "Failed to get Department Categories",
          message: err?.message,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteRecord = (id: any) => {
    setOpenModel((prev: any) => ({ ...prev, loading: true }));
    deleteDepartment(id)
      .then(() => {
        openNotification({
          type: "success",
          title: "Deleted Successfully",
          message: "Record Has been Deleted Successfully",
        });
        applyGetAllRecords({ page: 1, limit: tablePageLimit });
        setOpenModel({ loading: false, open: false, data: null, type: "add" });
      })
      .catch((err) => {
        openNotification({
          type: "error",
          title: "Failed to get Department Categories",
          message: err?.message,
        });
      })
      .finally(() => {
        setOpenModel((prev: any) => ({ ...prev, loading: false }));
      });
  };

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
    applyGetAllRecords({ page, limit: tablePageLimit });
  };

  const columns = [
    {
      headerName: "title",
      key: "title",
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
      headerName: "Created At",
      type: "date",
      key: "createdAt",
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
    <>
      <FormModel
        loading={departments.loading}
        title={`${selectedCategory.data?.title} (${selectedCategory?.data?.code})`}
        open={selectedCategory.open}
        isCentered
        close={() => setSelectedCategory({ open: false, data: null, id: null })}
      >
        <CustomTable
          cells={true}
          columns={columns}
          data={data}
          loading={loading}
          title="Positions"
          actions={{
            applyFilter: {
              show: false,
              function: () => {},
            },
            resetData: {
              show: true,
              text: "Reset Data",
              function: () => applyGetAllRecords({ reset: true }),
            },
            actionBtn: {
              addKey: {
                showAddButton: true,
                function: (dt: any) => {
                  setOpenModel({
                    type: "add",
                    data: dt,
                    open: true,
                  });
                },
              },
              editKey: {
                showEditButton: true,
                function: (dt: any) => {
                  setOpenModel({
                    type: "edit",
                    data: dt,
                    open: true,
                  });
                },
              },
              deleteKey: {
                showDeleteButton: true,
                function: (dt: string) => {
                  setOpenModel({
                    type: "delete",
                    data: dt,
                    open: true,
                  });
                },
              },
            },
            pagination: {
              show: true,
              onClick: handleChangePage,
              currentPage: currentPage,
              totalPages: totalPages,
            },
          }}
        />
      </FormModel>
      {openModel?.open && openModel?.type === "delete" && (
        <DeleteDepartment
          openModel={openModel}
          setOpenModel={setOpenModel}
          deleteRecord={deleteRecord}
        />
      )}
      {openModel?.open && openModel?.type === "add" && (
        <AddDepartment
          openModel={openModel}
          setOpenModel={setOpenModel}
          getAllRecords={applyGetAllRecords}
          selectedCategory={selectedCategory}
        />
      )}
      {openModel?.open && openModel?.type === "edit" && (
        <EditDepartment
          openModel={openModel}
          setOpenModel={setOpenModel}
          getAllRecords={applyGetAllRecords}
          selectedCategory={selectedCategory}
        />
      )}
    </>
  );
};

export default DepartmentDetails;