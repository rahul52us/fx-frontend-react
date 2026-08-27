import {
  Badge,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { formatTableDate } from "../../../../../config/constant/dateUtils";

type SettledRow = {
  amount?: number;
  exposureType?: string;
  rate?: number | string;
  referenceNumber?: string;
  refrenceNumber?: string;
  [key: string]: any;
};

type SettledSection = {
  category: string;
  group: string;
  rows: SettledRow[];
};

type SettledEntry = {
  dateKey: string;
  sections: SettledSection[];
};

type TotalSummary = {
  settledAmount?: number;
  settlementRate?: number | string;
};

type SettledListProps = {
  amountSettledList?: Record<string, any>[];
};

type SummaryCardProps = {
  label: string;
  value: string | number;
  helperText?: string;
};

/**
 * Converts an API value into an array so the UI can consistently
 * work with both single objects and arrays.
 */
const toArray = (value: any): any[] => {
  if (Array.isArray(value)) {
    return value;
  }

  if (value && typeof value === "object") {
    return [value];
  }

  return [];
};

/**
 * Number formatting used for monetary/numeric values.
 */
const formatNumber = (value: any) => {
  if (value === null || value === undefined || value === "") {
    return "--";
  }

  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return String(value);
  }

  return numericValue.toLocaleString("en-IN", {
    maximumFractionDigits: 6,
  });
};

/**
 * Keeps values such as rate readable without incorrectly converting
 * non-numeric API values.
 */
const formatValue = (value: any) => {
  if (value === null || value === undefined || value === "") {
    return "--";
  }

  const numericValue = Number(value);

  if (!Number.isNaN(numericValue)) {
    return numericValue.toLocaleString("en-IN", {
      maximumFractionDigits: 6,
    });
  }

  return String(value);
};

/**
 * API currently has both `referenceNumber` and the misspelled
 * `refrenceNumber`, so both are supported.
 */
const getReferenceNumber = (row: SettledRow) =>
  row.refrenceNumber || row.referenceNumber || "--";

/**
 * Converts the nested API response into a predictable structure
 * that is easier for the UI to render.
 */
const normalizeSettledEntries = (
  amountSettledList: Record<string, any>[] = []
): {
  dateEntries: SettledEntry[];
  totalSummary: TotalSummary | null;
} => {
  const dateEntries: SettledEntry[] = [];
  let totalSummary: TotalSummary | null = null;

  amountSettledList.forEach((item) => {
    if (!item || typeof item !== "object") {
      return;
    }

    Object.entries(item).forEach(([topLevelKey, topLevelValue]) => {
      if (topLevelKey === "Total") {
        totalSummary = topLevelValue || null;
        return;
      }

      if (!topLevelValue || typeof topLevelValue !== "object") {
        dateEntries.push({
          dateKey: topLevelKey,
          sections: [],
        });

        return;
      }

      const sections: SettledSection[] = [];

      Object.entries(topLevelValue).forEach(([group, groupValue]) => {
        if (!groupValue || typeof groupValue !== "object") {
          return;
        }

        Object.entries(groupValue).forEach(
          ([category, categoryValue]) => {
            const rows = toArray(categoryValue).filter(
              (row) => row && typeof row === "object"
            );

            if (!rows.length) {
              return;
            }

            sections.push({
              group,
              category,
              rows,
            });
          }
        );
      });

      dateEntries.push({
        dateKey: topLevelKey,
        sections,
      });
    });
  });

  return {
    dateEntries,
    totalSummary,
  };
};

const getSectionTotal = (rows: SettledRow[]) =>
  rows.reduce((sum, row) => {
    const amount = Number(row.amount);

    return sum + (Number.isNaN(amount) ? 0 : amount);
  }, 0);

const getEntryDealCount = (sections: SettledSection[]) =>
  sections.reduce((sum, section) => sum + section.rows.length, 0);

const getEntryTotal = (sections: SettledSection[]) =>
  sections.reduce(
    (sum, section) => sum + getSectionTotal(section.rows),
    0
  );

