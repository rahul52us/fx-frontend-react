import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
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

// Reusable Data Field
const DataField = ({ label, value }: { label: string; value: any }) => (
  <Box>
    <Text
      fontSize="xs"
      color="gray.500"
      fontWeight="bold"
      textTransform="uppercase"
      mb={1}
    >
      {label}
    </Text>
    <Text fontSize="sm" fontWeight="medium" color="gray.800">
      {value || "-"}
    </Text>
  </Box>
);

const ExposureSettlementViewDrawer = ({ isOpen, onClose, data }: any) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const drawerBg = useColorModeValue("gray.50", "gray.900");

  if (!data) return null;

  const eefcList =
  data?.isEEFCExportsEnabled
    ? data?.eefcExportsList
    : data?.isEEFCImportsEnabled
    ? data?.eefcImportsList
    : [];

const isEEFCEnabled =
  data?.isEEFCExportsEnabled || data?.isEEFCImportsEnabled;

  const pcfcList = Array.isArray(data?.pcfcList) ? data.pcfcList : [];

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xl">
      <DrawerOverlay />
      <DrawerContent bg={drawerBg}>
        <DrawerCloseButton zIndex={10} />

        <DrawerHeader borderBottomWidth="1px" bg={cardBg}>
          <Text
            fontWeight="bold"
            fontSize="xl"
            bgGradient="linear(to-r, blue.600, green.500)"
            bgClip="text"
          >
            Exposure Settlement Details
          </Text>
          <Text fontSize="sm" color="gray.500" textTransform="capitalize">
            {data?.bank} • {data?.settlementInputDate}
          </Text>
        </DrawerHeader>

        <DrawerBody p={0}>
          <Tabs isFitted variant="enclosed-colored" colorScheme="blue">
            {/* ================= TAB HEADERS ================= */}
            <Box bg={cardBg} px={4} pt={4} borderBottomWidth="1px">
              <TabList borderBottom="none">
                <Tab fontWeight="bold">Basic Info</Tab>

                {data?.isSpotEnabled && (
                  <Tab fontWeight="bold">
                    Spot ({data?.spotList?.length || 0})
                  </Tab>
                )}

             {isEEFCEnabled && (
  <Tab fontWeight="bold">
    EEFC ({eefcList?.length || 0})
  </Tab>
)}

