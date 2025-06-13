import { observer } from "mobx-react-lite";
import UserTable from "./component/UserTable";
import { Box } from "@chakra-ui/react";
import DashPageHeader from "../../../../config/component/common/DashPageHeader/DashPageHeader";
import { requestBreadCrumb } from "../../utils/breadcrumb.constant";
import store from "../../../../store/store";
import PageNotFound from "../../../../config/component/common/WebPages/PageNotFound";

const index = observer(() => {
  const {auth : {checkPermission}} = store
  return (
    checkPermission('managers','view') ? <Box>
      <DashPageHeader title="Request" breadcrumb={requestBreadCrumb.userList} />
      <UserTable />
    </Box>:<PageNotFound />
  );
});

export default index;
