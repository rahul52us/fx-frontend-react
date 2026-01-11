import { Grid, GridItem } from "@chakra-ui/react";
import { dashboard } from "../../../config/constant/routes";
import { observer } from "mobx-react-lite";
import store from "../../../store/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NewWidgetCard from "../../../config/component/WigdetCard/NewWidgetCard";
import { FaCode } from "react-icons/fa";
import { HiMiniBuildingOffice2, HiMiniUsers } from "react-icons/hi2";
import { MdOutlineQuiz, MdOutlineTravelExplore } from "react-icons/md";

const DashWidgetCard = observer(() => {
  const navigate = useNavigate();
  const {
    auth: { openNotification },
    tripStore: { getTripCounts, tripCount },
    User: { getUsersCount, UsersCounts },
    Project: { getProjectCounts, projectCount },
    company: { getCompanyCount, companyCount },
  } = store;

  const fetchData = (getDataFn: any) =>
    new Promise((resolve, reject) => {
      getDataFn().then(resolve).catch(reject);
    });

  useEffect(() => {
    Promise.all([
      fetchData(getTripCounts),
      fetchData(getUsersCount),
      fetchData(getProjectCounts),
      fetchData(getCompanyCount),
    ])
      .then(() => {})
      .catch(() => {
        // openNotification({
        //   type: "error",
        //   message: error?.message || "Something went wrong",
        //   title: "Failed to get dashboard data",
        // });
      });
  }, [
    getTripCounts,
    getUsersCount,
    getProjectCounts,
    getCompanyCount,
    openNotification,
  ]);

  return (
    <Grid
      templateColumns={{
        base: "repeat(1, 1fr)", // Mobile: 1 card per row
        sm: "repeat(2, 1fr)", // Small screens: 2 cards per row
        md: "repeat(3, 1fr)", // Tablets: 3 cards per row
        lg: "repeat(3, 1fr)", // Desktops: 4 cards per row
        xl: "repeat(5, 1fr)", // Large desktops: 5 cards per row
      }}
      gap={6}
    >
      {[
        {
          count: UsersCounts.data,
          title: "Users",
          link: dashboard.Users.index,
          loading: UsersCounts.loading,
          icon: HiMiniUsers,
          bg:"#F4F2FF"
        },
        {
          count: companyCount.data,
          title: "Company",
          link: dashboard.company.index,
          loading: companyCount.loading,
          icon: HiMiniBuildingOffice2,
          bg:"#ECFBFF"
        },
        {
          count: tripCount.data,
          title: "Trips",
          link: dashboard.tripManagement.index,
          loading: tripCount.loading,
          icon: MdOutlineTravelExplore,
           bg:"#FFF2EC"
        },
        {
          count: projectCount.data,
          title: "Projects",
          link: dashboard.application.project,
          loading: projectCount.loading,
          icon: FaCode,
          bg:"#EDFFEF"
        },
        {
          count: 2000,
          title: "Quiz",
          link: dashboard.quiz,
          loading: tripCount.loading,
          icon: MdOutlineQuiz,
          bg:"#FFFAF0"
        },
      ].map((item, key) => (
        <GridItem key={key}>
          <NewWidgetCard
            totalCount={item.count}
            handleClick={() => navigate(item.link)}
            title={item.title}
            loading={item.loading}
            icon={item.icon}
            bg={item.bg}
          />
        </GridItem>
      ))}
    </Grid>
  );
});

export default DashWidgetCard;
