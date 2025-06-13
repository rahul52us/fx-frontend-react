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
      .catch((error: any) => {
        openNotification({
          type: "error",
          message: error?.message || "Something went wrong",
          title: "Failed to get dashboard data",
        });
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
        base: "repeat(1, 1fr)",
        sm: "repeat(2, 1fr)",
        md: "repeat(4, 1fr)",
        lg: "repeat(5, 1fr)",
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
        },
        {
          count: companyCount.data,
          title: "Company",
          link: dashboard.company.index,
          loading: companyCount.loading,
          icon: HiMiniBuildingOffice2,
        },
        {
          count: tripCount.data,
          title: "Trips",
          link: dashboard.tripManagement.index,
          loading: tripCount.loading,
          icon: MdOutlineTravelExplore,
        },
        {
          count: projectCount.data,
          title: "Projects",
          link: dashboard.application.project,
          loading: projectCount.loading,
          icon: FaCode,
        },
        {
          count: 2000,
          title: "Quiz",
          link: dashboard.quiz,
          loading: tripCount.loading,
          icon: MdOutlineQuiz,
        },
      ].map((item, key) => (
        <GridItem key={key}>
          <NewWidgetCard
            key={key}
            totalCount={item.count}
            handleClick={() => navigate(item.link)}
            title={item.title}
            loading={item.loading}
            icon={item.icon}
          />
        </GridItem>
      ))}
    </Grid>
  );
});

export default DashWidgetCard;
