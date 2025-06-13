import { observer } from "mobx-react-lite";
import DashPageHeader from "../../../../config/component/common/DashPageHeader/DashPageHeader";
import { companyBreadCrumb } from "../../utils/breadcrumb.constant";
import HolidaysDetailTable from "../Holidays/Holidays";

const CompanyPolicy = observer(() => {
  return (
    <div>
      <DashPageHeader title="Policy" breadcrumb={companyBreadCrumb.policy} />
      <HolidaysDetailTable />
    </div>
  );
});

export default CompanyPolicy;