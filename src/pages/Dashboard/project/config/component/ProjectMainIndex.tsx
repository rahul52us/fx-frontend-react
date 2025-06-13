import {
  Box,
  Heading,
  SimpleGrid,
  Flex,
  Icon,
  Button,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState, useCallback } from "react";
import {
  FaProjectDiagram,
  FaTasks,
  FaUsers,
  FaFolderOpen,
  FaPlus,
} from "react-icons/fa";
import MainPagePagination from "../../../../../config/component/pagination/MainPagePagination";
import { getStatusType } from "../../../../../config/constant/statusCode";
import store from "../../../../../store/store";
import SummaryWidget from "../../../../../config/component/WigdetCard/SummaryWidget";
import ProjectCard from "./ProjectCard";
import CustomDrawer from "../../../../../config/component/Drawer/CustomDrawer";
import ProjectDetails from "../../component/ProjectDetails/ProjectDetails";
import NotFoundData from "../../../../../config/component/commonPages/NotFoundData";
import { useQueryParams } from "../../../../../config/component/customHooks/useQuery";
import EditProject from "../../component/Form/EditProject";
import CreateProject from "../../component/Form/CreateProject";
// import TaskCard from "../../component/TaskCard/TaskCard";

const ProjectMainIndex = observer(({ userId }: any) => {
  const {
    Project: {
      getProjects,
      projects,
      projectCount,
      openProjectDrawer,
      getProjectCounts,
      setOpenProjectDrawer,
    },
    auth: { openNotification, checkPermission },
  } = store;
  const showIcon = useBreakpointValue({ base: true, md: false });
  const [selectedProject, setSelectedProject] = useState({
    open: false,
    data: null,
  });

  const { getQueryParam, setQueryParam } = useQueryParams();
  const [currentPage, setCurrentPage] = useState(() =>
    getQueryParam("page") ? Number(getQueryParam("page")) : 1
  );

  const fetchProjectDetails = useCallback(() => {
    getProjects({ page: currentPage, limit: 10, userId })
      .then(() => {})
      .catch((err) => {
        openNotification({
          title: "Failed to Retrieve Project",
          message: err?.data?.message,
          type: getStatusType(err.status),
        });
      });
  }, [getProjects, openNotification, currentPage, userId]);

  useEffect(() => {
    getProjectCounts({ userId });
  }, [getProjectCounts, userId]);

  useEffect(() => {
    fetchProjectDetails();
  }, [currentPage, fetchProjectDetails]);

  const handlePageChange = (page: any) => {
    setCurrentPage(page.selected);
    setQueryParam("page", page.selected);
  };

  const summaryData = [
    {
      label: "Total Projects",
      value: projectCount.data,
      icon: FaProjectDiagram,
      colorScheme: "teal",
      description: "Total number of projects.",
      loading: projectCount.loading,
    },
    {
      label: "Total Tasks",
      value: 128,
      icon: FaTasks,
      colorScheme: "blue",
      description: "Total number of tasks across all projects.",
      loading: projectCount.loading,
    },
    {
      label: "Team Members",
      value: 10,
      icon: FaUsers,
      colorScheme: "purple",
      description: "The number of active team members.",
      loading: projectCount.loading,
    },
  ];

  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={6}>
        {summaryData.map((data, index) => (
          <SummaryWidget
            key={index}
            label={data.label}
            value={data.value}
            icon={data.icon}
            colorScheme={data.colorScheme}
            description={data.description}
            loading={data.loading}
          />
        ))}
      </SimpleGrid>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading
          display="flex"
          alignItems="center"
          fontSize={{ base: "xl", md: "2xl" }}
          color="teal.600"
        >
          <Icon as={FaFolderOpen} boxSize={6} mr={2} />
          Projects
        </Heading>
        {checkPermission("project", "add") && (
          <Box>
            {showIcon ? (
              <IconButton
                title="Create Project"
                onClick={() => setOpenProjectDrawer("create")}
                aria-label="Create Project"
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
                onClick={() => setOpenProjectDrawer("create")}
              >
                CREATE PROJECT
              </Button>
            )}
          </Box>
        )}
      </Flex>
      {projects.data.length === 0 && projects.loading === false ? (
      <NotFoundData
        onClick={() => setOpenProjectDrawer("create")}
        btnText="CREATE PROJECT"
        title="No projects found"
        subTitle="Start by creating a new project to get started."
        showCreateButton={checkPermission("project", "add")}
        />
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={8}>
          {projects.data.map((item: any, index: number) => (
            <ProjectCard
              item={item}
              key={index}
              project_name={item.project_name}
              subtitle={item.subtitle}
              description={item.description}
              logo={item.logo}
              priority={item.priority}
              status={item.status}
              startDate={item.startDate}
              endDate={item.endDate}
              dueDate={item.dueDate}
              approval={item.approval}
              onClick={() => {
                setSelectedProject({ open: true, data: item });
              }}
            />
          ))}
        </SimpleGrid>
      )}

      <Flex justifyContent="center" mt={8} display={projects.data.length !== 0 ? undefined : 'none'}>
        <MainPagePagination
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalPages={projects.totalPages}
        />
      </Flex>

      <CustomDrawer
        open={selectedProject.open}
        close={() => setSelectedProject({ open: false, data: null })}
        title="Project Details"
        width="90vw"
      >
        <ProjectDetails selectedProject={selectedProject.data} />
      </CustomDrawer>
      <CustomDrawer
        width="90vw"
        title={`${
          openProjectDrawer.type === "edit"
            ? "UPDATE PROJECT"
            : "CREATE NEW PROJECT"
        }`}
        open={openProjectDrawer.open}
        close={() => setOpenProjectDrawer("create")}
      >
        {openProjectDrawer.type === "edit" ? (
          <EditProject userId={userId} />
        ) : (
          <CreateProject userId={userId} />
        )}
      </CustomDrawer>
    </Box>
  );
});

export default ProjectMainIndex;
