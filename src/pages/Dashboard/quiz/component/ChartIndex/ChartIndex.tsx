import { observer } from "mobx-react-lite";
import { Button, Card, Grid } from "@chakra-ui/react";
import BarChart from "../../../../../config/component/charts/BarChart";
import { CardBoxShadow } from "../../../../../config/constant/variable";
import store from "../../../../../store/store";
import { useEffect } from "react";
import { makeChartResponse } from "../../../component/utils/common";
import DataTable from "../../../../../config/component/DataTable/DataTable";

interface QuizFormI {
  setQuizTableDrawer: (value: any) => void;
}

const ChartIndex = observer(({ setQuizTableDrawer }: QuizFormI) => {
  const {
    quiz: { getCategoryQuizCount, categoryQuizCount },
  } = store;

  useEffect(() => {
    getCategoryQuizCount()
      .then(() => {})
      .catch(() => {});
  }, [getCategoryQuizCount]);

  const QuizChartData = makeChartResponse(
    categoryQuizCount.data,
    "Quiz Data",
    "title",
    "total category",
    ["#FF5733", "#33FF57", "#3366FF", "#FF33A1", "#FFD700"]
  );

  const handleSearchData = (value: string) => {
    console.log(value);
  };

  const addData = (dt: any) => {
    alert(dt);
  };

  const editData = (dt: string) => {
    alert(dt);
  };

  return (
    <div>
      <Grid gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
        <Card width={"100%"} minH={350} p={3} boxShadow={CardBoxShadow}>
          <BarChart
            data={QuizChartData?.data}
            options={QuizChartData?.options}
            loading={categoryQuizCount.loading}
          />{" "}
        </Card>
        <Card width={"100%"} minH={350} p={3} boxShadow={CardBoxShadow}>
          <Button mt={5} onClick={() => setQuizTableDrawer({ open: true })}>
            Add New
          </Button>
          <DataTable
            columns={[
              { headerName: "Name", columnName: "name" },
              { headerName: "Age", columnName: "age" },
              { headerName: "School Name", columnName: "school" },
            ]}
            data={[
              { name: "Rahul kushwah", age: 22, school: "GCA" },
              { name: "Name", age: 25, school: "Name School" },
            ]}
            actions={{
              header: {
                show: true,
                text: "Actions",
              },
              search: {
                function: handleSearchData,
                showSearchInput: true,
                placeholder: "Search Data",
              },
              addKey: { showAddButton: true, function: addData },
              editKey: { showEditButton: true, function: editData },
              viewKey: {
                showViewButton: true,
                function: (dt: string) => {
                  alert(dt);
                },
              },
              deleteKey: {
                showDeleteButton: true,
                function: (dt: string) => {
                  alert(dt);
                },
              },
            }}
          />
        </Card>
      </Grid>
    </div>
  );
});

export default ChartIndex;