import { observer } from "mobx-react-lite";
import { requestBreadCrumb } from "../../../utils/breadcrumb.constant";
import DashPageHeader from "../../../../../config/component/common/DashPageHeader/DashPageHeader";
import AddRequest from "./component/form/LeaveAddRequest";

const LeaveRequest = observer(() => {
  return (
    <>
      <DashPageHeader
        title="Leave Request"
        breadcrumb={requestBreadCrumb.leave}
      />
      <AddRequest />
    </>
  );
});

export default LeaveRequest;