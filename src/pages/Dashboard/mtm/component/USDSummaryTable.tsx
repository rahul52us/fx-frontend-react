import { InfoOutlineIcon } from "@chakra-ui/icons";
import {
  Box,
  Select as ChakraSelect,
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
import React, { useMemo, useState } from "react";

interface USDSummaryTableProps {
  data: any;
  loading: boolean;
}

const metrics = [
  { label: "Shipment Made", key: "shipmentMade" },
  { label: "Benchmark Rate", key: "benchmarkRateShipment", isRate: true },
  { label: "Confirmed Order", key: "confirmedOrder" },
  { label: "Benchmark Rate", key: "benchmarkRateConfirmedOrder", isRate: true },
  { label: "Projected Exports", key: "projectedExports" },
  { label: "Benchmark Rate", key: "benchmarkRateProjected", isRate: true },
  { label: "Total Exports", key: "totalExports", isTotal: true },
  { label: "Benchmark Rate", key: "benchmarkRateTotalExports", isRate: true },
  { divider: true },
  { label: "PCFC Repayment Maturity", key: "pcfcRepaymentMaturity" },
  { label: "Drawdown Rate", key: "drawdownRatePcfcRepaymentMaturity", isRate: true },
  { label: "Projected PCFC Drawdown", key: "projectedPcfcDrawdown" },
  { label: "Drawdown Rate", key: "drawdownRatePcfcDrawdown", isRate: true },
  { divider: true },
  { label: "Net Exports", key: "netExports", isTotal: true },
  { label: "Benchmark Rate ", key: "benchmarkRateNetExports", isRate: true },
  { divider: true },
  { label: "DA/DP", key: "daDp" },
  { label: "Benchmark Rate", key: "benchmarkRateDaDp", isRate: true },
  { label: "LC/BC Shifting", key: "lcBcShifting" },
  { label: "Benchmark Rate ", key: "benchmarkRateLcBcShifting", isRate: true },
  { label: "LC/BC Direct", key: "lcBcDirect" },
  { label: "Benchmark Rate ", key: "benchmarkRateLcBcDirect", isRate: true },
  { label: "Forecast", key: "forecast" },
  { label: "Benchmark Rate", key: "benchmarkRateForecast", isRate: true },
  { divider: true },
  { label: "Total Imports", key: "totalImports", isTotal: true },
  { label: "Benchmark Rate", key: "benchmarkRateTotalImports", isRate: true },
  { divider: true },
  { label: "Net Exposure", key: "netExposure", isTotal: true, highlight: true },
  { divider: true },
  { label: "Export Forwards", key: "exportForwards" },
  { label: "Contracted Rate", key: "contractedRateExportForward", isRate: true },
  { label: "Import Forwards", key: "importForwards" },
  { label: "Contracted Rate", key: "contractedRateImportForwards", isRate: true },
  { label: "Net Hedging", key: "netHedging", isTotal: true },
  { label: "Contracted Rate", key: "contractedRateNetHedging", isRate: true },
  { divider: true },
  { label: "Net Unhedged Exports", key: "netUnhedgedExports" },
  { label: "Breakeven Rate", key: "breakevenRatenetUnhedgeExport", isRate: true },
  { label: "Net Unhedged Import", key: "netUnhedgeImport" },
  { label: "Breakeven Rate", key: "breakevenRatenetUnhedgeImport", isRate: true },
  { label: "Net Unhedged Exposure", key: "netUnhedgeExposure", isTotal: true, highlight: true },
  { label: "Breakeven Rate", key: "breakevenRatenetUnhedgeExposure", isRate: true },
  { divider: true },
  { label: "Current Fwd Rate", key: "currentFwdrate", isRate: true },
  { label: "Current Hedging %", key: "currentHedging", isPercentage: true },
  { label: "Hedging Gap", key: "hedgingGap" },
  { divider: true },
  { label: "Export Prescribed Hedging % (RMP)", key: "exportPrescribedHedging%AsPerRMP", isPercentage: true },
  { label: "Import Prescribed Hedging % (RMP)", key: "importPrescribedHedging%AsPerRMP", isPercentage: true },
  { label: "Net Prescribed Hedging % (RMP)", key: "netPrescribedHedging%AsPerRMP", isPercentage: true },
  { divider: true },
  { label: "P/L on Net Unhedged Exports (INR)", key: "PlOnNetUnHedgedExportsInInr", isINR: true },
  { label: "P/L on Net Unhedged Imports (INR)", key: "PlOnNetUnHedgedImportsInInr", isINR: true },
  { label: "P/L on Net Unhedged Exposure (INR)", key: "PlOnNetUnHedgedExposureInInr", isINR: true },
];

const denominations = [
  { label: "Absolute", value: "absolute", factor: 1 },
  { label: "In Thousands", value: "thousands", factor: 1000 },
  { label: "In Lakhs", value: "lakhs", factor: 100000 },
  { label: "In Millions", value: "millions", factor: 1000000 },
  { label: "In Crores", value: "crores", factor: 10000000 },
];

const formatValue = (val: any, isRate: boolean, factor: number = 1, isPercentage: boolean = false) => {
  if (val === undefined || val === null) return "—";
  const num = parseFloat(val);
  if (isNaN(num)) return val;
  if (num === 0) return "—";
  
  if (isRate) return num.toFixed(4);
  if (isPercentage) return (num * 100).toFixed(2) + "%";

  const converted = num / factor;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: factor === 1 ? 0 : 2,
    maximumFractionDigits: factor === 1 ? 0 : 2,
  }).format(converted);
};

