import { observer } from "mobx-react-lite";
import UserTable from "./component/UserTable";
import { Box } from "@chakra-ui/react";
import DashPageHeader from "../../../../config/component/common/DashPageHeader/DashPageHeader";
import { attendenceBreadCrumb } from "../../utils/breadcrumb.constant";
import store from "../../../../store/store";
import PageNotFound from "../../../../config/component/common/WebPages/PageNotFound";

const index = observer(() => {
  const {
    auth: { checkPermission },
  } = store;
  return checkPermission("managers", "view") ? (
    <Box>
      <DashPageHeader
        title="Attendence"
        breadcrumb={attendenceBreadCrumb.userList}
      />
      <UserTable />
    </Box>
  ) : (
    <PageNotFound />
  );
});

export default index;