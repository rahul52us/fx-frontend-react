import { observer } from "mobx-react-lite"
import store from "../../../../../store/store"
import {
  Box,
  Button,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import TableLoader from "../../../../../config/component/DataTable/TableLoader";
import { formatDate } from "../../../../../config/constant/dateUtils";

const QuizTable = observer(({addData} : any) => {
  const {
    quiz: {
      dashQuiz: { data, loading },
    },
  } = store;

  return (
    <Box
      boxShadow="rgb(0 0 0 / 12%) 0px 0px 11px"
      rounded={8}
      p="1.125rem 1.375rem"
      // bg="white"
      mt={8}
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Heading fontSize={"xl"} fontWeight={700} color="blue.500">
          QuizTable
        </Heading>
        <Flex gap={6}>

          <Box w="18rem">
            <Button onClick={addData}>Add Category</Button>
          </Box>
        </Flex>
      </Flex>
      <Box
        position="relative"
        overflow="auto hidden"
        className="customScrollBar"
      >
        <Table className="customTable" variant="striped" mt="1rem">
          <Thead>
            <Tr>
              <Th>title</Th>
              <Th>Description</Th>
              <Th>Categories</Th>
              <Th>Thumbnail</Th>
              <Th>Created Date</Th>
            </Tr>
          </Thead>
          <TableLoader show={data?.quiz?.length} loader={loading}>
          <Tbody>
            {
              data?.quiz?.map((item : any, index : number) => { return(
                <Tr key={index}>
                  <Td>{item.title}</Td>
                  <Td>{item.description?.length > 30 ? `${item.description?.substring(0,30)}...` : item.description}</Td>
                  <Td>{item?.totalChildData}</Td>
                  <Td>{item?.thumbnail?.name}</Td>
                  <Td>{formatDate(item?.createdAt)}</Td>
                </Tr>
              )})
            }
          </Tbody>
          </TableLoader>
        </Table>
      </Box>
    </Box>
  );
});

export default QuizTable