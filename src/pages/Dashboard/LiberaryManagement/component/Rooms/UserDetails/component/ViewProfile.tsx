import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import store from "../../../../../../../store/store";
import { getStatusType } from "../../../../../../../config/constant/statusCode";
import {
  Box,
  Text,
  Image,
  VStack,
  HStack,
  Badge,
  Grid,
} from "@chakra-ui/react";
import DrawerLoader from "../../../../../../../config/component/Loader/DrawerLoader";

// Type definitions
interface Reservation {
  _id: string;
  roomDetails: {
    coverImage: {
      url: string;
    };
    title: string;
    description: string;
  };
  seatDetails: {
    seatNumber: string;
  };
  status: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}

interface DataState {
  data: Reservation[];
  totalPages: number;
  loading: boolean;
}

const ReservationCard = ({ reservation }: { reservation: Reservation }) => (
  <Box
    borderWidth="1px"
    borderRadius="lg"
    overflow="hidden"
    p={5}
    boxShadow="md"
    _hover={{ boxShadow: "lg", transform: "scale(1.02)" }}
    transition="all 0.2s ease-in-out"
  >
    <HStack spacing={4}>
      <Image
        boxSize="150px"
        objectFit="cover"
        src={reservation.roomDetails.coverImage.url}
        alt={reservation.roomDetails.title}
        borderRadius="md"
      />
      <VStack align="start" spacing={2}>
        <Text fontSize="lg" fontWeight="bold" color="teal.600">
          {reservation.roomDetails.title}
        </Text>
        <Text fontSize="sm" color="gray.600">
          {reservation.roomDetails.description}
        </Text>
        <HStack spacing={2}>
          <Badge colorScheme="teal">Seat: {reservation.seatDetails.seatNumber}</Badge>
          <Badge colorScheme="blue">Status: {reservation.status}</Badge>
        </HStack>
        <Text>
          <strong>Start Date:</strong>{" "}
          {new Date(reservation.startDate).toLocaleDateString()}
        </Text>
        <Text>
          <strong>End Date:</strong>{" "}
          {new Date(reservation.endDate).toLocaleDateString()}
        </Text>
        <Text>
          <strong>Created At:</strong>{" "}
          {new Date(reservation.createdAt).toLocaleDateString()}
        </Text>
      </VStack>
    </HStack>
  </Box>
);

const ViewProfile = observer(({ userId }: { userId: string }) => {
  const [data, setData] = useState<DataState>({ data: [], totalPages: 0, loading: false });
  const {
    bookLiberary: { getUserReserveSeat },
    auth: { openNotification },
  } = store;

  useEffect(() => {
    setData({ data: [], totalPages: 0, loading: true });
    getUserReserveSeat({ user: userId })
      .then((dt) => {
        setData({ data: dt.data, totalPages: dt.totalPages, loading: false });
      })
      .catch((error) => {
        openNotification({
          title: "Fetch Failed",
          message: error?.data?.message || "An error occurred",
          type: getStatusType(error.status),
        });
        setData((prev : any) => ({ ...prev, loading: false }));
      });
  }, [openNotification, getUserReserveSeat, userId]);

  return (
    <DrawerLoader
      loading={data.loading}
      noRecordFoundText={data.data.length === 0}
    >
      <Grid gridTemplateColumns={{base : '1fr', md : '1fr 1fr'}} gap={4}>
        {data.data.length > 0 &&  (
          data.data.map((reservation) => (
            <ReservationCard key={reservation._id} reservation={reservation} />
          )))}
      </Grid>
    </DrawerLoader>
  );
});

export default ViewProfile;
