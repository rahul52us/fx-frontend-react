import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import DashPageHeader from "../../../config/component/common/DashPageHeader/DashPageHeader";
import { requestBreadCrumb } from "../utils/breadcrumb.constant";
import LeaveDetails from "./component/LeaveRequest/component/LeaveDetails/LeaveDetails";
import { useParams } from "react-router-dom";

const Request = observer(() => {
  const {userId} = useParams()
  return (
    <Box>
      <DashPageHeader title="Request" breadcrumb={userId ?  requestBreadCrumb.userIndex : requestBreadCrumb.index} />
      <LeaveDetails />
    </Box>
  );
});

export default Request;