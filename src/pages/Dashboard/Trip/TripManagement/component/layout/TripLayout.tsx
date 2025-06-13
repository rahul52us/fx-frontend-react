import { observer } from "mobx-react-lite";
import TripCard from "../tripCard/TripCard";
import { Box, Center, Flex, Grid, Spinner } from "@chakra-ui/react";
import store from "../../../../../../store/store";
import { useEffect, useState } from "react";
import CustomTable from "../../../../../../config/component/CustomTable/CustomTable";
import { tablePageLimit } from "../../../../../../config/constant/variable";
import EditTripForm from "../../admin/component/forms/EditTripForm";
import AddTripForm from "../../admin/component/forms/AddTripForm";
import { getStatusType } from "../../../../../../config/constant/statusCode";
import MainPagePagination from "../../../../../../config/component/pagination/MainPagePagination";
import { useQueryParams } from "../../../../../../config/component/customHooks/useQuery";
import NotFoundData from "../../../../../../config/component/commonPages/NotFoundData";
import ViewTripData from "../../admin/component/forms/ViewTripData";

const TripLayout = observer(
  ({
    setTripFormData,
    tripFormData,
    gridType,
    gridLoading,
    setGripType,
    userId
  }: any) => {
    const {
      tripStore: {
        getAllTrip,
        trips: { data, loading, totalPages },
      },
      auth: { openNotification, checkPermission },
    } = store;
    const [selectedRecord, setSelectedRecord] = useState<any>({
      open: false,
      data: null,
    });
    const { getQueryParam, setQueryParam } = useQueryParams();
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(() =>
      getQueryParam("page") ? Number(getQueryParam("page")) : 1
    );
    const [pageLimit, setPageLimit] = useState(tablePageLimit);
    const [date, setDate] = useState<any>({
      startDate: new Date(),
      endDate: new Date(),
    });

    useEffect(() => {
      setGripType((prev : any) => ({ ...prev, loading: true }));
      getAllTrip({ page: currentPage, limit: pageLimit, userId : userId })
        .catch((err: any) => {
          openNotification({
            title: "Failed to get Department Categories",
            message: err?.data?.message,
            type: getStatusType(err.status),
          });
        })
        .finally(() => {
          setGripType((prev : any) => ({ ...prev, loading: false }));
        });
    }, [
      getAllTrip,
      openNotification,
      setGripType,
      currentPage,
      pageLimit,
      userId
    ]);

    const applyGetAllRecord = ({ page, limit, reset }: any) => {
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
      getAllTrip(query).catch((err: any) => {
        openNotification({
          title: "Failed to get Department Categories",
          message: err?.data?.message,
          type: getStatusType(err.status),
        });
      });
    };

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
      setSearchValue("");
      applyGetAllRecord({ reset: true });
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
        headerName: "Trip Type",
        key: "type",
        props: {
          column: { textAlign: "center" },
          row : {
            textAlign : 'center'
          }
        },
      },
      {
        headerName: "Description",
        key: "description",
        type: "tooltip",
        props: {
          column: { textAlign: "center" },
          row : {
            textAlign : "center"
          }
        },
      },
      {
        headerName: "Created At",
        type: "date",
        key: "createdAt",
        props: {
          column: { textAlign: "center", minW: 160 },
          row : {
            textAlign : "center"
          }
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

    if (gridLoading && gridType === "grid") {
      return (
        <Center>
          <Box mt={40}>
            <Spinner color="blue.500" thickness="4px" size="xl" />
          </Box>
        </Center>
      );
    }

    return (
      <Box>
        {data.length === 0 && loading === false ? (
          <NotFoundData
            onClick={() =>
              setTripFormData({ open: true, type: "add", data: null })
            }
            btnText="TRIP"
            title="No Trip found"
            subTitle="Start by creating a new trip to get started."
          />
        ) : gridType === "grid" ? (
          <>
            <Grid
              templateColumns={{
                base: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr 1fr",
                lg: "1fr 1fr 1fr 1fr",
              }}
              gap={4}
              columnGap={3}
            >
              {data.map((item: any, index: number) => {
                return (
                  <TripCard
                    key={index}
                    item={item}
                    setTripFormData={setTripFormData}
                    setSelectedRecord={setSelectedRecord}
                  />
                );
              })}
            </Grid>
            <Flex justifyContent="center" mt={8}>
              <MainPagePagination
                currentPage={currentPage}
                onPageChange={(page: any) => handleChangePage(page.selected)}
                totalPages={totalPages}
              />
            </Flex>
          </>
        ) : (
          <CustomTable
            title="Trips"
            loading={loading}
            columns={columns}
            data={data}
            actions={{
              actionBtn: {
                editKey: {
                  showEditButton: userId ? false : true,
                  function: (item: any) => {
                    setTripFormData({ open: true, data: item, type: "edit" });
                  },
                },
              },
              datePicker: {
                show: true,
                isMobile: true,
                date: {
                  startDate: date.startDate,
                  endDate: date.endDate,
                },
                onDateChange: (e: string, type: string) =>
                  onDateChange(e, type),
              },
              resetData: {
                show: true,
                text: "Reset Data",
                function: () => resetTableData(),
              },
              pagination: {
                show: true,
                onClick: handleChangePage,
                currentPage: currentPage,
                totalPages: totalPages,
              },
            }}
          />
        )}
        {tripFormData && checkPermission('trip','edit') && tripFormData?.type === "edit" && (
          <EditTripForm
            tripFormData={tripFormData}
            setTripFormData={setTripFormData}
            handleGetRecord={applyGetAllRecord}
          />
        )}

        {tripFormData && checkPermission('trip','add') && <AddTripForm
          tripFormData={tripFormData}
          setTripFormData={setTripFormData}
          handleGetRecord={applyGetAllRecord}
        />}

        {selectedRecord.data && selectedRecord.open && checkPermission('trip','view') && (
          <ViewTripData
            item={selectedRecord.data}
            open={selectedRecord.open}
            userId={checkPermission('trip','edit')}
            onClose={() => setSelectedRecord({ open: false, data: null })}
          />
        )}
      </Box>
    );
  }
);

export default TripLayout;