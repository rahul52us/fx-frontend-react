import { observer } from "mobx-react-lite";
import {
  Box,
  Flex,
  Heading,
  Text,
  Icon,
  Divider,
  Grid,
  GridItem,
  Image,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import {
  FaBook,
  FaInfoCircle,
} from "react-icons/fa";
import DrawerLoader from "../../../../../../../config/component/Loader/DrawerLoader";
import store from "../../../../../../../store/store";
import { useEffect, useState } from "react";

const RoomView = observer(({ data }: any) => {
  const {
    bookLiberary: { getSingleRoom },
  } = store;
  const [fetchData, setFetchData] = useState<any>({
    data: null,
    loading: true,
  });

  useEffect(() => {
    setFetchData({ loading: true, data: null });
    getSingleRoom({ id: data?._id })
      .then((data: any) => {
        setFetchData({
          loading: false,
          data: data.data,
        });
      })
      .catch(() => {
        setFetchData({ loading: false, data: null });
      });
  }, [getSingleRoom, data]);

  const book = fetchData.data;
  const imageSize = useBreakpointValue({ base: "100%", md: "300px" });

  return (
    <DrawerLoader
      loading={fetchData.loading}
      noRecordFoundText={!fetchData.data}
    >
      {book && (
        <Box
          p={{ base: 4, md: 8 }}
          mx="auto"
        >
          <Grid
            templateColumns={{ base: "1fr", md: "300px 1fr" }}
            gap={8}
            alignItems="start"
          >
            <GridItem>
              <Image
                src={book.coverImage?.url || 'https://via.placeholder.com/300x400?text=No+thumbnail+found'}
                alt={book.title}
                width={imageSize}
                height="auto"
                objectFit="cover"
                borderRadius="lg"
                boxShadow="lg"
              />
            </GridItem>

            <GridItem>
              <VStack align="flex-start" spacing={4}>
                <Heading as="h3" size="2xl">
                  <Flex align="center">
                    <Icon as={FaBook} mr={3} />
                    {book.title}
                  </Flex>
                </Heading>
              </VStack>
            </GridItem>
          </Grid>

          <Divider my={8} />

          <Box>
            <Flex align="center" mb={4}>
              <Icon as={FaInfoCircle} mr={3} color="gray.600" />
              <Heading as="h4" size="lg">
                Description
              </Heading>
            </Flex>
            <Text fontSize="md" lineHeight="taller">
              {book.description}
            </Text>
          </Box>
        </Box>
      )}
    </DrawerLoader>
  );
});

export default RoomView;
