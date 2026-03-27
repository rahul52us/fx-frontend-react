import React, { useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Heading,
  Flex,
  Badge,
  IconButton,
  Button,
  Collapse,
  Spinner,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { primaryColor } from "../../../../globalColors";

interface SummaryTableProps {
  data: any[];
  loading: boolean;
  exposureType: string;
  onViewDetails?: (details: any) => void; // kept for backward compat, not used
}

// ── inline detail panel ────────────────────────────────────────────────────────

const DetailTable: React.FC<{ tableData: any[]; type: string }> = ({
  tableData,
  type,
}) => (
  <Box overflowX="auto">
    <Table size="sm" variant="simple">
      <Thead>
        <Tr bg="gray.50">
          {type === "export" && (
            <>
              <Th fontSize="xs" color="gray.500" textTransform="uppercase">
                PCFC Drawdown
              </Th>
              <Th fontSize="xs" color="gray.500" textTransform="uppercase">
                PCFC Rate
              </Th>
            </>
          )}
          <Th fontSize="xs" color="gray.500" textTransform="uppercase">
            Spot Conversion
          </Th>
          <Th fontSize="xs" color="gray.500" textTransform="uppercase">
            Spot Rate
          </Th>
          <Th fontSize="xs" color="gray.500" textTransform="uppercase">
            EEFC Conversion
          </Th>
          <Th fontSize="xs" color="gray.500" textTransform="uppercase">
            EEFC Rate
          </Th>
          <Th fontSize="xs" color="gray.500" textTransform="uppercase">
            Forward Utilization
          </Th>
          <Th fontSize="xs" color="gray.500" textTransform="uppercase">
            Forward Rate
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {tableData.map((item, idx) => (
          <Tr
            key={idx}
            _hover={{ bg: "blue.50" }}
            transition="background 0.15s"
          >
            {type === "export" && (
              <>
                <Td fontSize="sm">{item.pcfcDrawDown ?? "—"}</Td>
                <Td fontSize="sm">{item.pcfcRate ?? "—"}</Td>
              </>
            )}
            <Td fontSize="sm">{item.spotConversion ?? "—"}</Td>
            <Td fontSize="sm">{item.spotRate ?? "—"}</Td>
            <Td fontSize="sm">{item.eefcConversion ?? "—"}</Td>
            <Td fontSize="sm">{item.eefcRate ?? "—"}</Td>
            <Td fontSize="sm">{item.forwardUtilization ?? "—"}</Td>
            <Td fontSize="sm">{item.forwardRate ?? "—"}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  </Box>
);

const ExpandedPanel: React.FC<{ row: any; exposureType: string }> = ({
  row,
  exposureType,
}) => {
  if (exposureType === "total") {
    const exportRows = row?.exportDetails?.[0]?.details ?? [];
    const importRows = row?.importDetails?.[0]?.details ?? [];
    const hasAny = exportRows.length > 0 || importRows.length > 0;

    if (!hasAny) {
      return (
        <Text fontSize="sm" color="gray.400" textAlign="center" py={4}>
          No details available.
        </Text>
      );
    }

    return (
      <Flex direction="column" gap={6}>
        {exportRows.length > 0 && (
          <Box>
            <Flex align="center" gap={2} mb={3}>
              <Badge colorScheme="green" variant="subtle" px={2} py={0.5}>
                Export
              </Badge>
              <Text fontSize="xs" color="gray.400">
                {exportRows.length} record{exportRows.length !== 1 ? "s" : ""}
              </Text>
            </Flex>
            <DetailTable tableData={exportRows} type="export" />
          </Box>
        )}
        {importRows.length > 0 && (
          <Box>
            <Flex align="center" gap={2} mb={3}>
              <Badge colorScheme="blue" variant="subtle" px={2} py={0.5}>
                Import
              </Badge>
              <Text fontSize="xs" color="gray.400">
                {importRows.length} record{importRows.length !== 1 ? "s" : ""}
              </Text>
            </Flex>
            <DetailTable tableData={importRows} type="import" />
          </Box>
        )}
      </Flex>
    );
  }

  const details = row?.details ?? [];
  if (!details.length) {
    return (
      <Text fontSize="sm" color="gray.400" textAlign="center" py={4}>
        No details available.
      </Text>
    );
  }

  return <DetailTable tableData={details} type={exposureType} />;
};

// ── column definitions ─────────────────────────────────────────────────────────

const getColumns = (exposureType: string) => {
  if (exposureType === "export") {
    return [
      { label: "Month-Year", key: "monthYear" },
      { label: "Total Export Conversion", key: "totalExportConversion" },
      { label: "Settlement Rate", key: "settlementRate" },
      { label: "Average BMK Rate", key: "averageBmkRate" },
      { label: "BMK vs Settlement Rate", key: "bmkVsSettlementRate" },
      { label: "Spot on Settlement Date", key: "spotOnSettlementDate" },
      { label: "Spot vs Settlement Rate", key: "spotOnSettlementVsSettlementRate" },
      { label: "P/L on Forward Cancellation", key: "plOnForwardCancellation" },
      { label: "Net P/L", key: "netPl" },
    ];
  }
  if (exposureType === "import") {
    return [
      { label: "Month-Year", key: "monthYear" },
      { label: "Total Import Conversion", key: "totalImportConversion" },
      { label: "Settlement Rate", key: "settlementRate" },
      { label: "Average BMK Rate", key: "averageBmkRate" },
      { label: "BMK vs Settlement Rate", key: "bmkVsSettlementRate" },
      { label: "Spot on Settlement Date", key: "spotOnSettlementDate" },
      { label: "Market vs Settlement Rate", key: "marketVsSettlementRate" },
      { label: "P/L on Forward Cancellation", key: "plOnForwardCancellation" },
      { label: "Net P/L", key: "netPl" },
    ];
  }
  return [
    { label: "Month-Year", key: "monthYear" },
    { label: "BMK vs Settlement Rate", key: "bmkVsSettlementRate" },
    { label: "Market vs Settlement Rate", key: "marketVsSettlementRate" },
    { label: "P/L on Forward Cancellation", key: "plOnForwardCancellation" },
    { label: "Net P/L", key: "netPl" },
  ];
};

// ── main component ─────────────────────────────────────────────────────────────

const SummaryTable: React.FC<SummaryTableProps> = ({
  data,
  loading,
  exposureType,
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const columns = getColumns(exposureType);
  const title =
    exposureType.charAt(0).toUpperCase() + exposureType.slice(1) + " Summary";

  const allExpanded = data.length > 0 && expandedRows.size === data.length;

  const toggleRow = (idx: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedRows(new Set());
    } else {
      setExpandedRows(new Set(data.map((_, i) => i)));
    }
  };

  return (
    <Box bg="white" rounded="xl" shadow="sm" border="1px solid" borderColor="gray.100" overflow="hidden">
      {/* Header */}
      <Flex
        px={6}
        py={4}
        borderBottom="1px solid"
        borderColor="gray.100"
        align="center"
        justify="space-between"
      >
        <Heading size="sm" color="gray.700">
          {title}
        </Heading>
        <Flex align="center" gap={3}>
          {data.length > 0 && (
            <Badge colorScheme="blue" variant="subtle" px={2} py={1} borderRadius="md">
              {data.length} row{data.length !== 1 ? "s" : ""}
            </Badge>
          )}
          {data.length > 0 && !loading && (
            <Button
              size="sm"
              variant="outline"
              colorScheme="blue"
              leftIcon={allExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
              onClick={toggleAll}
            >
              {allExpanded ? "Collapse All" : "Expand All"}
            </Button>
          )}
        </Flex>
      </Flex>

      {/* Table */}
      <Box overflowX="auto">
        {loading ? (
          <Flex justify="center" align="center" py={16}>
            <Spinner color={primaryColor} size="lg" />
          </Flex>
        ) : data.length === 0 ? (
          <Text textAlign="center" py={12} color="gray.400" fontSize="sm">
            No data found. Adjust your filters and search again.
          </Text>
        ) : (
          <Table variant="simple" size="sm">
            <Thead>
              <Tr bg="gray.50">
                {columns.map((col) => (
                  <Th
                    key={col.key}
                    fontSize="xs"
                    color="gray.500"
                    textTransform="uppercase"
                    whiteSpace="nowrap"
                    py={3}
                  >
                    {col.label}
                  </Th>
                ))}
                {/* expand toggle column */}
                <Th w="48px" />
              </Tr>
            </Thead>
            <Tbody>
              {data.map((row, idx) => {
                const isExpanded = expandedRows.has(idx);
                return (
                  <React.Fragment key={idx}>
                    {/* ── data row ── */}
                    <Tr
                      cursor="pointer"
                      onClick={() => toggleRow(idx)}
                      bg={isExpanded ? "blue.50" : undefined}
                      _hover={{ bg: isExpanded ? "blue.50" : "gray.50" }}
                      transition="background 0.15s"
                      borderLeft={isExpanded ? "3px solid" : "3px solid transparent"}
                      borderLeftColor={isExpanded ? primaryColor : "transparent"}
                    >
                      {columns.map((col) => (
                        <Td key={col.key} fontSize="sm" py={3} whiteSpace="nowrap">
                          {row[col.key] ?? "—"}
                        </Td>
                      ))}
                      <Td textAlign="center" p={2}>
                        <IconButton
                          aria-label={isExpanded ? "Collapse" : "Expand"}
                          icon={isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                          size="xs"
                          variant="ghost"
                          colorScheme="blue"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRow(idx);
                          }}
                        />
                      </Td>
                    </Tr>

                    {/* ── expanded detail row ── */}
                    {isExpanded && (
                      <Tr>
                        <Td
                          colSpan={columns.length + 1}
                          p={0}
                          borderBottom="2px solid"
                          borderBottomColor="blue.100"
                        >
                          <Collapse in={isExpanded} animateOpacity>
                            <Box
                              px={6}
                              py={5}
                              bg="gray.50"
                              borderTop="1px solid"
                              borderTopColor="blue.100"
                            >
                              <Text
                                fontSize="xs"
                                fontWeight="semibold"
                                color="gray.400"
                                textTransform="uppercase"
                                letterSpacing="wide"
                                mb={4}
                              >
                                Breakdown · {row.monthYear}
                              </Text>
                              <ExpandedPanel row={row} exposureType={exposureType} />
                            </Box>
                          </Collapse>
                        </Td>
                      </Tr>
                    )}
                  </React.Fragment>
                );
              })}
            </Tbody>
          </Table>
        )}
      </Box>
    </Box>
  );
};

export default SummaryTable;