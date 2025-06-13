// ProjectCard.tsx
import React from "react";
import {
  Box,
  // Flex,
  Text,
  // Button,
  Badge,
  AvatarGroup,
  Avatar,
  Progress,
  useColorModeValue,
  Icon,
  VStack,
  HStack,
  // Flex,
  // Spacer,
} from "@chakra-ui/react";
import { FiUsers, FiClock, FiUser } from "react-icons/fi";

interface ProjectCardProps {
  title: string;
  // description: string;
  manager: string;
  deadline: string;
  status: string;
  team: string[];
  progress: number;
}

const ProjectCard2: React.FC<ProjectCardProps> = ({
  title,
  // description,
  manager,
  deadline,
  status,
  team,
  progress,
}) => {
  // const bg = useColorModeValue('white', 'gray.800');
  // const color = useColorModeValue('gray.800', 'white');
  const cardBg = useColorModeValue("gray.50", "gray.700");
  const statusColor =
    status === "In Progress"
      ? "yellow"
      : status === "Completed"
      ? "green"
      : "red";

  return (
    <Box
      maxW="xl"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={cardBg}
      p={5}
      shadow="lg"
      transition="transform 0.3s ease"
      _hover={{ transform: "scale(1.01)", shadow: "xl" }}
    >
      <VStack align="start" spacing={4}>
        <HStack w="full" justify="space-between" align="center">
          <Text fontWeight="bold" fontSize="xl">
            {title}
          </Text>
          <Badge colorScheme={statusColor} px={2} py={1} borderRadius="md" rounded={'full'}>
            {status}
          </Badge>
        </HStack>
        {/* <Text>{description}</Text> */}
        <HStack w="full" justify="space-between">
        <AvatarGroup size="sm" max={3}>
            {team.map((member, index) => (
              <Avatar key={index} name={member} />
            ))}
          </AvatarGroup>

          <HStack>
            <Icon as={FiClock} boxSize={5} />
            <Text fontSize="sm">{deadline}</Text>
          </HStack>
        </HStack>
        <Box w="full">
          <Text fontSize="sm" fontWeight={500} mb={1}>
            Progress 65%
          </Text>
          <Progress
            value={progress}
            colorScheme="telegram"
            size="xs"
            borderRadius="md"
          />
        </Box>
        <HStack w="full" justify="space-between">
          <HStack>
            <Icon as={FiUsers} boxSize={5} />
            <Text fontSize="sm">Team Members</Text>
          </HStack>
            <HStack>
            <Icon as={FiUser} boxSize={5} />
            <Text fontSize="sm">{manager}</Text>
          </HStack>
        </HStack>
        {/* <Flex justify={"end"} w={"100%"}>
          <Button mt={2} colorScheme="telegram" variant={"outline"} size={"sm"}>
            View Details
          </Button>
        </Flex> */}
      </VStack>
    </Box>
  );
};

export default ProjectCard2;