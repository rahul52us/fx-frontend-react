import {
  Box,
  Grid,
  Heading,
  Step,
  StepDescription,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  Text,
  Stack,
  Divider,
  Icon,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import store from "../../../../../../../../store/store";
import { getStatusType } from "../../../../../../../../config/constant/statusCode";
import { FaBuilding, FaMapMarkerAlt, FaBriefcase, FaCalendarAlt, FaUser, FaClock } from "react-icons/fa";

const WorkHistory = observer(({ user }: any) => {
  const [details, setDetails] = useState([]);
  const {
    User: { getCompanyDetailsById },
    auth: { openNotification },
  } = store;

  useEffect(() => {
    getCompanyDetailsById(user)
      .then((dt: any) => {
        setDetails(dt.details || []); // Ensure details is always an array
        console.log("Fetched data:", dt);
      })
      .catch((err: any) => {
        openNotification({
          title: "Failed to Fetch Data",
          message: err?.data?.message || "An unknown error occurred.",
          type: getStatusType(err.status),
        });
      });
  }, [user, getCompanyDetailsById, openNotification]);

  const iconSize = useBreakpointValue({ base: "20px", md: "24px" });
  const boxBg = useColorModeValue("white", "gray.800");
  const boxBorderColor = useColorModeValue("gray.200", "gray.600");
  const padding = useBreakpointValue({ base: 4, md: 6 });
  const spacing = useBreakpointValue({ base: 4, md: 6 });

  return (
    <Box p={padding} maxW="container.xl" mx="auto">
      <Heading mb={8} size="lg" textAlign="center" color="teal.600">
        User Work History
      </Heading>
      <Stepper size="lg" index={0} orientation="vertical" colorScheme="teal">
        {details.map((history: any) => (
          <Step key={history._id}>
            <StepIndicator alignItems="center" borderWidth={4} borderColor="teal.500">
              <StepStatus
                complete={<StepNumber />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>

            <Box
              ml={4}
              shadow="lg"
              borderWidth={1}
              rounded="md"
              p={padding}
              mb={spacing}
              bg={boxBg}
              borderColor={boxBorderColor}
              _hover={{ shadow: "xl", borderColor: "teal.400" }}
              transition="all 0.3s ease"
            >
              <StepDescription>
                <Grid
                  templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                  gap={spacing}
                >
                  <Stack spacing={3} mb={4}>
                    <Text fontWeight="bold" fontSize="lg" color="teal.600">
                      <Icon as={FaBuilding} mr={2} boxSize={iconSize} />
                      Department
                    </Text>
                    <Text fontSize="md">{history.department?.title || "N/A"}</Text>
                    <Divider />
                  </Stack>

                  <Stack spacing={3} mb={4}>
                    <Text fontWeight="bold" fontSize="lg" color="teal.600">
                      <Icon as={FaMapMarkerAlt} mr={2} boxSize={iconSize} />
                      Work Location
                    </Text>
                    <Text fontSize="md">
                      {history.workingLocation.map((loc: any) => loc?.locationName)?.join(", ") || "N/A"}
                    </Text>
                    <Divider />
                  </Stack>

                  <Stack spacing={3} mb={4}>
                    <Text fontWeight="bold" fontSize="lg" color="teal.600">
                      <Icon as={FaBriefcase} mr={2} boxSize={iconSize} />
                      Designation
                    </Text>
                    <Text fontSize="md">{history.designation?.title || "N/A"}</Text>
                    <Divider />
                  </Stack>

                  <Stack spacing={3} mb={4}>
                    <Text fontWeight="bold" fontSize="lg" color="teal.600">
                      <Icon as={FaCalendarAlt} mr={2} boxSize={iconSize} />
                      Description
                    </Text>
                    <Text fontSize="md">{history.description || "N/A"}</Text>
                    <Divider />
                  </Stack>

                  <Stack spacing={3} mb={4}>
                    <Text fontWeight="bold" fontSize="lg" color="teal.600">
                      <Icon as={FaCalendarAlt} mr={2} boxSize={iconSize} />
                      Date of Joining
                    </Text>
                    <Text fontSize="md">{new Date(history.doj).toLocaleDateString() || "N/A"}</Text>
                    <Divider />
                  </Stack>
                  <Stack spacing={3} mb={4}>
                    <Text fontWeight="bold" fontSize="lg" color="teal.600">
                      <Icon as={FaCalendarAlt} mr={2} boxSize={iconSize} />
                      Confirmation Date
                    </Text>
                    <Text fontSize="md">{new Date(history.confirmationDate).toLocaleDateString() || "N/A"}</Text>
                    <Divider />
                  </Stack>

                  <Stack spacing={3} mb={4}>
                    <Text fontWeight="bold" fontSize="lg" color="teal.600">
                      <Icon as={FaUser} mr={2} boxSize={iconSize} />
                      Managers
                    </Text>
                    <Text fontSize="md">
                      {history.managers.map((manager: any) => manager.username).join(", ") || "N/A"}
                    </Text>
                    <Divider />
                  </Stack>

                  <Stack spacing={3} mb={4}>
                    <Text fontWeight="bold" fontSize="lg" color="teal.600">
                      <Icon as={FaClock} mr={2} boxSize={iconSize} />
                      Work Timing
                    </Text>
                    <Text fontSize="md">
                      {history.workTiming.map((timing: any) =>
                        `${timing?.daysOfWeek?.join(", ")}: ${timing?.startTime} - ${timing?.endTime}`
                      )?.join("; ") || "N/A"}
                    </Text>
                    <Divider />
                  </Stack>
                </Grid>
              </StepDescription>
            </Box>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>
    </Box>
  );
});

export default WorkHistory;
