import {
  Box,
  Text,
  VStack
} from "@chakra-ui/react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const data = [
  { name: "USD", value: 45 },
  { name: "EUR", value: 25 },
  { name: "GBP", value: 15 },
  { name: "JPY", value: 10 },
  { name: "Others", value: 5 },
];

const COLORS = [
  "#3182CE", // primary (blue)
  "#38A169", // green
  "#D69E2E", // amber
  "#805AD5", // purple
  "#319795", // teal
];

const CurrencyPieChart = () => {
  const chartData = {
    labels: data.map((d) => d.name),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: COLORS,
        borderWidth: 0,
        spacing: 3, // similar to paddingAngle
        hoverOffset: 6
      }
    ]
  };

  const options: any = {
    cutout: "60%", // inner radius
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: "#fff",
        borderColor: "#E2E8F0",
        borderWidth: 1,
        titleColor: "#1A202C",
        bodyColor: "#1A202C",
        cornerRadius: 8,
        callbacks: {
          label: function (context: any) {
            return `${context.raw}%`;
          }
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
      sx={{ animationDelay: "400ms" }}
    >
      <VStack align="start" spacing="1" mb="4">
        <Text fontWeight="semibold" color="gray.800">
          Currency Distribution
        </Text>
        <Text fontSize="xs" color="gray.500">
          Exposure by currency (%)
        </Text>
      </VStack>

      <Box h="280px">
        <Doughnut data={chartData} options={options} />
      </Box>
    </Box>
  );
};

export default CurrencyPieChart;