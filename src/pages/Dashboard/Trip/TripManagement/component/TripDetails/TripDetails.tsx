import {
  Box,
  Divider,
  Flex,
  Grid,
  HStack,
  Image,
  Stack,
  Tag,
  Text,
  useColorModeValue,
  VStack,
  Icon,
  Button,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { MdLocationOn, MdEvent, MdAttachMoney } from "react-icons/md";
import ShowData from "../../../../Users/component/UserDetails/component/ShowData";
import { RiUserAddLine } from "react-icons/ri";
import AddNewUser from "./AddNewUser";
import store from "../../../../../../store/store";
import ShowAttachments from "../../../../../../config/component/common/showAttachments/ShowAttachments";
import ParticipantCard from "../../../../../../config/component/common/showParticipants/ShowParticipantCard";

interface TripData {
  _id: string;
  title: string;
  description: string;
  country: string;
  totalTripExpense: string;
  thumbnail: {
    name: string;
    url: string;
    type: string;
  };
  currency: string;
  type: string;
  isActive: boolean;
  createdBy: any;
  company: string;
  companyOrg: string;
  createdAt: string;
  attach_files: any[];
  participants: Array<{
    _id: string;
    username: string;
    role: string;
  }>;
  travelDetails: Array<{
    fromState?: string;
    toState?: string;
    fromCity?: string;
    toCity?: string;
    startDate: string;
    endDate: string;
    travelMode: string;
    travelCost: string;
    isCab: boolean;
    cabCost: string;
    isAccommodation?: boolean;
    locality?: string;
    durationOfStay?: number;
    accommodationCost?: string;
    _id: string;
  }>;
  additionalExpenses: Array<{
    type?: string;
    amount?: string;
    _id?: string;
  }>;
}

const TripDetails: React.FC<{
  trip: TripData;
  setTripData: any;
  userId: any;
}> = ({ trip, setTripData }) => {
  const {
    auth: { checkPermission },
  } = store;
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const secondaryTextColor = useColorModeValue("gray.500", "gray.400");
  const boxHoverBg = useColorModeValue("gray.50", "gray.700");

  const [addNewUser, setAddNewUser] = useState<any>({
    type: null,
    data: null,
    open: false,
    title: null,
  });

  return (
    <Box
      p={{ base: 5, md: 10 }}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="lg"
      bg={bgColor}
      w="100%"
    >
      <Flex
        direction={{ base: "column", lg: "row" }}
        gap={10}
        mb={8}
        align={{ base: "center", lg: "start" }}
      >
        <Image
          borderRadius="lg"
          boxSize={{ base: "150px", lg: "200px" }}
          objectFit="cover"
          src={trip.thumbnail?.url}
          alt={trip.thumbnail?.name}
          mb={{ base: 4, lg: 0 }}
          boxShadow="md"
        />
        <VStack align="start" spacing={4} w="full">
          <Flex
            justifyContent="space-between"
            width={"100%"}
            alignItems="center"
          >
            <Text
              fontSize="3xl"
              fontWeight="bold"
              color={textColor}
              cursor="pointer"
            >
              {trip.title}
            </Text>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="blue"
              cursor="pointer"
            >
              {trip.totalTripExpense}
            </Text>
          </Flex>
          <Text color={secondaryTextColor} fontSize="md">
            {trip.description}
          </Text>
          <HStack spacing={4}>
            <Tag rounded={"full"} colorScheme="purple">
              {trip.country}
            </Tag>
            <Tag
              textTransform={"capitalize"}
              py={1}
              rounded={"full"}
              colorScheme="blue"
            >
              {trip.type}
            </Tag>
            <Tag
              py={1}
              rounded={"full"}
              colorScheme={trip.isActive ? "green" : "red"}
            >
              {trip.isActive ? "Active" : "Inactive"}
            </Tag>
          </HStack>
          <Text fontSize="sm" color={secondaryTextColor}>
            Created by {trip.createdBy?.[0]?.username} on{" "}
            {new Date(trip.createdAt).toLocaleDateString()}
          </Text>
        </VStack>
      </Flex>

      <Divider my={6} />

      <Stack spacing={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={6} color={textColor}>
            Travel Details
          </Text>
          {trip.travelDetails.map((detail) => (
            <Box
              key={detail._id}
              p={6}
              borderWidth="1px"
              borderRadius="xl"
              mb={4}
              bg={boxHoverBg}
              boxShadow="md"
              transition="all 0.3s ease"
              _hover={{
                transform: "translateY(-5px)",
                boxShadow: "xl",
              }}
            >
              <Stack spacing={4}>
                <HStack spacing={3} align="center">
                  <Icon as={MdLocationOn} color="blue.500" />
                  <Text fontWeight="bold" color={textColor} fontSize="lg">
                    From {detail.fromCity}, {detail?.fromState} to{" "}
                    {detail.toCity}, {detail?.toState}
                  </Text>
                </HStack>
                <HStack spacing={3} align="center">
                  <Icon as={MdEvent} color="blue.500" />
                  <Tag colorScheme="telegram" w={"fit-content"}>
                    Date: {new Date(detail?.startDate).toLocaleDateString()} to{" "}
                    {new Date(detail?.endDate).toLocaleDateString()}
                  </Tag>
                </HStack>

                <Grid
                  mt={4}
                  templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                  gap={8}
                >
                  <ShowData label="Travel Mode" value={detail?.travelMode} />
                  <ShowData
                    label="Travel Cost"
                    value={`${trip.currency} ${detail?.travelCost}`}
                  />
                  {detail.isCab && (
                    <ShowData
                      label="Cab Cost"
                      value={`${trip.currency} ${detail?.cabCost}`}
                    />
                  )}
                  {detail.isAccommodation && (
                    <ShowData
                      label="Accommodation Cost"
                      value={`${trip.currency} ${detail?.accommodationCost}`}
                    />
                  )}
                  <ShowData label="Locality" value={detail?.locality} />
                  {detail?.durationOfStay && (
                    <ShowData
                      label="Duration of Stay"
                      value={`${detail?.durationOfStay} days`}
                    />
                  )}
                </Grid>
              </Stack>
            </Box>
          ))}
        </Box>

        {trip.additionalExpenses.length > 0 && (
          <Box>
            <Text fontSize="2xl" fontWeight="bold" mb={6} color={textColor}>
              Additional Expenses
            </Text>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
              gap={8}
            >
              {trip?.additionalExpenses.map((expense) => (
                <Box
                  key={expense._id}
                  p={5}
                  borderWidth={1}
                  borderRadius="xl"
                  bg={boxHoverBg}
                  transition="all 0.3s ease"
                  _hover={{
                    transform: "translateY(-5px)",
                    boxShadow: "xl",
                  }}
                >
                  <Flex justify="space-between" align="center">
                    <Text
                      fontWeight="bold"
                      fontSize="lg"
                      textTransform={"capitalize"}
                      color={textColor}
                    >
                      {expense?.type}
                    </Text>
                    <Text
                      fontSize={"xl"}
                      fontWeight="bold"
                      color="green.400"
                      display="flex"
                      alignItems="center"
                    >
                      <Icon as={MdAttachMoney} mr={1} />
                      {expense?.amount}
                    </Text>
                  </Flex>
                </Box>
              ))}
            </Grid>
          </Box>
        )}

        <Box>
          <Flex justifyContent="space-between">
            <Text fontSize="2xl" fontWeight="bold" color={textColor} mb={6}>
              Participants
            </Text>
            {checkPermission("trip", "edit") && (
              <Button
                leftIcon={<RiUserAddLine />}
                variant="outline"
                size="sm"
                rounded="full"
                onClick={() =>
                  setAddNewUser({
                    type: "participants",
                    open: true,
                    data: "user",
                    title: "New Member",
                  })
                }
              >
                Invite New
              </Button>
            )}
          </Flex>
          <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={6}>
            {trip.participants.map((participant: any) => (
              <ParticipantCard
                key={participant?.user?._id}
                participant={participant}
                textColor={textColor}
                boxHoverBg={boxHoverBg}
              />
            ))}
          </Grid>
        </Box>
        <Box mt={2}>
          <ShowAttachments attach_files={trip?.attach_files || []} />
        </Box>
      </Stack>
      {addNewUser.open && addNewUser.data && (
        <AddNewUser
          open={addNewUser.open}
          type={addNewUser.type}
          data={addNewUser.data}
          title={addNewUser.title}
          item={trip}
          setFetchData={setTripData}
          close={() =>
            setAddNewUser({
              open: false,
              data: null,
              type: null,
              title: "user",
            })
          }
        />
      )}
    </Box>
  );
};

export default TripDetails;