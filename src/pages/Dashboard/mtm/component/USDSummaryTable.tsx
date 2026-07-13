import { DownloadIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Select as ChakraSelect,
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
  useColorModeValue,
} from "@chakra-ui/react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import React, { useMemo, useState } from "react";

interface USDSummaryTableProps {
  data: any;
  loading: boolean;
}

const metrics = [
  { label: "Current Fwd Rate", key: "currentFwdrate", isRate: true },
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
  // { label: "Forecast", key: "forecast" },
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

const USDSummaryTable: React.FC<USDSummaryTableProps> = ({ data, loading }) => {
  const bg = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue("teal.500", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const [denomination, setDenomination] = useState(denominations[0]);

  const handleExportExcel = async () => {
    if (!data || !columns.length) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("USD Summary");

    // Define columns
    const excelColumns = [
      { header: "Metric", key: "metric", width: 40 },
      ...columns.map(col => ({ header: formatColumnHeader(col), key: col, width: 20 }))
    ];
    worksheet.columns = excelColumns;

    // Style Header Row
    const headerRow = worksheet.getRow(1);
    headerRow.height = 30;
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF319795" } // teal.500
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };
    });

    // Add Data Rows
    metrics.forEach((metric) => {
      if (metric.divider) {
        const row = worksheet.addRow({});
        row.height = 10;
        row.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF7FAFC" } // gray.50
          };
        });
        return;
      }

      const metricData = data[metric.key as string] || {};
      const rowValues: any = { metric: metric.label };

      columns.forEach((col) => {
        let value;
        if (metric.isINR) {
          value = col === "total" ? data[metric.key as string] : undefined;
        } else {
          value = metricData[col];
        }

        if (value === undefined || value === null || value === 0) {
          rowValues[col] = "-";
        } else {
          const num = parseFloat(value);
          if (isNaN(num)) {
            rowValues[col] = value;
          } else {
            if (metric.isPercentage) {
              rowValues[col] = num;
            } else if (metric.isRate) {
              rowValues[col] = num;
            } else {
              rowValues[col] = num / denomination.factor;
            }
          }
        }
      });

      const row = worksheet.addRow(rowValues);
      row.height = 25;

      const isSticky = metric.key === "currentFwdrate";
      const isHighlight = metric.highlight;
      const isTotal = metric.isTotal;

      row.eachCell((cell, colNumber) => {
        // Basic alignment
        cell.alignment = { vertical: "middle", horizontal: colNumber === 1 ? "left" : "right" };

        // Borders
        cell.border = {
          top: { style: "thin", color: { argb: "FFE2E8F0" } },
          left: { style: "thin", color: { argb: "FFE2E8F0" } },
          bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
          right: { style: "thin", color: { argb: "FFE2E8F0" } }
        };

        // Number Formatting
        if (colNumber > 1 && typeof cell.value === "number") {
          if (metric.isPercentage) {
            cell.numFmt = "0.00%";
          } else if (metric.isRate) {
            cell.numFmt = "0.0000";
          } else {
            cell.numFmt = "#,##0.00";
          }
        }

        // Font and Fill based on metric type
        if (isSticky) {
          cell.font = { bold: true, color: { argb: "FF2C7A7B" } };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE6FFFA" }
          };
        } else if (isHighlight) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFB2F5EA" }
          };
        } else if (isTotal) {
          cell.font = { bold: true };
          if (colNumber === 1) cell.font.color = { argb: "FF319795" };
        }
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, `Summary_${denomination.label.replace(" ", "_")}.xlsx`);
  };

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

  if (loading && (!data || Object.keys(data).length === 0)) {
    return (
      <Flex direction="column" align="center" justify="center" py={40} bg={bg} rounded="xl" shadow="sm" border="1px solid" borderColor={borderColor}>
        <Spinner size="xl" color="teal.500" thickness="4px" />
        <Text mt={4} color="gray.500" fontWeight="medium">Loading summary data...</Text>
      </Flex>
    );
  }

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
        <Flex align="center" gap={3}>
          <ChakraSelect
            w="180px"
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
          <Button
            leftIcon={<DownloadIcon />}
            size="sm"
            colorScheme="teal"
            variant="ghost"
            onClick={handleExportExcel}
            _hover={{ bg: "teal.50" }}
          >
            Export
          </Button>
        </Flex>
      </Flex>

      <Box overflowX="auto" maxH={'80vh'} position="relative">
        {loading && data && Object.keys(data).length > 0 && (
          <Center
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="whiteAlpha.700"
            zIndex={20}
            backdropFilter="blur(2px)"
          >
            <Spinner size="xl" color="teal.500" thickness="4px" />
          </Center>
        )}
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
              const isSticky = (metric as any).key === "currentFwdrate";

              return (
                <Tr
                  key={metric.key}
                  _hover={{ bg:"teal.50" }}
                  bg={isSticky ? "teal.50" : (isHighlight ? "teal.100" : "transparent")}
                  position={isSticky ? "sticky" : "relative"}
                  top={isSticky ? "48px" : "auto"}
                  zIndex={isSticky ? 4 : "auto"}
                >
                  <Td
                    position="sticky"
                    left={0}
                    zIndex={isSticky ? 4 : 1}
                    top={isSticky ? "48px" : "auto"}
                    bg={isSticky ? "teal.50" : (isHighlight ? "teal.50" : bg)}
                    fontWeight={isSticky || metric.isTotal ? "bold" : "medium"}
                    color={isSticky || metric.isTotal ? "teal.600" : "gray.600"}
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
                        fontWeight={isSticky || metric.isTotal || metric.isINR ? "bold" : "normal"}
                        color={color}
                        position={isSticky ? "sticky" : "relative"}
                        top={isSticky ? "48px" : "auto"}
                        zIndex={isSticky ? 4 : "auto"}
                        bg={isSticky ? "teal.50" : "transparent"}
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
