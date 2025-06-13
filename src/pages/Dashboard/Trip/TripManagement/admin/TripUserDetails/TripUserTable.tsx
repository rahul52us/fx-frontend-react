import { Avatar, Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";
import { useQueryParams } from "../../../../../../config/component/customHooks/useQuery";
import useDebounce from "../../../../../../config/component/customHooks/useDebounce";
import { tablePageLimit } from "../../../../../../config/constant/variable";
import store from "../../../../../../store/store";
import CustomTable from "../../../../../../config/component/CustomTable/CustomTable";
import { generateTableData } from "../../utils/functions";
import CustomDrawer from "../../../../../../config/component/Drawer/CustomDrawer";
import TripUserDetail from "../../user/TripUserDetail";

const TripUsersTable = observer(() => {
  const [viewDetails, setViewDetails] = useState<any>({
    open: false,
    type: "view",
    data: null,
  });
  const { getQueryParam, setQueryParam } = useQueryParams();
  const [currentPage, setCurrentPage] = useState(() =>
    getQueryParam("page") ? Number(getQueryParam("page")) : 1
  );
  const [selectedOptions, setSelectedOptions] = useState({});
  const [pageLimit, setPageLimit] = useState(tablePageLimit);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);
  const [date, setDate] = useState<any>({
    startDate: new Date(),
    endDate: new Date(),
  });
  const {
    User: { getAllUsers, Users },
    auth: { openNotification },
  } = store;

  // console.log('generateTableData',generateTableData(Users.data))
  const applyGetAllUsers = useCallback(
    ({ page, limit, reset }: any) => {
      const query: any = {};
      if (reset) {
        query["page"] = 1;
        query["limit"] = tablePageLimit;
      } else {
        if (debouncedSearchQuery.trim()) {
          query["search"] = debouncedSearchQuery;
        }
        query["page"] = page || currentPage;
        query["limit"] = limit || pageLimit;
        query["startDate"] = date.startDate;
        query["endDate"] = date.endDate;
      }
      getAllUsers(query)
        .then(() => {})
        .catch((err) => {
          openNotification({
            type: "error",
            title: "Failed to get users",
            message: err?.message,
          });
        });
    },
    [
      debouncedSearchQuery,
      currentPage,
      pageLimit,
      date,
      getAllUsers,
      openNotification,
    ]
  );

  useEffect(() => {
    applyGetAllUsers({
      page: currentPage,
      limit: tablePageLimit,
      search: debouncedSearchQuery,
    });
  }, [currentPage, debouncedSearchQuery, applyGetAllUsers]);

  const onDateChange = (e: any, type: string) => {
    setDate((prev: any) => ({ ...prev, [type]: e }));
  };

  const handleChangePage = (page: any) => {
    setCurrentPage(page);
    setQueryParam("page", page);
  };

  const resetTableData = () => {
    setCurrentPage(1);
    setPageLimit(tablePageLimit);
    setDate({
      startDate: new Date(),
      endDate: new Date(),
    });
    setSelectedOptions({});
    setSearchQuery("");
    applyGetAllUsers({ reset: true });
  };

  const UserTableColumns = [
    {
      headerName: "Name",
      key: "name",
      type: "link",
      function: () => {},
      props: {
        column: { textAlign: "center" },
        row: {
          minW: 140,
          textAlign: "center",
          fontWeight: 500,
          textDecoration: "none",
        },
      },
    },
    {
      headerName: "Pic",
      key: "designation",
      type: "component",
      metaData: {
        component: (dt: any) => (
          <Box m={1}>
            <Avatar
              src={dt?.pic?.url || undefined}
              name={dt?.name}
              size={"sm"}
            />
          </Box>
        ),
      },
      props: {
        row: { minW: 120, textAlign: "center" },
        column: { textAlign: "center" },
      },
    },
    {
      headerName: "Code",
      key: "code",
      props: { row: { minW: 100, textAlign: "center" } },
    },
    {
      headerName: "UserName",
      key: "username",
      props: {
        row: { minW: 160, textAlign: "center" },
        column: { textAlign: "center" },
      },
    },
    {
      headerName: "Mobile Number",
      key: "mobileNo",
      type: "tooltip",
      props: {
        row: { minW: 160, textAlign: "center" },
        column: { textAlign: "center" },
      },
    },
    {
      headerName: "Created At",
      key: "createdAt",
      type: "date",
      props: { row: { minW: 120, textAlign: "center" } },
    },
    {
      headerName: "Actions",
      key: "table-actions",
      type: "table-actions",
      props: {
        // isSticky: true,
        row: { minW: 180, textAlign: "center" },
        column: { textAlign: "center" },
      },
    },
  ];

  return (
    <>
      <Box>
        <CustomTable
          cells={true}
          actions={{
            search: {
              show: true,
              placeholder: "Search by code and username",
              searchValue: searchQuery,
              onSearchChange: (e: any) => setSearchQuery(e.target.value),
            },
            applyFilter: {
              show: true,
              function: () => applyGetAllUsers({ page: currentPage }),
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
                  alert("This is new");
                },
              },
              editKey: {
                showEditButton: false,
                function: () => {
                  alert("alert");
                },
              },
              viewKey: {
                showViewButton: true,
                function: (e: any) => {
                  setViewDetails({ type: "view", open: true, data: e });
                },
              },
              deleteKey: {
                showDeleteButton: false,
                function: (dt: string) => {
                  alert(dt);
                },
              },
            },
            pagination: {
              show: true,
              onClick: handleChangePage,
              currentPage: currentPage,
              totalPages: Users.totalPages,
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
              // search: {
              //   searchValue: searchQuery,
              //   visible: true,
              //   placeholder: "Search Value here",
              //   onSearchChange: (e: any) => setSearchQuery(e),
              // },
              onApply: () => applyGetAllUsers({}),
              selectedOptions: selectedOptions,
              onDropdownChange: (value: any, label: string) => {
                setSelectedOptions((prev: any) => ({
                  ...prev,
                  [label]: value,
                }));
              },
            },
          }}
          title="Users Details"
          data={generateTableData(Users.data)}
          columns={UserTableColumns}
          loading={Users.loading}
          serial={{ show: false, text: "S.No.", width: "10px" }}
        />
      </Box>
      <CustomDrawer
        width={"95%"}
        title="User Details"
        open={viewDetails.open}
        close={() => setViewDetails({ open: false, type: "view", data: null })}
      >
        <TripUserDetail userId={viewDetails?.data?._id} isDrawer={true} />
      </CustomDrawer>
    </>
  );
});

export default TripUsersTable;
