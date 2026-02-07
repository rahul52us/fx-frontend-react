import { Card, Grid } from "@chakra-ui/react";
import BarChart from "../../../../../config/component/charts/BarChart";
import { observer } from "mobx-react-lite";
import store from "../../../../../store/store";
import { useEffect, useState } from "react";
import DonutChart from "../../../../../config/component/charts/Doughnut";
import { glassCardStyle } from "../../../../../globalStyles";

const DashChartContainer = observer(() => {
  const {
    auth: { getDashboardCountsss },
  } = store;

  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response: any = await getDashboardCountsss();
        if (response?.status === "success") {
          const data = response.data;

          const labels = [
            "EEFC",
            "Export",
            "Import",
            "Exposure",
            "Fwd Reg",
            "Fwd Cancel",
            "PCFC",
          ];

          const values = [
            data.eefc?.total || 0,
            data.export?.total || 0,
            data.import?.total || 0,
            data.exposure?.total || 0,
            data.forwardRegister?.total || 0,
            data.forwardCancellation?.total || 0,
            data.pcfc?.total || 0,
          ];

          const colors = [
            "#4A90E2",
            "#50E3C2",
            "#F5A623",
            "#D0021B",
            "#B8E986",
            "#BD10E0",
            "#9013FE",
          ];

          setChartData({
            labels,
            datasets: [
              {
                label: "Total Count",
                data: values,
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1,
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getDashboardCountsss]);


  const glassStyle = {
    ...glassCardStyle,
    p: { base: 3, sm: 5 },
    minH: 350,
    width: "100%",
  };

  return (
    <Grid
      templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
      gap={5}
      mb={5}
      mt={5}
    >
      <Card
        {...glassStyle}
        width={"100%"}
        minH={350}
        p={{ base: 0, sm: 2 }}
        borderWidth={1}
      >
        <BarChart
          data={chartData}
          loading={loading}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: true, text: 'Financial Overview (Bar)' },
            },
          }}
        />
      </Card>
      <Card
        {...glassCardStyle}
        width={"100%"}
        minH={350}
        p={{ base: 0, sm: 2 }}
        borderWidth={1}
      >
        <DonutChart
          data={chartData}
          loading={loading}
          options={{
            responsive: true,
             maintainAspectRatio: false,
            plugins: {
              legend: { position: 'right' },
              title: { display: true, text: 'Financial Overview (Distribution)' },
            },
          }}
        />
      </Card>
    </Grid>
  );
});

export default DashChartContainer;
