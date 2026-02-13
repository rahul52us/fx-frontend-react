import { Grid, Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import DashWidgetCard from "../../component/DashWidgetCard";
import DashChartContainer from "../managerDashboard/component/DashManagerChartContainer";

const AdminDashboard = observer(() => {
  return (
    <Box p={6} minH="100vh" bg="gray.50">

      {/* Content Section */}
      <Grid templateColumns={{ base: "1fr", md: "1fr" }} gap={6}>
        <DashWidgetCard />
        <DashChartContainer />
        <Grid gridTemplateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
          {/* Add more widgets or charts here if needed */}
        </Grid>
      </Grid>
    </Box>
  );
});

export default AdminDashboard;
