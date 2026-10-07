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
}




const safeNumber = (val: unknown): number => {
  if (val === null || val === undefined || val === "") return 0;
  const num = typeof val === "number" ? val : Number(val);
  return Number.isFinite(num) ? num : 0;
};

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
        currentFwdrate: safeNumber(exp?.currentFwdrate)
      };

      const imp = importData[month];
      importMap[month] = {
        unhedgedAmount: safeNumber(imp?.unhedgedAmount),
        weightedAvgRate: safeNumber(imp?.weightedAvgRate),
        currentFwdrate: safeNumber(imp?.currentFwdrate)
      };
    });

    return {
      policyType: "gross",
      months,
      export: exportMap,
      import: importMap
    };
  }

  // Net policy mapping using usdSummaryData
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

const UnhedgedExposureChart = ({
  data,
  loading = false
}: UnhedgedExposureChartProps) => {
  if (loading) {
    return (
      <Box
        p="6"
        borderRadius="xl"
        bg="white"
        boxShadow="sm"
        animation="fadeInUp 0.4s ease forwards"
      >
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

  const months = data?.months || [];
  const hasData = months.length > 0;
  const isGross = data?.policyType === "gross";

  if (!hasData) {
    return (
      <Box
        p="6"
        borderRadius="xl"
        bg="white"
        boxShadow="sm"
        animation="fadeInUp 0.4s ease forwards"
      >
        <Flex justify="space-between" align="center" mb="4">
          <VStack align="start" spacing="1">
            <Text fontWeight="semibold" color="gray.800">
              Month-wise Unhedged Exposure
            </Text>
            <Text fontSize="xs" color="gray.500">
              Unhedged amount and forward rates across months
            </Text>
          </VStack>
          <Badge
            colorScheme={isGross ? "blue" : "purple"}
            textTransform="uppercase"
            px="2.5"
            py="0.5"
            borderRadius="full"
            fontSize="xs"
          >
            {isGross ? "Gross Policy" : "Net Policy"}
          </Badge>
        </Flex>

        <Box
          h="320px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="gray.50"
          borderRadius="lg"
          border="1px dashed"
          borderColor="gray.200"
        >
          <Text fontSize="sm" color="gray.500">
            No unhedged exposure data available
          </Text>
        </Box>
      </Box>
    );
  }

  const chartData: any = {
    labels: months,
    datasets: isGross
      ? [
          {
            type: "bar" as const,
            label: "Export Unhedged Amount",
            data: months.map((m) => data?.export?.[m]?.unhedgedAmount ?? 0),
            yAxisID: "y",
            backgroundColor: "#38A169",
            borderRadius: 4,
            barPercentage: 0.6,
            categoryPercentage: 0.7,
            order: 2
          },
          {
            type: "bar" as const,
            label: "Import Unhedged Amount",
            data: months.map((m) => data?.import?.[m]?.unhedgedAmount ?? 0),
            yAxisID: "y",
            backgroundColor: "#3182CE",
            borderRadius: 4,
            barPercentage: 0.6,
            categoryPercentage: 0.7,
            order: 2
          },
          {
            type: "line" as const,
            label: "Export Wtd Avg Rate",
            data: months.map((m) => data?.export?.[m]?.weightedAvgRate ?? 0),
            yAxisID: "y1",
            borderColor: "#22543D",
            backgroundColor: "#22543D",
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.2,
            order: 1
          },
          {
            type: "line" as const,
            label: "Export Current Fwd Rate",
            data: months.map((m) => data?.export?.[m]?.currentFwdrate ?? 0),
            yAxisID: "y1",
            borderColor: "#805AD5",
            backgroundColor: "#805AD5",
            borderDash: [4, 4],
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.2,
            order: 1
          },
          {
            type: "line" as const,
            label: "Import Wtd Avg Rate",
            data: months.map((m) => data?.import?.[m]?.weightedAvgRate ?? 0),
            yAxisID: "y1",
            borderColor: "#2B6CB0",
            backgroundColor: "#2B6CB0",
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.2,
            order: 1
          },
          {
            type: "line" as const,
            label: "Import Current Fwd Rate",
            data: months.map((m) => data?.import?.[m]?.currentFwdrate ?? 0),
            yAxisID: "y1",
            borderColor: "#DD6B20",
            backgroundColor: "#DD6B20",
            borderDash: [4, 4],
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.2,
            order: 1
          }
        ]
      : [
          {
            type: "bar" as const,
            label: "Net Unhedged Amount",
            data: months.map((m) => data?.net?.[m]?.unhedgedAmount ?? 0),
            yAxisID: "y",
            backgroundColor: (context: any) => {
              const val = context.raw;
              return val < 0 ? "#E53E3E" : "#805AD5";
            },
            borderRadius: 4,
            barPercentage: 0.5,
            categoryPercentage: 0.6,
            order: 2
          },
          {
            type: "line" as const,
            label: "Breakeven / Wtd Avg Rate",
            data: months.map((m) => data?.net?.[m]?.weightedAvgRate ?? 0),
            yAxisID: "y1",
            borderColor: "#38A169",
            backgroundColor: "#38A169",
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.2,
            order: 1
          },
          {
            type: "line" as const,
            label: "Current Forward Rate",
            data: months.map((m) => data?.net?.[m]?.currentFwdrate ?? 0),
            yAxisID: "y1",
            borderColor: "#DD6B20",
            backgroundColor: "#DD6B20",
            borderDash: [4, 4],
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.2,
            order: 1
          }
        ]
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { size: 12 },
          usePointStyle: true,
          boxWidth: 8
        }
      },
      tooltip: {
        backgroundColor: "#fff",
        borderColor: "#E2E8F0",
        borderWidth: 1,
        titleColor: "#1A202C",
        bodyColor: "#1A202C",
        cornerRadius: 8,
        bodyFont: { size: 12 },
        callbacks: {
          label: (context: any) => {
            const datasetLabel = context.dataset.label || "";
            const value = context.raw;
            if (context.dataset.yAxisID === "y1") {
              return `${datasetLabel}: ${Number(value).toFixed(4)}`;
            }
            return `${datasetLabel}: ${Number(value).toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#718096",
          font: { size: 11 },
          maxRotation: 45,
          minRotation: 0
        }
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Unhedged Amount",
          color: "#4A5568",
          font: { size: 12, weight: "bold" }
        },
        grid: {
          borderDash: [3, 3],
          color: "#E2E8F0"
        },
        ticks: {
          color: "#718096",
          font: { size: 11 },
          callback: (value: string | number) => Number(value).toLocaleString()
        }
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Rate",
          color: "#4A5568",
          font: { size: 12, weight: "bold" }
        },
        grid: {
          drawOnChartArea: false
        },
        ticks: {
          color: "#718096",
          font: { size: 11 },
          callback: (value: string | number) => Number(value).toFixed(2)
        }
      }
    }
  };

  return (
    <Box
      p="6"
      borderRadius="xl"
      bg="white"
      boxShadow="sm"
      animation="fadeInUp 0.4s ease forwards"
    >
      <Flex justify="space-between" align="center" mb="4" flexWrap="wrap" gap="2">
        <VStack align="start" spacing="1">
          <HStack spacing="2">
            <Text fontWeight="semibold" color="gray.800">
              Month-wise Unhedged Exposure
            </Text>
          </HStack>
          <Text fontSize="xs" color="gray.500">
            {isGross
              ? "Gross unhedged amounts (Export/Import) and associated forward & weighted average rates"
              : "Net unhedged amount and associated forward & breakeven rates"}
          </Text>
        </VStack>

        <Badge
          colorScheme={isGross ? "blue" : "purple"}
          textTransform="uppercase"
          px="2.5"
          py="0.5"
          borderRadius="full"
          fontSize="xs"
        >
          {isGross ? "Gross Policy" : "Net Policy"}
        </Badge>
      </Flex>

      <Box h="340px">
        <Chart type="bar" data={chartData} options={options} />
      </Box>
    </Box>
  );
};

export default UnhedgedExposureChart;
