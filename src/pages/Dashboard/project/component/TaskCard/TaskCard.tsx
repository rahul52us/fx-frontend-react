import {
  Avatar,
  AvatarGroup,
  Box,
  Flex,
  Badge,
  Text,
  useColorModeValue,
  IconButton,
  HStack,
  Tooltip,
  ScaleFade,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { FaEdit, FaEye } from "react-icons/fa";
import store from "../../../../../store/store";

// Function to fetch avatar URLs
const getAvatarUrl = (userId: string) => {
  return `https://api.example.com/avatars/${userId}.jpg`;
};

const TaskCard = ({ task, setActiveSelectedTask }: any) => {
  const {
    auth: { checkPermission },
  } = store;
  const bgColor = useColorModeValue(
    "rgba(255, 255, 255, 0.6)",
    "rgba(255, 255, 255, 0.1)"
  );
  const borderColor = useColorModeValue("gray.200", "rgba(255, 255, 255, 0.3)");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");

  const { title, description, priority, team_members, startDate, endDate } =
    task;

  // Determine the color scheme based on the priority level
  const getPriorityColorScheme = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "low":
        return "green";
      case "medium":
        return "yellow";
      case "high":
        return "red";
      default:
        return "gray";
    }
  };

  const priorityColorScheme = getPriorityColorScheme(priority);

  // Map team members to avatars
  const avatars = team_members
    ? team_members.map((_: any, index: number) => ({
        name: `M ${index + 1}`,
        src: getAvatarUrl(`${index + 1}`),
      }))
    : [];

  const handleEditTask = () => {
    setActiveSelectedTask("edit", task);
  };

  const handleViewTask = () => {
    if (checkPermission("task", "view")) {
      setActiveSelectedTask("view", task);
    }
  };

  const hasValidDates = startDate && endDate;

  const taskDuration = hasValidDates
    ? Math.ceil(
        (new Date(endDate).getTime() - new Date(startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  const formatDate = (date: string) =>
    date ? new Date(date).toLocaleDateString() : "N/A";

  return (
    <ScaleFade in={true} initialScale={0.9}>
      <Box
        p={4}
        boxShadow="lg"
        borderWidth={1}
        borderRadius="xl"
        borderColor={borderColor}
        bg={bgColor}
        backdropFilter="blur(10px)"
        _hover={{
          backdropFilter: "blur(15px)",
          transform: "scale(1.02)",
          transition: "all 0.2s ease-in-out",
        }}
      >
        <Flex justify="space-between" align="center" mb={2}>
          <Badge
            variant="solid"
            rounded="full"
            colorScheme={priorityColorScheme}
            py={1}
          >
            {priority}
          </Badge>
          <HStack spacing={2}>
            {checkPermission("task", "view") && (
              <Tooltip label="View Task" aria-label="View Task">
                <IconButton
                  size="sm"
                  colorScheme="blue"
                  aria-label="View Task"
                  icon={<FaEye />}
                  onClick={handleViewTask}
                />
              </Tooltip>
            )}
            {checkPermission("task", "edit") && (
              <Tooltip label="Edit Task" aria-label="Edit Task">
                <IconButton
                  size="sm"
                  colorScheme="teal"
                  aria-label="Edit Task"
                  icon={<FaEdit />}
                  onClick={handleEditTask}
                />
              </Tooltip>
            )}
          </HStack>
        </Flex>
        <Text
          mt={1}
          fontSize="xl"
          fontWeight="bold"
          cursor="pointer"
          onClick={handleViewTask}
          noOfLines={1}
          color={textColor}
        >
          {title}
        </Text>
        <Text fontSize="sm" color="gray.500" noOfLines={2}>
          {description}
        </Text>
        <Flex align="center" justify="space-between" mt={2}>
          <AvatarGroup size="sm" max={3}>
            {avatars.map((avatar: any, index: number) => (
              <Avatar key={index} name={avatar?.name} src={avatar?.src} />
            ))}
          </AvatarGroup>
          <Flex direction="column" align="flex-end">
            <Badge colorScheme="orange">
              {hasValidDates
                ? `${formatDate(startDate)} - ${formatDate(endDate)}`
                : "Dates not available"}
            </Badge>
            {taskDuration !== null && (
              <Text fontSize="xs" color="gray.400">
                Duration: {taskDuration} day{taskDuration > 1 ? "s" : ""}
              </Text>
            )}
          </Flex>
        </Flex>
      </Box>
    </ScaleFade>
  );
};

export default observer(TaskCard);