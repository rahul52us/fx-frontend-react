import { Box, Text, VStack, HStack } from "@chakra-ui/react";
import {
  FiArrowUpRight,
  FiArrowDownLeft,
  FiRefreshCw,
  FiShield
} from "react-icons/fi";
import { IconType } from "react-icons";

interface Activity {
  icon: IconType;
  label: string;
  time: string;
  color: string;
  bg: string;
}

const activities: Activity[] = [
  {
    icon: FiArrowUpRight,
    label: "Export EXP-2024-089 settled",
    time: "2 hours ago",
    color: "green.500",
    bg: "green.100"
  },
  {
    icon: FiArrowDownLeft,
    label: "Import INV-2024-145 created",
    time: "4 hours ago",
    color: "blue.500",
    bg: "blue.100"
  },
  {
    icon: FiRefreshCw,
    label: "Forward FWD-034 mapped",
    time: "6 hours ago",
    color: "orange.400",
    bg: "orange.100"
  },
  {
    icon: FiShield,
    label: "PCFC PC-012 linked to EXP-078",
    time: "1 day ago",
    color: "purple.500",
    bg: "purple.100"
  },
  {
    icon: FiArrowUpRight,
    label: "EEFC balance updated",
    time: "1 day ago",
    color: "teal.500",
    bg: "teal.100"
  }
];

const RecentActivity = () => {
  return (
    <Box
      p="6"
      borderRadius="xl"
      bg="white"
      boxShadow="sm"
      animation="fadeInUp 0.4s ease forwards"
      sx={{ animationDelay: "600ms" }}
    >
      <Text fontWeight="semibold" color="gray.800" mb="4">
        Recent Activity
      </Text>

      <VStack spacing="4" align="stretch">
        {activities.map((activity, index) => (
          <HStack
            key={index}
            spacing="3"
            cursor="pointer"
            role="group"
          >
            {/* Icon */}
            <Box
              p="2"
              borderRadius="lg"
              bg={activity.bg}
              transition="transform 0.3s"
              _groupHover={{ transform: "scale(1.1)" }}
            >
              <Box
                as={activity.icon}
                boxSize="4"
                color={activity.color}
              />
            </Box>

            {/* Text */}
            <Box flex="1" minW="0">
              <Text
                fontSize="sm"
                fontWeight="medium"
                color="gray.800"
                noOfLines={1}
              >
                {activity.label}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {activity.time}
              </Text>
            </Box>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

export default RecentActivity;