import { Grid } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import PunchAttendance from "../../PunchAttendence/PunchAttendence";
import ManagerDashWidget from "./component/ManagerDashWidget";
import ManagerUsers from "./component/ManagerUsers";

const ManagerDashboard = observer(() => {
  return (
    <Grid templateColumns={{ base: "1fr", md: "1fr" }} columnGap={3}>
      <ManagerDashWidget />
      <Grid gridTemplateColumns={{ base: "1fr", lg: "1fr 1fr" }} columnGap={4}>
        <ManagerUsers />
        <PunchAttendance />
      </Grid>
    </Grid>
  );
});

export default ManagerDashboard;