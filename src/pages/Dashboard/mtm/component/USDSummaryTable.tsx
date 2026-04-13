import { InfoOutlineIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Heading,
  Icon,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useMemo } from "react";

interface USDSummaryTableProps {
  data: any;
  loading: boolean;
}

const metrics = [
  { label: "Shipment Made", key: "shipmentMade" },
  { label: "Benchmark Rate (Shipment)", key: "benchmarkRateShipment", isRate: true },
  { label: "Confirmed Order", key: "confirmedOrder" },
  { label: "Benchmark Rate (Confirmed Order)", key: "benchmarkRateConfirmedOrder", isRate: true },
  { label: "Projected Exports", key: "projectedExports" },
  { label: "Benchmark Rate (Projected)", key: "benchmarkRateProjected", isRate: true },
  { label: "Total Exports", key: "totalExports", isTotal: true },
  { label: "Benchmark Rate (Total Exports)", key: "benchmarkRateTotalExports", isRate: true },
  { divider: true },
  { label: "PCFC Repayment Maturity", key: "pcfcRepaymentMaturity" },
  { label: "Drawdown Rate (PCFC)", key: "drawdownRatePcfcRepaymentMaturity", isRate: true },
  { label: "Projected PCFC Drawdown", key: "projectedPcfcDrawdown" },
  { label: "Drawdown Rate (Drawdown)", key: "drawdownRatePcfcDrawdown", isRate: true },
  { divider: true },
  { label: "Net Exports", key: "netExports", isTotal: true },
  { label: "Benchmark Rate (Net Exports)", key: "benchmarkRateNetExports", isRate: true },
  { divider: true },
  { label: "DA/DP", key: "daDp" },
  { label: "Benchmark Rate (DA/DP)", key: "benchmarkRateDaDp", isRate: true },
  { label: "LC/BC Shifting", key: "lcBcShifting" },
  { label: "Benchmark Rate (LC/BC Shifting)", key: "benchmarkRateLcBcShifting", isRate: true },
  { label: "LC/BC Direct", key: "lcBcDirect" },
  { label: "Benchmark Rate (LC/BC Direct)", key: "benchmarkRateLcBcDirect", isRate: true },
  { label: "Forecast", key: "forecast" },
  { label: "Benchmark Rate (Forecast)", key: "benchmarkRateForecast", isRate: true },
  { divider: true },
  { label: "Total Imports", key: "totalImports", isTotal: true },
  { label: "Benchmark Rate (Total Imports)", key: "benchmarkRateTotalImports", isRate: true },
  { divider: true },
  { label: "Net Exposure", key: "netExposure", isTotal: true, highlight: true },
  { divider: true },
  { label: "Export Forwards", key: "exportForwards" },
  { label: "Contracted Rate (Export Forward)", key: "contractedRateExportForward", isRate: true },
  { label: "Import Forwards", key: "importForwards" },
  { label: "Contracted Rate (Import Forwards)", key: "contractedRateImportForwards", isRate: true },
  { label: "Net Hedging", key: "netHedging", isTotal: true },
  { label: "Contracted Rate (Net Hedging)", key: "contractedRateNetHedging", isRate: true },
  { divider: true },
  { label: "Net Unhedged Exports", key: "netUnhedgedExports" },
  { label: "Breakeven Rate (Net Unhedged Export)", key: "breakevenRatenetUnhedgeExport", isRate: true },
  { label: "Net Unhedged Import", key: "netUnhedgeImport" },
  { label: "Breakeven Rate (Net Unhedged Import)", key: "breakevenRatenetUnhedgeImport", isRate: true },
  { label: "Net Unhedged Exposure", key: "netUnhedgeExposure", isTotal: true, highlight: true },
  { label: "Breakeven Rate (Net Unhedged Exposure)", key: "breakevenRatenetUnhedgeExposure", isRate: true },
];

const formatValue = (val: any, isRate: boolean) => {
  if (val === undefined || val === null) return "—";
  const num = parseFloat(val);
  if (isNaN(num)) return val;
  if (isRate) return num.toFixed(4);
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

const USDSummaryTable: React.FC<USDSummaryTableProps> = ({ data }) => {
  const bg = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const columns = useMemo(() => {
    if (!data) return [];
    // Get columns from the first available metric
    const firstMetricKey = Object.keys(data)[0];
    if (!firstMetricKey) return [];
    return Object.keys(data[firstMetricKey]);
  }, [data]);

  const formatColumnHeader = (col: string) => {
    if (col === "dueWithIn15Days") return "Due within 15 Days";
    if (col === "overDueExposure") return "Overdue Exposure";
    return col;
  };

  if (!data || Object.keys(data).length === 0) {
    return (
      <Flex direction="column" align="center" py={20} gap={4} bg={bg} rounded="xl" shadow="sm" border="1px solid" borderColor={borderColor}>
        <Icon as={InfoOutlineIcon} w={10} h={10} color="gray.300" />
        <Text color="gray.500" fontWeight="medium">No USD summary data available.</Text>
      </Flex>
    );
  }

  return (
    <Box bg={bg} rounded="2xl" shadow="xl" overflow="hidden" border="1px solid" borderColor={borderColor}>
      <Box p={6} borderBottom="1px solid" borderColor={borderColor}>
        <Heading size="md" color={"blue.700"}>
          USD Exposure Summary Metrics
        </Heading>
      </Box>

      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead bg={headerBg}>
            <Tr>
              <Th
                position="sticky"
                left={0}
                zIndex={2}
                bg={headerBg}
                minW="250px"
                borderRight="1px solid"
                borderColor={borderColor}
                py={4}
              >
                Metric
              </Th>
              {columns.map((col) => (
                <Th key={col} textAlign="right" py={4} whiteSpace="nowrap">
                  {formatColumnHeader(col)}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {metrics.map((metric, idx) => {
              if (metric.divider) {
                return (
                  <Tr key={`divider-${idx}`} bg={"gray.50"}>
                    <Td colSpan={columns.length + 1} p={1} />
                  </Tr>
                );
              }

              const metricData = data[metric.key as string] || {};
              const isHighlight = metric.highlight;

              return (
                <Tr 
                  key={metric.key} 
                  _hover={{ bg:"blue.50" }}
                  bg={isHighlight ? "blue.100" : "transparent"}
                >
                  <Td
                    position="sticky"
                    left={0}
                    zIndex={1}
                    bg={isHighlight ? "blue.50" : bg}
                    fontWeight={metric.isTotal ? "bold" : "medium"}
                    color={metric.isTotal ? "blue.600" : "gray.600"}
                    borderRight="1px solid"
                    borderColor={borderColor}
                    whiteSpace="nowrap"
                  >
                    {metric.label}
                  </Td>
                  {columns.map((col) => {
                    const value = metricData[col];
                    const numVal = parseFloat(value);
                    const color = !metric.isRate && numVal < 0 ? "red.500" : undefined;
                    
                    return (
                      <Td 
                        key={col} 
                        textAlign="right" 
                        fontWeight={metric.isTotal ? "bold" : "normal"}
                        color={color}
                      >
                        {formatValue(value, metric.isRate || false)}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default USDSummaryTable;
