import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import store from "../../../../store/store";
import CustomTable from "../../../../config/component/CustomTable/CustomTable";
import { getStatusType } from "../../../../config/constant/statusCode";
import { employDropdownData } from "../../Users/component/UserDetails/utils/constant";
import ViewCompany from "./component/element/form/ViewCompany";
import CustomDrawer from "../../../../config/component/Drawer/CustomDrawer";
import AddCompany from "./component/element/form/AddCompany";
import EditCompany from "./component/element/form/EditCompany";

const HolidaysDetailTable = observer(() => {
  const [viewCompanyModel, setViewCompanyModel] = useState<any>({
    open: false,
    data: null,
  });
  const [addCompanyModel, setAddCompanyModel] = useState<any>({
    open: false,
    data: null,
  });
  const [editCompanyModel, setEditCompanyModel] = useState<any>({
    open: false,
    data: null
  });
  const dropdowns = useState(employDropdownData)[0];
  const [selectedOptions, setSelectedOptions] = useState({});
  const [date, setDate] = useState<any>({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [formValues, setFormValues] = useState<any>({
    open: false,
    loading: false,
    type: "add",
    data: null,
  });

  const {
    company: { getCompanies, companies },
    auth: { openNotification },
  } = store;

  useEffect(() => {
    getCompanies({})
      .then(() => {})
      .catch((err: any) => {
        openNotification({
          type: getStatusType(err.status),
          title: "Failed to get Companies",
          message: err?.data?.message,
        });
      });
  }, [getCompanies, openNotification]);

  // function to get the data from backend on the page, limit, date and others
  const applyGetAllRecords = () => {
    const query: any = {};
    getCompanies(query)
      .then(() => {})
      .catch((err: any) => {
        openNotification({
          type: "error",
          title: "Failed to get Companies",
          message: err?.message,
        });
      });
  };

  const onDateChange = (e: any, type: string) => {
    setDate((prev: any) => ({ ...prev, [type]: e }));
  };

  const handleChangePage = () => {
    applyGetAllRecords();
  };

  const resetTableData = () => {
    setDate({
      startDate: new Date(),
      endDate: new Date(),
    });
    setSelectedOptions({});
    applyGetAllRecords();
  };

  const UserTableColumns = [
    {
      headerName: "Company Name",
      key: "company_name",
      type: "link",
      function: (dt: string) => {
        setViewCompanyModel({ open: true, data: dt });
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
      headerName: "Mobile Number",
      key: "mobileNo",
      type: "string",
      props: { row: { minW: 100, textAlign: "center" } },
    },
    {
      headerName: "Work Number",
      key: "workNo",
      props: {
        row: { minW: 120, textAlign: "center" },
        column: { textAlign: "center" },
      },
    },
    {
      headerName: "Description",
      key: "bio",
      type: "tooltip",
      props: {
        row: { minW: 160, textAlign: "center" },
        column: { textAlign: "center" },
      },
    },
    {
      headerName: "Created At",
      key: "createdAt",
      type: "tooltip",
      props: {
        row: { minW: 180, textAlign: "center" },
        column: { textAlign: "center" },
      },
    },
    {
      headerName: "Actions",
      key: "table-actions",
      type: "table-actions",
      props: {
        row: { maxW: 60, textAlign: "center" },
        column: { maxW: 60, textAlign: "center" },
      },
    },
  ];

  return (
    <>
      <CustomTable
        cells={true}
        actions={{
          search: {
            show: true,
            placeholder: "Search by code and username",
            searchValue: "",
            onSearchChange: () => {},
          },
          applyFilter: {
            show: false,
            function: () => applyGetAllRecords(),
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
                setAddCompanyModel({open : true , data : null})
              },
            },
            editKey: {
              showEditButton: true,
              function: (e: any) => {
                setEditCompanyModel({
                  open : true,
                  data : e
                })
              },
            },
            viewKey: {
              showViewButton: true,
              function: (dt: string) => {
                setViewCompanyModel({ open: true, data: dt });
              },
            },
            deleteKey: {
              showDeleteButton: true,
              function: (dt: string) => {
                setFormValues(() => ({
                  ...formValues,
                  data: dt,
                  open: true,
                  type: "delete",
                }));
              },
            },
          },
          pagination: {
            show: false,
            onClick: handleChangePage,
            currentPage: 1,
            totalPages: companies.totalPages,
          },
          datePicker: {
            show: false,
            isMobile: true,
            date: {
              startDate: date.startDate,
              endDate: date.endDate,
            },
            onDateChange: (e: string, type: string) => onDateChange(e, type),
          },
          multidropdown: {
            show: false,
            title: "Apply Filters",
            placeholder: "Apply Filters",
            search: {
              searchValue: "",
              visible: true,
              placeholder: "Search Value here",
              onSearchChange: () => {},
            },
            dropdowns: dropdowns,
            onApply: () => applyGetAllRecords(),
            selectedOptions: selectedOptions,
            onDropdownChange: (value: any, label: string) => {
              setSelectedOptions((prev: any) => ({ ...prev, [label]: value }));
            },
          },
        }}
        title="Companies"
        data={companies.data}
        columns={UserTableColumns}
        loading={companies.loading}
        serial={{ show: false, text: "S.No.", width: "10px" }}
      />

      {/* Add Company Model */}
      {editCompanyModel.open && (
        <CustomDrawer
          open={editCompanyModel.open}
          width={"95vw"}
          props={{margin:0,padding : 0}}
          close={() => setEditCompanyModel({ open: false, data: null })}
        >
          <EditCompany
            data={editCompanyModel.data}
            onClose={() => setEditCompanyModel({ open: false, data: null })}
          />
        </CustomDrawer>
      )}

      {/* Add Company Model */}
      {addCompanyModel.open && (
        <CustomDrawer
          open={addCompanyModel.open}
          width={"95vw"}
          props={{margin:0,padding : 0}}
          close={() => setAddCompanyModel({ open: false, data: null })}
        >
          <AddCompany
            // data={addCompanyModel.data}
            onClose={() => setAddCompanyModel({ open: false, data: null })}
          />
        </CustomDrawer>
      )}

      {/* View Company Model */}
      {viewCompanyModel.data && viewCompanyModel.open && (
        <CustomDrawer
          open={viewCompanyModel.open}
          width={"70vw"}
          close={() => setViewCompanyModel({ open: false, data: null })}
        >
          <ViewCompany
            data={viewCompanyModel.data}
            onClose={() => setViewCompanyModel({ open: false, data: null })}
          />
        </CustomDrawer>
      )}
    </>
  );
});

export default HolidaysDetailTable;