import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import {
  BarController,
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

type SummaryData = Record<string, Record<string, unknown>>;

interface HedgingSummaryTableProps {
  data?: SummaryData | null;
  loading?: boolean;
  basis: "gross" | "net";
}

type ChartConfig = {
  title: string;
  gapKey: string;
  currentKey: string;
  prescribedKey: string;
};

const USE_DUMMY_DATA = true;

const grossMetrics = [
  { label: "Export Hedging Gap", key: "exportHedgingGap", group: "Export" },
  {
    label: "Export Current Hedging %",
    key: "exportCurrentHedging",
    group: "Export",
    percentage: true,
  },
  {
    label: "Export Prescribed Hedging % (RMP)",
    key: "exportPrescribedHedging%AsPerRMP",
    group: "Export",
    percentage: true,
  },
  { label: "Import Hedging Gap", key: "importHedgingGap", group: "Import" },
  {
    label: "Import Current Hedging %",
    key: "importCurrentHedging",
    group: "Import",
    percentage: true,
  },
  {
    label: "Import Prescribed Hedging % (RMP)",
    key: "importPrescribedHedging%AsPerRMP",
    group: "Import",
    percentage: true,
  },
];

const netMetrics = [
  { label: "Net Hedging Gap", key: "netHedgingGap", group: "Net" },
  {
    label: "Net Current Hedging %",
    key: "netCurrentHedging",
    group: "Net",
    percentage: true,
  },
  {
    label: "Net Prescribed Hedging % (RMP)",
    key: "netPrescribedHedging%AsPerRMP",
    group: "Net",
    percentage: true,
  },
];

const grossCharts: ChartConfig[] = [
  {
    title: "Monthwise Export Hedge Summary",
    gapKey: "exportHedgingGap",
    currentKey: "exportCurrentHedging",
    prescribedKey: "exportPrescribedHedging%AsPerRMP",
  },
  {
    title: "Monthwise Import Hedge Summary",
    gapKey: "importHedgingGap",
    currentKey: "importCurrentHedging",
    prescribedKey: "importPrescribedHedging%AsPerRMP",
  },
];

const netCharts: ChartConfig[] = [
  {
    title: "Monthwise Net Hedge Gap",
    gapKey: "netHedgingGap",
    currentKey: "netCurrentHedging",
    prescribedKey: "netPrescribedHedging%AsPerRMP",
  },
];

const EXCLUDED_COLUMNS = ["total", "dueWithIn15Days", "overDueExposure"];

const dummyGrossData: SummaryData = {
  exportHedgingGap: {
    "Oct 2026": 310000,
    "Nov 2026": 220000,
    "Dec 2026": 580000,
    "Jan 2027": 55000,
    "Feb 2027": 15000,
    "Mar 2027": 470000,
    total: 1650000,
  },
  exportCurrentHedging: {
    "Oct 2026": 0.33,
    "Nov 2026": 0.355,
    "Dec 2026": 0.28,
    "Jan 2027": 0.29,
    "Feb 2027": 0.295,
    "Mar 2027": 0.21,
    total: 0.3,
  },
  "exportPrescribedHedging%AsPerRMP": {
    "Oct 2026": 0.4,
    "Nov 2026": 0.4,
    "Dec 2026": 0.4,
    "Jan 2027": 0.3,
    "Feb 2027": 0.3,
    "Mar 2027": 0.3,
    total: 0.35,
  },
  importHedgingGap: {
    "Oct 2026": 150000,
    "Nov 2026": 90000,
    "Dec 2026": 300000,
    "Jan 2027": 40000,
    "Feb 2027": 10000,
    "Mar 2027": 200000,
    total: 790000,
  },
  importCurrentHedging: {
    "Oct 2026": 0.25,
    "Nov 2026": 0.3,
    "Dec 2026": 0.22,
    "Jan 2027": 0.26,
    "Feb 2027": 0.27,
    "Mar 2027": 0.18,
    total: 0.25,
  },
  "importPrescribedHedging%AsPerRMP": {
    "Oct 2026": 0.35,
    "Nov 2026": 0.3,
    "Dec 2026": 0.35,
    "Jan 2027": 0.28,
    "Feb 2027": 0.28,
    "Mar 2027": 0.28,
    total: 0.31,
  },
};

const dummyNetData: SummaryData = {
  netHedgingGap: {
    "Oct 2026": 200000,
    "Nov 2026": 150000,
    "Dec 2026": 400000,
    "Jan 2027": 50000,
    total: 800000,
  },
  netCurrentHedging: {
    "Oct 2026": 0.3,
    "Nov 2026": 0.33,
    "Dec 2026": 0.25,
    "Jan 2027": 0.28,
    total: 0.29,
  },
  "netPrescribedHedging%AsPerRMP": {
    "Oct 2026": 0.4,
    "Nov 2026": 0.4,
    "Dec 2026": 0.4,
    "Jan 2027": 0.3,
    total: 0.37,
  },
};

const toAmount = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const number = Number.parseFloat(String(value).replace(/,/g, ""));
  return Number.isFinite(number) ? number : null;
};

