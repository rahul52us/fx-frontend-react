import { observer } from "mobx-react-lite";
import DailyAttendence from "./component/Daily/DailyAttendence";
import useQuery from "../../../config/component/customHooks/useQuery";
import MonthlyAttendence from "./component/Monthly/MonthlyAttendence";
import YearlyAttendence from "./component/Yearly/YearlyAttendence";
import LeaveLedger from "./component/LeaveLedger/LeaveLedger";
import { Box, Text } from "@chakra-ui/react";
import DashPageHeader from "../../../config/component/common/DashPageHeader/DashPageHeader";
import { attendenceBreadCrumb } from "../utils/breadcrumb.constant";

const Attendence = observer(() => {
  const query = useQuery();

  const getElement = () => {
    switch (query.get("tab")) {
      case "daily":
        return <DailyAttendence />;
      case "monthly":
        return <MonthlyAttendence />;
      case "yearly":
        return <YearlyAttendence />;
      case "leave-ledger":
        return <LeaveLedger />;
      default:
        return <Text>No Tab are Available</Text>;
    }
  };

  return (
    <Box>
      <DashPageHeader title="Dashboard" breadcrumb={attendenceBreadCrumb.attendence} />
      {getElement()}
    </Box>
  );
});

export default Attendence;