import {
  Box,
  Button,
  Flex,
  Tab,
  TabList,
  Tabs,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import CustomInput from "../../../../../config/component/CustomInput/CustomInput";
import { useCallback, useState } from "react";
import store from "../../../../../store/store";
import { format, addDays } from "date-fns";
import NormalTable from "../../../../../config/component/Table/NormalTable/NormalTable";
import { SearchIcon } from "@chakra-ui/icons";
import { generatePunchResponse } from "../../../PunchAttendence/utils/function";
import { useNavigate, useParams } from "react-router-dom";
import { dashboard } from "../../../../../config/constant/routes";
import useQuery from "../../../../../config/component/customHooks/useQuery";
import { tabKeys } from "../../utils/constant";

const DailyAttendance = observer(() => {
  const { userId } = useParams();
  const query: any = useQuery();
  const [tabIndex] = useState<number>(
    tabKeys.findIndex((item) => item === query.get("tab"))
  );
  const navigate = useNavigate();
  const [attendenceRecord, setAttendenceRecord] = useState([]);
  const {
    AttendencePunch: { getRecentPunch, recentPunch },
    auth : {getPolicy}
  } = store;

  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

  const fetchRecordsData = useCallback(() => {
    const selectedDatePlusOne = addDays(selectedDate, 1);

    let query: any = {
      startDate: formatDate(selectedDate),
      endDate: formatDate(selectedDatePlusOne),
      policy : getPolicy()
    };

    if (userId) {
      query = { ...query, user: userId };
    }
    getRecentPunch(query)
      .then((data) => {
        setAttendenceRecord(data);
      })
      .catch(() => {})
      .finally(() => {});
  }, [selectedDate, getRecentPunch, userId, getPolicy]);

  const handleDateChange = (date: Date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const columns = [
    { headerName: "Date", key: "date" },
    { headerName: "In", key: "punchInTime" },
    { headerName: "Out", key: "punchOutTime" },
    { headerName: "WHrs.", key: "workingHours" },
    { headerName: "Status", key: "status" },
    { headerName: "Late Coming", key: "lateComingMinutes" },
    { headerName: "Early Going", key: "earlyGoingMinutes" },
  ];

  const bgColor = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const boxShadow = useColorModeValue("md", "dark-lg");

  const handleTabChange = (index: number) => {
    if (userId) {
      navigate(`${dashboard.attendence.userList}/${userId}?tab=${tabKeys[index]}`);
    } else {
      navigate(`${dashboard.attendence.index}?tab=${tabKeys[index]}`);
    }
  };

  return (
    <Box
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="md"
      p={3}
      boxShadow={boxShadow}
      bg={bgColor}
    >
      <Tabs
        onChange={(index: number) => handleTabChange(index)}
        index={tabIndex}
      >
        <TabList>
          <Tab>Daily</Tab>
          <Tab>Monthly</Tab>
          <Tab>Yearly</Tab>
        </TabList>
      </Tabs>
      <Flex align="center" mb={3} mt={3}>
        <Text fontWeight="bold" mr={2}>
          Date:
        </Text>
        <CustomInput
          type="date"
          onChange={(date) => handleDateChange(date)}
          name="date"
          value={selectedDate}
          placeholder="Select Date"
        />
        <Button
          ml={{ base: 0, md: 4 }}
          mt={{ base: 4, md: 0 }}
          colorScheme="teal"
          onClick={fetchRecordsData}
          leftIcon={<SearchIcon />}
          isLoading={recentPunch.loading}
        >
          Search
        </Button>
      </Flex>
      <Flex justify="space-between" align="center" mb={4}>
        <Flex align="center" flex="1">
          <Text fontWeight="bold" mr={2}>
            Usere:
          </Text>
          <Text>Rahul Kushwah</Text>
        </Flex>
        <Flex align="center" flex="1" justify="flex-end">
          <Text fontWeight="bold" mr={2}>
            ECode:
          </Text>
          <Text>SS-298</Text>
        </Flex>
      </Flex>
      <Box
        overflowX="auto"
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="md"
        p={3}
        bg={useColorModeValue("white", "gray.700")}
      >
        <NormalTable
          columns={columns}
          data={generatePunchResponse(attendenceRecord)}
          loading={recentPunch.loading}
          currentPage={0}
          totalPages={0}
          onPageChange={() => {}}
          title="Daily Punch"
        />
      </Box>
    </Box>
  );
});

export default DailyAttendance;
