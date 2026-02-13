import { Grid, Select, Flex, Text, useToast } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import DashWidgetCard from "../../component/DashWidgetCard";
import DashChartContainer from "../managerDashboard/component/DashManagerChartContainer";
import store from "../../../../store/store";

const AdminDashboard = observer(() => {
  const {
    auth: { viewAsUserId, setViewAsUserId },
    User, // Access UserStore
  } = store;

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await User.getUsersWithAuth({ search: "", role: 'user' });
      const usersList = Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : []);

      const formattedData = usersList.map((user: any) => ({
        ...user,
        ...(user.basicDetails || {}),
      }));

      console.log("Fetched Users:", formattedData);
      setUsers(formattedData);

      // Default select the first user if no user is selected
      if (!viewAsUserId && formattedData.length > 0) {
        console.log("Setting default ViewAsUserId:", formattedData[0].userId);
        setViewAsUserId(formattedData[0].userId);
      } else if (viewAsUserId && !formattedData.find((u: any) => u.userId === viewAsUserId) && formattedData.length > 0) {
        console.log("ViewAsUserId not in list, resetting to:", formattedData[0].userId);
        setViewAsUserId(formattedData[0].userId);
      }

    } catch (error: any) {
      console.error("Failed to fetch users", error);
      toast({
        title: "Error fetching users",
        description: error?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (store.auth.user?.role === "admin") {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid templateColumns={{ base: "1fr", md: "1fr" }} columnGap={3}>
      <Flex display={store.auth.user?.role === "admin" ? undefined : 'none'} justifyContent="flex-end" mb={4} alignItems="center">
        <Text mr={3} fontWeight="bold">View As:</Text>
        <Select
          width="250px"
          placeholder="Select User"
          value={viewAsUserId || ""}
          onChange={(e) => setViewAsUserId(e.target.value)}
          bg="white"
          isDisabled={loading}
        >
          {users.map((user: any) => (
            <option key={user._id} value={user.userId}>
              {user.basicDetails?.email || user.email || `${user.firstName} ${user.lastName}`}
            </option>
          ))}
        </Select>
      </Flex>
      <DashWidgetCard />
      <DashChartContainer />
      <Grid gridTemplateColumns={{ base: "1fr", lg: "1fr 1fr" }} columnGap={4}>
      </Grid>
    </Grid>
  );
});

export default AdminDashboard;
