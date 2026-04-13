import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Select,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useState } from "react";
import RestrictedAccess from "../../../config/component/common/RestrictedAccess/RestrictedAccess";
import { usePermission } from "../../../config/component/customHooks/usePermission";
import store from "../../../store/store";
import USDSummaryTable from "./component/USDSummaryTable";

const MTMUSDSummary = observer(() => {
  const { canView } = usePermission("mtm");
  const { auth, User: userStore,  summaryStore } = store;
  
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [filters, setFilters] = useState({
    userId: auth.viewAsUserId || "",
  });

  const fetchUsers = useCallback(async () => {
    try {
      const response = await userStore.getUsersWithAuth({ role: "user" });
      const data = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  }, [userStore]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Update filters when viewAsUserId changes in the global store
  useEffect(() => {
    if (auth.viewAsUserId) {
      setFilters((prev:any) => ({ ...prev, userId: auth.viewAsUserId }));
    }
  }, [auth.viewAsUserId]);

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    setFilters(prev => ({ ...prev, userId }));
  };

  const handleSearch = async () => {
    if (!filters.userId) return;
    
    setLoading(true);
    try {
      summaryStore.setFilters({ userId: filters.userId });
      await summaryStore.fetchUSDSummaryData();
    } catch (err) {
      console.error("Error fetching mtm usd summary:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      summaryStore.resetUSDSummaryData();
    };
  }, [summaryStore]);

  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");

  if (!canView) return <RestrictedAccess />;

  return (
    <Box p={4}>
      <Flex direction="column" gap={6}>
        <Box
          bg={bg}
          p={6}
          rounded="xl"
          shadow="sm"
          border="1px solid"
          borderColor={borderColor}
        >
          <Heading size="md" mb={6} color={useColorModeValue("blue.700", "blue.200")}>
            MTM USD Summary Filters
          </Heading>
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "1fr auto",
            }}
            gap={4}
            alignItems="flex-end"
          >
            <FormControl>
              <FormLabel fontSize="sm">User</FormLabel>
              <Select
                placeholder="Select User"
                value={filters.userId}
                onChange={handleUserChange}
                bg={bg}
              >
                {users.map((u: any) => (
                  <option key={u.userId} value={u.userId}>
                    {u.userName || u.email}
                  </option>
                ))}
              </Select>
            </FormControl>

            <Button
              colorScheme="blue"
              onClick={handleSearch}
              isLoading={loading || summaryStore.usdSummaryData.loading}
              px={10}
              mt={{ base: 2, lg: 0 }}
            >
              Fetch USD Summary
            </Button>
          </Grid>
        </Box>

        {summaryStore.usdSummaryData.data ? (
          <USDSummaryTable
            data={summaryStore.usdSummaryData.data}
            loading={loading || summaryStore.usdSummaryData.loading}
          />
        ) : !loading && filters.userId && !summaryStore.usdSummaryData.loading ? (
          <Center py={10} bg={bg} rounded="xl" border="1px solid" borderColor={borderColor}>
            <Text color="gray.500">Pick a user and click "Fetch USD Summary" to view data.</Text>
          </Center>
        ) : null}
        
        {(loading || summaryStore.usdSummaryData.loading) && (
           <Center py={20}>
             <Spinner size="xl" color="blue.500" />
           </Center>
        )}
      </Flex>
    </Box>
  );
});

export default MTMUSDSummary;
