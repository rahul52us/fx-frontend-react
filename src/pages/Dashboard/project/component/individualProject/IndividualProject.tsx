import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import store from "../../../../../store/store";
import { Box } from "@chakra-ui/react";
import PageLoader from "../../../../../config/component/Loader/PageLoader";
import ProjectDetails from "../ProjectDetails/ProjectDetails";

const IndividualProject = observer(() => {
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const {
    Project: { getIndividualProject },
    auth: { openNotification, hasComponentAccess, user },
  } = store;
  const { projectId } = useParams();

  useEffect(() => {
    const query: any = { projectId };
    if (!hasComponentAccess()) {
      query["userId"] = user._id;
    }
    setLoading(true);
    getIndividualProject(query)
      .then((data: any) => {
        setHasPermission(true);
        console.log(data);
      })
      .catch(() => {
        // openNotification({
        //   title: "Failed to Fetch",
        //   message: err?.data?.message,
        //   type: getStatusType(err?.data?.statusCode),
        // });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [
    getIndividualProject,
    openNotification,
    projectId,
    user,
    hasComponentAccess,
  ]);

  return (
    <Box>
      <PageLoader
        loading={loading}
        height="25vh"
        noRecordFoundText={!hasPermission}
      >
        <ProjectDetails selectedProject={{_id : projectId}} userId={user._id}/>
      </PageLoader>
    </Box>
  );
});

export default IndividualProject;
