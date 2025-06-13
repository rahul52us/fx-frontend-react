import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { Box } from "@chakra-ui/react";

const CommonBarGraph: React.FC<{ labels: string[]; datasets: any[] }> = ({
  labels,
  datasets,
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = chartRef.current?.getContext("2d");
    if (!ctx) return;

    const myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: window.innerWidth < 768 ? 10 : 12, // Adjust font size for mobile and tablet
              },
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                size: window.innerWidth < 768 ? 10 : 12, // Adjust font size for mobile and tablet
              },
            },
          },
        },
      },
    });

    return () => {
      myChart.destroy();
    };
  }, [labels, datasets]);

  return (
    <Box width="100%" h={{ base: "250px", md: "300px" }} mx="auto">
      <canvas ref={chartRef} />
    </Box>
  );
};

export default CommonBarGraph;
