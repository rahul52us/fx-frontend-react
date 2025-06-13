import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tablePageLimit } from "../../../../../config/constant/variable";
import { dashboard } from "../../../../../config/constant/routes";
import CustomTable from "../../../../../config/component/CustomTable/CustomTable";
import store from "../../../../../store/store";

const PersonalDetailTable = observer(({ data, loading }: any) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit] = useState(tablePageLimit);

  const {
    User: { getAllUsers, Users },
    auth: { openNotification },
  } = store;

  const applyGetAllUsers = useCallback(
    ({ page, limit, reset }: any) => {
      const query: any = {};
      if (reset) {
        query["page"] = 1;
        query["limit"] = tablePageLimit;
      } else {
        query["page"] = page || currentPage;
        query["limit"] = limit || pageLimit;
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
    [currentPage, pageLimit, getAllUsers, openNotification]
  );

  useEffect(() => {
    if (false) {
      applyGetAllUsers({});
    }
  }, [applyGetAllUsers]);

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const UserTableColumns = [
    {
      headerName: "Name",
      key: "name",
      type: "link",
      function: (e: any) => {
        navigate(
          `${dashboard.Users.personalDetails}/${e?._id}`
        );
      },
      props: {
        column: { textAlign: "center" },
        row: {
          minW: 120,
          textAlign: "center",
          fontWeight: 500,
          textDecoration: "none",
          padding:5
        },
      },
    },
    {
      headerName: "User Name",
      key: "name",
      props: {
        row: { minW: 160, textAlign: "left" },
        column: { textAlign: "left" },
      },
    },
    {
      headerName: "E-Code",
      key: "code",
      props: { row: { minW: 100, textAlign: "center" } },
    },
    {
      headerName: "UserName",
      key: "username",
      props: {
        row: { minW: 160, textAlign: "left" },
        column: { textAlign: "left" },
      },
    },
    {
      headerName: "Designation",
      key: "designation",
      props: {
        row: { minW: 160, textAlign: "left" },
        column: { textAlign: "left" },
      },
    },
    {
      headerName: "Department",
      key: "department",
      props: {
        row: { minW: 160, textAlign: "left" },
        column: { textAlign: "left" },
      },
    },
    {
      headerName: "Blood Group",
      key: "bloodGroup",
      props: {
        row: { minW: 160, textAlign: "left" },
        column: { textAlign: "left" },
      },
    },
  ];

  return (
    <CustomTable
      actions={{
        pagination: {
          show: true,
          onClick: handleChangePage,
          currentPage: currentPage,
          totalPages: Users.totalPages,
        },
      }}
      data={data}
      columns={UserTableColumns}
      loading={loading}
      serial={{ show: false, text: "S.No.", width: "10px" }}
    />
  );
});

export default PersonalDetailTable;
