import React from "react";
import { Box, Text, Divider } from "@chakra-ui/react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registering chart components
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface QuizScoresChartProps {
  quizScores: any;
}

const QuizScoresChart: React.FC<QuizScoresChartProps> = ({ quizScores }) => {
  const quizScoresData = {
    labels: quizScores?.map((value: any) => value?.label),
    datasets: [
      {
        label: "Quiz Scores",
        data: quizScores?.map((value: any) => value?.data),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        borderWidth: 2,
        tension: 0.4, // This creates the curved lines
        pointRadius: 5, // Show points
        pointHoverRadius: 7, // Increase point size on hover
      },
    ],
  };

  const chartOptions: any = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
      tooltip: {
        enabled: true,
        intersect: false,
        mode: "index",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
        beginAtZero: true,
        suggestedMax: 100,
      },
    },
  };

  return (
    <Box p={5} rounded="14" shadow={"rgba(0, 0, 0, 0.15) 0px 5px 15px 0px"} bg={'transparent'}>
      <Text fontSize="lg" mb={2} color="gray.800">
        Quiz Scores
      </Text>
      <Box height="220px">
        <Line data={quizScoresData} options={chartOptions} />
      </Box>
      <Divider />
    </Box>
  );
};

export default QuizScoresChart;
