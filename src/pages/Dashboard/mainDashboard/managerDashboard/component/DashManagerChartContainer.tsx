import { Card, Grid } from "@chakra-ui/react";
import BarChart from "../../../../../config/component/charts/BarChart";
import { observer } from "mobx-react-lite";
import store from "../../../../../store/store";
import { useEffect } from "react";
import { makeChartResponse } from "../../../component/utils/common";
import DonutChart from "../../../../../config/component/charts/Doughnut";
import { glassCardStyle } from "../../../../../globalStyles";

const DashChartContainer = observer(() => {
  const {
    User: { getManagersUsersCount, managersUsersCount },
  } = store;

  // const borderColor = useColorModeValue("gray.200", "gray.700");

  const fetchData = (getDataFn: any) =>
    new Promise((resolve, reject) => {
      getDataFn().then(resolve).catch(reject);
    });

  useEffect(() => {
    Promise.all([fetchData(getManagersUsersCount)])
      .then(() => {})
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [getManagersUsersCount]);

  // Medium-light color palettes
  const barChartColors = [
    "#4A90E2",
    "#50E3C2",
    "#F5A623",
    "#D0021B",
    "#B8E986",
  ];
  const donutChartColors = [
    "#4CAF50",
    "#FFC107",
    "#03A9F4",
    "#E91E63",
    "#9E9E9E",
  ];

  const coursesChartData = makeChartResponse(
    managersUsersCount.data,
    "FX Data",
    "title",
    "count",
    barChartColors // Use the medium-light color palette for BarChart
  );
  //  const glassCardStyle = {
  //   bg: "rgba(255, 255, 255, 0.8)",
  //   backdropFilter: "blur(12px)",
  //   borderRadius: "2xl",
  //   boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  //   border: "1px solid rgba(255, 255, 255, 0.6)",
  //   p: { base: 3, sm: 5 },
  //   minH: 350,
  //   width: "100%",
  // };
  const glassStyle={
    ...glassCardStyle,
    p: { base: 3, sm: 5 },
    minH: 350,
    width: "100%",
  }

  return (
    <Grid
      templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
      gap={5}
      mb={5}
      mt={5}
    >
      <Card {...glassStyle}
        width={"100%"}
        minH={350}
        p={{ base: 0, sm: 2 }}
        borderWidth={1}
      >
        <BarChart
          data={coursesChartData?.data}
          options={coursesChartData?.options}
          loading={managersUsersCount.loading}
        />
      </Card>
      <Card {...glassCardStyle}
        width={"100%"}
        minH={350}
        p={{ base: 0, sm: 2 }}
        borderWidth={1}
      >
        <DonutChart
          data={coursesChartData?.data}
          options={coursesChartData?.options}
          loading={managersUsersCount.loading}
          colors={donutChartColors} // Use the medium-light color palette for DonutChart
        />
      </Card>
    </Grid>
  );
});

export default DashChartContainer;
