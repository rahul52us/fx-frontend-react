import { Box, Heading, Text, Flex, Icon, useColorModeValue } from "@chakra-ui/react";
import { FaUser, FaComment, FaCheck } from "react-icons/fa";

const RecentActivityFeed = () => {
  const boxBgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const iconColor = useColorModeValue("teal.500", "teal.300");
  const textColor = useColorModeValue("gray.700", "gray.400");

  const recentActivities = [
    { icon: <Icon as={FaUser} boxSize={5} color={iconColor} />, text: "New user registered", timestamp: "2 hours ago" },
    { icon: <Icon as={FaComment} boxSize={5} color={iconColor} />, text: "You have a new message", timestamp: "1 day ago" },
    { icon: <Icon as={FaCheck} boxSize={5} color={iconColor} />, text: "Task completed1", timestamp: "3 days ago" },
    { icon: <Icon as={FaCheck} boxSize={5} color={iconColor} />, text: "Task completed2", timestamp: "3 days ago" },
    { icon: <Icon as={FaCheck} boxSize={5} color={iconColor} />, text: "Task completed3", timestamp: "3 days ago" },
  ];

  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      bg={boxBgColor}
      borderColor={borderColor}
      boxShadow="md"
      maxH="400px"
      overflowY="auto"
    >
      <Heading fontSize="lg" fontWeight="semibold" mb={4} color={iconColor}>
        Recent Activity Feed
      </Heading>
      {recentActivities.map((activity) => (
        <Flex key={activity.text} justify="space-between" mb={3} alignItems="center">
          <Flex align="center">
            {activity.icon}
            <Text ml={3} color={textColor} fontSize="md">
              {activity.text}
            </Text>
          </Flex>
          <Text fontSize="sm" opacity={0.7} color={textColor}>
            {activity.timestamp}
          </Text>
        </Flex>
      ))}
      {recentActivities.length === 0 && (
        <Text color="gray.500" fontSize="sm">
          No recent activities.
        </Text>
      )}
    </Box>
  );
};

export default RecentActivityFeed;
