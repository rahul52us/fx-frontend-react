import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tablePageLimit } from "../../../../../config/constant/variable";
import useDebounce from "../../../../../config/component/customHooks/useDebounce";
import store from "../../../../../store/store";
import { dashboard } from "../../../../../config/constant/routes";
import CustomTable from "../../../../../config/component/CustomTable/CustomTable";
import { employDropdownData } from "../utils/constant";
import { generateTableData } from "../utils/function";

const UserTable = observer(() => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const dropdowns = useState(employDropdownData)[0];
  const [selectedOptions, setSelectedOptions] = useState({});
  const [pageLimit, setPageLimit] = useState(tablePageLimit);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);
  const [date, setDate] = useState<any>({
    startDate: new Date(),
    endDate: new Date(),
  });

  const {
    User: { getAllManagerUsers, managerUsers },
    auth: { openNotification, user },
  } = store;

  const applyGetAllRecords = useCallback(
    ({ page, limit, reset }: any) => {
      const query: any = {
        managerId: user._id,
      };
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
      getAllManagerUsers(query)
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
      getAllManagerUsers,
      openNotification,
      user,
    ]
  );

  useEffect(() => {
    applyGetAllRecords({
      page: currentPage,
      limit: tablePageLimit,
      search: debouncedSearchQuery,
    });
  }, [currentPage, debouncedSearchQuery, applyGetAllRecords]);

  const onDateChange = (e: any, type: string) => {
    setDate((prev: any) => ({ ...prev, [type]: e }));
  };

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
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
    applyGetAllRecords({ reset: true });
  };

  const UserTableColumns = [
    {
      headerName: "Name",
      key: "name",
      type: "link",
      function: (e: any) => {
        navigate(
          `${dashboard.attendence.userList}/${e?._id}?tab=daily`
        );
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
      headerName: "E-Code",
      key: "code",
      props: { row: { minW: 160, textAlign: "center" } },
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
        headerName: "DOJ",
        key: "doj",
        type : 'date',
        props: {
          row: { minW: 120, textAlign: "center" },
          column: { textAlign: "center" },
        },
      },
    {
      headerName: "Designation",
      key: "designation",
      props: {
        row: { minW: 120, textAlign: "center" },
        column: { textAlign: "center" },
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
    <CustomTable
      cells={true}
      actions={{
        search:{
          show: true,
          searchValue: searchQuery,
          onSearchChange: (e: any) => setSearchQuery(e.target.value),
        },
        applyFilter: {
          show: true,
          function: () => applyGetAllRecords({ page: currentPage }),
        },
        resetData: {
          show: true,
          text: "Reset Data",
          function: () => resetTableData(),
        },
        actionBtn: {
          viewKey: {
            showViewButton: true,
            function: (e : any) => {
              navigate(
                `${dashboard.request.userList}/${e?._id}`
              );
            },
          },
        },
        pagination: {
          show: true,
          onClick: handleChangePage,
          currentPage: currentPage,
          totalPages: managerUsers.totalPages,
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
            searchValue: searchQuery,
            visible: false,
            placeholder: "Search Value here",
            // onSearchChange: (e: any) => setSearchQuery(e),
          },
          dropdowns: dropdowns,
          onApply: () => applyGetAllRecords({}),
          selectedOptions: selectedOptions,
          onDropdownChange: (value: any, label: string) => {
            setSelectedOptions((prev: any) => ({ ...prev, [label]: value }));
          },
        },
      }}

      title="Users Details"
      data={generateTableData(managerUsers.data)}
      columns={UserTableColumns}
      loading={managerUsers.loading}
      serial={{ show: false, text: "S.No.", width: "10px" }}
    />
  );
});

export default UserTable;