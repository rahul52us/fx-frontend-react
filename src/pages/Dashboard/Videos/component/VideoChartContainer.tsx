import { Button, Card, Grid } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import store from "../../../../store/store";
import { makeChartResponse } from "../../component/utils/common";
import BarChart from "../../../../config/component/charts/BarChart";

const VideoChartContainer = observer(({addData} : any) => {
  const {
    VideoStore: { getCategoryVideoCount, categoryVideosCount },
  } = store;

  const fetchData = (getDataFn: any) =>
    new Promise((resolve, reject) => {
      getDataFn().then(resolve).catch(reject);
    });

  useEffect(() => {
    Promise.all([
      fetchData(getCategoryVideoCount),
    ])
      .then(() => {})
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [getCategoryVideoCount]);

  const videosChartData = makeChartResponse(
    categoryVideosCount.data,
    "Videos Data",
    "title",
    "count",
    ["#FF5733", "#33FF57", "#3366FF", "#FF33A1", "#FFD700"]
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
          data={null}
          options={videosChartData?.options}
          loading={categoryVideosCount.loading}
        />
      </Card>
      <Card width={"100%"} minH={350} p={{ base: 0, sm: 2 }}>
        <Button onClick={addData}>Add Data</Button>
      </Card>
    </Grid>
  );
});

export default VideoChartContainer;
