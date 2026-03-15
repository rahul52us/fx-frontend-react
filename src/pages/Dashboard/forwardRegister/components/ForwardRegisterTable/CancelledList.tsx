import {
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";

const CancelledList = ({ cancelledList }: { cancelledList: any[] }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // ✅ Flatten: merge all objects in the array, then extract each date key as its own entry
  const flattenedEntries: { dateKey: string; data: any[] }[] = (cancelledList || []).flatMap(
    (group) =>
      Object.entries(group).map(([dateKey, value]: [string, any]) => ({
        dateKey,
        data: value.data || [],
      }))
  );

  const hasData = flattenedEntries.length > 0;

  return (
    <>
      {/* Trigger Button */}
      {!hasData ? (
        <Text color="gray.500">No cancelled deals</Text>
      ) : (
        <Button
          onClick={onOpen}
          colorScheme="red"
          variant="outline"
          size="sm"
          borderRadius="full"
          fontWeight={500}
        >
          Cancelled List
        </Button>
      )}

      {/* Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="lg">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton mt={1} />
          <DrawerHeader
            borderBottomWidth="1px"
            fontSize="md"
            fontWeight={600}
            color="gray.700"
          >
            Cancelled Deals
          </DrawerHeader>

          <DrawerBody py={5} px={4}>
            {!hasData ? (
              <Box
                textAlign="center"
                py={10}
                color="gray.400"
                fontSize="sm"
                border="1px dashed"
                borderColor="gray.200"
                borderRadius="lg"
              >
                No cancelled records found.
              </Box>
            ) : (
              <Flex direction="column" gap={6}>
                {flattenedEntries.map(({ dateKey, data }, groupIndex) => {
                  const totalPL = data.reduce(
                    (sum: number, item: any) => sum + item.profitAndLoss,
                    0
                  );
                  const totalAmount = data.reduce(
                    (sum: number, item: any) => sum + item.amount,
                    0
                  );

                  return (
                    <Box
                      key={groupIndex}
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="xl"
                      overflow="hidden"
                      bg="white"
                    >
                      {/* Card Header */}
                      <Flex
                        px={5}
                        py={3}
                        bg="gray.50"
                        justify="space-between"
                        align="center"
                        borderBottom="1px solid"
                        borderColor="gray.200"
                      >
                        <Flex align="center" gap={3}>
                          <Text fontWeight={600} fontSize="sm" color="gray.700">
                            {dateKey}
                          </Text>
                          <Badge colorScheme="blue" borderRadius="full" px={2}>
                            {data.length} {data.length === 1 ? "deal" : "deals"}
                          </Badge>
                        </Flex>

                        <Flex gap={6} align="center">
                          <Flex direction="column" align="flex-end">
                            <Text fontSize="11px" color="gray.400" mb="1px">
                              Total amount
                            </Text>
                            <Text fontWeight={600} fontSize="sm" color="gray.700">
                              {totalAmount.toLocaleString("en-IN")}
                            </Text>
                          </Flex>
                          <Divider orientation="vertical" h="32px" />
                          <Flex direction="column" align="flex-end">
                            <Text fontSize="11px" color="gray.400" mb="1px">
                              Net P&L
                            </Text>
                            <Text
                              fontWeight={600}
                              fontSize="sm"
                              color={totalPL < 0 ? "red.500" : "green.500"}
                            >
                              {totalPL < 0 ? "▼" : "▲"}{" "}
                              {Math.abs(totalPL).toLocaleString("en-IN")}
                            </Text>
                          </Flex>
                        </Flex>
                      </Flex>

                      {/* Table */}
                      <Box overflowX="auto">
                        <Table size="sm" variant="simple">
                          <Thead bg="gray.50">
                            <Tr>
                              <Th color="gray.500" fontSize="11px" py={3}>
                                Ref no.
                              </Th>
                              <Th color="gray.500" fontSize="11px" isNumeric>
                                Amount
                              </Th>
                              <Th color="gray.500" fontSize="11px" isNumeric>
                                Rate
                              </Th>
                              <Th color="gray.500" fontSize="11px" isNumeric>
                                Profit & loss
                              </Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {data.map((item: any, index: number) => (
                              <Tr
                                key={index}
                                _hover={{ bg: "gray.50" }}
                                transition="background 0.15s"
                              >
                                <Td py={3}>
                                  <Badge
                                    colorScheme="purple"
                                    variant="subtle"
                                    borderRadius="md"
                                    px={2}
                                    fontSize="12px"
                                  >
                                    {item.referenceNumber}
                                  </Badge>
                                </Td>
                                <Td isNumeric fontSize="sm" color="gray.700" py={3}>
                                  {item.amount.toLocaleString("en-IN")}
                                </Td>
                                <Td isNumeric fontSize="sm" color="gray.700" py={3}>
                                  {item.rate}
                                </Td>
                                <Td isNumeric py={3}>
                                  <Flex align="center" justify="flex-end" gap={1}>
                                    <Text
                                      fontSize="sm"
                                      fontWeight={500}
                                      color={item.profitAndLoss < 0 ? "red.500" : "green.500"}
                                    >
                                      {item.profitAndLoss < 0 ? "▼" : "▲"}{" "}
                                      {Math.abs(item.profitAndLoss).toLocaleString("en-IN")}
                                    </Text>
                                  </Flex>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </Box>
                    </Box>
                  );
                })}
              </Flex>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default CancelledList;
