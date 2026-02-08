import DashboardBanner from "./component/DashboardBanner";
import { observer } from "mobx-react-lite";
import store from "../../store/store";
import DashPageHeader from "../../config/component/common/DashPageHeader/DashPageHeader";
import { headerHeight } from "../../config/constant/variable";
import { Box } from "@chakra-ui/react";
import { dashBreadCrumb } from "./utils/breadcrumb.constant";
import AdminDashboard from "./mainDashboard/adminDashboard/AdminDashboard";
import ManagerDashboard from "./mainDashboard/managerDashboard/ManagerDashboard";

const DashboardIndex = observer(() => {
  const {
    auth: { user, hasComponentAccess },
  } = store;


  console.log('the user are', user)

  const renderElements = (role: string) => {
    if (role === "manager") {
      return <ManagerDashboard />;
    } else if (hasComponentAccess()) {
      return <AdminDashboard />;
    } else {
      return <AdminDashboard />;
    }
  };

  return (
    <>
      <Box minHeight={`calc(100vh - ${headerHeight})`} m={-2} p={3}>
        <DashPageHeader title="Dashboard" breadcrumb={dashBreadCrumb} />
        <DashboardBanner />
        {renderElements(user.role)}
      </Box>
    </>
  );
});

export default DashboardIndex;