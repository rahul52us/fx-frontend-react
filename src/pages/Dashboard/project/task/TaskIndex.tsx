import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashPageHeader from "../../../../config/component/common/DashPageHeader/DashPageHeader";
import CustomDrawer from "../../../../config/component/Drawer/CustomDrawer";
import PageLoader from "../../../../config/component/Loader/PageLoader";
import { getStatusType } from "../../../../config/constant/statusCode";
import store from "../../../../store/store";
import { projectBreadCrumb } from "../../utils/breadcrumb.constant";
import AddTask from "./component/form/AddTask";
import TaskPage from "./component/TaskPage/TaskPage";
import EditTask from "./component/form/EditTask";
import { FaPlus, FaTasks } from "react-icons/fa";
import ViewTask from "./component/form/viewTask/ViewTask";
import PermissionDeniedPage from "../../../../config/component/commonPages/PermissionDeniedPage";

const TaskIndex = observer(() => {
  const [projectDetails, setProjectDetails] = useState<any>({
    loading: true,
    data: null,
    secondApiCall: false,
  });
  const [taskData, setTaskData] = useState<any>([]);
  const {
    Project: { getSingleProject, setOpenTaskDrawer, openTaskDrawer, getTasks },
    auth: { openNotification, checkPermission },
  } = store;
  const showIcon = useBreakpointValue({ base: true, md: false });

  const { projectId } = useParams();

  const fetchRecords = useCallback(() => {
    if (projectId) {
      getSingleProject({ id: projectId })
        .then((data: any) => {
          setProjectDetails({
            loading: false,
            data: data.data,
            secondApiCall: true,
          });
          getTasks({ id: projectId })
            .then((response) => {
              setTaskData(response?.data);
            })
            .catch((err) => {
              openNotification({
                title: "Failed to Get",
                message: err?.data?.message || "An error occurred",
                type: getStatusType(err.status),
              });
            });
        })
        .catch((err) => {
          openNotification({
            title: "Failed to Get",
            message: err?.data?.message || "An error occurred",
            type: getStatusType(err.status),
          });
          setProjectDetails({
            loading: false,
            data: null,
            secondApiCall: false,
          });
        });
    }
  }, [openNotification, getSingleProject, projectId, getTasks]);

  useEffect(() => {
    if (checkPermission("task", "view")) {
      fetchRecords();
    }
  }, [fetchRecords,checkPermission]);

  return (
    <PermissionDeniedPage show={!checkPermission("task", "view")}>
      <React.Fragment>
        <Box p={2}>
          <DashPageHeader
            title="Project"
            breadcrumb={projectBreadCrumb.task.index}
          />
          <PageLoader
            loading={
              projectDetails.loading && projectDetails.secondApiCall === false
            }
            noRecordFoundText={
              projectDetails.loading === false &&
              projectDetails.data === null &&
              projectDetails.secondApiCall === false
                ? true
                : false
            }
          >
            {projectDetails.data && (
              <Box p={2}>
                <Flex justifyContent="space-between" alignItems="center" mb={4}>
                  <Heading
                    display="flex"
                    alignItems="center"
                    fontSize={{ base: "sm", md: "xl" }}
                    color="teal.600"
                  >
                    <Icon as={FaTasks} boxSize={6} mr={2} />
                    project :- {projectDetails.data.project_name}
                  </Heading>
                  {checkPermission("task", "add") && (
                    <Box>
                      {showIcon ? (
                        <IconButton
                          title="Create Task"
                          onClick={() =>
                            setOpenTaskDrawer("create", {
                              projectId: projectId,
                            })
                          }
                          aria-label="Create Task"
                          icon={<FaPlus />}
                          colorScheme="teal"
                        />
                      ) : (
                        <Button
                          leftIcon={<FaPlus />}
                          colorScheme="teal"
                          variant="solid"
                          size="lg"
                          _hover={{ bg: "teal.600" }}
                          _active={{ bg: "teal.700" }}
                          _focus={{ boxShadow: "outline" }}
                          onClick={() =>
                            setOpenTaskDrawer("create", {
                              projectId: projectId,
                            })
                          }
                        >
                          CREATE Task
                        </Button>
                      )}
                    </Box>
                  )}
                </Flex>
                <Box p={{ base: 1, sm: 2 }}>
                  <TaskPage
                    taskData={taskData?.data}
                    setActiveSelectedTask={setOpenTaskDrawer}
                    fetchRecords={fetchRecords}
                  />
                </Box>
              </Box>
            )}
          </PageLoader>
        </Box>

        <CustomDrawer
          title={
            ["view", "edit"].includes(openTaskDrawer.type)
              ? openTaskDrawer?.data?.title
              : "CREATE NEW TASK"
          }
          open={openTaskDrawer.open}
          close={() => setOpenTaskDrawer("create")}
          width={"90vw"}
        >
          {openTaskDrawer.type === "create" && (
            <AddTask
              projectId={openTaskDrawer?.data?.projectId}
              fetchRecords={fetchRecords}
              close={() => setOpenTaskDrawer("create")}
            />
          )}
          {openTaskDrawer.type === "view" && (
            <ViewTask
              fetchRecords={fetchRecords}
              close={() => setOpenTaskDrawer("create")}
              task={openTaskDrawer?.data}
            />
          )}
          {openTaskDrawer.type === "edit" && (
            <EditTask
              task={openTaskDrawer?.data}
              projectId={openTaskDrawer?.data?.projectId}
              fetchRecords={fetchRecords}
              close={() => setOpenTaskDrawer("create")}
            />
          )}
        </CustomDrawer>
      </React.Fragment>
    </PermissionDeniedPage>
  );
});

export default TaskIndex;
