import { Box, Heading, SimpleGrid, Flex, Icon, Button } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState, useCallback } from "react";
import MainPagePagination from "../../../../../../config/component/pagination/MainPagePagination";
import { getStatusType } from "../../../../../../config/constant/statusCode";
import store from "../../../../../../store/store";
import NotFoundData from "../../../../../../config/component/commonPages/NotFoundData";
import { useQueryParams } from "../../../../../../config/component/customHooks/useQuery";
import { FaPlus } from "react-icons/fa";
import RoomDetailDrawer from "../RoomDetailDrawers";
import RoomCard from "./element/RoomCard";
import { MdRoomPreferences } from "react-icons/md";

const RoomDetails = observer(() => {
  const {
    auth: { openNotification },
    bookLiberary: { getAllRooms, roomData, handleRoomForm, handleRoomSeatForm, handleRoomReserveSeatForm },
  } = store;

  const { getQueryParam, setQueryParam } = useQueryParams();
  const [currentPage, setCurrentPage] = useState(() =>
    getQueryParam("page") ? Number(getQueryParam("page")) : 1
  );

  const fetchRecords = useCallback(
    (page: number = currentPage) => {
      getAllRooms({ page, limit: 10 })
        .then(() => {})
        .catch((err: any) => {
          openNotification({
            title: "Failed to Retrieve Rooms",
            message: err?.data?.message,
            type: getStatusType(err.status),
          });
        });
    },
    [getAllRooms, openNotification, currentPage]
  );

  useEffect(() => {
    fetchRecords(currentPage);
  }, [currentPage, fetchRecords]);

  const handlePageChange = (page: any) => {
    setCurrentPage(page.selected);
    setQueryParam("page", page.selected);
  };

  return (
    <Box>
      <Flex mb={6} justifyContent={"space-between"}>
        <Heading
          display="flex"
          alignItems="center"
          fontSize={{ base: "xl", md: "2xl" }}
          color="teal.600"
        >
          <Icon as={MdRoomPreferences} boxSize={6} mr={2} />
          Rooms
        </Heading>
        <Flex columnGap={4}>
          <Button
            leftIcon={<FaPlus />}
            colorScheme="teal"
            variant="solid"
            size="lg"
            _hover={{ bg: "teal.600" }}
            _active={{ bg: "teal.700" }}
            _focus={{ boxShadow: "outline" }}
            onClick={() =>
              handleRoomForm({ open: true, data: null, type: "add" })
            }
          >
            Add Room
          </Button>
        </Flex>
      </Flex>
      {roomData.data.length === 0 && !roomData.loading ? (
        <NotFoundData
          onClick={() =>
            handleRoomForm({ open: true, data: null, type: "add" })
          }
          btnText="Add First Room"
          title="No Rooms found"
          subTitle="Start by creating a new room to get started."
        />
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={6} mb={8}>
          {roomData.data.map((item: any, index: number) => (
            <RoomCard
              data={{ ...item, ratings: item.ratings || [] }}
              key={index}
              handleForm={(item: any, type: string) =>
                handleRoomForm({ open: true, data: item, type: type })
              }
              handleAddSeat={(item :any, type : string) => {
                handleRoomSeatForm({ open: true, data: item, type: type })
              }}
              handleReserveSeat={(item :any, type : string) => {
                handleRoomReserveSeatForm({ open: true, data: item, type: type })
              }}
            />
          ))}
        </SimpleGrid>
      )}
      <Flex justifyContent="center" mt={8}>
        <MainPagePagination
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalPages={roomData.totalPages}
        />
      </Flex>
      <RoomDetailDrawer fetchRecords={fetchRecords} />
    </Box>
  );
});

export default RoomDetails;
