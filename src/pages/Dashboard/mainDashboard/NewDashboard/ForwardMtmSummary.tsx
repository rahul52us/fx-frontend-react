import React from "react";
import {
  Badge,
  Box,
  Flex,
  Grid,
  HStack,
  SimpleGrid,
  Skeleton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack
} from "@chakra-ui/react";

export interface ForwardMtmSummaryProps {
  data?: {
    currencyWiseForwardMtm?: {
      totalInrValue?: number | string;
      [currency: string]: any;
    };
    closingBalance?: Record<
      string,
      {
        closingBalance?: number | string;
        closingRate?: number | string;
      }
    >;
    totalPcfcOutstanding?: {
      outstanding?: number | string;
      drawdownRate?: number | string;
    };
  } | null;
  loading?: boolean;
}

const formatAmount = (value: unknown): string => {
  if (value === null || value === undefined || value === "") return "—";
  const num = Number(value);
  if (isNaN(num)) return "—";
  return num.toLocaleString(undefined, {
    maximumFractionDigits: 2
  });
};

const formatRate = (value: unknown): string => {
  if (value === null || value === undefined || value === "") return "—";
  const num = Number(value);
  if (isNaN(num)) return "—";
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  });
};

export const ForwardMtmSummary: React.FC<ForwardMtmSummaryProps> = ({
  data,
  loading = false
}) => {
  const currencyWiseForwardMtm = data?.currencyWiseForwardMtm;
  const closingBalance = data?.closingBalance;
  const totalPcfcOutstanding = data?.totalPcfcOutstanding;

  // Extract dynamic currencies excluding metadata "totalInrValue"
  const mtmEntries = Object.entries(currencyWiseForwardMtm || {}).filter(
    ([key, value]) =>
      key !== "totalInrValue" &&
      typeof value === "object" &&
      value !== null
  );

  const totalInrValue = currencyWiseForwardMtm?.totalInrValue;
  const hasTotalMtm =
    totalInrValue !== undefined &&
    totalInrValue !== null &&
    !isNaN(Number(totalInrValue));
  const numericTotalMtm = hasTotalMtm ? Number(totalInrValue) : 0;

  // Extract dynamic closing balance currencies
  const closingEntries = Object.entries(closingBalance || {}).filter(
    ([, value]) => typeof value === "object" && value !== null
  );

  if (loading) {
    return (
      <Box>
        <Text
          fontSize="sm"
          fontWeight="semibold"
          color="gray.500"
          textTransform="uppercase"
          mb="4"
        >
          Financial Position
        </Text>
        <Grid templateColumns={{ base: "1fr", lg: "7fr 5fr" }} gap="4">
          <Box
            p="5"
            borderRadius="xl"
            bg="white"
            boxShadow="sm"
            borderWidth="1px"
            borderColor="gray.100"
          >
            <Skeleton height="24px" width="180px" mb="4" />
            <Skeleton height="200px" borderRadius="md" />
          </Box>
          <VStack spacing="4" align="stretch">
            <Box
              p="5"
              borderRadius="xl"
              bg="white"
              boxShadow="sm"
              borderWidth="1px"
              borderColor="gray.100"
            >
              <Skeleton height="20px" width="140px" mb="3" />
              <Skeleton height="100px" borderRadius="md" />
            </Box>
            <Box
              p="5"
              borderRadius="xl"
              bg="white"
              boxShadow="sm"
              borderWidth="1px"
              borderColor="gray.100"
            >
              <Skeleton height="20px" width="140px" mb="3" />
              <Skeleton height="70px" borderRadius="md" />
            </Box>
          </VStack>
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      <Text
        fontSize="sm"
        fontWeight="semibold"
        color="gray.500"
        textTransform="uppercase"
        mb="4"
      >
        Financial Position
      </Text>

      <Grid templateColumns={{ base: "1fr", lg: "7fr 5fr" }} gap="4">
        {/* 1 & 2: Dynamic Currency-wise Forward MTM Table & Total MTM */}
        <Box
          p="5"
          borderRadius="xl"
          bg="white"
          boxShadow="sm"
          borderWidth="1px"
          borderColor="gray.100"
          display="flex"
          flexDirection="column"
        >
          <Flex
            justify="space-between"
            align={{ base: "flex-start", sm: "center" }}
            direction={{ base: "column", sm: "row" }}
            gap="2"
            mb="4"
            pb="3"
            borderBottomWidth="1px"
            borderColor="gray.100"
          >
            <VStack align="start" spacing="0.5">
              <Text fontWeight="semibold" color="gray.800" fontSize="sm">
                Currency-wise Forward MTM
              </Text>
              <Text fontSize="xs" color="gray.400">
                Mark-to-market status across currencies
              </Text>
            </VStack>

            {hasTotalMtm && (
              <HStack
                spacing="2"
                bg={numericTotalMtm < 0 ? "red.50" : numericTotalMtm > 0 ? "green.50" : "gray.50"}
                px="3"
                py="1.5"
                borderRadius="md"
                borderWidth="1px"
                borderColor={
                  numericTotalMtm < 0
                    ? "red.200"
                    : numericTotalMtm > 0
                    ? "green.200"
                    : "gray.200"
                }
              >
                <Text
                  fontSize="xs"
                  fontWeight="medium"
                  color={
                    numericTotalMtm < 0
                      ? "red.700"
                      : numericTotalMtm > 0
                      ? "green.700"
                      : "gray.600"
                  }
                >
                  Total MTM (INR):
                </Text>
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color={
                    numericTotalMtm < 0
                      ? "red.700"
                      : numericTotalMtm > 0
                      ? "green.700"
                      : "gray.800"
                  }
                >
                  {formatAmount(totalInrValue)}
                </Text>
              </HStack>
            )}
          </Flex>

          <Box overflowX="auto" flex="1">
            {mtmEntries.length === 0 ? (
              <Flex py="10" justify="center" align="center">
                <Text fontSize="xs" color="gray.400">
                  No forward MTM records available
                </Text>
              </Flex>
            ) : (
              <Table size="sm" variant="simple">
                <Thead bg="gray.50">
                  <Tr>
                    <Th fontSize="2xs" color="gray.600" textTransform="none">
                      Currency
                    </Th>
                    <Th
                      fontSize="2xs"
                      color="gray.600"
                      textTransform="none"
                      isNumeric
                    >
                      Outstanding Amount
                    </Th>
                    <Th
                      fontSize="2xs"
                      color="gray.600"
                      textTransform="none"
                      isNumeric
                    >
                      Hedge Rate
                    </Th>
                    <Th
                      fontSize="2xs"
                      color="gray.600"
                      textTransform="none"
                      isNumeric
                    >
                      Current Forward Rate
                    </Th>
                    <Th
                      fontSize="2xs"
                      color="gray.600"
                      textTransform="none"
                      isNumeric
                    >
                      MTM (INR)
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {mtmEntries.map(([currency, item]: [string, any]) => {
                    const mtmVal = Number(item?.mtmInInr);
                    const isNeg = !isNaN(mtmVal) && mtmVal < 0;
                    const isPos = !isNaN(mtmVal) && mtmVal > 0;

                    return (
                      <Tr
                        key={currency}
                        _hover={{ bg: "gray.50" }}
                        transition="background-color 0.15s ease"
                      >
                        <Td fontWeight="semibold" fontSize="xs" color="gray.800">
                          <Badge colorScheme="purple" variant="subtle" fontSize="2xs">
                            {currency}
                          </Badge>
                        </Td>
                        <Td fontSize="xs" color="gray.700" isNumeric>
                          {formatAmount(item?.outStandingAmount)}
                        </Td>
                        <Td fontSize="xs" color="gray.700" isNumeric>
                          {formatRate(item?.hedgeRate)}
                        </Td>
                        <Td fontSize="xs" color="gray.700" isNumeric>
                          {formatRate(item?.currentForwardRate)}
                        </Td>
                        <Td
                          fontSize="xs"
                          fontWeight="semibold"
                          color={isNeg ? "red.600" : isPos ? "green.600" : "gray.800"}
                          isNumeric
                        >
                          {formatAmount(item?.mtmInInr)}
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            )}
          </Box>
        </Box>

        {/* Right column: Dynamic Closing Balance & PCFC Outstanding */}
        <VStack spacing="4" align="stretch">
          {/* 3: Dynamic Closing Balance Table */}
          <Box
            p="5"
            borderRadius="xl"
            bg="white"
            boxShadow="sm"
            borderWidth="1px"
            borderColor="gray.100"
          >
            <Flex
              justify="space-between"
              align="center"
              mb="3"
              pb="2.5"
              borderBottomWidth="1px"
              borderColor="gray.100"
            >
              <Text fontWeight="semibold" color="gray.800" fontSize="sm">
                Closing Balance
              </Text>
              <Text fontSize="xs" color="gray.400">
                {closingEntries.length > 0
                  ? `${closingEntries.length} currencies`
                  : "No data"}
              </Text>
            </Flex>

            <Box overflowX="auto">
              {closingEntries.length === 0 ? (
                <Flex py="6" justify="center" align="center">
                  <Text fontSize="xs" color="gray.400">
                    No closing balance records available
                  </Text>
                </Flex>
              ) : (
                <Table size="sm" variant="simple">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th fontSize="2xs" color="gray.600" textTransform="none">
                        Currency
                      </Th>
                      <Th
                        fontSize="2xs"
                        color="gray.600"
                        textTransform="none"
                        isNumeric
                      >
                        Closing Balance
                      </Th>
                      <Th
                        fontSize="2xs"
                        color="gray.600"
                        textTransform="none"
                        isNumeric
                      >
                        Closing Rate
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {closingEntries.map(([currency, item]: [string, any]) => (
                      <Tr
                        key={currency}
                        _hover={{ bg: "gray.50" }}
                        transition="background-color 0.15s ease"
                      >
                        <Td fontWeight="semibold" fontSize="xs" color="gray.800">
                          <Badge colorScheme="blue" variant="subtle" fontSize="2xs">
                            {currency}
                          </Badge>
                        </Td>
                        <Td fontSize="xs" color="gray.700" isNumeric>
                          {formatAmount(item?.closingBalance)}
                        </Td>
                        <Td fontSize="xs" color="gray.700" isNumeric>
                          {formatRate(item?.closingRate)}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </Box>
          </Box>

          {/* 4: PCFC Outstanding Summary Card */}
          <Box
            p="5"
            borderRadius="xl"
            bg="white"
            boxShadow="sm"
            borderWidth="1px"
            borderColor="gray.100"
          >
            <Flex
              justify="space-between"
              align="center"
              mb="3"
              pb="2.5"
              borderBottomWidth="1px"
              borderColor="gray.100"
            >
              <Text fontWeight="semibold" color="gray.800" fontSize="sm">
                PCFC Outstanding
              </Text>
              <Badge colorScheme="teal" variant="subtle" fontSize="2xs">
                Active
              </Badge>
            </Flex>

            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing="3">
              <Box
                p="3"
                borderRadius="lg"
                bg="gray.50"
                borderWidth="1px"
                borderColor="gray.100"
              >
                <Text fontSize="2xs" color="gray.500" mb="1" fontWeight="medium">
                  Outstanding
                </Text>
                <Text fontSize="sm" fontWeight="bold" color="gray.800">
                  {formatAmount(totalPcfcOutstanding?.outstanding)}
                </Text>
              </Box>

              <Box
                p="3"
                borderRadius="lg"
                bg="gray.50"
                borderWidth="1px"
                borderColor="gray.100"
              >
                <Text fontSize="2xs" color="gray.500" mb="1" fontWeight="medium">
                  Drawdown Rate
                </Text>
                <Text fontSize="sm" fontWeight="bold" color="teal.600">
                  {formatRate(totalPcfcOutstanding?.drawdownRate)}
                </Text>
              </Box>
            </SimpleGrid>
          </Box>
        </VStack>
      </Grid>
    </Box>
  );
};

export default ForwardMtmSummary;
