import { observer } from "mobx-react-lite";
import DashPageHeader from "../../../../../config/component/common/DashPageHeader/DashPageHeader";
import { UsersBreadCrumb } from "../../../utils/breadcrumb.constant";
import UserDetailsTable from "./Element/UserDetailsTable";

// This is the main User details file
const UserDetails = observer(() => {
  return (
    <div>
      <DashPageHeader
        title="Users > Details"
        breadcrumb={UsersBreadCrumb.details}
      />
      <UserDetailsTable />
    </div>
  );
});

export default UserDetails;