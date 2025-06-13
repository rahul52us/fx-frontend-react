import { Doughnut } from "react-chartjs-2";
import {
  Box,
  CircularProgress,
  Flex,
  Grid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Chart, ArcElement } from "chart.js";
Chart.register(ArcElement);

const StudentActivityChart = () => {
  const borderColor = useColorModeValue("white", "gray.700");
  const data = {
    labels: ["Quiz", "Course", "Assignment", "Live Class"],
    datasets: [
      {
        data: [300, 200, 400, 100],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };
  const options: any = {
    plugins: {
      datalabels: {
        formatter: (value: any, ctx: any) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return `${label}: ${value}`;
        },
        textAlign: "center",
        font: {
          size: "4",
        },
        anchor: "start",
        offset: 20,
      },
    },
    cutout: "78%",
    borderColor: borderColor,
  };

  const taskTimes = ["2 hrs 30 min", "1 hr 50 min", "3 hrs 20 min", "1 hr"];
  const totalTime = taskTimes.reduce((acc, curr) => {
    const [hours, minutes] = curr.split(" ");
    return acc + parseInt(hours) + parseInt(minutes) / 60;
  }, 0);

  return (
    <Box
      p={6}
      shadow="rgb(0 0 0 / 20%) 0px 0px 11px"
      rounded={8}
      bg={useColorModeValue("white", "gray.700")}
    >
      <Grid templateColumns={"1fr 1fr"} alignItems={"center"} gap={2}>
        <Box h={220}>
          <Doughnut data={data} options={options} />
        </Box>
        <Box>
          <Text fontWeight="bold" mb={2}>
            Total Hours Spent
          </Text>
          <Flex align="center" mb={4}>
            <Text fontSize="2xl" fontWeight="bold">
              {totalTime}
            </Text>
            <Text ml={2}>hrs</Text>
          </Flex>
          {data.labels.map((label, index) => (
            <Flex key={label} justify={"space-between"} align={"center"} mb={3}>
              <Flex gap={2} align={"center"}>
                <CircularProgress
                  value={data.datasets[0].data[index] / 3}
                  size="5"
                  color={data.datasets[0].backgroundColor[index]}
                  thickness="14px"
                />
                <Text>{label}</Text>
              </Flex>
              <Text fontSize={"sm"} fontWeight={500}>
                {taskTimes[index]}
              </Text>
            </Flex>
          ))}
        </Box>
      </Grid>
    </Box>
  );
};

export default StudentActivityChart;
