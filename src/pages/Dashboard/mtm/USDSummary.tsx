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

  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= currentYear - 5; i--) {
    years.push(i.toString());
  }

  const financialYears: string[] = [];
  for (let i = 0; i < 5; i++) {
    const y = currentYear - i;
    const fy = `${y - 1}-${y.toString().slice(-2)}`;
    financialYears.push(fy);
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
    <Box>
      <Flex direction="column" gap={6}>
        <Box
          bg={bg}
          p={5}
          rounded="2xl"
          shadow="md"
          border="1px solid"
          borderColor={borderColor}
        >
          <Heading size="md" mb={6} color={useColorModeValue("teal.700", "teal.200")}>
            Summary
          </Heading>
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
              xl: "repeat(6, 1fr)",
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

            {/* <FormControl>
              <FormLabel fontSize="sm">Exposure Type</FormLabel>
              <Select
                value={filters.exposureType}
                onChange={(e) => setFilters({ exposureType: e.target.value })}
                bg={bg}
              >
                <option value="export">Export</option>
                <option value="import">Import</option>
                <option value="total">Total</option>
              </Select>
            </FormControl> */}


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

            {/* Period Selection (Year vs Fin Year) */}
            <FormControl>
              <FormLabel fontSize="sm">
                {filters.financialYear ? "Financial Year" : "Calendar Year"}
              </FormLabel>
              <Flex gap={2}>
                {filters.financialYear ? (
                  <Select
                    value={filters.financialYear}
                    onChange={(e) => setFilters({ financialYear: e.target.value, year: "" })}
                    bg={bg}
                  >
                    {financialYears.map((fy) => (
                      <option key={fy} value={fy}>
                        {fy}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Select
                    value={filters.year}
                    onChange={(e) => setFilters({ year: e.target.value, financialYear: "" })}
                    bg={bg}
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </Select>
                )}
                <Button
                  size="md"
                  variant="outline"
                  bg={useColorModeValue('teal.50', 'teal.900')}
                  onClick={() => {
                    if (filters.financialYear) {
                      setFilters({ financialYear: "", year: currentYear.toString() });
                    } else {
                      setFilters({ financialYear: financialYears[0], year: "" });
                    }
                  }}
                  px={4}
                >
                  {filters.financialYear ? "Year" : "FY"}
                </Button>
              </Flex>
            </FormControl>


            <Button
              colorScheme="teal"
              onClick={handleSearch}
              isLoading={usdSummaryData.loading}
              w="full"
              mt={2}
            >
              Fetch Summary
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
            <Text color="gray.500">Pick a user and click "Fetch Summary" to view data.</Text>
          </Center>
        ) : null}
        
        {usdSummaryData.loading && (
           <Center py={20}>
              <Spinner size="xl" color="teal.500" />
           </Center>
        )}
      </Flex>
    </Box>
  );
});

export default MTMUSDSummary;
