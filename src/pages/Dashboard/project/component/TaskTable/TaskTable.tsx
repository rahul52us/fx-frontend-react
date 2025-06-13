import {
  Badge,
  Box,
  Flex,
  HStack,
  //   Text,
  Icon,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { FaTasks } from "react-icons/fa";
import { FiArrowDown, FiArrowRight, FiArrowUp } from "react-icons/fi";

const dummyData = [
  {
    name: "Conduct user research to...",
    //   customer: "Courtney Henry",
    status: "Processing",
    assignDate: "12 Aug 2022",
    dueDate: "30 Mar 2023",
    assignedTo: "Leslie Alexander",
    priority: "Urgent",
  },
  {
    name: "Develop user personas based..",
    //   customer: "Guy Hawkins",
    status: "Not Started",
    assignDate: "12 Aug 2023",
    dueDate: "30 Mar 2023",
    assignedTo: "Ralph Edwards",
    priority: "High",
  },
  // Add more dummy data as needed
];

const TaskTable = () => {
  return (
    <Box>
      <HStack mb={2} color={"gray.600"}>
        <Icon as={FaTasks} />
        <Text fontWeight="bold">Recent Tasks (5)</Text>
      </HStack>
      <TableContainer shadow={"md"} borderWidth={2} rounded={8}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              {/* <Th>Customer</Th>   */}
              <Th>Status</Th>
              <Th>Assigned Date</Th>
              <Th>Due Date</Th>
              <Th>Assigned To</Th>
              <Th>Priority</Th>
            </Tr>
          </Thead>
          <Tbody>
            {dummyData.map((task, index) => (
              <Tr key={index}>
                <Td>{task.name}</Td>
                {/* <Td>{task.customer}</Td>   */}
                <Td>
                  <Badge
                    colorScheme={
                      task.status === "Processing"
                        ? "yellow"
                        : task.status === "Completed"
                        ? "green"
                        : "red"
                    }
                    variant="subtle"
                    borderRadius="full"
                    px={3}
                    py={1}
                  >
                    {task.status}
                  </Badge>
                </Td>
                <Td>{task.assignDate}</Td>
                <Td>{task.dueDate}</Td>
                <Td>{task.assignedTo}</Td>
                <Td>
                  <Flex align="center">
                    {task.priority === "Urgent" && (
                      <Tooltip label="Urgent" aria-label="Urgent">
                        <Icon as={FiArrowUp} color="red.500" mr={2} />
                      </Tooltip>
                    )}
                    {task.priority === "High" && (
                      <Tooltip label="High" aria-label="High">
                        <Icon as={FiArrowUp} color="orange.500" mr={2} />
                      </Tooltip>
                    )}
                    {task.priority === "Medium" && (
                      <Tooltip label="Medium" aria-label="Medium">
                        <Icon as={FiArrowRight} color="yellow.500" mr={2} />
                      </Tooltip>
                    )}
                    {task.priority === "Low" && (
                      <Tooltip label="Low" aria-label="Low">
                        <Icon as={FiArrowDown} color="green.500" mr={2} />
                      </Tooltip>
                    )}
                    <Tag
                      ml={1}
                      rounded={"full"}
                      variant={"subtle"}
                      colorScheme={
                        task.priority === "Urgent"
                          ? "red"
                          : task.priority === "High"
                          ? "orange"
                          : task.priority === "Medium"
                          ? "yellow"
                          : "green"
                      }
                    >
                      {task.priority}
                    </Tag>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default observer(TaskTable);
