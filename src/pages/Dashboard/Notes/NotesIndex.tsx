import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  IconButton,
  StepIcon,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import BarChart from "../../../config/component/charts/BarChart";
import store from "../../../store/store";
import CategoryTable from "./component/CategoryTable";
import CustomDrawer from "../../../config/component/Drawer/CustomDrawer";
import { CardBoxShadow, headerHeight } from "../../../config/constant/variable";
import { makeChartResponse } from "../component/utils/common";
import DashPageHeader from "../../../config/component/common/DashPageHeader/DashPageHeader";
import { coursesBreadCrumb } from "../utils/breadcrumb.constant";
import CourseList from "./component/CourseList";
import CourseCategoryGridLayout from "./Layout/CourseCategoryGridLayout";
import { BiArrowBack, BiHome } from "react-icons/bi";
import MainNotesForm from "./component/forms/MainNotes/MainNotesForm";
import CustomStepper from "../../../config/component/Stepper/Stepper";

const steps = [
  { title: "Manager", description: "Contact Info", Icon: <StepIcon /> },
  { title: "Financier", description: "Date & Time", Icon: <BiHome /> },
  { title: "HR", description: "Select Rooms", Icon: <StepIcon /> },
  { title: "CTO", description: "Food", Icon: <StepIcon /> },
];

const NotesIndex = observer(() => {
  const [openCategoryList, setOpenCategoryList] = useState({
    open: false,
  });
  const [courseListModel, setCourseListModel] = useState({
    open: false,
    type: "add",
    category: null,
    data: null,
  });

  const [CategoryformModel, setCategoryFormModel] = useState({
    open: false,
    type: "add",
    data: null,
  });
  const {
    notesStore: {
      getCategories,
      categories,
      getCategoryCoursesCount,
      categoryCoursesCount,
    },
    auth: { openNotification },
  } = store;

  useEffect(() => {
    if (!categories.hasFetch) {
      getCategoryCoursesCount()
        .then(() => {})
        .catch(() => {});
      getCategories({ page: 1 })
        .then(() => {})
        .catch((err: any) => {
          openNotification({
            type: "error",
            message: err?.message,
            title: "Get Categories Failed",
          });
        });
    }
  }, [
    getCategories,
    categories.hasFetch,
    openNotification,
    getCategoryCoursesCount,
  ]);

  const CoursesChartData = makeChartResponse(
    categoryCoursesCount.data,
    "Courses Data",
    "title",
    "count",
    ["#FF5733", "#33FF57", "#3366FF", "#FF33A1", "#FFD700"]
  );

  return (
    <Box minHeight={`calc(100vh - ${headerHeight})`} m={-2} p={3}>
      <DashPageHeader title="Videos" breadcrumb={coursesBreadCrumb} />
      <Box mb={8}>
        <CustomStepper steps={steps} activeStepIndex={4} />
      </Box>
      <Grid gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
        <Card width={"100%"} minH={350} p={3} boxShadow={CardBoxShadow}>
          <BarChart
            data={CoursesChartData?.data}
            options={CoursesChartData?.options}
            loading={categoryCoursesCount.loading}
          />{" "}
        </Card>
        <Card width={"100%"} minH={350} p={3} boxShadow={CardBoxShadow}>
          <Button onClick={() => setOpenCategoryList({ open: true })}>
            Add New
          </Button>
        </Card>
      </Grid>
      <Box mt={5}>
        <CourseCategoryGridLayout
          handleClick={(item: any) => {
            setCourseListModel({
              type: "add",
              open: true,
              category: item,
              data: null,
            });
          }}
        />
      </Box>
      <CustomDrawer
        title="Course Categories"
        open={openCategoryList.open}
        close={() => setOpenCategoryList({ open: false })}
      >
        <Flex mb={2} justifyContent="space-between">
          <Box>
            <IconButton
              title="back"
              aria-label="back-btn"
              onClick={() => {
                setOpenCategoryList({ open: false });
              }}
            >
              <BiArrowBack />
            </IconButton>
          </Box>
          <Button
            title="create new category"
            onClick={() =>
              setCategoryFormModel({ open: true, type: "add", data: null })
            }
          >
            CREATE
          </Button>
        </Flex>
        <CategoryTable
          data={categories.data}
          setFormModel={setCategoryFormModel}
          totalPages={categories.totalPages}
          currentPage={categories.currentPage}
          handleCourseModel={(item: any) => {
            setCourseListModel({
              type: "add",
              open: true,
              category: item,
              data: null,
            });
          }}
        />
      </CustomDrawer>
      <CustomDrawer
        open={CategoryformModel.open}
        close={() => {
          setCategoryFormModel({ open: false, type: "add", data: null });
        }}
        title="Add New Data"
      >
        <MainNotesForm formData={CategoryformModel} />
      </CustomDrawer>
      <CourseList
        category={courseListModel.category}
        open={courseListModel.open}
        close={() => {
          setCourseListModel({
            type: "add",
            data: null,
            category: null,
            open: false,
          });
        }}
      />
    </Box>
  );
});

export default NotesIndex;
