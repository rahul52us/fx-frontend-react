import { observer } from "mobx-react-lite";
import DashPageHeader from "../../../../config/component/common/DashPageHeader/DashPageHeader";
import { Box } from "@chakra-ui/react";
import ProjectMainIndex from "../config/component/ProjectMainIndex";
import { projectBreadCrumb } from "../../utils/breadcrumb.constant";

const UserIndex = observer(({userId} : any) => {
  return (
    <Box p={2}>
      <DashPageHeader title="Project" breadcrumb={projectBreadCrumb.index} />
      <ProjectMainIndex userId={userId}/>
    </Box>
  );
});

export default UserIndex;
