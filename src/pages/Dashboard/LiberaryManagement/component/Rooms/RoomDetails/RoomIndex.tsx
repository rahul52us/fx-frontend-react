import { observer } from "mobx-react-lite";
import { Box, SimpleGrid } from "@chakra-ui/react";
import { useEffect } from "react";
import { FaPersonCircleQuestion } from "react-icons/fa6";
import { FaBookOpen, FaBookReader } from "react-icons/fa";
import store from "../../../../../../store/store";
import { getStatusType } from "../../../../../../config/constant/statusCode";
import { dashboard } from "../../../../../../config/constant/routes";
import DashPageHeader from "../../../../../../config/component/common/DashPageHeader/DashPageHeader";
import { liberaryBreadCrumb } from "../../../../utils/breadcrumb.constant";
import SummaryWidget from "../../../../../../config/component/WigdetCard/SummaryWidget";
import RoomDetails from "./RoomDetails";

const BookLiberary = observer(() => {
  const {
    bookLiberary: {
      getRoomsCounts,
      getAvailableRoomSeatCounts,
      roomsCounts,
      roomSeatCounts,
      availableRoomSeatCounts,
      getRoomsSeatCounts,
    },
    auth: { openNotification },
  } = store;

  const fetchData = (getDataFn: any) =>
    new Promise((resolve, reject) => {
      getDataFn().then(resolve).catch(reject);
    });

  useEffect(() => {
    Promise.all([
      fetchData(getRoomsCounts),
      fetchData(getAvailableRoomSeatCounts),
      fetchData(getRoomsSeatCounts),
    ])
      .then(() => {})
      .catch((err: any) => {
        openNotification({
          title: "Failed to Retrieve Counts",
          message: err?.data?.message,
          type: getStatusType(err.status),
        });
      });
  }, [
    getRoomsCounts,
    getAvailableRoomSeatCounts,
    getRoomsSeatCounts,
    openNotification,
  ]);

  const summaryData = [
    {
      label: "Total Rooms",
      value: roomsCounts.data,
      loading: roomsCounts.loading,
      icon: FaBookOpen,
      colorScheme: "teal",
      description: "Total No. of Room Counts",
    },
    {
      label: "Total Seats",
      value: roomSeatCounts.data,
      loading: roomSeatCounts.loading,
      icon: FaPersonCircleQuestion,
      colorScheme: "teal",
      description: "Here is an description for the Seats",
    },
    {
      label: "Available Seats",
      value: availableRoomSeatCounts.data,
      loading: availableRoomSeatCounts.loading,
      icon: FaBookReader,
      colorScheme: "teal",
      description: "Here is an description for the Available Seats",
      link:dashboard.liberary.books.category.index
    }
  ];

  return (
    <Box px={{ base: 2, md: 4 }}>
      <DashPageHeader
        title="Dashboard"
        breadcrumb={liberaryBreadCrumb.liberary}
      />
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={6}>
        {summaryData.map((data, index) => (
          <SummaryWidget
            key={index}
            label={data.label}
            value={data.value}
            icon={data.icon}
            colorScheme={data.colorScheme}
            description={data.description}
            link={data.link}
            loading={data.loading}
          />
        ))}
      </SimpleGrid>
      <RoomDetails />
    </Box>
  );
});

export default BookLiberary;
