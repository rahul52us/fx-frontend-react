import { Spinner, Text, Box } from "@chakra-ui/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { observer } from "mobx-react-lite";
import { Bar } from "react-chartjs-2";
import './chart.css'
import { primaryColor } from "../../../globalColors";




const BarChart = observer(
  ({ options = {}, data = [], loading = true }: any) => {
    ChartJS.register(
      CategoryScale,
      LinearScale,
      BarElement,
      Title,
      Tooltip,
      Legend
    );

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
            <Spinner color={primaryColor} thickness="4px" size="lg" />
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

    const chartOptions =
      options && Object.keys(options).length ? options : { responsive: true };
    const chartData = data && data.datasets ? data : { labels: [], datasets: [] };
    return <Bar options={chartOptions} data={chartData} />;
  }
);

export default BarChart;
