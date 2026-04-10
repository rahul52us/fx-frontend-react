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
import axios from "axios";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useState } from "react";
import RestrictedAccess from "../../../config/component/common/RestrictedAccess/RestrictedAccess";
import { usePermission } from "../../../config/component/customHooks/usePermission";
import store from "../../../store/store";
import SummaryTable from "../summary/component/SummaryTable";

const MTMConversionSummary = observer(() => {
  const { canView } = usePermission("mtm");
  const { auth, User: userStore } = store;
  
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserDetails, setSelectedUserDetails] = useState<any>(null);
  
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<any[]>([]);
  
  const [filters, setFilters] = useState({
    userId: auth.viewAsUserId || "",
    exposureType: "export",
    currency: "USDINR",
    year: "2025",
  });

  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear + 1; i >= currentYear - 5; i--) {
    years.push(i.toString());
  }

  const fetchUsers = useCallback(async () => {
    try {
      const response = await userStore.getUsersWithAuth({ role: "user" });
      const data = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];
      setUsers(data);
      
      // Initialize selected user details if userId is present
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
      setFilters((prev:any) => ({ ...prev, userId: auth.viewAsUserId }));
      const user = users.find((u: any) => u.userId === auth.viewAsUserId);
      if (user) setSelectedUserDetails(user);
    }
  }, [auth.viewAsUserId, users]);

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    setFilters(prev => ({ ...prev, userId, currency: "" }));
    const user = users.find((u: any) => u.userId === userId);
    setSelectedUserDetails(user);
  };

  const handleSearch = async () => {
    if (!filters.userId) return;
    
    setLoading(true);
    try {
      const payload = {
        userId: filters.userId,
        exposureType: filters.exposureType,
        currency: filters.currency,
        year: filters.year,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_FX_BASE_URL}/mtmview/conversionsummary/`,
        payload
      );
      
      const responseData = response.data;
      const actualData = responseData.data && responseData.data[0] ? responseData.data[0] : {};
      
      // Transform map to array for SummaryTable
      const transformedData = Object.entries(actualData).map(([monthYear, values]: [string, any]) => ({
        monthYear,
        ...values
      }));
      
      setSummaryData(transformedData);
    } catch (err) {
      console.error("Error fetching mtm conversion summary:", err);
      setSummaryData([]);
    } finally {
      setLoading(false);
    }
  };

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
            MTM Conversion Summary Filters
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
              <FormLabel fontSize="sm">Exposure Type</FormLabel>
              <Select
                value={filters.exposureType}
                onChange={(e) => setFilters(prev => ({ ...prev, exposureType: e.target.value }))}
                bg={bg}
              >
                <option value="export">Export</option>
                <option value="import">Import</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Currency</FormLabel>
              <Select
                placeholder="Select Currency"
                value={filters.currency}
                onChange={(e) => setFilters(prev => ({ ...prev, currency: e.target.value }))}
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
              <FormLabel fontSize="sm">Year</FormLabel>
              <Select
                value={filters.year}
                onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                bg={bg}
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </Select>
            </FormControl>

            <Button
              colorScheme="blue"
              onClick={handleSearch}
              isLoading={loading}
              w="full"
              gridColumn={{ lg: "span 4" }}
              mt={2}
            >
              Fetch Summary
            </Button>
          </Grid>
        </Box>

        {summaryData.length > 0 ? (
          <SummaryTable
            data={summaryData}
            loading={loading}
            exposureType={filters.exposureType}
          />
        ) : !loading && filters.userId ? (
          <Center py={10} bg={bg} rounded="xl" border="1px solid" borderColor={borderColor}>
            <Text color="gray.500">No data records to display. Please adjust filters or click "Fetch Summary".</Text>
          </Center>
        ) : null}
        
        {loading && (
           <Center py={20}>
             <Spinner size="xl" color="blue.500" />
           </Center>
        )}
      </Flex>
    </Box>
  );
});

export default MTMConversionSummary;
