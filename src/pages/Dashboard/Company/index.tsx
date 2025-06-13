import { observer } from "mobx-react-lite";
import DashPageHeader from "../../../config/component/common/DashPageHeader/DashPageHeader";
import { companyBreadCrumb } from "../utils/breadcrumb.constant";
import WidgetCard from "../../../config/component/WigdetCard/WidgetCard";
import { Grid, GridItem } from "@chakra-ui/react";
import { dashboard } from "../../../config/constant/routes";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import store from "../../../store/store";
import CompaniesTable from "./companies/CompaniesTable";

const Company = observer(() => {
  const {
    DepartmentStore: { getDepartmentCounts, departmentCounts },
    auth: { openNotification },
  } = store;
  const navigate = useNavigate();

  const cards: any = [
    {
      totalCount: 2,
      title: "Policy",
      link: dashboard.company.holidays,
      loading: false,
    },
    {
      totalCount: 14,
      title: "Work Timing",
      // onclick: () => setworkTimingForm({ open: true }),
      loading: false,
    },
    {
      totalCount: departmentCounts.data,
      title: "Departments",
      link: dashboard.department.index,
      loading: departmentCounts.loading,
    },
  ];

  const fetchData = (getDataFn: any) =>
    new Promise((resolve, reject) => {
      getDataFn().then(resolve).catch(reject);
    });

  useEffect(() => {
    Promise.all([fetchData(getDepartmentCounts)])
      .then(() => {})
      .catch((error: any) => {
        openNotification({
          type: "error",
          message: error.message,
          title: "Failed to get dashboard data",
        });
      });
  }, [getDepartmentCounts, openNotification]);

  return (
    <div>
      <DashPageHeader title="Company" breadcrumb={companyBreadCrumb.index} />
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)",
          sm: "repeat(1, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={4}
        marginX="auto"
      >
        {cards.map((item: any, index: number) => {
          return (
            <GridItem key={index}>
              <WidgetCard
                key={index}
                totalCount={item.totalCount}
                title={item.title}
                handleClick={() => {
                  if (item.link) {
                    navigate(item.link);
                  }
                  if (item.onclick) {
                    item.onclick();
                  }
                }}
                loading={item.loading}
              />
            </GridItem>
          );
        })}
      </Grid>
      <Grid mt={5}>
        <GridItem overflowX="auto">
          <CompaniesTable />
        </GridItem>
      </Grid>
    </div>
  );
});

export default Company;