import { CalendarIcon, ChevronDownIcon, ChevronUpIcon, InfoIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { primaryColor } from "../../../../globalColors";

interface SummaryTableProps {
  data: any[];
  loading: boolean;
  exposureType: string;
}

// ── Summary rows — top-level fields only (outside details array) ───────────

function useSummaryRows(exposureType: string) {
  return useMemo(() => {
    const commonRows = [
      { label: "Settlement Rate",          key: "settlementRate" },
      { label: "Average BMK Rate",         key: "averageBmkRate" },
      { label: "BMK vs Settlement",        key: "bmkVsSettlementRate" },
      { label: "Spot on Sett. Date",       key: "spotOnSettlementDate" },
      { label: "Forward Cancellation P/L", key: "plOnForwardCancellation" },
      { label: "Net P/L",                  key: "netPl", highlight: true },
    ];

    if (exposureType === "export") {
      return [
        { label: "Total Export Conversion",  key: "totalExportConversion" },
        { label: "Spot vs Sett. Rate",       key: "spotOnSettlementVsSettlementRate" },
        ...commonRows,
      ];
    }

    if (exposureType === "import") {
      return [
        { label: "Total Import Conversion",  key: "totalImportConversion" },
        { label: "Market vs Sett. Rate",     key: "marketVsSettlementRate" },
        ...commonRows,
      ];
    }

    return commonRows;
  }, [exposureType]);
}

// ── Detail rows — fields from details[0] only, shown on expand ────────────

function useDetailRows(exposureType: string) {
  return useMemo(() => {
    const base = [
      { label: "Spot Conversion",  key: "spotConversion" },
      { label: "Spot Rate",        key: "spotRate" },
      { label: "EEFC Conversion",  key: "eefcConversion" },
      { label: "EEFC Rate",        key: "eefcRate" },
      { label: "Forward Util.",    key: "forwardUtilization" },
      { label: "Forward Rate",     key: "forwardRate" },
    ];

    if (exposureType === "export") {
      return [
        { label: "PCFC Drawdown",  key: "pcfcDrawDown" },
        { label: "PCFC Rate",      key: "pcfcRate" },
        ...base,
      ];
    }

    if (exposureType === "import") {
      return [
        { label: "Import Drawdown", key: "drawdown" },
        { label: "Import Rate",     key: "rate" },
        ...base,
      ];
    }

    return base;
  }, [exposureType]);
}

// ── Helpers ────────────────────────────────────────────────────────────────

function cellColor(value: any): string | undefined {
  const n = parseFloat(value);
  if (isNaN(n)) return undefined;
  return n < 0 ? "red.600" : undefined;
}

const LabelCell: React.FC<{
  children: React.ReactNode;
  highlight?: boolean;
  isDetail?: boolean;
}> = ({ children, highlight, isDetail }) => {
  let bg = "white";
  if (highlight) bg = "green.50";
  if (isDetail) bg = "teal.50";

  return (
    <Td
      fontSize="sm"
      fontWeight={highlight ? "bold" : "medium"}
      color={highlight ? "green.700" : isDetail ? "teal.600" : "gray.600"}
      py={3}
      px={5}
      pl={isDetail ? 8 : 5}
      position="sticky"
      left={0}
      zIndex={1}
      bg={bg}
      borderRight="2px solid"
      borderColor="gray.200"
      whiteSpace="nowrap"
    >
      {children}
    </Td>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────

const SummaryTable: React.FC<SummaryTableProps> = ({ data, loading, exposureType }) => {
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  const summaryRows = useSummaryRows(exposureType);
  const detailRows  = useDetailRows(exposureType);

  if (loading) {
    return (
      <Flex justify="center" align="center" py={24} direction="column" gap={4}>
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color={primaryColor} size="xl" />
        <Text color="gray.500" fontWeight="medium">Compiling Report...</Text>
      </Flex>
    );
  }

  if (data.length === 0) {
    return (
      <Flex direction="column" align="center" py={20} gap={4} bg="white" rounded="xl" shadow="sm">
        <Icon as={InfoIcon} w={10} h={10} color="gray.200" />
        <Text color="gray.400" fontWeight="medium">No analysis data found.</Text>
      </Flex>
    );
  }

  return (
    <Box bg="white" rounded="2xl" shadow="2xl" overflow="hidden">

      {/* ── Header ── */}
      <Flex align="center" gap={3} px={6} py={4} borderBottom="1px solid" borderColor="gray.100">
        <Icon as={CalendarIcon} color={primaryColor} />
        <Heading size="sm" color="gray.700">Analysis Summary</Heading>
        <Badge colorScheme="teal" variant="solid" px={3} py={1} rounded="full" fontSize="xs" ml="auto">
          {exposureType.toUpperCase()}
        </Badge>
      </Flex>

      {/* ── Table ── */}
      <Box overflowX="auto">
        <Table size="sm" variant="simple">

          {/* Month column headers */}
          <Thead>
            <Tr bg="gray.50">
              <Th
                fontSize="11px"
                py={4}
                px={5}
                minW="220px"
                position="sticky"
                left={0}
                zIndex={2}
                bg="gray.50"
                borderRight="2px solid"
                borderColor="gray.200"
              >
                METRIC
              </Th>
              {data.map((month) => (
                <Th
                  key={month.monthYear}
                  fontSize="11px"
                  py={4}
                  px={5}
                  textAlign="center"
                  minW="150px"
                >
                  {month.monthYear}
                </Th>
              ))}
            </Tr>
          </Thead>

          <Tbody>

            {/* ── Toggle button row ── */}
            <Tr bg="teal.50">
              <Td
                colSpan={data.length + 1}
                py={2}
                px={5}
                borderBottom={detailsExpanded ? "none" : "2px solid"}
                borderColor="teal.100"
              >
                <Button
                  size="xs"
                  variant="ghost"
                  colorScheme="teal"
                  rightIcon={detailsExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  onClick={() => setDetailsExpanded((prev) => !prev)}
                  fontWeight="semibold"
                  fontSize="12px"
                >
                  {detailsExpanded ? "Hide Record Details" : "Show Record Details"}
                </Button>
              </Td>
            </Tr>

            {/* ── Detail rows — only visible when expanded, reads details[0] ── */}
            {detailsExpanded && (
              <>
                {detailRows.map((row, i) => (
                  <Tr
                    key={`detail-${row.key}`}
                    bg={i % 2 === 0 ? "teal.50" : "white"}
                    _hover={{ bg: "teal.100" }}
                  >
                    <LabelCell isDetail>{row.label}</LabelCell>
                    {data.map((month) => {
                      const val = month.details?.[0]?.[row.key];
                      return (
                        <Td
                          key={month.monthYear}
                          fontSize="sm"
                          py={3}
                          px={5}
                          textAlign="center"
                          color={cellColor(val)}
                        >
                          {val ?? "—"}
                        </Td>
                      );
                    })}
                  </Tr>
                ))}

                {/* Separator */}
                <Tr>
                  <Td colSpan={data.length + 1} p={0} borderBottom="2px solid" borderColor="teal.200" />
                </Tr>
              </>
            )}

            {/* ── Summary rows — always visible, reads top-level month fields ── */}
            {summaryRows.map((row) => (
              <Tr
                key={`summary-${row.key}`}
                _hover={{ bg: "gray.50" }}
                bg={row.highlight ? "green.50" : undefined}
              >
                <LabelCell highlight={row.highlight}>{row.label}</LabelCell>
                {data.map((month) => {
                  const val = month[row.key];
                  const color = row.highlight
                    ? (parseFloat(val) < 0 ? "red.600" : "green.700")
                    : cellColor(val);
                  return (
                    <Td
                      key={month.monthYear}
                      fontSize="sm"
                      py={3}
                      px={5}
                      textAlign="center"
                      color={color}
                      fontWeight={row.highlight ? "bold" : undefined}
                    >
                      {val ?? "—"}
                    </Td>
                  );
                })}
              </Tr>
            ))}

          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default SummaryTable;