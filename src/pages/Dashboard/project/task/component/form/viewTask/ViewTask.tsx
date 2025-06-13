import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import store from "../../../../../../../store/store";
import { getStatusType } from "../../../../../../../config/constant/statusCode";
import DrawerLoader from "../../../../../../../config/component/Loader/DrawerLoader";
import {
  Box,
  Flex,
  Text,
  Heading,
  Badge,
  Stack,
  Divider,
  useColorModeValue,
  Grid,
} from "@chakra-ui/react";
import ShowAttachments from "../../../../../../../config/component/common/showAttachments/ShowAttachments";
import ParticipantCard from "../../../../../../../config/component/common/showParticipants/ShowParticipantCard";

const ViewTask = observer(({ task }: any) => {
  const [fetchData, setFetchData] = useState<any>({
    loading: false,
    data: null,
  });

  const {
    Project: { getSingleTask },
    auth: { openNotification },
  } = store;

  useEffect(() => {
    setFetchData((prev: any) => ({ ...prev, loading: true, data: null }));
    getSingleTask({ id: task?._id })
      .then(({ data }: any) => {
        data.attach_files = data?.attach_files?.map((it: any) => ({
          ...it,
          file: it.file ? [it.file] : undefined,
        }));
        setFetchData({
          loading: false,
          data: data,
        });
      })
      .catch((err: any) => {
        setFetchData({ loading: false, data: null });
        openNotification({
          title: "Failed to Fetch Record",
          message: err?.data?.message,
          type: getStatusType(err.status),
        });
      });
  }, [getSingleTask, openNotification, task]);

  // Use color mode values for theme adaptability
  const bgColor = useColorModeValue("white", "gray.800");
  const dividerColor = useColorModeValue("gray.200", "gray.600");
  const cardHoverBgColor = useColorModeValue("gray.100", "gray.600");
  const textColor = useColorModeValue("gray.700", "gray.300");

  return (
    <DrawerLoader
      loading={fetchData.loading}
      noRecordFoundText={fetchData.data === null}
    >
      {fetchData.data && (
        <Box
          p={{ base: 4, md: 6 }}
          bg={bgColor}
          borderRadius="lg"
          boxShadow="lg"
        >
          <Flex
            justifyContent="space-between"
            alignItems={{ base: "flex-start", md: "center" }}
            mb={4}
            direction={{ base: "column", md: "row" }}
          >
            <Box mb={{ base: 4, md: 0 }}>
              <Heading as="h2" size="lg" textAlign="left" color="teal.500">
                {fetchData.data.title}
              </Heading>
              <Text fontSize="md" mt={2} color={textColor}>
                {fetchData.data.description}
              </Text>
            </Box>
            <Flex
              direction="column"
              alignItems={{ base: "flex-start", md: "flex-end" }}
            >
              <Badge
                colorScheme="blue"
                fontSize="lg"
                p={2}
                borderRadius="md"
                mb={2}
              >
                {fetchData.data.status}
              </Badge>
              <Badge
                colorScheme={
                  fetchData.data.priority === "high" ? "red" : "yellow"
                }
                fontSize="lg"
                p={2}
                borderRadius="md"
              >
                {fetchData.data.priority.charAt(0).toUpperCase() +
                  fetchData.data.priority.slice(1)}
              </Badge>
            </Flex>
          </Flex>

          <Divider my={4} borderColor={dividerColor} />

          <Grid
            gridTemplateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }}
            gap={6}
            mb={6}
          >
            <Box>
              <Text fontSize="lg" fontWeight="bold" mb={2} color="teal.500">
                Start Date
              </Text>
              <Text fontSize="md" color={textColor}>
                {new Date(fetchData.data.startDate).toLocaleString()}
              </Text>
            </Box>

            <Box>
              <Text fontSize="lg" fontWeight="bold" mb={2} color="teal.500">
                End Date
              </Text>
              <Text fontSize="md" color={textColor}>
                {new Date(fetchData.data.endDate).toLocaleString()}
              </Text>
            </Box>

            <Box>
              <Text fontSize="lg" fontWeight="bold" mb={2} color="teal.500">
                Due Date
              </Text>
              <Text fontSize="md" color={textColor}>
                {new Date(fetchData.data.dueDate).toLocaleString()}
              </Text>
            </Box>
          </Grid>

          <Divider my={4} borderColor={dividerColor} />

          <Box mb={6}>
            <Text fontSize="lg" fontWeight="bold" mb={2} color="teal.500">
              Reminders
            </Text>
            <Stack spacing={2}>
              {fetchData.data.reminders.map(
                (reminder: string, index: number) => (
                  <Text key={index} color={textColor}>
                    {new Date(reminder).toLocaleString()}
                  </Text>
                )
              )}
            </Stack>
          </Box>

          <Divider my={4} borderColor={dividerColor} />

          <Box mb={6}>
            <Text fontSize="lg" fontWeight="bold" mb={2} color="teal.500">
              Assigner
            </Text>
            <Grid gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
              {fetchData.data?.assigner?.map((member: any, index: number) => {
                return(
                <ParticipantCard
                  key={index}
                  participant={member}
                  textColor={textColor}
                  boxHoverBg={cardHoverBgColor}
                />
              )})}
            </Grid>
          </Box>

          <Divider my={4} borderColor={dividerColor} />

          <Box mb={6}>
            <Text fontSize="lg" fontWeight="bold" mb={2} color="teal.500">
              Team Members
            </Text>
            <Grid gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
              {fetchData.data.team_members.map((member: any, index: number) => (
                <ParticipantCard
                  key={index}
                  participant={member}
                  textColor={textColor}
                  boxHoverBg={cardHoverBgColor}
                />
              ))}
            </Grid>
          </Box>

          <Divider my={4} borderColor={dividerColor} />

          <Box mb={6}>
            <Text fontSize="lg" fontWeight="bold" mb={2} color="teal.500">
              Dependencies
            </Text>
            <Grid gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
              {fetchData.data.dependencies.map((dep: any, index: number) => (
                <ParticipantCard
                  key={index}
                  participant={dep}
                  textColor={textColor}
                  boxHoverBg={cardHoverBgColor}
                />
              ))}
            </Grid>
          </Box>

          <Divider my={4} borderColor={dividerColor} />

          <Box mb={6}>
            <Text fontSize="lg" fontWeight="bold" mb={2} color="teal.500">
              Progress
            </Text>
            <Text fontSize="md" fontWeight="medium" color={textColor}>
              {fetchData.data.progress}%
            </Text>
          </Box>

          <Divider my={4} borderColor={dividerColor} />

          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={2} color="teal.500">
              Created At
            </Text>
            <Text fontSize="md" color={textColor}>
              {new Date(fetchData.data.createdAt).toLocaleString()}
            </Text>
          </Box>
          <Box mt={2}>
            <ShowAttachments
              attach_files={fetchData?.data?.attach_files || []}
            />
          </Box>
        </Box>
      )}
    </DrawerLoader>
  );
});

export default ViewTask;
