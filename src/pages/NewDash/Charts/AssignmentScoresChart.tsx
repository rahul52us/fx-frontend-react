import React from 'react';
import { Box, Text, Divider } from '@chakra-ui/react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Registering chart components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface AssignmentScoresChartProps {
  assignmentScores: number[];
}

const AssignmentScoresChart: React.FC<AssignmentScoresChartProps> = ({ assignmentScores }) => {
  // Configuring data for assignment scores chart
  const assignmentScoresData = {
    labels: assignmentScores.map((_, idx) => `Assignment ${idx + 1}`),
    datasets: [
      {
        label: 'Assignment Scores',
        data: assignmentScores,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
        borderWidth: 2,
        tension: 0.4, // This creates the curved lines
        pointRadius: 5, // Show points
        pointHoverRadius: 7, // Increase point size on hover
      },
    ],
  };

  // Chart options to maintain aspect ratio and handle resizing
  const chartOptions:any = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        enabled: true,
        intersect: false,
        mode: 'index',
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
    <Box>
      <Text fontSize="lg" mb={2} color="gray.800">
        Assignment Scores
      </Text>
      <Box height="200px">
        <Line data={assignmentScoresData} options={chartOptions} />
      </Box>
      <Divider />
    </Box>
  );
};

export default AssignmentScoresChart;
