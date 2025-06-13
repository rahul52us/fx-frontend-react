import {
  Box,
  Text,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

const data = [
  {
    courseName: "React",
    duration: "4 Hr",
    status: "Completed",
    progress: "100%",
    assignments: 12,
  },
  {
    courseName: "Node Js",
    duration: "8 Hr",
    status: "In Progress",
    progress: "48%",
    assignments: 17,
  },
];

const MyCoursesTable = () => {
  return (
    <div>
      <Box boxShadow="rgb(0 0 0 / 20%) 0px 0px 8px" p={2}>
        <Text>My Courses</Text>
        <TableContainer>
          <Table variant={"simple"}>
            <Thead bgGradient="linear(to-r, #4FACFE, #2B8FF7)">
              <Tr>
                <Th>Course Name</Th>
                <Th>Course Duration</Th>
                <Th>Status</Th>
                <Th>Progress</Th>
                <Th>Assignments</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((value: any, index) => {
                return (
                  <>
                    <Tr key={index}>
                      <Td>{value.courseName}</Td>
                      <Td>{value.duration}</Td>
                      <Td>{value.status}</Td>
                      <Td>{value.progress}</Td>
                      <Td>{value.assignments}</Td>
                    </Tr>
                  </>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};

export default MyCoursesTable;
