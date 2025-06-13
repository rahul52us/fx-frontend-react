import {
  Avatar,
  Box,
  Flex,
  Progress,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaClock, FaTrophy } from "react-icons/fa";

const MyCoursesCard = ({ course }: any) => {
  // const { colorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const academyColor = useColorModeValue("gray.500", "gray.400");
  const progressColor = useColorModeValue("pink.500", "pink.300");
  const shadowColor = useColorModeValue(
    "rgba(0, 0, 0, 0.2)", // For light mode
    "rgba(0, 0, 0, 0.4)" // For dark mode
  );

  return (
    <Box
      p={3}
      bg={bgColor}
      rounded={14}
      boxShadow={`0 4px 6px ${shadowColor}`}
      _hover={{ boxShadow: `0 8px 10px ${shadowColor}` }}
      transition="box-shadow 0.3s ease"
    >
      <Flex gap={4} align={"center"}>
        <Avatar
          name={course.name}
          boxSize={8}
          src={course.imageUrl}
          borderRadius={8}
        />
        <Box>
          <Text fontWeight={700} color={textColor}>
            {course.title}
          </Text>
          <Text fontSize={"sm"} color={academyColor} fontWeight={600}>
            {course.academy}
          </Text>
        </Box>
      </Flex>
      <Flex justify={"space-between"} mt={2} alignItems="center">
        <Flex align="center" gap={1}>
          <FaTrophy color={progressColor} fontSize={"14px"} />
          <Text fontSize={"xs"} color={textColor}>
            {course.completion}% Completed
          </Text>
        </Flex>
        <Flex align="center" gap={1}>
          <FaClock color={progressColor} fontSize={"14px"} />
          <Text fontSize={"xs"} color={textColor}>
            {course.timeLeft}
          </Text>
        </Flex>
      </Flex>
      <Progress
        value={course.completion}
        size="xs"
        colorScheme={course.colorScheme}
        mt={2}
        rounded={"full"}
        bg={useColorModeValue("gray.300", "gray.600")}
      />
    </Box>
  );
};

export default MyCoursesCard;
