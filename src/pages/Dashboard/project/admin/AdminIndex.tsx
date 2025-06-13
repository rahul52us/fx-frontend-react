import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import React from "react";
import DashPageHeader from "../../../../config/component/common/DashPageHeader/DashPageHeader";
import { projectBreadCrumb } from "../../utils/breadcrumb.constant";
import ProjectMainIndex from "../config/component/ProjectMainIndex";

const AdminIndex = observer(() => {
  return (
    <React.Fragment>
      <Box p={2}>
        <DashPageHeader title="Project" breadcrumb={projectBreadCrumb.index} />
        <ProjectMainIndex />
      </Box>
    </React.Fragment>
  );
});

export default AdminIndex;
