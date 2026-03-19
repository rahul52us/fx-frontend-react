import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Select,
  Grid,
  Heading,
  useDisclosure,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import store from "../../../store/store";
import SummaryTable from "./component/SummaryTable";
import SummaryDetailsDrawer from "./component/SummaryDetailsDrawer";

const SummaryPage: React.FC = observer(() => {
  const { summaryStore, User: userStore } = store;
  const { filters, setFilters, fetchSummaryData, summaryData } = summaryStore;
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserDetails, setSelectedUserDetails] = useState<any>(null);
  const [drawerData, setDrawerData] = useState<any>(null); // Changed from any[] to any
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userStore.getUsersWithAuth({ role: "user" });
        const data = Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : []);
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, [userStore]);

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    setFilters({ userId, currency: "" }); // Reset currency when user changes
    const user = users.find((u: any) => u.userId === userId);
    setSelectedUserDetails(user);
    if (user) {
        console.log("Selected user currencies:", user.currencies);
    }
  };

  const handleSearch = () => {
    if (!filters.userId) {
      alert("Please select a user");
      return;
    }
    fetchSummaryData();
  };

  const handleViewDetails = (data: any) => {
    setDrawerData(data);
    onOpen();
  };

  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= currentYear - 5; i--) {
    years.push(i.toString());
  }

  return (
    <Box p={4}>
      <Flex direction="column" gap={6}>
        <Box bg="white" p={6} rounded="xl" shadow="sm" border="1px solid" borderColor="gray.100">
          <Heading size="md" mb={6}>Summary Filters</Heading>
          <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)", lg: "repeat(5, 1fr)" }} gap={4} alignItems="flex-end">
            <FormControl>
              <FormLabel fontSize="sm">User</FormLabel>
              <Select placeholder="Select User" value={filters.userId} onChange={handleUserChange}>
                {users.map((u: any) => (
                  <option key={u.userId} value={u.userId}>{u.userName}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Exposure Type</FormLabel>
              <Select value={filters.exposureType} onChange={(e) => setFilters({ exposureType: e.target.value })}>
                <option value="export">Export</option>
                <option value="import">Import</option>
                <option value="total">Total</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Currency</FormLabel>
              <Select placeholder="Select Currency" value={filters.currency} onChange={(e) => setFilters({ currency: e.target.value })}>
                {selectedUserDetails?.currencies?.map((curr: string) => (
                  <option key={curr} value={curr}>{curr}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Year</FormLabel>
              <Select value={filters.year} onChange={(e) => setFilters({ year: e.target.value })}>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </Select>
            </FormControl>

            <Button colorScheme="blue" onClick={handleSearch} isLoading={summaryData.loading} w="full">
              Search
            </Button>
          </Grid>
        </Box>

        {summaryData.data && (
          <SummaryTable 
            data={[...(summaryData.data || [])]} 
            loading={summaryData.loading} 
            exposureType={filters.exposureType}
            onViewDetails={handleViewDetails}
          />
        )}
      </Flex>

      <SummaryDetailsDrawer 
        isOpen={isOpen} 
        onClose={onClose} 
        data={drawerData} 
        exposureType={filters.exposureType}
      />
    </Box>
  );
});

export default SummaryPage;
