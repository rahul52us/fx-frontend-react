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

const data = [
  { month: "Jan", exports: 4200, imports: 3800 },
  { month: "Feb", exports: 3900, imports: 4100 },
  { month: "Mar", exports: 5100, imports: 3500 },
  { month: "Apr", exports: 4700, imports: 4300 },
  { month: "May", exports: 5500, imports: 3900 },
  { month: "Jun", exports: 6100, imports: 4600 },
];

const ExposureChart = () => {
  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: "Exports",
        data: data.map((d) => d.exports),
        backgroundColor: "#38A169", // green
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.5
      },
      {
        label: "Imports",
        data: data.map((d) => d.imports),
        backgroundColor: "#3182CE", // blue
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
        ticks: {
          color: "#718096",
          font: { size: 12 }
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
          Exposure Overview
        </Text>
        <Text fontSize="xs" color="gray.500">
          Monthly export vs import exposure (USD '000)
        </Text>
      </VStack>

      <Box h="280px">
        <Bar data={chartData} options={options} />
      </Box>
    </Box>
  );
};

export default ExposureChart;