import {
  Box,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { BiCalendarPlus } from "react-icons/bi";
import { MdClass } from "react-icons/md";
import { BsBook } from "react-icons/bs";

const upcomingActivities = [
  { id: 1, type: "scheduled", event: "Mathematics Quiz", date: "2024-05-15" },
  { id: 2, type: "class", event: "Physics Lecture", date: "2024-05-16" },
  {
    id: 3,
    type: "assignment",
    event: "Biology Assignment Due",
    date: "2024-05-20",
  },
];

const UserActivityFeed = () => {
  const bg = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.200");

  const iconMap: any = {
    scheduled: <Icon as={BiCalendarPlus} color="purple.500" />,
    class: <Icon as={MdClass} color="blue.500" />,
    assignment: <Icon as={BsBook} color="green.500" />,
  };

  return (
    <Box>
      <Text fontWeight="bold" mb={2} color={textColor}>
        Pending Tasks
      </Text>
      <VStack align="stretch"  spacing={2}>
        {upcomingActivities.map((activity) => (
          <HStack
            key={activity.id}
            spacing={4}
            bg={bg} shadow="base" borderWidth={1} p={2} rounded={8}
            // _hover={{
            //   bg: "blue.100",
            //   // transform: "scale(1.02)",
            //   cursor: "pointer",
            // }}
            transition="ease-in-out 0.1s"
          >
            <Box flex="1">
              <Text fontWeight="500" fontSize={'sm'} color={textColor}>
                {activity.event}
              </Text>
              <Text fontSize="xs" color="gray" textTransform={"capitalize"}>
                {activity.type} on {activity.date}
              </Text>
            </Box>
            {iconMap[activity.type]}
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

export default UserActivityFeed;