/**
 * Small reusable metric shown at the top of the drawer.
 */
const SummaryCard = ({
  label,
  value,
  helperText,
  bg = "white",
  borderColor = "gray.200",
  textColor = "gray.900",
  accentColor = "blue.500",
}: SummaryCardProps & {
  bg?: string;
  borderColor?: string;
  textColor?: string;
  accentColor?: string;
}) => {
  return (
    <Box
      bg={bg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="xl"
      px={4}
      py={4}
      minW={0}
      position="relative"
      overflow="hidden"
      boxShadow="sm"
      transition="all 0.2s ease"
      _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        h="3px"
        bg={accentColor}
      />
      <Text
        fontSize="11px"
        fontWeight={700}
        color="gray.500"
        textTransform="uppercase"
        letterSpacing="0.05em"
        mb={1.5}
      >
        {label}
      </Text>

      <Text
        fontSize={{ base: "lg", md: "xl" }}
        fontWeight={800}
        color={textColor}
        lineHeight="short"
        noOfLines={1}
        title={String(value)}
      >
        {value}
      </Text>

      {helperText && (
        <Text
          fontSize="11px"
          color="gray.500"
          fontWeight={500}
          mt={1.5}
          noOfLines={1}
        >
          {helperText}
        </Text>
      )}
    </Box>
  );
};

const SettledList = ({
  amountSettledList = [],
}: SettledListProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  /**
   * Normalize only when incoming data changes.
   */
  const { dateEntries, totalSummary } = useMemo(
    () => normalizeSettledEntries(amountSettledList),
    [amountSettledList]
  );

  /**
   * Do not render empty date containers.
   */
  const visibleDateEntries = useMemo(
    () =>
      dateEntries.filter(
        (entry) => entry.sections.length > 0
      ),
    [dateEntries]
  );

  /**
   * Useful aggregate information for quick scanning.
   */
  const summary = useMemo(() => {
    const totalDeals = visibleDateEntries.reduce(
      (sum, entry) =>
        sum + getEntryDealCount(entry.sections),
      0
    );

    const calculatedAmount = visibleDateEntries.reduce(
      (sum, entry) =>
        sum + getEntryTotal(entry.sections),
      0
    );

    return {
      totalDeals,
      totalDates: visibleDateEntries.length,
      calculatedAmount,
    };
  }, [visibleDateEntries]);

  const hasData = summary.totalDeals > 0;

  /**
   * Prefer backend summary when available.
   * Fall back to the amount calculated from visible rows.
   */
  const settledAmount =
    totalSummary?.settledAmount ??
    summary.calculatedAmount;

  return (
    <>
      {!hasData ? (
        <Text
          color="gray.500"
          fontSize="sm"
          fontWeight={500}
        >
          No settled deals
        </Text>
      ) : (
        <Button
          onClick={onOpen}
          variant="outline"
          size="sm"
          bg="white"
          color="gray.700"
          borderColor="gray.300"
          borderRadius="md"
          fontWeight={600}
          px={3.5}
          _hover={{
            bg: "gray.50",
            borderColor: "gray.400",
          }}
          _active={{
            bg: "gray.100",
          }}
        >
          <Flex align="center" gap={2}>
            <Text>Settled deals</Text>

            <Badge
              bg="green.50"
              color="green.700"
              borderRadius="full"
              px={2}
              fontSize="10px"
              fontWeight={700}
            >
              {summary.totalDeals}
            </Badge>
          </Flex>
        </Button>
      )}

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        size="xl"
      >
        <DrawerOverlay bg="blackAlpha.400" />

        <DrawerContent bg="gray.50">
          <DrawerCloseButton
            top={4}
            right={4}
            color="gray.500"
            _hover={{
              bg: "gray.100",
              color: "gray.800",
            }}
          />

          {/* Drawer header */}
          <DrawerHeader
            bg="white"
            borderBottom="1px solid"
            borderColor="gray.200"
            px={{ base: 4, md: 6 }}
            py={4}
          >
            <Box pr={10}>
              <Text
                fontSize="lg"
                fontWeight={700}
                color="gray.900"
                lineHeight="short"
              >
                Settled Deals
              </Text>

              <Text
                mt={1}
                fontSize="sm"
                fontWeight={400}
                color="gray.500"
              >
                Review settlement details grouped by date
                and exposure.
              </Text>
            </Box>
          </DrawerHeader>

          <DrawerBody
            px={{ base: 3, md: 5 }}
            py={5}
          >
            {!hasData ? (
              <Box
                bg="white"
                border="1px dashed"
                borderColor="gray.300"
                borderRadius="xl"
                px={6}
                py={12}
                textAlign="center"
              >
                <Text
                  fontSize="sm"
                  fontWeight={600}
                  color="gray.600"
                >
                  No settled records found
                </Text>

                <Text
                  fontSize="xs"
                  color="gray.400"
                  mt={1}
                >
                  Settlement records will appear here when
                  available.
                </Text>
              </Box>
            ) : (
              <Flex direction="column" gap={5}>
                {/* Summary */}
                <Box>
                  <Flex
                    align="center"
                    justify="space-between"
                    mb={3}
                  >
                    <Text
                      fontSize="xs"
                      fontWeight={700}
                      color="gray.500"
                      textTransform="uppercase"
                      letterSpacing="0.05em"
                    >
                      Overview
                    </Text>
                  </Flex>

                  <SimpleGrid
                    columns={{
                      base: 2,
                      md: 4,
                    }}
                    spacing={3}
                  >
                    <SummaryCard
                      label="Settled amount"
                      value={formatNumber(settledAmount)}
                      helperText="Total settled value"
                      bg="green.50"
                      borderColor="green.200"
                      textColor="green.900"
                      accentColor="green.500"
                    />

                    <SummaryCard
                      label="Settlement rate"
                      value={formatValue(
                        totalSummary?.settlementRate
                      )}
                      helperText="Overall rate"
                      bg="purple.50"
                      borderColor="purple.200"
                      textColor="purple.900"
                      accentColor="purple.500"
                    />

                    <SummaryCard
                      label="Total deals"
                      value={summary.totalDeals}
                      helperText={
                        summary.totalDeals === 1
                          ? "1 settlement"
                          : `${summary.totalDeals} settlements`
                      }
                      bg="blue.50"
                      borderColor="blue.200"
                      textColor="blue.900"
                      accentColor="blue.500"
                    />

                    <SummaryCard
                      label="Settlement dates"
                      value={summary.totalDates}
                      helperText={
                        summary.totalDates === 1
                          ? "1 date"
                          : `${summary.totalDates} dates`
                      }
                      bg="orange.50"
                      borderColor="orange.200"
                      textColor="orange.900"
                      accentColor="orange.500"
                    />
                  </SimpleGrid>
                </Box>

                {/* Detailed records */}
                <Box>
                  <Text
                    fontSize="xs"
                    fontWeight={700}
                    color="gray.500"
                    textTransform="uppercase"
                    letterSpacing="0.05em"
                    mb={3}
                  >
                    Settlement details
                  </Text>

                  <Flex
                    direction="column"
                    gap={4}
                  >
                    {visibleDateEntries.map(
                      (
                        { dateKey, sections },
                        dateIndex
                      ) => {
                        const dateDealCount =
                          getEntryDealCount(sections);

                        const dateTotal =
                          getEntryTotal(sections);

                        return (
                          <Box
                            key={`${dateKey}-${dateIndex}`}
                            bg="white"
                            border="1px solid"
                            borderColor="blue.100"
                            borderRadius="xl"
                            overflow="hidden"
                            boxShadow="sm"
                          >
                            {/* Date header */}
                            <Flex
                              px={{ base: 4, md: 5 }}
                              py={3.5}
                              bg="blue.50"
                              borderBottom="1px solid"
                              borderColor="blue.100"
                              justify="space-between"
                              align={{
                                base: "flex-start",
                                sm: "center",
                              }}
                              direction={{
                                base: "column",
                                sm: "row",
                              }}
                              gap={2}
                            >
                              <Box>
                                <Flex align="center" gap={2}>
                                  <Text
                                    fontSize="sm"
                                    fontWeight={700}
                                    color="blue.900"
                                  >
                                    {formatTableDate(
                                      dateKey
                                    )}
                                  </Text>
                                  <Badge colorScheme="blue" variant="subtle" borderRadius="md" px={2} fontSize="10px">
                                    {dateDealCount} {dateDealCount === 1 ? "deal" : "deals"}
                                  </Badge>
                                </Flex>
                              </Box>

                              <Box
                                textAlign={{
                                  base: "left",
                                  sm: "right",
                                }}
                              >
                                <Text
                                  fontSize="10px"
                                  color="blue.600"
                                  fontWeight={700}
                                  textTransform="uppercase"
                                  letterSpacing="0.04em"
                                >
                                  Date total
                                </Text>

                                <Text
                                  mt={0.5}
                                  fontSize="sm"
                                  color="blue.900"
                                  fontWeight={700}
                                >
                                  {formatNumber(
                                    dateTotal
                                  )}
                                </Text>
                              </Box>
                            </Flex>

                            {/* Sections for this date */}
                            {sections.map(
                              (
                                section,
                                sectionIndex
                              ) => {
                                const sectionTotal =
                                  getSectionTotal(
                                    section.rows
                                  );

                                return (
                                  <Box
                                    key={`${dateKey}-${section.group}-${section.category}-${sectionIndex}`}
                                    borderTop={
                                      sectionIndex === 0
                                        ? "none"
                                        : "1px solid"
                                    }
                                    borderColor="gray.200"
                                  >
                                    {/* Section heading */}
                                    <Flex
                                      px={{
                                        base: 4,
                                        md: 5,
                                      }}
                                      py={3.5}
                                      bg="gray.50"
                                      justify="space-between"
                                      align={{
                                        base: "flex-start",
                                        md: "center",
                                      }}
                                      direction={{
                                        base: "column",
                                        md: "row",
                                      }}
                                      gap={3}
                                    >
                                      <Box minW={0}>
                                        <Badge
                                          colorScheme="teal"
                                          variant="outline"
                                          fontSize="10px"
                                          fontWeight={700}
                                          textTransform="uppercase"
                                          letterSpacing="0.06em"
                                          px={1.5}
                                          py={0.5}
                                          borderRadius="md"
                                        >
                                          {section.group}
                                        </Badge>

                                        <Flex
                                          align="center"
                                          gap={2}
                                          mt={1.5}
                                          wrap="wrap"
                                        >
                                          <Text
                                            fontSize="sm"
                                            fontWeight={700}
                                            color="gray.800"
                                            textTransform="capitalize"
                                          >
                                            {section.category}
                                          </Text>

                                          <Text
                                            fontSize="xs"
                                            color="gray.400"
                                          >
                                            •
                                          </Text>

                                          <Text
                                            fontSize="xs"
                                            fontWeight={600}
                                            color="teal.600"
                                          >
                                            {
                                              section.rows.length
                                            }{" "}
                                            {section.rows.length === 1
                                              ? "entry"
                                              : "entries"}
                                          </Text>
                                        </Flex>
                                      </Box>

                                      <Box
                                        textAlign={{
                                          base: "left",
                                          md: "right",
                                        }}
                                      >
                                        <Text
                                          fontSize="10px"
                                          fontWeight={600}
                                          color="gray.500"
                                          textTransform="uppercase"
                                          letterSpacing="0.04em"
                                        >
                                          Section total
                                        </Text>

                                        <Text
                                          mt={0.5}
                                          fontSize="sm"
                                          fontWeight={700}
                                          color="teal.700"
                                        >
                                          {formatNumber(
                                            sectionTotal
                                          )}
                                        </Text>
                                      </Box>
                                    </Flex>

                                    {/* Data table */}
                                    <Box
                                      overflowX="auto"
                                      borderTop="1px solid"
                                      borderColor="gray.200"
                                    >
                                      <Table
                                        size="sm"
                                        variant="simple"
                                      >
                                        <Thead bg="blue.50">
                                          <Tr>
                                            <Th
                                              py={3}
                                              pl={{
                                                base: 4,
                                                md: 5,
                                              }}
                                              color="blue.700"
                                              fontSize="10px"
                                              fontWeight={700}
                                              letterSpacing="0.05em"
                                            >
                                              Reference
                                            </Th>

                                            <Th
                                              minW="120px"
                                              py={3}
                                              color="blue.700"
                                              fontSize="10px"
                                              fontWeight={700}
                                              letterSpacing="0.05em"
                                              isNumeric
                                            >
                                              Amount
                                            </Th>

                                            <Th
                                              minW="100px"
                                              py={3}
                                              pr={{
                                                base: 4,
                                                md: 5,
                                              }}
                                              color="blue.700"
                                              fontSize="10px"
                                              fontWeight={700}
                                              letterSpacing="0.05em"
                                              isNumeric
                                            >
                                              Rate
                                            </Th>
                                          </Tr>
                                        </Thead>

                                        <Tbody>
                                          {section.rows.map(
                                            (
                                              item,
                                              rowIndex
                                            ) => (
                                              <Tr
                                                key={`${dateKey}-${section.group}-${section.category}-${rowIndex}`}
                                                _hover={{
                                                  bg: "blue.50",
                                                }}
                                                transition="background 0.15s ease"
                                                sx={{
                                                  "&:last-of-type td":
                                                    {
                                                      borderBottom:
                                                        "none",
                                                    },
                                                }}
                                              >
                                                <Td
                                                  py={3.5}
                                                  pl={{
                                                    base: 4,
                                                    md: 5,
                                                  }}
                                                >
                                                  <Text
                                                    fontSize="xs"
                                                    fontWeight={600}
                                                    color="blue.700"
                                                    whiteSpace="nowrap"
                                                  >
                                                    {getReferenceNumber(
                                                      item
                                                    )}
                                                  </Text>
                                                </Td>

                                                {/* <Td py={3.5}>
                                                  <Badge
                                                    variant="subtle"
                                                    colorScheme="blue"
                                                    borderRadius="md"
                                                    px={2}
                                                    py={0.5}
                                                    fontSize="10px"
                                                    fontWeight={
                                                      600
                                                    }
                                                    textTransform="capitalize"
                                                  >
                                                    {item.exposureType ||
                                                      section.category}
                                                  </Badge>
                                                </Td> */}

                                                <Td
                                                  py={3.5}
                                                  isNumeric
                                                >
                                                  <Text
                                                    fontSize="sm"
                                                    fontWeight={
                                                      600
                                                    }
                                                    color="gray.800"
                                                    whiteSpace="nowrap"
                                                    // fontVariantNumeric="tabular-nums"
                                                  >
                                                    {formatNumber(
                                                      item.amount
                                                    )}
                                                  </Text>
                                                </Td>

                                                <Td
                                                  py={3.5}
                                                  pr={{
                                                    base: 4,
                                                    md: 5,
                                                  }}
                                                  isNumeric
                                                >
                                                  <Text
                                                    fontSize="sm"
                                                    color="gray.600"
                                                    whiteSpace="nowrap"
                                                    // fontVariantNumeric="tabular-nums"
                                                  >
                                                    {formatValue(
                                                      item.rate
                                                    )}
                                                  </Text>
                                                </Td>
                                              </Tr>
                                            )
                                          )}
                                        </Tbody>
                                      </Table>
                                    </Box>
                                  </Box>
                                );
                              }
                            )}
                          </Box>
                        );
                      }
                    )}
                  </Flex>
                </Box>
              </Flex>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SettledList;