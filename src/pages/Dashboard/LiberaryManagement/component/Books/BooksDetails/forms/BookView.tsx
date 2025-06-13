import { observer } from "mobx-react-lite";
import {
  Box,
  Flex,
  Heading,
  Text,
  Icon,
  Stack,
  Divider,
  Grid,
  GridItem,
  Image,
  useBreakpointValue,
  VStack,
  HStack,
} from "@chakra-ui/react";
import {
  FaBook,
  FaUser,
  FaCalendar,
  FaTag,
  FaGlobe,
  FaLayerGroup,
  FaInfoCircle,
} from "react-icons/fa";
import DrawerLoader from "../../../../../../../config/component/Loader/DrawerLoader";
import store from "../../../../../../../store/store";
import { useEffect, useState } from "react";

const BookView = observer(({ data }: any) => {
  const {
    bookLiberary: { getSingleBook },
  } = store;
  const [fetchBookData, setFetchBookData] = useState<any>({
    data: null,
    loading: true,
  });

  useEffect(() => {
    setFetchBookData({ loading: true, data: null });
    getSingleBook({ id: data?._id })
      .then((data: any) => {
        setFetchBookData({
          loading: false,
          data: data.data,
        });
      })
      .catch(() => {
        setFetchBookData({ loading: false, data: null });
      });
  }, [getSingleBook, data]);

  const book = fetchBookData.data;
  const imageSize = useBreakpointValue({ base: "100%", md: "300px" });

  return (
    <DrawerLoader
      loading={fetchBookData.loading}
      noRecordFoundText={!fetchBookData.data}
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
                <Text fontSize="lg" color="gray.600">
                  {book.subtitle}
                </Text>

                <Stack spacing={2} width="100%">
                  <HStack>
                    <Icon as={FaUser} color="gray.600" />
                    <Text fontSize="lg">
                      <strong>Author:</strong> {book.author}
                    </Text>
                  </HStack>

                  <HStack>
                    <Icon as={FaCalendar} color="gray.600" />
                    <Text fontSize="lg">
                      <strong>Published Date:</strong>{" "}
                      {new Date(book.publishedDate).toLocaleDateString()}
                    </Text>
                  </HStack>

                  <HStack>
                    <Icon as={FaGlobe} color="gray.600" />
                    <Text fontSize="lg">
                      <strong>Language:</strong> {book.language.join(", ")}
                    </Text>
                  </HStack>

                  <HStack>
                    <Icon as={FaLayerGroup} color="gray.600" />
                    <Text fontSize="lg">
                      <strong>Categories:</strong>{" "}
                      {book.categories.length > 0
                        ? book.categories.join(", ")
                        : "N/A"}
                    </Text>
                  </HStack>

                  <HStack>
                    <Icon as={FaTag} color="gray.600" />
                    <Text fontSize="lg">
                      <strong>Tags:</strong> {book.tags.join(", ")}
                    </Text>
                  </HStack>

                  <HStack>
                    <Icon as={FaBook} color="gray.600" />
                    <Text fontSize="lg">
                      <strong>Publisher:</strong> {book.publisher}
                    </Text>
                  </HStack>

                  <HStack>
                    <Icon as={FaBook} color="gray.600" />
                    <Text fontSize="lg">
                      <strong>ISBN:</strong> {book.isbn}
                    </Text>
                  </HStack>

                  <HStack justify="space-between" width="100%">
                    <Text fontSize="lg">
                      <strong>Available Copies:</strong> {book.availableCopies}
                    </Text>
                    <Text fontSize="lg">
                      <strong>Total Copies:</strong> {book.totalCopies}
                    </Text>
                  </HStack>

                  <HStack justify="space-between" width="100%">
                    <Text fontSize="lg">
                      <strong>Edition:</strong> {book.edition}
                    </Text>
                    <Text fontSize="lg">
                      <strong>Reference Only:</strong>{" "}
                      {book.isReferenceOnly ? "Yes" : "No"}
                    </Text>
                  </HStack>
                </Stack>
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

export default BookView;
