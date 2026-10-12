import { Badge, Box, Flex, HStack, Skeleton, Text, VStack } from "@chakra-ui/react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export interface MonthlyUnhedgedData {
  unhedgedAmount: number;
  weightedAvgRate: number;
  currentFwdrate: number;
  difference?: number;
}

export interface UnhedgedChartData {
  policyType: "gross" | "net";
  months: string[];
  export?: Record<string, MonthlyUnhedgedData>;
  import?: Record<string, MonthlyUnhedgedData>;
  net?: Record<string, MonthlyUnhedgedData>;
}

export interface UnhedgedExposureChartProps {
  data?: UnhedgedChartData | null;
  loading?: boolean;
  isDummyData?: boolean;
}

/* ------------------------------------------------------------------ */
/* Demo data: realistic USD/INR levels, mix of gains and losses        */
/* ------------------------------------------------------------------ */
const dummyGrossChartData: UnhedgedChartData = {
  policyType: "gross",
  months: ["Nov 2026", "Dec 2026", "Jan 2027", "Feb 2027", "Mar 2027", "Apr 2027", "May 2027", "Jun 2027"],
  export: {
    "Nov 2026": { unhedgedAmount: 1250000, weightedAvgRate: 86.45, currentFwdrate: 88.1, difference: 320000 },
    "Dec 2026": { unhedgedAmount: 980000, weightedAvgRate: 88.6, currentFwdrate: 88.35, difference: -125000 },
    "Jan 2027": { unhedgedAmount: 1450000, weightedAvgRate: 86.9, currentFwdrate: 88.6, difference: 410000 },
    "Feb 2027": { unhedgedAmount: 1100000, weightedAvgRate: 88.9, currentFwdrate: 88.85, difference: -80000 },
    "Mar 2027": { unhedgedAmount: 1300000, weightedAvgRate: 87.4, currentFwdrate: 89.1, difference: 270000 },
    "Apr 2027": { unhedgedAmount: 900000, weightedAvgRate: 89.5, currentFwdrate: 89.35, difference: -150000 },
    "May 2027": { unhedgedAmount: 1180000, weightedAvgRate: 87.8, currentFwdrate: 89.6, difference: 355000 },
    "Jun 2027": { unhedgedAmount: 1020000, weightedAvgRate: 90.1, currentFwdrate: 89.85, difference: -95000 }
  },
  import: {
    "Nov 2026": { unhedgedAmount: 450000, weightedAvgRate: 88.3, currentFwdrate: 88.1, difference: -95000 },
    "Dec 2026": { unhedgedAmount: 300000, weightedAvgRate: 87.8, currentFwdrate: 88.35, difference: 65000 },
    "Jan 2027": { unhedgedAmount: 600000, weightedAvgRate: 88.9, currentFwdrate: 88.6, difference: -170000 },
    "Feb 2027": { unhedgedAmount: 500000, weightedAvgRate: 88.4, currentFwdrate: 88.85, difference: 90000 },
    "Mar 2027": { unhedgedAmount: 700000, weightedAvgRate: 89.3, currentFwdrate: 89.1, difference: -110000 },
    "Apr 2027": { unhedgedAmount: 400000, weightedAvgRate: 88.7, currentFwdrate: 89.35, difference: 75000 },
    "May 2027": { unhedgedAmount: 550000, weightedAvgRate: 89.8, currentFwdrate: 89.6, difference: -130000 },
    "Jun 2027": { unhedgedAmount: 350000, weightedAvgRate: 89.2, currentFwdrate: 89.85, difference: 60000 }
  }
};

const safeNumber = (val: unknown): number => {
  if (val === null || val === undefined || val === "") return 0;
  const num = typeof val === "number" ? val : Number(val);
  return Number.isFinite(num) ? num : 0;
};

