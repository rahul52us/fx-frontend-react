import { Box, Text, VStack } from "@chakra-ui/react";
import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip
} from "chart.js";
import { useRef } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const data = [
  { period: "0-30d", value: 8200 },
  { period: "30-60d", value: 6500 },
  { period: "60-90d", value: 5100 },
  { period: "90-180d", value: 3800 },
  { period: "180d+", value: 2200 },
];

const MaturityChart = () => {
  const chartRef = useRef<any>(null);

  const chartData = {
    labels: data.map((d) => d.period),
    datasets: [
      {
        label: "Exposure",
        data: data.map((d) => d.value),
        borderColor: "#3182CE",
        backgroundColor: "rgba(49,130,206,0.2)", // fallback
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0
      }
    ]
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
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
    >
      <VStack align="start" spacing="1" mb="4">
        <Text fontWeight="semibold" color="gray.800">
          Maturity Profile
        </Text>
        <Text fontSize="xs" color="gray.500">
          Exposure by maturity bucket (USD '000)
        </Text>
      </VStack>

      <Box h="280px">
        <Line ref={chartRef} data={chartData} options={options} />
      </Box>
    </Box>
  );
};

export default MaturityChart;