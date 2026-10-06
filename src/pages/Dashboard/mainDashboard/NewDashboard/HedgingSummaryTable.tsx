import {
    Box,
    Center,
    Spinner,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr
} from "@chakra-ui/react";

interface HedgingSummaryTableProps {
  data?: Record<string, Record<string, unknown>> | null;
  loading: boolean;
  basis: "gross" | "net";
}

const grossMetrics = [
  { label: "Export Hedging Gap", key: "exportHedgingGap", group: "Export" },
  { label: "Export Current Hedging", key: "exportCurrentHedging", group: "Export" },
  {
    label: "Export Prescribed Hedging % (RMP)",
    key: "exportPrescribedHedging%AsPerRMP",
    group: "Export",
    percentage: true
  },
  { label: "Import Hedging Gap", key: "importHedgingGap", group: "Import" },
  { label: "Import Current Hedging", key: "importCurrentHedging", group: "Import" },
  {
    label: "Import Prescribed Hedging % (RMP)",
    key: "importPrescribedHedging%AsPerRMP",
    group: "Import",
    percentage: true
  }
];

const netMetrics = [
  { label: "Net Hedging Gap", key: "netHedgingGap", group: "Net" },
  { label: "Net Current Hedging", key: "netCurrentHedging", group: "Net" },
  {
    label: "Net Prescribed Hedging % (RMP)",
    key: "netPrescribedHedging%AsPerRMP",
    group: "Net",
    percentage: true
  }
];

const formatValue = (value: unknown, percentage?: boolean) => {
  if (value === null || value === undefined || value === "") return "—";

  const numericValue = Number.parseFloat(String(value));
  if (!Number.isFinite(numericValue)) return String(value);
  if (percentage) {
    return String(value).includes("%")
      ? String(value)
      : `${(numericValue * 100).toFixed(2)}%`;
  }

  return numericValue.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

const HedgingSummaryTable = ({ data, loading, basis }: HedgingSummaryTableProps) => {
  const metrics = basis === "net" ? netMetrics : grossMetrics;
  const monthSet = new Set<string>();
  let hasTotal = false;

  metrics.forEach(({ key }) => {
    Object.keys(data?.[key] || {}).forEach((column) => {
      if (column === "total") hasTotal = true;
      else if (column !== "dueWithIn15Days" && column !== "overDueExposure") monthSet.add(column);
    });
  });

  const columns = [...Array.from(monthSet), ...(hasTotal ? ["total"] : [])];
  const headerBg = "teal.600";

  return (
    <Box bg="white" borderRadius="xl" boxShadow="sm" overflow="hidden">
      <Box px="5" py="4" borderBottomWidth="1px" borderColor="gray.200">
        <Text fontWeight="semibold" color="gray.800">Monthly Hedging Summary</Text>
        <Text fontSize="xs" color="gray.500" mt="1">
          {basis === "net" ? "Net hedging metrics" : "Export and import hedging metrics"}
        </Text>
      </Box>

      {loading && columns.length === 0 ? (
        <Center py="12"><Spinner color="teal.500" /></Center>
      ) : columns.length === 0 ? (
        <Center py="10">
          <Text fontSize="sm" color="gray.500">No monthly hedging summary available.</Text>
        </Center>
      ) : (
        <Box overflowX="auto" maxH="480px" position="relative">
          <Table size="sm" variant="simple">
            <Thead bg={headerBg} position="sticky" top={0} zIndex={2}>
              <Tr>
                <Th
                  position="sticky"
                  left={0}
                  zIndex={3}
                  bg={headerBg}
                  color="white"
                  minW="250px"
                  py="3"
                >
                  Metric
                </Th>
                {columns.map((column) => (
                  <Th key={column} color="white" textAlign="right" whiteSpace="nowrap" minW="105px">
                    {column === "total" ? "Total" : column}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {metrics.map((metric, index) => {
                const isNewGroup = index > 0 && metrics[index - 1].group !== metric.group;
                return (
                  <Tr
                    key={metric.key}
                    bg={metric.percentage ? "teal.50" : "white"}
                    borderTop={isNewGroup ? "2px solid" : undefined}
                    borderColor="gray.200"
                    _hover={{ bg: "gray.50" }}
                  >
                    <Td
                      position="sticky"
                      left={0}
                      bg={metric.percentage ? "teal.50" : "white"}
                      fontWeight="medium"
                      color="gray.700"
                      whiteSpace="nowrap"
                    >
                      {metric.label}
                    </Td>
                    {columns.map((column) => (
                      <Td key={column} textAlign="right" whiteSpace="nowrap">
                        {formatValue(data?.[metric.key]?.[column], metric.percentage)}
                      </Td>
                    ))}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  );
};

export default HedgingSummaryTable;