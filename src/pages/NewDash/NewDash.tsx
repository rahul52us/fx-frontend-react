import { Box, Grid, VStack } from "@chakra-ui/react";
import MyCoursesCard from "./MyCourseCard";
import StudentActivityChart from "./StudentActivityChart";
// import NewDashboardCard from "./Cards/NewDashboardCard";
import { IoPeopleSharp } from "react-icons/io5";
import { NewDashboardCard } from "./Cards/NewDashboardCard";
import QuizScoresChart from "./Charts/QuizScoreChart";
// import UserActivityFeed from "./UserActivityFeed";
// import TodayActivityCalendar from "./Cards/UserProfileCard";
import UserActivityFeed from "./UserActivityFeed";
// import DynamicCalendar from "./Timeline";
import CalendarApp from "./Timeline";
import React from "react";
import ProgressCard from "./ProgressCard/ProgressCard";
import DashboardStatsCard from "./Cards/DashboardStatsCard";
import { cardData } from "./Cards/constant";
import DoughnutChart from "./Charts/DoughnutChart/DoughnutChart";
import {
  barChartData,
  doughnutDataset,
  labels,
} from "./Charts/DoughnutChart/constant";
import CommonBarGraph from "./Charts/BarGraph/CommonBarGraph";

const coursesData = [
  {
    name: "Figma",
    imageUrl: "https://cdn-icons-png.flaticon.com/128/5968/5968705.png",
    title: "Figma UI UX Design",
    academy: "Abcd Academy",
    completion: 64,
    timeLeft: "3 hr 20 min left",
    colorScheme: "purple",
  },
  {
    name: "Figma",
    imageUrl: "https://cdn-icons-png.flaticon.com/128/5968/5968705.png",
    title: "Figma UI UX Design",
    academy: "Abcd Academy",
    completion: 64,
    timeLeft: "3 hr 20 min left",
    colorScheme: "purple",
  },
  {
    name: "Figma",
    imageUrl: "https://cdn-icons-png.flaticon.com/128/5968/5968705.png",
    title: "Figma UI UX Design",
    academy: "Abcd Academy",
    completion: 64,
    timeLeft: "3 hr 20 min left",
    colorScheme: "purple",
  },
  {
    name: "Figma",
    imageUrl: "https://cdn-icons-png.flaticon.com/128/5968/5968705.png",
    title: "Figma UI UX Design",
    academy: "Abcd Academy",
    completion: 64,
    timeLeft: "3 hr 20 min left",
    colorScheme: "purple",
  },
];

const quizcore = [
  { label: "quiz1", data: 30 },
  { label: "he he", data: 20 },
  { label: "quiz3", data: 75 },
  { label: "quiz4", data: 45 },
];

const cardColor = ["purple", "orange", "green", "red"];

const { barGraphLabels, datasets } = barChartData;

export default function NewDash() {
  return (
    <Box>
      <Grid templateColumns={"3fr 1fr"} columnGap={6}>
        <Box>
          <Grid gap={4} templateColumns={"repeat(4, 1fr)"}>
            {[1, 2, 3, 4].map((item) => (
              <React.Fragment key={item}>
                <NewDashboardCard
                  icon={<IoPeopleSharp fontSize="24px" />}
                  value="1,475"
                  label="No of Students"
                  colorScheme={cardColor[item - 1]}
                  bgColor={{
                    light: `${cardColor[item - 1]}.100`,
                    dark: "gray.700",
                  }}
                />
              </React.Fragment>
            ))}
          </Grid>

          <Grid
            templateColumns={{ md: "1fr 1fr", lg: "repeat(3, 1fr)" }}
            gap={4}
            mt={4}
          >
            {cardData.map((card, index) => (
              <DashboardStatsCard key={index} {...card} />
            ))}
          </Grid>

          <Grid templateColumns={"1fr 1fr"} mt={4} gap={4}>
            <Box shadow={"md"} borderWidth={1} rounded={12} p={4}>
              <DoughnutChart
                labels={labels}
                doughnutDataset={doughnutDataset}
              />
            </Box>
            <Box shadow={"md"} borderWidth={1} rounded={12} p={4}>
              <CommonBarGraph labels={barGraphLabels} datasets={datasets} />
            </Box>
          </Grid>

          <Grid templateColumns={"1fr 1fr"} mt={6} gap={4}>
            <StudentActivityChart />
            <QuizScoresChart quizScores={quizcore} />
          </Grid>
        </Box>

        <VStack align={"stretch"} spacing={4}>
          <CalendarApp />

          <ProgressCard
            title="Check your progress"
            description="You have completed 67% of the given target"
            progress={67}
            linkText="Click Here"
            linkUrl="#"
          />
          <UserActivityFeed />
        </VStack>
      </Grid>
      <Grid templateColumns={"1fr 1fr 1fr 1fr"} gap={6} mt={6}>
        {coursesData.map((course, index) => (
          <MyCoursesCard key={index} course={course} />
        ))}
      </Grid>
    </Box>
  );
}
