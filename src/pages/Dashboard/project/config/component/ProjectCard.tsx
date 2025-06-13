import React from "react";
import {
  Box,
  Flex,
  Avatar,
  Heading,
  Text,
  Badge,
  Stack,
  Divider,
  VStack,
  useColorModeValue,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { EditIcon } from "@chakra-ui/icons";
import store from "../../../../../store/store";
import { dashboard } from "../../../../../config/constant/routes";

interface CardProps {
  project_name: string;
  subtitle?: string;
  description?: string;
  logo?: {
    name?: string;
    url?: string;
    type?: string;
  };
  priority: "Low" | "Medium" | "High";
  status: "BackLog" | "Todo" | "InProgress" | "Done" | "Completed";
  startDate?: Date;
  endDate?: Date;
  dueDate?: Date;
  approval?: "Satisfactory" | "Unsatisfactory";
  onClick?: any;
  item?: any;
}

const ProjectCard: React.FC<CardProps> = ({
  item,
  project_name,
  subtitle,
  description,
  logo,
  priority,
  status,
  startDate,
  endDate,
  dueDate,
  approval,
  onClick,
}) => {
  const navigate = useNavigate();
  const {
    Project: { setOpenProjectDrawer },
    auth: { checkPermission },
  } = store;
  const bgColor = useColorModeValue("white", "gray.800");
  const boxShadow = useColorModeValue("lg", "dark-lg");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const subtitleColor = useColorModeValue("gray.500", "gray.400");

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={6}
      boxShadow={boxShadow}
      bg={bgColor}
      _hover={{ boxShadow: "xl", transform: "scale(1.02)" }}
      transition="all 0.3s ease-in-out"
    >
      <Flex align="center" justifyContent="space-between" mb={4}>
        <Flex align="center">
          <Avatar
            size="xl"
            src={logo?.url || "https://via.placeholder.com/150"}
            name={logo?.name}
            mr={4}
          />
          <Box cursor="pointer" onClick={onClick}>
            <Heading fontSize="2xl" fontWeight="bold">
              {project_name}
            </Heading>
            {subtitle && (
              <Text fontSize="md" color={subtitleColor}>
                {subtitle}
              </Text>
            )}
          </Box>
        </Flex>
        {checkPermission("project", "edit") && (
          <Tooltip label="Edit Project" aria-label="Edit Project">
            <IconButton
              icon={<EditIcon />}
              onClick={() => setOpenProjectDrawer("edit", item)}
              variant="ghost"
              colorScheme="teal"
              aria-label="Edit Project"
            />
          </Tooltip>
        )}
      </Flex>
      <Divider mb={4} />
      <Box mb={4}>
        <Text fontSize="md" color={textColor} noOfLines={2}>
          {description}
        </Text>
      </Box>
      <Stack direction="row" spacing={4} mb={4}>
        <Badge
          colorScheme={
            priority === "High"
              ? "red"
              : priority === "Medium"
              ? "yellow"
              : "green"
          }
        >
          {priority}
        </Badge>
        <Badge
          colorScheme={
            status === "InProgress"
              ? "blue"
              : status === "Done" || status === "Completed"
              ? "green"
              : "gray"
          }
        >
          {status}
        </Badge>
        {approval && (
          <Badge colorScheme={approval === "Satisfactory" ? "green" : "red"}>
            {approval}
          </Badge>
        )}
      </Stack>
      <Divider mb={4} />
      <Flex justifyContent="space-between" alignItems="center">
        <VStack align="start" spacing={2}>
          {startDate && (
            <Text fontSize="sm" color="gray.600">
              Start Date: {new Date(startDate).toLocaleDateString()}
            </Text>
          )}
          {endDate && (
            <Text fontSize="sm" color="gray.600">
              End Date: {new Date(endDate).toLocaleDateString()}
            </Text>
          )}
          {dueDate && (
            <Text fontSize="sm" color="gray.600">
              Due Date: {new Date(dueDate).toLocaleDateString()}
            </Text>
          )}
        </VStack>
        {checkPermission("task", "view") && (
          <Text
            cursor="pointer"
            color="teal.500"
            fontWeight="bold"
            onClick={() => {
              navigate(`${dashboard.project.index}/${item._id}/task`);
            }}
          >
            View tasks
          </Text>
        )}
      </Flex>
    </Box>
  );
};

export default ProjectCard;