/* ------------------------------------------------------------------ */
/* Data normalisation (logic unchanged)                                */
/* ------------------------------------------------------------------ */
export const normalizeUnhedgedData = (
  chartData: any,
  usdSummaryData: any,
  fallbackBasis: "gross" | "net" = "gross"
): UnhedgedChartData => {
  const rawPolicy = chartData?.unhedgedData?.policyType;
  const policyType: "gross" | "net" =
    typeof rawPolicy === "string" &&
    (rawPolicy.toLowerCase() === "gross" || rawPolicy.toLowerCase() === "net")
      ? (rawPolicy.toLowerCase() as "gross" | "net")
      : fallbackBasis === "net"
      ? "net"
      : "gross";

  if (policyType === "gross") {
    const exportData = chartData?.unhedgedData?.export || {};
    const importData = chartData?.unhedgedData?.import || {};

    const exportMonths = Object.keys(exportData);
    const importMonths = Object.keys(importData);
    const months = Array.from(new Set([...exportMonths, ...importMonths]));

    if (months.length === 0) {
      return {
        policyType: "gross",
        months: [],
        export: {},
        import: {}
      };
    }

    const exportMap: Record<string, MonthlyUnhedgedData> = {};
    const importMap: Record<string, MonthlyUnhedgedData> = {};

    months.forEach((month) => {
      const exp = exportData[month];
      exportMap[month] = {
        unhedgedAmount: safeNumber(exp?.unhedgedAmount),
        weightedAvgRate: safeNumber(exp?.weightedAvgRate),
        currentFwdrate: safeNumber(exp?.currentFwdrate),
        difference: safeNumber(exp?.difference)
      };

      const imp = importData[month];
      importMap[month] = {
        unhedgedAmount: safeNumber(imp?.unhedgedAmount),
        weightedAvgRate: safeNumber(imp?.weightedAvgRate),
        currentFwdrate: safeNumber(imp?.currentFwdrate),
        difference: safeNumber(imp?.difference)
      };
    });

    return {
      policyType: "gross",
      months,
      export: exportMap,
      import: importMap
    };
  }

  const netExposure = usdSummaryData?.netUnhedgeExposure || {};
  const breakevenRates = usdSummaryData?.breakevenRatenetUnhedgeExposure || {};
  const currentForwardRates = usdSummaryData?.currentFwdrate || {};

  const months = Array.from(
    new Set([
      ...Object.keys(netExposure),
      ...Object.keys(breakevenRates),
      ...Object.keys(currentForwardRates)
    ])
  );

  if (months.length === 0) {
    return {
      policyType: "net",
      months: [],
      net: {}
    };
  }

  const netMap: Record<string, MonthlyUnhedgedData> = {};

  months.forEach((month) => {
    netMap[month] = {
      unhedgedAmount: safeNumber(netExposure[month]),
      weightedAvgRate: safeNumber(breakevenRates[month]),
      currentFwdrate: safeNumber(currentForwardRates[month])
    };
  });

  return {
    policyType: "net",
    months,
    net: netMap
  };
};

/* ------------------------------------------------------------------ */
/* Visual tokens                                                       */
/* ------------------------------------------------------------------ */
const C = {
  text: "#1A202C",
  muted: "#718096",
  grid: "#EDF2F7",
  zero: "#4A5568",
  // Each bar field keeps ONE colour; negative values use a lighter shade of it
  exportBar: "#2F855A",
  exportBarNeg: "#9AE6B4",
  importBar: "#3182CE",
  importBarNeg: "#90CDF4",
  netBar: "#6B46C1",
  netBarNeg: "#D6BCFA",
  exportLine: "#6B46C1",
  importLine: "#DD6B20",
  netLine: "#2F855A",
  netLine2: "#DD6B20"
};

const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const formatCompact = (v: number) => (v === 0 ? "0" : compact.format(v));
const formatSigned = (v: number) => `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(v).toLocaleString()}`;

