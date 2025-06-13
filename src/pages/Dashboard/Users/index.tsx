import { observer } from "mobx-react-lite";
import DashPageHeader from "../../../config/component/common/DashPageHeader/DashPageHeader";
import { UsersBreadCrumb } from "../utils/breadcrumb.constant";
import { Box } from "@chakra-ui/react";
import UserWidget from "./component/UserWidget/UserWidget";
import UserChart from "./component/UserChart/UserChart"

const Users = observer(() => {
  return (
    <Box>
      <DashPageHeader title="Users" breadcrumb={UsersBreadCrumb.index} />
      <UserWidget />
      <UserChart />
    </Box>
  );
});

export default Users;