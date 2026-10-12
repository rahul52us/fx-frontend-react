import {
  Box,
  SimpleGrid,
  Text
} from "@chakra-ui/react";
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
  Tooltip
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

/* -------------------------------------------------------------------------- */
/*  CONFIG                                                                    */
/* -------------------------------------------------------------------------- */

// Set to false (or delete the dummy blocks below) once the API is wired up.
const USE_DUMMY_DATA = true;

const grossMetrics = [
  { label: "Export Hedging Gap", key: "exportHedgingGap", group: "Export" },
  {
    label: "Export Current Hedging %",
    key: "exportCurrentHedging",
    group: "Export",
    percentage: true
  },
  {
    label: "Export Prescribed Hedging % (RMP)",
    key: "exportPrescribedHedging%AsPerRMP",
    group: "Export",
    percentage: true
  },
  { label: "Import Hedging Gap", key: "importHedgingGap", group: "Import" },
  {
    label: "Import Current Hedging %",
    key: "importCurrentHedging",
    group: "Import",
    percentage: true
  },
  {
    label: "Import Prescribed Hedging % (RMP)",
    key: "importPrescribedHedging%AsPerRMP",
    group: "Import",
    percentage: true
  }
];

const netMetrics = [
  { label: "Net Hedging Gap", key: "netHedgingGap", group: "Net" },
  {
    label: "Net Current Hedging %",
    key: "netCurrentHedging",
    group: "Net",
    percentage: true
  },
  {
    label: "Net Prescribed Hedging % (RMP)",
    key: "netPrescribedHedging%AsPerRMP",
    group: "Net",
    percentage: true
  }
];

// Each chart maps to API keys. Bars = gap (amount), lines = percentages.
const grossCharts = [
  {
    title: "Monthwise Export Hedge Summary",
    gapKey: "exportHedgingGap",
    currentKey: "exportCurrentHedging",
    prescribedKey: "exportPrescribedHedging%AsPerRMP"
  },
  {
    title: "Monthwise Import Hedge Summary",
    gapKey: "importHedgingGap",
    currentKey: "importCurrentHedging",
    prescribedKey: "importPrescribedHedging%AsPerRMP"
  }
];

const netCharts = [
  {
    title: "Monthwise Net Hedge Gap",
    gapKey: "netHedgingGap",
    currentKey: "netCurrentHedging",
    prescribedKey: "netPrescribedHedging%AsPerRMP"
  }
];

const EXCLUDED_COLUMNS = ["total", "dueWithIn15Days", "overDueExposure"];

/* -------------------------------------------------------------------------- */
/*  DUMMY DATA (percentages are stored as fractions: 0.33 = 33%)              */
/* -------------------------------------------------------------------------- */

const dummyGrossData: SummaryData = {
  exportHedgingGap: {
    "Oct 2026": 310000,
    "Nov 2026": 220000,
    "Dec 2026": 580000,
    "Jan 2027": 55000,
    "Feb 2027": 15000,
    "Mar 2027": 470000,
    total: 1650000
  },
  exportCurrentHedging: {
    "Oct 2026": 0.33,
    "Nov 2026": 0.355,
    "Dec 2026": 0.28,
    "Jan 2027": 0.29,
    "Feb 2027": 0.295,
    "Mar 2027": 0.21,
    total: 0.3
  },
  "exportPrescribedHedging%AsPerRMP": {
    "Oct 2026": 0.4,
    "Nov 2026": 0.4,
    "Dec 2026": 0.4,
    "Jan 2027": 0.3,
    "Feb 2027": 0.3,
    "Mar 2027": 0.3,
    total: 0.35
  },
  importHedgingGap: {
    "Oct 2026": 150000,
    "Nov 2026": 90000,
    "Dec 2026": 300000,
    "Jan 2027": 40000,
    "Feb 2027": 10000,
    "Mar 2027": 200000,
    total: 790000
  },
  importCurrentHedging: {
    "Oct 2026": 0.25,
    "Nov 2026": 0.3,
    "Dec 2026": 0.22,
    "Jan 2027": 0.26,
    "Feb 2027": 0.27,
    "Mar 2027": 0.18,
    total: 0.25
  },
  "importPrescribedHedging%AsPerRMP": {
    "Oct 2026": 0.35,
    "Nov 2026": 0.30,
    "Dec 2026": 0.35,
    "Jan 2027": 0.28,
    "Feb 2027": 0.28,
    "Mar 2027": 0.28,
    total: 0.31
  }
};

const dummyNetData: SummaryData = {
  netHedgingGap: {
    "Oct 2026": 200000,
    "Nov 2026": 150000,
    "Dec 2026": 400000,
    "Jan 2027": 50000,
    total: 800000
  },
  netCurrentHedging: {
    "Oct 2026": 0.3,
    "Nov 2026": 0.33,
    "Dec 2026": 0.25,
    "Jan 2027": 0.28,
    total: 0.29
  },
  "netPrescribedHedging%AsPerRMP": {
    "Oct 2026": 0.4,
    "Nov 2026": 0.4,
    "Dec 2026": 0.4,
    "Jan 2027": 0.3,
    total: 0.37
  }
};