/* Small legend marker used in the "how to read" strip */
const Swatch = ({ color, tint, dashed, line }: { color: string; tint?: string; dashed?: boolean; line?: boolean }) =>
  line ? (
    <Box
      as="span"
      display="inline-block"
      w="18px"
      h="0"
      borderTopWidth="2px"
      borderTopStyle={dashed ? "dashed" : "solid"}
      borderTopColor={color}
      verticalAlign="middle"
    />
  ) : (
    <Box
      as="span"
      display="inline-block"
      w="10px"
      h="10px"
      borderRadius="3px"
      bg={tint || color}
      borderWidth="2px"
      borderColor={color}
      verticalAlign="middle"
    />
  );

const HintItem = ({ children }: { children: React.ReactNode }) => (
  <HStack spacing="2" fontSize="xs" color="gray.600" flexWrap="wrap">
    {children}
  </HStack>
);

const UnhedgedExposureChart = ({
  data,
  loading = false,
  isDummyData = true
}: UnhedgedExposureChartProps) => {
  const resolvedData = isDummyData ? dummyGrossChartData : data;
  const chartDataReady = Boolean(resolvedData?.months?.length);

  if (loading) {
    return (
      <Box p="6" borderRadius="xl" bg="white" borderWidth="1px" borderColor="gray.100">
        <Flex justify="space-between" align="center" mb="4">
          <VStack align="start" spacing="2">
            <Skeleton height="20px" width="220px" borderRadius="md" />
            <Skeleton height="14px" width="160px" borderRadius="md" />
          </VStack>
          <Skeleton height="24px" width="70px" borderRadius="full" />
        </Flex>
        <Skeleton height="320px" borderRadius="lg" />
      </Box>
    );
  }

  const months = chartDataReady ? resolvedData!.months : [];
  const isGross = resolvedData?.policyType === "gross";

  /* Shared line styling: solid = weighted avg, dashed = current forward */
  const lineBase = {
    type: "line" as const,
    yAxisID: "y1",
    borderWidth: 2.5,
    pointRadius: 4,
    pointHoverRadius: 6,
    pointBorderWidth: 2,
    tension: 0.25,
    order: 1
  };
  const solidLine = (color: string) => ({
    ...lineBase,
    legendColor: color,
    borderColor: color,
    backgroundColor: color,
    pointBackgroundColor: color,
    pointBorderColor: "#fff"
  });
  const dashedLine = (color: string) => ({
    ...lineBase,
    legendColor: color,
    borderColor: color,
    backgroundColor: color,
    borderDash: [6, 5],
    pointBackgroundColor: "#fff",
    pointBorderColor: color
  });

  const chartData: any = {
    labels: months,
    datasets: isGross
      ? [
          {
            // Export bars: green. Darker = positive, lighter = negative
            type: "bar" as const,
            label: "Export Difference",
            data: months.map((m) => resolvedData?.export?.[m]?.difference ?? 0),
            yAxisID: "y",
            legendColor: C.exportBar,
            legendFillNeg: C.exportBarNeg,
            backgroundColor: (context: any) => (context.raw < 0 ? C.exportBarNeg : C.exportBar),
            borderColor: C.exportBar,
            borderWidth: 2,
            borderRadius: 6,
            borderSkipped: false,
            barPercentage: 0.9,
            categoryPercentage: 0.62,
            order: 2
          },
          {
            // Import bars: blue. Darker = positive, lighter = negative
            type: "bar" as const,
            label: "Import Difference",
            data: months.map((m) => resolvedData?.import?.[m]?.difference ?? 0),
            yAxisID: "y",
            legendColor: C.importBar,
            legendFillNeg: C.importBarNeg,
            backgroundColor: (context: any) => (context.raw < 0 ? C.importBarNeg : C.importBar),
            borderColor: C.importBar,
            borderWidth: 2,
            borderRadius: 6,
            borderSkipped: false,
            barPercentage: 0.9,
            categoryPercentage: 0.62,
            order: 2
          },
          {
            ...solidLine(C.exportLine),
            label: "Export Wtd Avg Rate",
            data: months.map((m) => resolvedData?.export?.[m]?.weightedAvgRate ?? 0)
          },
          {
            ...dashedLine(C.exportLine),
            label: "Export Current Fwd Rate",
            data: months.map((m) => resolvedData?.export?.[m]?.currentFwdrate ?? 0)
          },
          {
            ...solidLine(C.importLine),
            label: "Import Wtd Avg Rate",
            data: months.map((m) => resolvedData?.import?.[m]?.weightedAvgRate ?? 0)
          },
          {
            ...dashedLine(C.importLine),
            label: "Import Current Fwd Rate",
            data: months.map((m) => resolvedData?.import?.[m]?.currentFwdrate ?? 0)
          }
        ]
      : [
          {
            type: "bar" as const,
            label: "Net Unhedged Amount",
            data: months.map((m) => resolvedData?.net?.[m]?.unhedgedAmount ?? 0),
            yAxisID: "y",
            legendColor: C.netBar,
            legendFillNeg: C.netBarNeg,
            backgroundColor: (context: any) => (context.raw < 0 ? C.netBarNeg : C.netBar),
            borderColor: C.netBar,
            borderWidth: 2,
            borderRadius: 6,
            borderSkipped: false,
            barPercentage: 0.9,
            categoryPercentage: 0.5,
            order: 2
          },
          {
            ...solidLine(C.netLine),
            label: "Breakeven / Wtd Avg Rate",
            data: months.map((m) => resolvedData?.net?.[m]?.weightedAvgRate ?? 0)
          },
          {
            ...dashedLine(C.netLine2),
            label: "Current Forward Rate",
            data: months.map((m) => resolvedData?.net?.[m]?.currentFwdrate ?? 0)
          }
        ]
  };

  /* Tight right-axis range so the rate lines stay readable above the bars */
  const rateValues: number[] = chartData.datasets
    .filter((d: any) => d.yAxisID === "y1")
    .flatMap((d: any) => d.data as number[])
    .filter((v: number) => Number.isFinite(v) && v !== 0);
  const rateMin = rateValues.length ? Math.min(...rateValues) : undefined;
  const rateMax = rateValues.length ? Math.max(...rateValues) : undefined;
  const ratePad = rateMin !== undefined && rateMax !== undefined ? Math.max((rateMax - rateMin) * 0.25, 0.3) : 0;

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 4, right: 4 } },
    interaction: { mode: "index", intersect: false },
    animation: { duration: 400 },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          boxHeight: 10,
          padding: 16,
          color: C.text,
          font: { size: 12 },
          // Legend swatches follow the series colour (bar colours are per-bar functions)
          generateLabels: (chart: any) => {
            const base = ChartJS.defaults.plugins.legend.labels.generateLabels(chart);
            return base.map((item: any) => {
              const ds: any = chart.data.datasets[item.datasetIndex];
              const isBar = ds.type === "bar";
              return {
                ...item,
                pointStyle: isBar ? "rectRounded" : "line",
                fillStyle: ds.legendColor,
                strokeStyle: ds.legendColor,
                lineWidth: isBar ? 2 : 2.5,
                lineDash: isBar ? [] : ds.borderDash || []
              };
            });
          }
        }
      },
      tooltip: {
        backgroundColor: "#fff",
        borderColor: "#E2E8F0",
        borderWidth: 1,
        titleColor: C.text,
        bodyColor: C.text,
        titleFont: { size: 13, weight: "600" },
        padding: 12,
        boxPadding: 6,
        cornerRadius: 8,
        usePointStyle: true,
        itemSort: (a: any, b: any) => a.datasetIndex - b.datasetIndex,
        callbacks: {
          labelColor: (context: any) => {
            const ds: any = context.dataset;
            const isBar = ds.type === "bar";
            const neg = isBar && context.raw < 0;
            return {
              borderColor: ds.legendColor,
              backgroundColor: neg ? ds.legendFillNeg : ds.legendColor,
              borderWidth: 2,
              borderRadius: 3
            };
          },
          label: (context: any) => {
            const label = context.dataset.label || "";
            const val = Number(context.raw);
            if (context.dataset.yAxisID === "y1") {
              return `${label}: ${val.toFixed(4)}`;
            }
            return `${label}: ${formatSigned(val)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        border: { color: "#CBD5E0" },
        ticks: {
          color: C.muted,
          font: { size: 12 },
          // "Nov 2026" -> two lines ("Nov" / "2026") so 8 months fit cleanly
          callback: function (this: any, value: any) {
            return String(this.getLabelForValue(value)).split(" ");
          }
        }
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        grace: "15%",
        title: {
          display: true,
          text: isGross ? "Unhedged difference" : "Net unhedged amount",
          color: C.muted,
          font: { size: 12, weight: "500" }
        },
        ticks: { color: C.muted, font: { size: 11 }, callback: (v: any) => formatCompact(Number(v)) },
        border: { display: false },
        // Make the zero baseline stand out so negative bars read clearly
        grid: {
          color: (ctx: any) => (ctx.tick?.value === 0 ? C.zero : C.grid),
          lineWidth: (ctx: any) => (ctx.tick?.value === 0 ? 1.5 : 1)
        }
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        suggestedMin: rateMin !== undefined ? rateMin - ratePad : undefined,
        suggestedMax: rateMax !== undefined ? rateMax + ratePad : undefined,
        title: {
          display: true,
          text: "Rate",
          color: C.muted,
          font: { size: 12, weight: "500" }
        },
        ticks: { color: C.muted, font: { size: 11 }, callback: (v: any) => Number(v).toFixed(2) },
        border: { display: false },
        grid: { drawOnChartArea: false }
      }
    }
  };

  return (
    <Box p={{ base: "4", md: "6" }} borderRadius="xl" bg="white" borderWidth="1px" borderColor="gray.100">
      <Flex justify="space-between" align="flex-start" mb="3" flexWrap="wrap" gap="2">
        <VStack align="start" spacing="1">
          <Text fontWeight="semibold" fontSize="md" color="gray.800">
            Month-wise Unhedged Exposure
          </Text>
          <Text fontSize="xs" color="gray.500">
            {isGross ? "Gross unhedged amounts and rates" : "Net unhedged amount and rates"}
          </Text>
        </VStack>
        <Badge colorScheme={isGross ? "blue" : "purple"} textTransform="uppercase" px="2.5" py="0.5" borderRadius="full">
          {isGross ? "Gross Policy" : "Net Policy"}
        </Badge>
      </Flex>

      {/* How to read this chart */}
      {chartDataReady && (
        <Flex bg="gray.50" borderRadius="lg" px="4" py="3" mb="4" gap="2" direction="column">
          <HintItem>
            <Text fontWeight="semibold" minW="48px">Bars</Text>
            <Text>
              {isGross ? "unhedged difference" : "net unhedged amount"} (left axis). Dark shade = positive, light shade = negative.
            </Text>
            {isGross ? (
              <>
                <Swatch color={C.exportBar} />
                <Text>Export</Text>
                <Swatch color={C.importBar} />
                <Text>Import</Text>
              </>
            ) : (
              <>
                <Swatch color={C.netBar} />
                <Swatch color={C.netBar} tint={C.netBarNeg} />
              </>
            )}
          </HintItem>
          <HintItem>
            <Text fontWeight="semibold" minW="48px">Lines</Text>
            <Text>rates (right axis). Solid = weighted avg / breakeven, dashed = current forward.</Text>
            {isGross && (
              <>
                <Swatch line color={C.exportLine} />
                <Text>Export</Text>
                <Swatch line color={C.importLine} />
                <Text>Import</Text>
              </>
            )}
          </HintItem>
        </Flex>
      )}

      {/* position relative + w="100%" prevents Chart.js canvas collapse */}
      <Box h={{ base: "380px", md: "440px" }} w="100%" position="relative">
        {chartDataReady ? (
          <Chart type="bar" data={chartData} options={options} />
        ) : (
          <Flex h="100%" align="center" justify="center">
            <Text fontSize="sm" color="gray.500">No unhedged exposure data available</Text>
          </Flex>
        )}
      </Box>
    </Box>
  );
};
export default UnhedgedExposureChart;