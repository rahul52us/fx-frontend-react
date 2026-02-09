import { Text, Box } from "@chakra-ui/react";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, DoughnutController } from "chart.js";
import { observer } from "mobx-react-lite";
import { Doughnut } from "react-chartjs-2";
import SpinnerLoader from "../Loader/SpinnerLoader"; // Adjust the import path as necessary
import { useState, useEffect } from "react";
import "./chart.css"; // Include any necessary styling

ChartJS.register(Title, Tooltip, ArcElement, Legend, DoughnutController);

const DonutChart = observer(
  ({ options = {}, data = {}, loading = true }: any) => {
    const [legendPosition, setLegendPosition] = useState<'top' | 'right'>('right');

    useEffect(() => {
      const handleResize = () => {
        setLegendPosition(window.innerWidth >= 768 ? 'right' : 'top');
      };

      // Set initial position
      handleResize();

      // Add event listener for window resize
      window.addEventListener('resize', handleResize);

      // Clean up event listener on component unmount
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (loading) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            padding="20px"
          >
            <SpinnerLoader />
            <Text
              color="#333"
              fontSize="sm"
              marginTop={2}
              fontWeight="bold"
              style={{
                animation: "text-fade 1s ease-in-out infinite",
              }}
            >
              Loading Data...
            </Text>
          </Box>
        </Box>
      );
    }

    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: legendPosition, // Dynamically set position
          align: 'center',
          labels: {
            boxWidth: 10,
            padding: 10,
          },
        },
        title: {
          display: true,
          text: 'Donut Chart',
        },
        doughnut: {
          cutout: '60%',
        },
      },
    };

    const chartOptions = options && Object.keys(options).length ? options : defaultOptions;
    const safeData = data && data.datasets ? data : { labels: [], datasets: [] };

    return <Doughnut options={chartOptions} data={safeData} />;
  }
);

export default DonutChart;
