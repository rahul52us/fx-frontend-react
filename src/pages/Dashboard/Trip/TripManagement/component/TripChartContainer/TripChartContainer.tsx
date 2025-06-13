import { Card, Grid } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect } from "react";
import store from "../../../../../../store/store";
import { makeChartResponse } from "../../../../component/utils/common";
import BarChart from "../../../../../../config/component/charts/BarChart";
import PieChart from "../../../../../../config/component/charts/PieChart";

const TripChartContainer = observer(({userId} : any) => {
  const {
    tripStore: { getTripChartCounts, tripChartCount, getTripTitleAmount, tripTitleAmount },
  } = store;

  const fetchData = useCallback((getDataFn: any) =>
    new Promise((resolve, reject) => {
      getDataFn({userId : userId}).then(resolve).catch(reject);
    }),[userId]);

  useEffect(() => {
    Promise.all([
      fetchData(getTripChartCounts),
      fetchData(getTripTitleAmount)
    ])
      .then(() => {})
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [getTripChartCounts,getTripTitleAmount,fetchData]);

  const tripChartData = makeChartResponse(
    tripChartCount.data,
    "Trip Data",
    "title",
    "count",
    ["rgba(54, 162, 235, 0.5)", "rgba(255, 99, 132, 0.5)", "rgba(75, 192, 192, 0.5)", "rgba(75, 172, 195, 0.5)", "#FFD700"]
  );

  const tripTitleAmountData = makeChartResponse(
    tripTitleAmount.data,
    "Trips Expenses",
    "title",
    "amount",
    ["rgba(54, 162, 235, 0.5)", "rgba(255, 99, 132, 0.5)", "rgba(75, 192, 192, 0.5)", "rgba(75, 172, 195, 0.5)", "#FFD700"]
  );

  return (
    <Grid
      templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
      gap={5}
      mb={5}
      mt={5}
    >
      <Card width={"100%"} minH={350} p={{ base: 0, sm: 2 }}>
      <BarChart
          data={tripChartData?.data}
          options={tripChartData?.options}
          loading={tripChartCount.loading}
        />
      </Card>
      <Card width={"100%"} minH={350} p={{ base: 0, sm: 2 }}>
      <PieChart
          data={tripTitleAmountData?.data}
          options={tripTitleAmountData?.options}
          loading={tripTitleAmount.loading}
        />
      </Card>
    </Grid>
  );
});

export default TripChartContainer;
