import {
  Badge,
  Box,
  Flex,
  Grid,
  HStack,
  Skeleton,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack
} from "@chakra-ui/react";
import React from "react";

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

/* ----------------------------- formatters ----------------------------- */
const toNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
};

/** 12345678.9 -> "12.35 M"  |  -2500000 -> "-2.50 M" */
const formatMillion = (value: unknown): string => {
  const num = toNumber(value);
  if (num === null) return "—";
  return `${(num / 1_000_000).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })} M`;
};

const formatRate = (value: unknown): string => {
  const num = toNumber(value);
  if (num === null) return "—";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  });
};

const tone = (num: number | null) =>
  num === null || num === 0 ? "neutral" : num < 0 ? "negative" : "positive";
const TONES = {
  positive: { fg: "green.600", bg: "green.50", bar: "green.400", arrow: "▲" },
  negative: { fg: "red.600", bg: "red.50", bar: "red.400", arrow: "▼" },
  neutral: { fg: "gray.700", bg: "gray.50", bar: "gray.300", arrow: "" }
} as const;

/* ------------------------------ shared UI ------------------------------ */

const NUM_STYLE = { fontVariantNumeric: "tabular-nums" } as const;

const Panel: React.FC<React.ComponentProps<typeof Box>> = ({
  children,
  ...rest
}) => (
  <Box
    bg="white"
    borderRadius="2xl"
    borderWidth="1px"
    borderColor="gray.100"
    boxShadow="0 1px 2px rgba(16, 24, 40, 0.04)"
    overflow="hidden"
    {...rest}
  >
    {children}
  </Box>
);

const PanelHeader: React.FC<{
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}> = ({ title, subtitle, right }) => (
  <Flex
    justify="space-between"
    align="center"
    px="5"
    py="4"
    borderBottomWidth="1px"
    borderColor="gray.100"
    gap="3"
  >
    <Box>
      <Text fontWeight="semibold" fontSize="sm" color="gray.800">
        {title}
      </Text>
      {subtitle && (
        <Text fontSize="xs" color="gray.500" mt="0.5">
          {subtitle}
        </Text>
      )}
    </Box>
    {right}
  </Flex>
);

const CurrencyChip: React.FC<{ code: string; scheme?: string }> = ({
  code,
  scheme = "purple"
}) => (
  <Tag
  colorScheme={scheme}
    // align="center"
    // justify="center"
    // minW="44px"
    size="sm"
    // h="20px"
    // px="2"
    // borderRadius="md"
    // bg={`${scheme}.50`}
    // color={`${scheme}.700`}
    // fontSize="xs"
    // fontWeight="bold"
    // letterSpacing="0.02em"
  >
    {code}
  </Tag>
);

const headStyle = {
  fontSize: "xs",
  fontWeight: "medium",
  color: "gray.500",
  textTransform: "none" as const,
  letterSpacing: "normal",
  bg: "gray.50",
  borderColor: "gray.100",
  py: "3"
};

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <Flex py="12" justify="center" align="center">
    <Text fontSize="sm" color="gray.400">
      {message}
    </Text>
  </Flex>
);

/* ------------------------------ component ------------------------------ */

