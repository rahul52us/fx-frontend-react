import React from "react";
import {
  Box,
//   Heading,
  Text,
  Progress,
  //   useColorMode,
  useColorModeValue,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
} from "@chakra-ui/react";
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

interface PerformanceData {
  attendance: number;
  quizScores: number[];
  assignmentScores: number[];
  overallProgress: number;
}

interface StudentPerformanceTrackerProps {
  performanceData: PerformanceData;
}

const StudentPerformanceTracker: React.FC<StudentPerformanceTrackerProps> = ({
  performanceData,
}) => {
  const bg = useColorModeValue("white", "gray.700");
  const color = useColorModeValue("gray.800", "white");

  // Configuring data for quiz scores chart
  const quizScoresData = {
    labels: performanceData.quizScores.map((_, idx) => `Quiz ${idx + 1}`),
    datasets: [
      {
        label: "Quiz Scores",
        data: performanceData.quizScores,
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

  // Configuring data for assignment scores chart
  const assignmentScoresData = {
    labels: performanceData.assignmentScores.map(
      (_, idx) => `Assignment ${idx + 1}`
    ),
    datasets: [
      {
        label: "Assignment Scores",
        data: performanceData.assignmentScores,
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: true,
        borderWidth: 2,
        tension: 0.4, // This creates the curved lines
        pointRadius: 5, // Show points
        pointHoverRadius: 7, // Increase point size on hover
      },
    ],
  };

  // Chart options to maintain aspect ratio and handle resizing
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
    <Box p={4}>
      {/* <Heading as="h2" size="md" mb={4} color={color}>
        Student Performance Tracker
      </Heading> */}
      <Stack spacing={4} bg={bg} p={4} borderRadius="md" shadow="md">
        <Stat>
          <StatLabel>Attendance</StatLabel>
          <StatNumber>{performanceData.attendance}%</StatNumber>
          <StatHelpText>Current Month</StatHelpText>
        </Stat>
        <Progress
          value={performanceData.attendance}
          size="sm"
          colorScheme={performanceData.attendance > 75 ? "green" : "red"}
          borderRadius="md"
        />
        <Divider />
        <Box>
          <Text fontSize="lg" mb={2} color={color}>
            Quiz Scores
          </Text>
          <Box height="200px">
            <Line data={quizScoresData} options={chartOptions} />
          </Box>
        </Box>
        <Divider />
        <Box>
          <Text fontSize="lg" mb={2} color={color}>
            Assignment Scores
          </Text>
          <Box height="200px">
            <Line data={assignmentScoresData} options={chartOptions} />
          </Box>
        </Box>
        <Divider />
        <Box>
          <Text fontSize="lg" mb={2} color={color}>
            Overall Progress
          </Text>
          <Progress
            value={performanceData.overallProgress}
            size="sm"
            colorScheme="blue"
            borderRadius="md"
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default StudentPerformanceTracker;
