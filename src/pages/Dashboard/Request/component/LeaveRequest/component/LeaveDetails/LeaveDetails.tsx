import { useEffect, useState } from "react";
import { tablePageLimit } from "../../../../../../../config/constant/variable";
import store from "../../../../../../../store/store";
import CustomTable from "../../../../../../../config/component/CustomTable/CustomTable";
import { useNavigate, useParams } from "react-router-dom";
import { dashboard } from "../../../../../../../config/constant/routes";
import { Box, Flex, Text } from "@chakra-ui/react";
import RequestButtons from "../../../element/RequestButtons";
import { observer } from "mobx-react-lite";
import { generateTableRequestData } from "../../utils/function";
import FormModel from "../../../../../../../config/component/common/FormModel/FormModel";
import ReviewStatusForm from "../common/ReviewStatusForm";

const LeaveDetails = observer(() => {
  const {
    requestStore: { getAllRequest },
    auth: { openNotification, user },
  } = store;
  const [reviewModel, setReviewModel] = useState({ open: false, data: null });
  const navigate = useNavigate();
  const [selectRequestStatus, setSelectRequestStatus] = useState("all");
  const setOpenModel = useState<any>({
    open: false,
    data: null,
    type: "add",
    loading: false,
  })[1];

  const { userId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    let query: any = {
      page: 1,
      limit: tablePageLimit,
      status: selectRequestStatus,
      user: userId ? userId : user._id,
    };
    if (
      (user.role === "manager" ||
        user.role === "admin" ||
        user.role === "superadmin") &&
      userId
    ) {
      query = { ...query, userType: "manager", managerId: user._id };
    }
    getAllRequest(query)
      .then((data) => {
        setData(generateTableRequestData(data?.data || [], userId));
        setTotalPages(data.totalPages);
      })
      .catch((err: any) => {
        openNotification({
          type: "error",
          title: `Failed to get ${selectRequestStatus} requests`,
          message: err?.message,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [getAllRequest, openNotification, selectRequestStatus, user, userId]);

  // function to get the data from backend on the page, limit, date and others
  const applyGetAllRecords = ({
    page,
    limit,
    selectRequestStatus,
    reset,
  }: any) => {
    let query: any = {};
    if (reset) {
      query["page"] = 1;
      query["limit"] = tablePageLimit;
      query["status"] = selectRequestStatus || "pending";
      query["user"] = userId ? userId : user._id;
    } else {
      query["page"] = page || currentPage;
      query["limit"] = limit || tablePageLimit;
      query["status"] = selectRequestStatus || "pending";
      query["user"] = userId ? userId : user._id;
    }
    if (user.role === "manager" && userId) {
      query = { ...query, userType: "manager", managerId: user._id };
    }
    setLoading(true);
    getAllRequest(query)
      .then((data) => {
        console.log(
          "the response are",
          generateTableRequestData(data?.data, userId)
        );
        setData(generateTableRequestData(data?.data || [], userId));
        setTotalPages(data.totalPages);
      })
      .catch((err: any) => {
        openNotification({
          type: "error",
          title: `Failed to get ${selectRequestStatus} requests`,
          message: err?.message,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
    applyGetAllRecords({ page, limit: tablePageLimit, selectRequestStatus });
  };

  const columns = [
    {
      headerName: "Leave Type",
      type: "link",
      key: "leaveType",
      function: (e: any) => {
        if (userId) {
          navigate(
            `${dashboard.request.userList}/${userId}/leave/edit/${e._id}`
          );
        } else {
          navigate(`${dashboard.request.leave}/edit/${e._id}`);
        }
      },
      props: {
        column: { textAlign: "center" },
        row: {
          textAlign: "center",
          fontWeight: 500,
          textDecoration: "none",
        },
      },
    },
    {
      headerName: "From Date",
      type: "date",
      key: "startDate",
      props: {
        row: { textAlign: "center" },
        column: { textAlign: "center" },
      },
    },
    {
      headerName: "To Date",
      type: "date",
      key: "endDate",
      props: {
        row: { textAlign: "center" },
        column: { textAlign: "center" },
      },
    },
    {
      headerName: "Status",
      type: "link",
      key: "status",
      props: {
        row: { textAlign: "center", fontWeight: "500", textDecoration: "none" },
        column: { textAlign: "center" },
      },
      function: (e: any) => {
        if (userId) {
          setReviewModel({
            data: { ...e, userId: userId, userType: "manager" },
            open: true,
          });
        } else {
          if (e.status === "pending") {
            setReviewModel({
              data: { ...e, userId: user._id, userType: "user" },
              open: true,
            });
          }
        }
      },
    },
    // {
    //   headerName: "Manager",
    //   type: "text",
    //   key: "sendTo",
    //   props: {
    //     row : {textAlign : 'center'},
    //     column: { textAlign: "center" },
    //   }
    // },
    // {
    //   headerName: "Remarks",
    //   type: "approvals",
    //   key: "approvals",
    //   props: {
    //     row: { textAlign: "center" },
    //     column: { textAlign: "center" },
    //   },
    // },
    {
      headerName: "Applied On",
      type: "date",
      key: "createdAt",
      props: {
        row: { textAlign: "center" },
        column: { textAlign: "center" },
      },
    },
    {
      headerName: "Actions",
      key: "table-actions",
      type: "table-actions",
      props: {
        column: { textAlign: "center" },
      },
    },
  ];

  return (
    <>
      <Box  >
        <Flex alignItems="center" justifyContent="space-between" m={3}>
          <Text fontSize={'lg'} fontWeight={500} color={'blue.500'}>Leave Request</Text>
          <Flex>
            <RequestButtons
              selectRequestStatus={selectRequestStatus}
              setSelectRequestStatus={setSelectRequestStatus}
            />
          </Flex>
        </Flex>
        <CustomTable
           cells={true}
          columns={columns}
          data={data}
          loading={loading}
          // title="Leave Request"
          actions={{
            applyFilter: {
              show: false,
              function: () => {},
            },
            resetData: {
              show: false,
              text: "Reset Data",
              function: () => applyGetAllRecords({ reset: true }),
            },
            actionBtn: {
              addKey: {
                showAddButton: false,
                function: () => {
                  navigate(dashboard.request.leaveAdd);
                },
              },
              editKey: {
                showEditButton: true,
                function: (e: any) => {
                  if (userId) {
                    navigate(
                      `${dashboard.request.userList}/${userId}/leave/edit/${e._id}`
                    );
                  } else {
                    navigate(`${dashboard.request.leave}/edit/${e._id}`);
                  }
                },
              },
              deleteKey: {
                showDeleteButton: false,
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
      </Box>
      <FormModel
        open={reviewModel.open}
        close={() => setReviewModel({ open: false, data: null })}
      >
        <ReviewStatusForm
          data={reviewModel.data}
          onClose={() => setReviewModel({ open: false, data: null })}
          applyGetAllRecords={applyGetAllRecords}
          selectRequestStatus={selectRequestStatus}
        />
      </FormModel>
    </>
  );
});

export default LeaveDetails;