{data?.isPCFCEnabled && (
  <Tab fontWeight="bold">
    PCFC ({data?.pcfcList?.length || 0})
  </Tab>
)}


                {data?.isForwardEnabled && (
                  <Tab fontWeight="bold">
                    Forward ({data?.forwardList?.length || 0})
                  </Tab>
                )}
              </TabList>
            </Box>

            {/* ================= TAB PANELS ================= */}
            <TabPanels p={4}>
              {/* ================= BASIC INFO ================= */}
              <TabPanel p={0}>
                <Box
                  bg={cardBg}
                  p={5}
                  borderRadius="lg"
                  boxShadow="md"
                  borderLeft="4px solid"
                  borderLeftColor="blue.400"
                >
                  <SimpleGrid columns={2} spacing={5}>
                    <DataField label="Month" value={data?.month} />
                    <DataField label="Settlement Date" value={data?.settlementDate} />
                    <DataField label="Exposure Type" value={data?.exposureType} />
                    <DataField label="Settlement Type" value={data?.settlementType} />
                    <DataField label="PO Number" value={data?.poNumber} />
                    <DataField label="Party Name" value={data?.partyName} />
                    <DataField label="Business Unit" value={data?.bussinessUnit} />
                    <DataField label="Currency" value={data?.currency} />
                    <DataField label="Outstanding Amount" value={data?.outStandingAmount} />
                    <DataField label="Settled Amount" value={data?.settledAmount} />
                    <DataField label="Settlement Rate" value={data?.settlementRate} />
                    <DataField label="Settled INR" value={data?.settledAmountInInr} />
                  </SimpleGrid>

                  {/* Rate Comparison Section */}
                  <Box mt={6} p={4} bg="gray.50" borderRadius="md">
                    <Text fontSize="sm" fontWeight="bold" mb={3}>
                      Rate Comparison
                    </Text>
                    <SimpleGrid columns={2} spacing={4}>
                      <DataField label="Benchmark Rate" value={data?.benchmarkRate} />
                      <DataField label="BMK vs Settlement" value={data?.bmkVsSettlementRate} />
                      <DataField label="Spot on Settlement Date" value={data?.spotOnSettlementDate} />
                      <DataField label="Market vs Settlement" value={data?.marketVsSettlementRate} />
                    </SimpleGrid>
                  </Box>
                </Box>
              </TabPanel>



              {/* ================= SPOT DETAILS ================= */}
              {data?.isSpotEnabled && (
                <TabPanel p={0}>
                  <Stack spacing={4}>
                    {data?.spotList?.map((spot: any, index: number) => (
                      <Box
                        key={index}
                        bg={cardBg}
                        p={5}
                        borderRadius="lg"
                        boxShadow="md"
                        borderLeft="4px solid"
                        borderLeftColor="blue.400"
                      >
                        <SimpleGrid columns={2} spacing={5}>
                          <DataField
                            label="Conversion Ref"
                            value={spot?.conversionReferenceNumber}
                          />
                          <DataField label="Amount Converted" value={spot?.amountConverted} />
                          <DataField label="Spot Booked" value={spot?.spotBooked} />
                          <DataField label="Cash/Tom Spot" value={spot?.cashTomSpot} />
                          <DataField label="Bank Margin" value={spot?.bankMargin} />
                          <DataField label="Net Conversion Rate" value={spot?.netConversionRate} />
                        </SimpleGrid>
                      </Box>
                    ))}
                  </Stack>
                </TabPanel>
              )}

              {/* ================= EEFC EXPORTS ================= */}
           {isEEFCEnabled && (
  <TabPanel p={0}>
    <Stack spacing={4}>
      {eefcList?.map((eefc: any, index: number) => (
        <Box
          key={index}
          bg={cardBg}
          p={5}
          borderRadius="lg"
          boxShadow="md"
          borderLeft="4px solid"
          borderLeftColor="green.400"
        >
          <SimpleGrid columns={2} spacing={5}>
            
            {/* If settlementRate exists (Imports case) */}
            {eefc?.settlementRate && (
              <DataField
                label="Settlement Rate"
                value={eefc?.settlementRate}
              />
            )}

            {/* Amount (Imports case) */}
            {eefc?.amount && (
              <DataField
                label="Amount"
                value={eefc?.amount}
              />
            )}

            {/* Utilization Amount (Exports case) */}
            {eefc?.utilizationAmount && (
              <DataField
                label="Utilization Amount"
                value={eefc?.utilizationAmount}
              />
            )}

            {/* Net Settlement Rate (Exports case) */}
            {eefc?.netConversionRate && (
              <DataField
                label="Net Conversion Rate"
                value={eefc?.netConversionRate}
              />
            )}

            {/* Closing Amount (Imports case) */}
            {eefc?.closingAmount && (
              <DataField
                label="Closing Amount"
                value={eefc?.closingAmount}
              />
            )}

            {/* Closing INR (Imports case) */}
            {eefc?.closingAmountInr && (
              <DataField
                label="Closing Amount (INR)"
                value={eefc?.closingAmountInr}
              />
            )}
          </SimpleGrid>
        </Box>
      ))}
    </Stack>
  </TabPanel>
)}


              {data?.isPCFCEnabled && (
  <TabPanel p={0}>
    <Stack spacing={4}>
      {pcfcList?.map((pcfc: any, index: number) => (
        <Box
          key={index}
          bg={cardBg}
          p={5}
          borderRadius="lg"
          boxShadow="md"
          borderLeft="4px solid"
          borderLeftColor="purple.400"
        >
          <SimpleGrid columns={2} spacing={5}>
            <DataField label="Trade Ref Number" value={pcfc?.tradeRefNumber} />
            <DataField label="Outstanding Amount" value={pcfc?.outstandingAmount} />
            <DataField label="Utilization Amount" value={pcfc?.utilizationAmount} />
            <DataField label="Net Drawdown Rate" value={pcfc?.netDrawdownRate} />
            <DataField label="Net Settlement Rate" value={pcfc?.netSettlementRate} />
            <DataField label="Due Date" value={pcfc?.dueDate} />
          </SimpleGrid>
        </Box>
      ))}
    </Stack>
  </TabPanel>
)}


              {/* ================= FORWARD DETAILS ================= */}
              {data?.isForwardEnabled && (
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
                      >
                        <SimpleGrid columns={2} spacing={5}>
                          <DataField label="Hedge Deal Ref" value={fwd?.hedgeDealRefNo} />
                          <DataField label="Outstanding Amount" value={fwd?.outstandingAmount} />
                          <DataField label="Utilization Amount" value={fwd?.utilizationAmount} />
                          <DataField label="Hedge Rate" value={fwd?.hedgeRate} />
                          <DataField label="Forward Premium" value={fwd?.forwardPremium} />
                          <DataField label="Net Settlement Rate" value={fwd?.netSettlementRate} />

                          <Box bg="gray.50" p={3} borderRadius="md">
                            <Text fontSize="xs" color="gray.500" fontWeight="bold">
                              DELIVERY PERIOD
                            </Text>
                            <Text fontSize="sm">
                              {fwd?.deliveryDateFrom} → {fwd?.deliveryDateTo}
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

export default ExposureSettlementViewDrawer;
