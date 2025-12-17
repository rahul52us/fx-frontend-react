import {
    Box,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    SimpleGrid,
    Stack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    useColorModeValue
} from "@chakra-ui/react";

// Reusable component for individual data fields
const DataField = ({ label, value }: { label: string; value: any }) => (
  <Box>
    <Text fontSize="xs" color="gray.500" fontWeight="bold" textTransform="uppercase" mb={1}>
      {label}
    </Text>
    <Text fontSize="sm" fontWeight="medium" color="gray.800">
      {value || "-"}
    </Text>
  </Box>
);

const PCFCViewDrawer = ({ isOpen, onClose, data }: any) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const drawerBg = useColorModeValue("gray.50", "gray.900");

  if (!data) return null;

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xl">
      <DrawerOverlay />
      <DrawerContent bg={drawerBg}>
        <DrawerCloseButton zIndex={10} />
        
        <DrawerHeader borderBottomWidth="1px" bg={cardBg}>
          <Text fontWeight="bold" fontSize="xl" bgGradient="linear(to-r, blue.600, orange.600)" bgClip="text">
            Transaction Details
          </Text>
          <Text fontSize="sm" color="gray.500" fontWeight="normal" textTransform={'capitalize'}>
             {data?.bank} • {data?.pcfcInputDate}
          </Text>
        </DrawerHeader>

        <DrawerBody p={0}>
          <Tabs isFitted variant="enclosed-colored" colorScheme="blue" h="100%">
            <Box bg={cardBg} px={4} pt={4} borderBottomWidth="1px" borderColor="gray.200">
              <TabList borderBottom="none">
                {data.isSpotEnabled && (
                  <Tab _selected={{ color: "blue.600", bg: "blue.50", borderBottomColor: "blue.600", borderBottomWidth: "2px" }} fontWeight="bold">
                    Spot Details ({data.spotList?.length || 0})
                  </Tab>
                )}
                {data?.isForwardEnabled && (
                  <Tab _selected={{ color: "orange.600", bg: "orange.50", borderBottomColor: "orange.600", borderBottomWidth: "2px" }} fontWeight="bold">
                    Forward Details ({data?.forwardList?.length || 0})
                  </Tab>
                )}
              </TabList>
            </Box>

            <TabPanels p={4}>
              {/* ============ TAB 1: SPOT DETAILS ============ */}
              {data.isSpotEnabled && (
                <TabPanel p={0}>
                  <Stack spacing={4}>
                    {data.spotList?.map((spot: any, index: number) => (
                      <Box
                        key={index}
                        bg={cardBg}
                        p={5}
                        borderRadius="lg"
                        
                        boxShadow="md"
                        borderLeft="4px solid"
                        borderLeftColor="blue.400"
                        _hover={{ boxShadow: "lg" }}
                        transition="all 0.2s"
                      >
                        <Flex justify="space-between" align="center" mb={4} pb={2} borderBottom="1px dashed" borderColor="gray.200">
                           {/* <Badge colorScheme="blue" variant="subtle" px={2} py={1} borderRadius="md">
                             {spot.cashTomSpot}
                             </Badge> */}
                        </Flex>

                        <SimpleGrid columns={2} spacing={5}>
                             <DataField label="Conversion Ref" value={spot?.conversionRefNo} />
                          <DataField label="Amount Converted" value={spot?.amountConverted} />
                          <DataField label="Spot Booked" value={spot?.spotBooked} />
                          <DataField label="Bank Margin" value={spot?.bankMargin} />
                          <DataField label="Cash/Tom Spot" value={spot?.cashTomSpot} />
                          <DataField label="Net Conversion Rate" value={spot?.netConversionRate} />
                        </SimpleGrid>
                      </Box>
                    ))}
                  </Stack>
                </TabPanel>
              )}

              {/* ============ TAB 2: FORWARD DETAILS ============ */}
              {data.isForwardEnabled && (
                <TabPanel p={0}>
                  <Stack spacing={4}>
                    {data?.forwardList?.map((fwd: any, index: number) => (
                      <Box
                        key={index}
                        bg={cardBg}
                        p={5}
                        borderRadius="lg"
                        boxShadow="md"
                        borderLeft="4px solid"
                        borderLeftColor="orange.400"
                        _hover={{ boxShadow: "lg" }}
                        transition="all 0.2s"
                      >
                        {/* <Flex justify="space-between" align="center" mb={4} pb={2} borderBottom="1px dashed" borderColor="gray.200">
                           <Badge colorScheme="orange" variant="subtle" px={2} py={1} borderRadius="md">
                             {fwd.cashTomSpot}
                           </Badge>
                        </Flex> */}

                        <SimpleGrid columns={2} spacing={5}>
                           <DataField label="Hedge Deal Ref" value={fwd?.hedgeDealRefNo} />
                           <DataField label="Cash/Tom Spot" value={fwd?.cashTomSpot} />
                          <DataField label="Outstanding Amt" value={fwd?.outstandingAmount} />
                          <DataField label="Utilization Amt" value={fwd?.utilizationAmount} />
                          <DataField label="Hedge Rate" value={fwd?.hedgeRate} />
                          <DataField label="Forward Premium" value={fwd?.forwardPremium} />
                          <DataField label="Net Settlement Rate" value={fwd?.netSettlementRate} />
                          
                          {/* Full width for Date Range */}
                          <Box bg="gray.50" p={2} borderRadius="md">
                             <Text fontSize="xs" color="gray.500" fontWeight="bold" mb={1}>DELIVERY PERIOD</Text>
                             <Text fontSize="sm" fontWeight="medium">
                               {fwd?.deliveryDateFrom} <Text as="span" color="orange.500" mx={1}>→</Text> {fwd?.deliveryDateTo}
                             </Text>
                          </Box>
                        </SimpleGrid>
                      </Box>
                    ))}
                  </Stack>
                </TabPanel>
              )}
            </TabPanels>
          </Tabs>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default PCFCViewDrawer;