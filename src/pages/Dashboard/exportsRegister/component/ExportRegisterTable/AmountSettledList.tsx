import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Grid,
  GridItem,
  Stack,
  Text,
  Badge,
  Divider,
  useDisclosure,
} from "@chakra-ui/react";

const LabelValue = ({ label, value }: any) => (
  <Grid templateColumns="140px 1fr" gap={2} fontSize="sm">
    <GridItem color="gray.500">{label}</GridItem>
    <GridItem fontWeight="500">{value || "--"}</GridItem>
  </Grid>
);

// Instrument type → badge color mapping
const INSTRUMENT_COLORS: Record<string, string> = {
  Spot: "blue",
  EEFC: "purple",
  PCFC: "orange",
  Forward: "green",
};

const AmountSettledList = (row: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const amountSettledList: Record<string, any>[] = row.amountSettledList || [];

  if (!amountSettledList.length) {
    return <Text fontSize="sm" color="gray.400">--</Text>;
  }

  // Separate date entries from the "Total" entry
  const dateEntries = amountSettledList.filter((item) => !item["Total"]);
  const totalEntry = amountSettledList.find((item) => item["Total"]);

  // Count unique dates for button label
  const dateCount = dateEntries.length;

  return (
    <>
      <Button
        size="xs"
        variant="outline"
        colorScheme="pink"
        fontWeight="500"
        onClick={onOpen}
      >
        Settled Amount ({dateCount})
      </Button>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Settled Amount List</DrawerHeader>
          <DrawerBody p={4}>
            <Stack spacing={5}>
              {/* Date sections */}
              {dateEntries.map((dateObj, dateIndex) => {
                // Each object has one date key + optional Total key
                const dateKey = Object.keys(dateObj).find((k) => k !== "Total")!;
                const instruments: Record<string, any[]> = dateObj[dateKey]?.Instrument || {};

                return (
                  <Box
                    key={dateIndex}
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="lg"
                    overflow="hidden"
                  >
                    {/* Date Header */}
                    <Box px={3} py={2} bg="gray.100">
                      <Text fontWeight="600" fontSize="sm">
                        📅 {dateKey}
                      </Text>
                    </Box>

                    <Stack spacing={3} p={3}>
                      {Object.entries(instruments).map(([instrumentType, entries]) => {
                        if (!Array.isArray(entries) || !entries.length) return null;

                        return (
                          <Box key={instrumentType}>
                            {/* Instrument Type Badge */}
                            <Badge
                              colorScheme={INSTRUMENT_COLORS[instrumentType] || "gray"}
                              mb={2}
                              fontSize="xs"
                              px={2}
                              py={0.5}
                              borderRadius="md"
                            >
                              {instrumentType}
                            </Badge>

                            <Stack spacing={2}>
                              {entries.map((entry: any, entryIndex: number) => (
                                <Box
                                  key={entryIndex}
                                  p={2}
                                  bg="gray.50"
                                  borderRadius="md"
                                  border="1px solid"
                                  borderColor="gray.100"
                                >
                                  <Stack spacing={1}>
                                    {/* Only Spot, PCFC, Forward have referenceNumber */}
                                    {"refrenceNumber" in entry && (
                                      <LabelValue
                                        label="Reference No."
                                        value={entry.refrenceNumber}
                                      />
                                    )}
                                    <LabelValue label="Amount" value={entry.amount} />
                                    <LabelValue label="Rate" value={entry.rate} />
                                  </Stack>
                                </Box>
                              ))}
                            </Stack>
                          </Box>
                        );
                      })}
                    </Stack>
                  </Box>
                );
              })}

              {/* Total Section */}
              {totalEntry?.Total && (
                <>
                  <Divider />
                  <Box
                    p={3}
                    bg="pink.50"
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="pink.200"
                  >
                    <Text fontWeight="600" fontSize="sm" mb={2} color="pink.700">
                      Total
                    </Text>
                    <Stack spacing={1}>
                      <LabelValue
                        label="Settled Amount"
                        value={totalEntry.Total.settledAmount}
                      />
                      <LabelValue
                        label="Settlement Rate"
                        value={totalEntry.Total.settlementRate}
                      />
                    </Stack>
                  </Box>
                </>
              )}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AmountSettledList;