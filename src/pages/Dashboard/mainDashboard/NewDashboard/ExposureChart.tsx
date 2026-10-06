import { Box, Text, VStack } from "@chakra-ui/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const toPercentage = (value?: string) => Number.parseFloat(value || "0") || 0;

const ExposureChart = ({ data }: { data?: any }) => {
  const categories = [
    {
      label: "Exports",
      hedged: toPercentage(data?.totalExportHedgeStatus?.totalExportHedgeStatus),
      unhedged: toPercentage(data?.totalExportHedgeStatus?.totalExportUnhedgeStatus)
    },
    {
      label: "Imports",
      hedged: toPercentage(data?.totalImportHedgeStatus?.totalImportHedgeStatus),
      unhedged: toPercentage(data?.totalImportHedgeStatus?.totalImportUnedgeStatus)
    },
    {
      label: "Net exposure",
      hedged: toPercentage(data?.totalNetExposureHedgeStatus?.netExposureHedgeStatus),
      unhedged: Math.max(0, 100 - toPercentage(data?.totalNetExposureHedgeStatus?.netExposureHedgeStatus))
    }
  ];

  const chartData = {
    labels: categories.map((item) => item.label),
    datasets: [
      {
        label: "Hedged",
        data: categories.map((item) => item.hedged),
        backgroundColor: "#38A169", // green
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.5
      },
      {
        label: "Unhedged",
        data: categories.map((item) => item.unhedged),
        backgroundColor: "#3182CE",
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.5
      }
    ]
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: "#fff",
        borderColor: "#E2E8F0",
        borderWidth: 1,
        titleColor: "#1A202C",
        bodyColor: "#1A202C",
        cornerRadius: 8,
        bodyFont: { size: 12 }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#718096",
          font: { size: 12 }
        }
      },
      y: {
        grid: {
          borderDash: [3, 3],
          color: "#E2E8F0"
        },
        min: 0,
        max: 100,
        ticks: {
          color: "#718096",
          font: { size: 12 },
          callback: (value: string | number) => `${value}%`
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
      sx={{ animationDelay: "300ms" }}
    >
      <VStack align="start" spacing="1" mb="4">
        <Text fontWeight="semibold" color="gray.800">
          Hedge Status
        </Text>
        <Text fontSize="xs" color="gray.500">
          Hedged vs unhedged exposure (%)
        </Text>
      </VStack>

      <Box h="280px">
        <Bar data={chartData} options={options} />
      </Box>
    </Box>
  );
};

export default ExposureChart;