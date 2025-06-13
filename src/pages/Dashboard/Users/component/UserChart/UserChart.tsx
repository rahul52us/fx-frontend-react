import { Card, Grid } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import BarChart from "../../../../../config/component/charts/BarChart";
import LineGraph from "../../../../../config/component/charts/LineChart";
import { makeChartResponse } from "../../../component/utils/common";
import store from "../../../../../store/store";
import { useEffect } from "react";

const UserChart = observer(() => {
  const {
    User: {
      getDesignationCount,
      designationCount,
      getUsersRoleCount,
      userRoleCounts,
    },
    auth: { openNotification },
  } = store;

  useEffect(() => {
    getDesignationCount()
      .then(() => {})
      .catch((err: any) => {
        openNotification({
          type: "error",
          title: "Failed to Designation Count",
          message: err?.message,
        });
      });
    getUsersRoleCount()
      .then((data: any) => {
        console.log("the data are", data);
      })
      .catch(() => {});
  }, [getDesignationCount, openNotification, getUsersRoleCount]);

  const coursesChartData = makeChartResponse(
    designationCount.data,
    "Designation",
    "designation",
    "count",
    ["#FFB6C1", "#98FB98", "#87CEEB", "#FFDAB9", "#FFFACD"]
  );

  const formatRoleCountData = (data: any) => {
    if (!data) return { data: [], options: {} };

    const labels = data.map((item: any) => item._id);
    const counts = data.map((item: any) => item.count);

    return {
      data: {
        labels,
        datasets: [
          {
            label: "Users Count",
            data: counts,
            backgroundColor: [
              "#FFB6C1",
              "#98FB98",
              "#87CEEB",
              "#FFDAB9",
              "#FFFACD",
            ],
            barThickness:24
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };
  };

  const roleChartData = formatRoleCountData(userRoleCounts.data);

  return (
    <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={5} mt={5}>
      <Card width={"100%"} minH={350} p={{ base: 0, sm: 2 }}>
        <BarChart
          data={roleChartData.data}
          options={roleChartData.options}
          loading={userRoleCounts.loading}
        />
      </Card>
      <Card width={"100%"} minH={350} p={{ base: 0, sm: 2 }}>
        <LineGraph
          data={coursesChartData.data}
          options={coursesChartData.options}
          loading={designationCount.loading}
        />
      </Card>
    </Grid>
  );
});

export default UserChart;
