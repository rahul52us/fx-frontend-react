import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import UserDetailsTable from "./UserDetailsTable/UserDetailTable";
import DashPageHeader from "../../../../../../config/component/common/DashPageHeader/DashPageHeader";
import { liberaryBreadCrumb } from "../../../../utils/breadcrumb.constant";

const UserDetails = observer(() => {
  return (
    <Box>
      <DashPageHeader
        title="Dashboard"
        breadcrumb={liberaryBreadCrumb.liberary}
      />
      <UserDetailsTable />
    </Box>
  );
});

export default UserDetails;
