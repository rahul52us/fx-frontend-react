import { observer } from "mobx-react-lite";
import DepartmentCategories from "./CategoriesDetails/CategoriesDetails";
import DashPageHeader from "../../../../config/component/common/DashPageHeader/DashPageHeader";
import { departmentsBreadCrumb } from "../../utils/breadcrumb.constant";

const Department = observer(() => {
  return (
    <div>
      <DashPageHeader title="Departments" breadcrumb={departmentsBreadCrumb}/>
      <DepartmentCategories />
    </div>
  );
});

export default Department;