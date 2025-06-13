import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import TripUsersTable from "./TripUserTable";
import { tripBreadCrumb } from "../../../../utils/breadcrumb.constant";
import DashPageHeader from "../../../../../../config/component/common/DashPageHeader/DashPageHeader";

const TripUsersTableIndex = observer(() => {
  return (
    <Box>
      <DashPageHeader
        breadcrumb={tripBreadCrumb.users}
      />
       <TripUsersTable />
    </Box>
  );
});

export default TripUsersTableIndex;