// Amount -> number (or null when missing)
const toAmount = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const n = Number.parseFloat(String(value).replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
};

// Percentage -> fraction (0.33). Accepts 0.33 or "33%" from the API.
const toFraction = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const str = String(value);
  const n = Number.parseFloat(str);
  if (!Number.isFinite(n)) return null;
  return str.includes("%") ? n / 100 : n;
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

/* -------------------------------------------------------------------------- */
/*  CHART                                                                     */
/* -------------------------------------------------------------------------- */

interface HedgeGapChartProps {
  title: string;
  data: SummaryData;
  months: string[];
  gapKey: string;
  currentKey: string;
  prescribedKey: string;
}

const HedgeGapChart = ({
  title,
  data,
  months,
  gapKey,
  currentKey,
  prescribedKey
}: HedgeGapChartProps) => {
  const chartData: ChartData<"bar" | "line", (number | null)[], string> = {
    labels: months,
    datasets: [
      {
        type: "bar",
        label: "Hedge Gap",
        data: months.map((m) => toAmount(data?.[gapKey]?.[m])),
        backgroundColor: "#1E9BD7",
        barThickness: 28,
        yAxisID: "y", // left axis (amount)
        order: 3
      },
      {
        type: "line",
        label: "Current Hedging %",
        data: months.map((m) => toFraction(data?.[currentKey]?.[m])),
        borderColor: "#ED7D31",
        backgroundColor: "#ED7D31",
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.3,
        yAxisID: "y1", // right axis (percentage)
        order: 1
      },
      {
        type: "line",
        label: "Prescribed Hedging %",
        data: months.map((m) => toFraction(data?.[prescribedKey]?.[m])),
        borderColor: "#1E6B2E",
        backgroundColor: "#1E6B2E",
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.3,
        yAxisID: "y1", // right axis (percentage)
        order: 2
      }
    ]
  };

  const options: ChartOptions<"bar" | "line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const value = ctx.parsed.y;
            if (value === null || value === undefined) return "";
            const formatted =
              ctx.dataset.yAxisID === "y1"
                ? `${(value * 100).toFixed(2)}%`
                : value.toLocaleString();
            return `${ctx.dataset.label}: ${formatted}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { maxRotation: 35, minRotation: 35, font: { size: 11 } }
      },
      // LEFT: amount (Hedge Gap bars)
      y: {
        type: "linear",
        position: "left",
        beginAtZero: true,
        grid: { color: "#E2E8F0" },
        ticks: {
          font: { size: 11 },
          callback: (value) => Number(value).toLocaleString()
        }
      },
      // RIGHT: percentage (lines)
      y1: {
        type: "linear",
        position: "right",
        beginAtZero: true,
        grid: { drawOnChartArea: false },
        ticks: {
          font: { size: 11 },
          callback: (value) => `${(Number(value) * 100).toFixed(0)}%`
        }
      }
    }
  };

  return (
    <Box bg="white" borderRadius="2xl" boxShadow="md" borderWidth={1} p="4">
      <Text fontWeight="bold" color="gray.800" mb="2">
        {title}
      </Text>

      <Box h="360px">
        <Chart type="bar" data={chartData} options={options} />
      </Box>
    </Box>
  );
};

/* -------------------------------------------------------------------------- */
/*  MAIN COMPONENT                                                            */
/* -------------------------------------------------------------------------- */

const HedgingSummaryTable = ({
  data,
  // loading = false,
  basis = "gross"
}: HedgingSummaryTableProps) => {
  // Real API data wins. Dummy data is only a fallback and can be removed
  // by setting USE_DUMMY_DATA = false (or deleting the dummy blocks).
  // const dummy = basis === "net" ? dummyNetData : dummyGrossData;
  const dummy = basis === "net" ? dummyNetData : dummyGrossData;
  const displayData: SummaryData = USE_DUMMY_DATA ? dummy : data ?? {};
  // const displayData: SummaryData = data ?? (USE_DUMMY_DATA ? dummy : {});

  const metrics = basis === "net" ? netMetrics : grossMetrics;
  const charts = basis === "net" ? netCharts : grossCharts;

  const { months } = getMonthColumns(
    displayData,
    metrics.map((m) => m.key)
  );

  return (

    <Box>
{/* ------------------------------ CHARTS ------------------------------ */}
{months.length === 0 && !USE_DUMMY_DATA && (
<Text color="gray.500" fontSize="sm" mb="3">
No data available.
</Text>
)}

  {/* Always render charts, even when there is no API data */}
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
  //   <Box>

      
  //     {months.length > 0 && (
  //       <SimpleGrid columns={1} spacing="4" mb="4">
  //         {charts.map((chart) => (
  //           <HedgeGapChart
  //             key={chart.gapKey}
  //             title={chart.title}
  //             data={displayData}
  //             months={months}
  //             gapKey={chart.gapKey}
  //             currentKey={chart.currentKey}
  //             prescribedKey={chart.prescribedKey}
  //           />
  //         ))}
  //       </SimpleGrid>
  //     )}
  //   </Box>
  // );
};

export default HedgingSummaryTable;