const USDSummaryTable: React.FC<USDSummaryTableProps> = ({ data }) => {
  const bg = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue("teal.500", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const [denomination, setDenomination] = useState(denominations[0]);

  const columns = useMemo(() => {
    if (!data) return [];
    
    // Find first metric that is an object and has keys
    const firstObjMetric = Object.values(data).find(
      (v) => v !== null && typeof v === "object" && Object.keys(v).length > 0
    ) as any;

    if (!firstObjMetric) return [];

    const keys = Object.keys(firstObjMetric).filter(
      (col) => col !== "dueWithIn15Days" && col !== "overDueExposure"
    );

    // Sort: Months first, then total
    const months = keys.filter((k) => k !== "total");
    const hasTotal = keys.includes("total");

    return hasTotal ? [...months, "total"] : months;
  }, [data]);

  const formatColumnHeader = (col: string) => {
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
      <Flex 
        p={6} 
        borderBottom="1px solid" 
        borderColor={borderColor} 
        justify="space-between" 
        align="center"
        wrap="wrap"
        gap={4}
      >
        <Heading size="md" color={"teal.700"}>
        Summary Metrics
        </Heading>
        <ChakraSelect 
          w="200px" 
          size="sm" 
          rounded="lg"
          value={denomination.value} 
          onChange={(e) => {
            const selected = denominations.find(d => d.value === e.target.value);
            if (selected) setDenomination(selected);
          }}
        >
          {denominations.map(d => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </ChakraSelect>
      </Flex>

      <Box overflowX="auto" maxH={'80vh'} >
        <Table variant="simple" size="sm">
          <Thead bg={headerBg} position="sticky" top={0} zIndex={5}>
            <Tr>
              <Th
                position="sticky"
                left={0}
                color={'white'}
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
                <Th key={col} textAlign="right" py={4} whiteSpace="nowrap" color={'white'}>
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
                  _hover={{ bg:"teal.50" }}
                  bg={isHighlight ? "teal.100" : "transparent"}
                >
                  <Td
                    position="sticky"
                    left={0}
                    zIndex={1}
                    bg={isHighlight ? "teal.50" : bg}
                    fontWeight={metric.isTotal ? "bold" : "medium"}
                    color={metric.isTotal ? "teal.600" : "gray.600"}
                    borderRight="1px solid"
                    borderColor={borderColor}
                    whiteSpace="nowrap"
                  >
                    {metric.label}
                  </Td>
                  {columns.map((col) => {
                    let value;
                    if (metric.isINR) {
                      // For INR fields which are single numbers in the API
                      value = col === "total" ? data[metric.key as string] : undefined;
                    } else {
                      value = metricData[col];
                    }
                    
                    const numVal = parseFloat(value);
                    const color = !metric.isRate && !metric.isPercentage && numVal < 0 ? "red.500" : undefined;
                    
                    return (
                      <Td 
                        key={col} 
                        textAlign="right" 
                        fontWeight={metric.isTotal || metric.isINR ? "bold" : "normal"}
                        color={color}
                      >
                        {formatValue(value, (metric as any).isRate || false, denomination.factor, (metric as any).isPercentage || false)}
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
