import { Grid } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import PunchAttendance from "../../PunchAttendence/PunchAttendence";
import UserDashWidget from "./component/UserDashWidget";

const UserDashboard = observer(() => {
  return (
    <Grid gridTemplateColumns={{ base: "1fr", lg: "1fr" }} columnGap={4}>
      <UserDashWidget />
      <Grid gridTemplateColumns={{ base: "1fr", lg: "1fr" }} columnGap={4}>
        <PunchAttendance />
      </Grid>
    </Grid>
  );
});

export default UserDashboard;
