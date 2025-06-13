import { Box, Button, Flex, Tab, TabList, Tabs, Text, useColorModeValue } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import CustomInput from "../../../../../config/component/CustomInput/CustomInput";
import { useCallback, useState } from "react";
import store from "../../../../../store/store";
import { format } from "date-fns";
import NormalTable from "../../../../../config/component/Table/NormalTable/NormalTable";
import { generatePunchResponse } from "../../../PunchAttendence/utils/function";
import { useNavigate, useParams } from "react-router-dom";
import { dashboard } from "../../../../../config/constant/routes";
import { tabKeys } from "../../utils/constant";
import useQuery from "../../../../../config/component/customHooks/useQuery";

const DailyAttendance = observer(() => {
  const {userId} = useParams()
  const query = useQuery()
  const navigate = useNavigate()
  const [tabIndex] = useState<number>(
    tabKeys.findIndex((item) => item === query.get("tab"))
  );
  const [attendenceRecord, setAttendenceRecord] = useState([]);
  const {
    AttendencePunch: { getRecentPunch, recentPunch },
    auth : {getPolicy}
  } = store;

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

  const fetchRecordsData = useCallback(() => {
    let query : any = {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      limit: 31,
      policy : getPolicy()
    }
    if(userId){
      query = {...query, user : userId}
    }
    getRecentPunch(query)
      .then((data) => {
        setAttendenceRecord(data);
      })
      .catch(() => {})
      .finally(() => {});
  }, [startDate, endDate, getRecentPunch, userId, getPolicy]);

  const handleStartDateChange = (date: Date) => {
    if (date) {
      setStartDate(date);
    }
  };

  const handleEndDateChange = (date: Date) => {
    if (date) {
      setEndDate(date);
    }
  };

  const handleTabChange = (index: number) => {
    if (userId) {
      navigate(`${dashboard.attendence.userList}/${userId}?tab=${tabKeys[index]}`);
    } else {
      navigate(`${dashboard.attendence.index}?tab=${tabKeys[index]}`);
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

      <Flex align="center" mb={6} gap={4}>
        <Box flex="1">
          <CustomInput
            type="date"
            onChange={handleStartDateChange}
            name="startDate"
            value={startDate}
            placeholder="Select Start Date"
            label="Start Date"
          />
        </Box>
        <Box flex="1">
          <CustomInput
            type="date"
            onChange={handleEndDateChange}
            name="endDate"
            value={endDate}
            placeholder="Select End Date"
            label="End Date"
          />
        </Box>
        <Button
          colorScheme="teal"
          onClick={fetchRecordsData}
          ml={{ base: 0, md: 4 }}
          mt={{ base: 4, md: 8 }}
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
        p={2}
        bg={useColorModeValue("white", "gray.700")}
      >
        <NormalTable
          columns={columns}
          data={generatePunchResponse(attendenceRecord)}
          loading={recentPunch.loading}
          currentPage={0}
          totalPages={0}
          onPageChange={() => {}}
          title="Monthly Punch"
        />
      </Box>
    </Box>
  );
});

export default DailyAttendance;