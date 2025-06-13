import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { Box } from "@chakra-ui/react";

// Updated DoughnutChart component
const DoughnutChart: React.FC<any> = ({ labels, doughnutDataset }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = chartRef.current?.getContext("2d");
    if (!ctx) return;

    const myChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: doughnutDataset,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
          },
        },
      },
    });

    return () => {
      myChart.destroy();
    };
  }, [labels, doughnutDataset]);

  return (
    <Box width={{ base: "80vw", md: "100%", lg: "380px" }} h="250px" mx="auto">
      <canvas ref={chartRef} />
    </Box>
  );
};

export default DoughnutChart;