export const ForwardMtmSummary: React.FC<ForwardMtmSummaryProps> = ({
  data,
  loading = false
}) => {
  const currencyWiseForwardMtm = data?.currencyWiseForwardMtm;
  const closingBalance = data?.closingBalance;
  const totalPcfcOutstanding = data?.totalPcfcOutstanding;
  // Dynamic currencies (skip the "totalInrValue" metadata key)
  const mtmEntries = Object.entries(currencyWiseForwardMtm || {}).filter(
    ([key, value]) =>
      key !== "totalInrValue" && typeof value === "object" && value !== null
  );
  const totalMtm = toNumber(currencyWiseForwardMtm?.totalInrValue);
  // Dynamic closing balance currencies (INR, USD, EUR, ... any number)
  const closingEntries = Object.entries(closingBalance || {}).filter(
    ([, value]) => typeof value === "object" && value !== null
  );
  const outstanding = totalPcfcOutstanding?.outstanding;
  const drawdownRate = totalPcfcOutstanding?.drawdownRate;
  if (loading) {
    return (
      <Box>
        <Skeleton height="22px" width="160px" mb="4" />
        <Skeleton height="96px" borderRadius="2xl" mb="4" />
        <Grid templateColumns={{ base: "1fr", lg: "7fr 5fr" }} gap="4">
          <Skeleton height="280px" borderRadius="2xl" />
          <Skeleton height="280px" borderRadius="2xl" />
        </Grid>
      </Box>
    );
  }
  return (
    <Box>
      {/* Section title */}
      <Flex align="baseline" justify="space-between" mb="4" wrap="wrap" gap="2">
        <Text fontSize="lg" fontWeight="semibold" color="gray.800">
          Financial position
        </Text>
        <Text fontSize="xs" color="gray.500">
          Amounts in millions (M) · Rates as quoted
        </Text>
      </Flex>
      {/* Headline strip: PCFC + drawdown rate */}
      <Panel mb="4">
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }}>
          <Flex
            direction="column"
            justify="center"
            px="6"
            py="5"
            borderTopWidth={{ base: "1px", md: "0" }}
            borderLeftWidth={{ base: "0", md: "0" }}
            borderColor="gray.100"
          >
            <Text fontSize="sm" color="gray.600">
              PCFC outstanding
            </Text>
            <Text
              fontSize="2xl"
              fontWeight="semibold"
              color="gray.800"
              mt="1"
              lineHeight="1.1"
              sx={NUM_STYLE}
            >
              {formatMillion(outstanding)}
            </Text>
          </Flex>
          <Flex
            direction="column"
            justify="center"
            px="6"
            py="5"
            borderTopWidth={{ base: "1px", md: "0" }}
            borderLeftWidth={{ base: "0", md: "1px" }}
            borderColor="gray.100"
          >
            <Text fontSize="sm" color="gray.600">
              Drawdown rate
            </Text>
            <Text
              fontSize="2xl"
              fontWeight="semibold"
              color="teal.600"
              mt="1"
              lineHeight="1.1"
              sx={NUM_STYLE}
            >
              {formatRate(drawdownRate)}
            </Text>
          </Flex>
        </Grid>
      </Panel>
      <Grid templateColumns={{ base: "1fr", lg: "7fr 5fr" }} gap="4">
        {/* Currency-wise forward MTM */}
        <Panel display="flex" flexDirection="column">
          <PanelHeader
            title="Currency-wise forward MTM"
            subtitle="Outstanding hedges marked to the current forward rate"
            right={
              mtmEntries.length > 0 ? (
                <Badge
                  colorScheme="purple"
                  variant="subtle"
                  borderRadius="full"
                  px="2.5"
                  py="0.5"
                  fontSize="xs"
                  textTransform="none"
                  fontWeight="medium"
                >
                  {mtmEntries.length}{" "}
                  {mtmEntries.length === 1 ? "currency" : "currencies"}
                </Badge>
              ) : undefined
            }
          />
          <Box overflowX="auto" flex="1">
            {mtmEntries.length === 0 ? (
              <EmptyState message="No forward MTM records available" />
            ) : (
              <Table size="md" variant="simple">
                <Thead>
                  <Tr>
                    <Th {...headStyle}>Currency</Th>
                    <Th {...headStyle} isNumeric>
                      Outstanding
                    </Th>
                    <Th {...headStyle} isNumeric>
                      Hedge rate
                    </Th>
                    <Th {...headStyle} isNumeric>
                      Forward rate
                    </Th>
                    <Th {...headStyle} isNumeric>
                      MTM (INR)
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {mtmEntries.map(([currency, item]: [string, any]) => {
                    const mtmVal = toNumber(item?.mtmInInr);
                    const t = TONES[tone(mtmVal)];
                    return (
                      <Tr
                        key={currency}
                        _hover={{ bg: "gray.50" }}
                        transition="background-color 0.15s ease"
                      >
                        <Td borderColor="gray.100">
                          <CurrencyChip code={currency} scheme="purple" />
                        </Td>
                        <Td
                          fontSize="sm"
                          color="gray.700"
                          borderColor="gray.100"
                          isNumeric
                          sx={NUM_STYLE}
                        >
                          {formatMillion(item?.outStandingAmount)}
                        </Td>
                        <Td
                          fontSize="sm"
                          color="gray.700"
                          borderColor="gray.100"
                          isNumeric
                          sx={NUM_STYLE}
                        >
                          {formatRate(item?.hedgeRate)}
                        </Td>
                        <Td
                          fontSize="sm"
                          color="gray.700"
                          borderColor="gray.100"
                          isNumeric
                          sx={NUM_STYLE}
                        >
                          {formatRate(item?.currentForwardRate)}
                        </Td>
                        <Td borderColor="gray.100" isNumeric>
                          <Box
                            display="inline-flex"
                            alignItems="center"
                            gap="1.5"
                            px="2.5"
                            py="0.5"
                            borderRadius="md"
                            bg={t.bg}
                            color={t.fg}
                            fontSize="sm"
                            fontWeight="semibold"
                            sx={NUM_STYLE}
                          >
                            {t.arrow && (
                              <Text as="span" fontSize="2xs">
                                {t.arrow}
                              </Text>
                            )}
                            {formatMillion(item?.mtmInInr)}
                          </Box>
                        </Td>
                      </Tr>
                    );
                  })}
                  <Tr bg="gray.50">
                    <Td borderColor="gray.100" fontWeight="bold">
                      Total
                    </Td>
                    <Td borderColor="gray.100" />
                    <Td borderColor="gray.100" />
                    <Td borderColor="gray.100" />
                    <Td
                      borderColor="gray.100"
                      isNumeric
                      fontWeight="bold"
                      color={
                        totalMtm === null
                          ? "gray.500"
                          : totalMtm < 0
                            ? "red.600"
                            : totalMtm > 0
                              ? "green.600"
                              : "gray.700"
                      }
                      sx={NUM_STYLE}
                    >
                      {formatMillion(totalMtm)}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            )}
          </Box>
        </Panel>
        {/* Closing balance — dynamic list: INR, USD, EUR, ... */}
        <Panel display="flex" flexDirection="column">
          <PanelHeader
            title="Closing balance"
            subtitle="Balance and closing rate by currency"
            right={
              closingEntries.length > 0 ? (
                <Badge
                  colorScheme="blue"
                  variant="subtle"
                  borderRadius="full"
                  px="2.5"
                  py="0.5"
                  fontSize="xs"
                  textTransform="none"
                  fontWeight="medium"
                >
                  {closingEntries.length}{" "}
                  {closingEntries.length === 1 ? "currency" : "currencies"}
                </Badge>
              ) : undefined
            }
          />
          {closingEntries.length === 0 ? (
            <EmptyState message="No closing balance records available" />
          ) : (
            <VStack spacing="0" align="stretch" flex="1">
              {closingEntries.map(([currency, item]: [string, any], idx) => (
                <Flex
                  key={currency}
                  align="center"
                  justify="space-between"
                  gap="3"
                  px="5"
                  py="3.5"
                  borderTopWidth={idx === 0 ? "0" : "1px"}
                  borderColor="gray.100"
                  _hover={{ bg: "gray.50" }}
                  transition="background-color 0.15s ease"
                >
                  <HStack spacing="3">
                    <CurrencyChip code={currency} scheme="blue" />
                    <Box>
                      <Text fontSize="xs" color="gray.500">
                        Closing rate
                      </Text>
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color="gray.700"
                        sx={NUM_STYLE}
                      >
                        {formatRate(item?.closingRate)}
                      </Text>
                    </Box>
                  </HStack>
                  <Box textAlign="right">
                    <Text fontSize="xs" color="gray.500">
                      Balance
                    </Text>
                    <Text
                      fontSize="md"
                      fontWeight="semibold"
                      color="gray.800"
                      sx={NUM_STYLE}
                    >
                      {formatMillion(item?.closingBalance)}
                    </Text>
                  </Box>
                </Flex>
              ))}
            </VStack>
          )}
        </Panel>
      </Grid>
    </Box>
  );
};

export default ForwardMtmSummary;