// Accepts 0.33 or "33%" from the API and returns a fraction.
const toFraction = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const stringValue = String(value);
  const number = Number.parseFloat(stringValue);
  if (!Number.isFinite(number)) return null;
  return stringValue.includes("%") ? number / 100 : number;
};

const formatAmount = (value: unknown): string => {
  const amount = toAmount(value);
  return amount === null ? "—" : amount.toLocaleString();
};

const formatPercentage = (value: unknown): string => {
  const fraction = toFraction(value);
  return fraction === null ? "—" : `${(fraction * 100).toFixed(2)}%`;
};

const getMonthColumns = (
  data: SummaryData,
  keys: string[]
): { months: string[]; hasTotal: boolean } => {
  const monthSet = new Set<string>();
  let hasTotal = false;

  keys.forEach((key) => {
    Object.keys(data?.[key] || {}).forEach((column) => {
      if (column === "total") hasTotal = true;
      else if (!EXCLUDED_COLUMNS.includes(column)) monthSet.add(column);
    });
  });

  return { months: Array.from(monthSet), hasTotal };
};

interface HedgeGapChartProps extends ChartConfig {
  data: SummaryData;
  months: string[];
}

const HedgeGapChart = ({
  title,
  data,
  months,
  gapKey,
  currentKey,
  prescribedKey,
}: HedgeGapChartProps) => {
  const [view, setView] = useState<"chart" | "table">("chart");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const chartData: ChartData<"bar" | "line", (number | null)[], string> = {
    labels: months,
    datasets: [
      {
        type: "bar",
        label: "Hedge Gap",
        data: months.map((month) => toAmount(data?.[gapKey]?.[month])),
        backgroundColor: "#1E9BD7",
        barThickness: 28,
        yAxisID: "y",
        order: 3,
      },
      {
        type: "line",
        label: "Current Hedging %",
        data: months.map((month) => toFraction(data?.[currentKey]?.[month])),
        borderColor: "#ED7D31",
        backgroundColor: "#ED7D31",
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.3,
        yAxisID: "y1",
        order: 1,
      },
      {
        type: "line",
        label: "Prescribed Hedging %",
        data: months.map((month) =>
          toFraction(data?.[prescribedKey]?.[month])
        ),
        borderColor: "#1E6B2E",
        backgroundColor: "#1E6B2E",
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.3,
        yAxisID: "y1",
        order: 2,
      },
    ],
  };

  const options: ChartOptions<"bar" | "line"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { position: "top" },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.parsed.y;
              if (value === null || value === undefined) return "";
              const formatted =
                context.dataset.yAxisID === "y1"
                  ? `${(value * 100).toFixed(2)}%`
                  : value.toLocaleString();
              return `${context.dataset.label}: ${formatted}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { maxRotation: 35, minRotation: 35, font: { size: 11 } },
        },
        y: {
          type: "linear",
          position: "left",
          beginAtZero: true,
          grid: { color: "#E2E8F0" },
          ticks: {
            font: { size: 11 },
            callback: (value) => Number(value).toLocaleString(),
          },
        },
        y1: {
          type: "linear",
          position: "right",
          beginAtZero: true,
          grid: { drawOnChartArea: false },
          ticks: {
            font: { size: 11 },
            callback: (value) => `${(Number(value) * 100).toFixed(0)}%`,
          },
        },
      },
    }),
    []
  );

  const tableView = (
    <TableContainer width="100%" overflowX="auto">
      <Table size="sm" variant="simple">
        <Thead>
          <Tr>
            <Th>Metric</Th>
            {months.map((month) => (
              <Th key={month} isNumeric whiteSpace="nowrap">
                {month}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td fontWeight="medium">Hedge Gap</Td>
            {months.map((month) => (
              <Td key={month} isNumeric whiteSpace="nowrap">
                {formatAmount(data?.[gapKey]?.[month])}
              </Td>
            ))}
          </Tr>
          <Tr>
            <Td fontWeight="medium">Current Hedging %</Td>
            {months.map((month) => (
              <Td key={month} isNumeric whiteSpace="nowrap">
                {formatPercentage(data?.[currentKey]?.[month])}
              </Td>
            ))}
          </Tr>
          <Tr>
            <Td fontWeight="medium">Prescribed Hedging %</Td>
            {months.map((month) => (
              <Td key={month} isNumeric whiteSpace="nowrap">
                {formatPercentage(data?.[prescribedKey]?.[month])}
              </Td>
            ))}
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );

  const chartView = (
    <Box h="360px" width="100%">
      <Chart type="bar" data={chartData} options={options} />
    </Box>
  );

  return (
    <Box bg="white" borderRadius="2xl" boxShadow="md" borderWidth={1} p="4">
      <HStack
        justify="space-between"
        align={{ base: "flex-start", sm: "center" }}
        mb="4"
        spacing={3}
        flexWrap="wrap"
      >
        <Text fontWeight="bold" color="gray.800">
          {title}
        </Text>
        <HStack spacing={2} flexShrink={0}>
          <Button
            size="sm"
            variant="outline"
            colorScheme="blue"
            onClick={() => setView((current) =>
              current === "chart" ? "table" : "chart"
            )}
          >
            {view === "chart" ? "View Table" : "View Chart"}
          </Button>
          <Button size="sm" variant="outline" onClick={onOpen}>
            Expand
          </Button>
        </HStack>
      </HStack>

      {view === "chart" ? chartView : tableView}

      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent m={{ base: 2, md: 6 }} borderRadius="xl">
          <ModalHeader pr="16">
            <HStack justify="space-between" flexWrap="wrap" spacing={3}>
              <Text>{title}</Text>
              <Button
                size="sm"
                variant="outline"
                colorScheme="blue"
                onClick={() => setView((current) =>
                  current === "chart" ? "table" : "chart"
                )}
              >
                {view === "chart" ? "View Table" : "View Chart"}
              </Button>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="6">
            {view === "chart" ? (
              <Box h={{ base: "70vh", md: "78vh" }} width="100%">
                <Chart type="bar" data={chartData} options={options} />
              </Box>
            ) : (
              tableView
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const HedgingSummaryTable = ({
  data,
  // loading = false,
  basis = "gross",
}: HedgingSummaryTableProps) => {
  const dummy = basis === "net" ? dummyNetData : dummyGrossData;
  const displayData: SummaryData = USE_DUMMY_DATA ? dummy : data ?? {};
  const metrics = basis === "net" ? netMetrics : grossMetrics;
  const charts = basis === "net" ? netCharts : grossCharts;

  const { months } = getMonthColumns(
    displayData,
    metrics.map((metric) => metric.key)
  );

  return (
    <Box>
      {months.length === 0 && !USE_DUMMY_DATA && (
        <Text color="gray.500" fontSize="sm" mb="3">
          No data available.
        </Text>
      )}

      <SimpleGrid columns={1} spacing="4" mb="4">
        {charts.map((chart) => (
          <HedgeGapChart
            key={chart.gapKey}
            title={chart.title}
            data={displayData}
            months={months}
            gapKey={chart.gapKey}
            currentKey={chart.currentKey}
            prescribedKey={chart.prescribedKey}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default HedgingSummaryTable;
