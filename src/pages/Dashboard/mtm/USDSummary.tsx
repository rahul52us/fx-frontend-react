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
  const { auth, User: userStore, summaryStore } = store;
  const { filters, setFilters, fetchUSDSummaryData, usdSummaryData, resetUSDSummaryData } = summaryStore;
  
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserDetails, setSelectedUserDetails] = useState<any>(null);
  
  const fetchUsers = useCallback(async () => {
    try {
      const response = await userStore.getUsersWithAuth({ role: "user" });
      const data = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];
      setUsers(data);
      
      if (filters.userId) {
        const user = data.find((u: any) => u.userId === filters.userId);
        if (user) setSelectedUserDetails(user);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  }, [userStore, filters.userId]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Update filters when viewAsUserId changes in the global store
  useEffect(() => {
    if (auth.viewAsUserId) {
      setFilters({ userId: auth.viewAsUserId });
    }
  }, [auth.viewAsUserId, setFilters]);

  // Update selectedUserDetails when filters.userId changes
  useEffect(() => {
    if (filters.userId && users.length > 0) {
      const user = users.find((u: any) => u.userId === filters.userId);
      if (user) setSelectedUserDetails(user);
    }
  }, [filters.userId, users]);

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    setFilters({ 
      userId, 
      currency: "", 
      businessUnit: "", 
      bank: "" 
    });
    const user = users.find((u: any) => u.userId === userId);
    setSelectedUserDetails(user);
  };

  const handleSearch = async () => {
    if (!filters.userId) return;
    await fetchUSDSummaryData();
  };

  useEffect(() => {
    return () => {
      resetUSDSummaryData();
    };
  }, [resetUSDSummaryData]);

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
              lg: "repeat(4, 1fr)",
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

            <FormControl>
              <FormLabel fontSize="sm">Currency</FormLabel>
              <Select
                placeholder="Select Currency"
                value={filters.currency}
                onChange={(e) => setFilters({ currency: e.target.value })}
                isDisabled={!filters.userId}
                bg={bg}
              >
                {selectedUserDetails?.currencies?.map((curr: string) => (
                  <option key={curr} value={curr}>
                    {curr}
                  </option>
                )) || (
                  <option value="USDINR">USDINR</option>
                )}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Business Unit</FormLabel>
              <Select
                placeholder="All Business Units"
                value={filters.businessUnit}
                onChange={(e) => setFilters({ businessUnit: e.target.value, bank: "" })}
                isDisabled={!filters.userId}
                bg={bg}
              >
                {selectedUserDetails?.businessUnits?.map((bu: any) => (
                  <option key={bu.unitCode} value={bu.unitCode}>
                    {bu.unitCode}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Bank</FormLabel>
              <Select
                placeholder="All Banks"
                value={filters.bank}
                onChange={(e) => setFilters({ bank: e.target.value })}
                isDisabled={!filters.userId}
                bg={bg}
              >
                {(filters.businessUnit
                  ? selectedUserDetails?.businessUnits?.find((bu: any) => bu.unitCode === filters.businessUnit)?.banks || []
                  : Array.from(new Set(selectedUserDetails?.businessUnits?.flatMap((bu: any) => bu.banks || []).map((b: any) => b.bankName)))
                      .map(name => selectedUserDetails?.businessUnits?.flatMap((bu: any) => bu.banks || []).find((b: any) => b.bankName === name))
                )?.map((bank: any, idx: number) => (
                  <option key={`${bank.bankName}-${idx}`} value={bank.bankName}>
                    {bank.bankName}
                  </option>
                ))}
              </Select>
            </FormControl>

            <Button
              colorScheme="blue"
              onClick={handleSearch}
              isLoading={usdSummaryData.loading}
              w="full"
              gridColumn={{ lg: "span 4" }}
              mt={2}
            >
              Fetch USD Summary
            </Button>
          </Grid>
        </Box>

        {usdSummaryData.data ? (
          <USDSummaryTable
            data={usdSummaryData.data}
            loading={usdSummaryData.loading}
          />
        ) : !usdSummaryData.loading && filters.userId ? (
          <Center py={10} bg={bg} rounded="xl" border="1px solid" borderColor={borderColor}>
            <Text color="gray.500">Pick a user and click "Fetch USD Summary" to view data.</Text>
          </Center>
        ) : null}
        
        {usdSummaryData.loading && (
           <Center py={20}>
             <Spinner size="xl" color="blue.500" />
           </Center>
        )}
      </Flex>
    </Box>
  );
});

export default MTMUSDSummary;
