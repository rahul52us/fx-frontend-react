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

const SettledList = ({ amountSettledList }: { amountSettledList: any[] }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // ✅ Separate date entries from the "Total" summary object
  const dateEntries: { dateKey: string; instruments: Record<string, any> }[] = [];
  let totalSummary: { settledAmount: number; settlementRate: number } | null = null;

  (amountSettledList || []).forEach((item) => {
    const key = Object.keys(item)[0];
    if (key === "Total") {
      totalSummary = item[key];
    } else {
      dateEntries.push({ dateKey: key, instruments: item[key] });
    }
  });

  const hasData = dateEntries.length > 0;

  return (
    <>
      {/* Trigger Button */}
      {!hasData ? (
        <Text color="gray.500">No settled deals</Text>
      ) : (
        <Button
          onClick={onOpen}
          colorScheme="green"
          variant="outline"
          size="sm"
          borderRadius="full"
          fontWeight={500}
        >
          Settled List
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
            Settled Deals
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
                No settled records found.
              </Box>
            ) : (
              <Flex direction="column" gap={6}>

                {/* ── Date-wise cards ── */}
                {dateEntries.map(({ dateKey, instruments }, groupIndex) =>
                  // Each instrument type e.g. "Instrument"
                  Object.entries(instruments).map(([instrumentType, instrumentValue]: [string, any]) => {
                    // Each category inside instrument e.g. "Exposure"
                    return Object.entries(instrumentValue).map(
                      ([category, rows]: [string, any]) => {
                        const data: any[] = rows || [];
                        const totalAmount = data.reduce(
                          (sum, item) => sum + (item.amount || 0), 0
                        );

                        return (
                          <Box
                            key={`${groupIndex}-${instrumentType}-${category}`}
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
                              bg="green.50"
                              justify="space-between"
                              align="center"
                              borderBottom="1px solid"
                              borderColor="gray.200"
                            >
                              <Flex align="center" gap={3}>
                                <Text fontWeight={600} fontSize="sm" color="gray.700">
                                  {dateKey}
                                </Text>
                                <Badge colorScheme="teal" borderRadius="full" px={2}>
                                  {instrumentType}
                                </Badge>
                                <Badge colorScheme="blue" borderRadius="full" px={2}>
                                  {category}
                                </Badge>
                                <Badge colorScheme="blue" variant="subtle" borderRadius="full" px={2}>
                                  {data.length} {data.length === 1 ? "deal" : "deals"}
                                </Badge>
                              </Flex>

                              <Flex direction="column" align="flex-end">
                                <Text fontSize="11px" color="gray.400" mb="1px">
                                  Total amount
                                </Text>
                                <Text fontWeight={600} fontSize="sm" color="gray.700">
                                  {totalAmount.toLocaleString("en-IN")}
                                </Text>
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
                                    <Th color="gray.500" fontSize="11px">
                                      Exposure type
                                    </Th>
                                    <Th color="gray.500" fontSize="11px" isNumeric>
                                      Amount
                                    </Th>
                                    <Th color="gray.500" fontSize="11px" isNumeric>
                                      Rate
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
                                          {item.refrenceNumber}
                                        </Badge>
                                      </Td>
                                      <Td py={3}>
                                        <Badge
                                          colorScheme="orange"
                                          variant="subtle"
                                          borderRadius="md"
                                          px={2}
                                          fontSize="12px"
                                          textTransform="capitalize"
                                        >
                                          {item.exposureType}
                                        </Badge>
                                      </Td>
                                      <Td isNumeric fontSize="sm" color="gray.700" py={3}>
                                        {item.amount.toLocaleString("en-IN")}
                                      </Td>
                                      <Td isNumeric fontSize="sm" color="gray.700" py={3}>
                                        {item.rate}
                                      </Td>
                                    </Tr>
                                  ))}
                                </Tbody>
                              </Table>
                            </Box>
                          </Box>
                        );
                      }
                    );
                  })
                )}

                {/* ── Total Summary Card ── */}
                {totalSummary && (
                  <Box
                    border="1px solid"
                    borderColor="green.200"
                    borderRadius="xl"
                    overflow="hidden"
                    bg="white"
                  >
                    <Flex
                      px={5}
                      py={3}
                      bg="green.50"
                      align="center"
                      borderBottom="1px solid"
                      borderColor="green.200"
                    >
                      <Badge colorScheme="green" borderRadius="full" px={3}>
                        Summary
                      </Badge>
                    </Flex>
                    <Flex px={5} py={4} gap={8}>
                      <Flex direction="column">
                        <Text fontSize="11px" color="gray.400" mb="2px">
                          Total settled amount
                        </Text>
                        <Text fontWeight={600} fontSize="sm" color="gray.700">
                          {(totalSummary as any).settledAmount.toLocaleString("en-IN")}
                        </Text>
                      </Flex>
                      <Divider orientation="vertical" h="36px" />
                      <Flex direction="column">
                        <Text fontSize="11px" color="gray.400" mb="2px">
                          Settlement rate
                        </Text>
                        <Text fontWeight={600} fontSize="sm" color="gray.700">
                          {(totalSummary as any).settlementRate}
                        </Text>
                      </Flex>
                    </Flex>
                  </Box>
                )}

              </Flex>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SettledList;