import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Select,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import store from "../../../store/store";
import SummaryTable from "./component/SummaryTable";

const SummaryPage: React.FC = observer(() => {
  const { summaryStore, User: userStore } = store;
  const { filters, setFilters, fetchSummaryData, summaryData } = summaryStore;
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserDetails, setSelectedUserDetails] = useState<any>(null);

  useEffect(() => {
    const fetchUsers = async () => {
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
    };
    fetchUsers();
  }, [userStore]);

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    setFilters({ 
      userId, 
      currency: "", 
      businessUnit: "", 
      bank: "",
    });
    const user = users.find((u: any) => u.userId === userId);
    setSelectedUserDetails(user);
  };

  const handleSearch = () => {
    if (!filters.userId) {
      alert("Please select a user");
      return;
    }
    fetchSummaryData();
  };

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

  return (
    <Box p={4}>
      <Flex direction="column" gap={6}>
        {/* ── filter bar ── */}
        <Box
          bg="white"
          p={6}
          rounded="xl"
          shadow="sm"
          border="1px solid"
          borderColor="gray.100"
        >
          <Heading size="md" mb={6}>
            Summary Filters
          </Heading>
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(3, 1fr)",
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
              >
                {users.map((u: any) => (
                  <option key={u.userId} value={u.userId}>
                    {u.userName}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Exposure Type</FormLabel>
              <Select
                value={filters.exposureType}
                onChange={(e) => setFilters({ exposureType: e.target.value })}
              >
                <option value="export">Export</option>
                <option value="import">Import</option>
                <option value="total">Total</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Currency</FormLabel>
              <Select
                placeholder="Select Currency"
                value={filters.currency}
                onChange={(e) => setFilters({ currency: e.target.value })}
                isDisabled={!filters.userId}
              >
                {selectedUserDetails?.currencies?.map((curr: string) => (
                  <option key={curr} value={curr}>
                    {curr}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Business Unit</FormLabel>
              <Select
                placeholder="All Business Units"
                value={filters.businessUnit}
                onChange={(e) => setFilters({ businessUnit: e.target.value, bank: "" })}
                isDisabled={!filters.userId}
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
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </Select>
                )}
                <Button
                  size="sm"
                  variant="outline"
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
              colorScheme="blue"
              onClick={handleSearch}
              isLoading={summaryData.loading}
              w="full"
              gridColumn={{ xl: "span 6" }}
              mt={4}
            >
              Search
            </Button>
          </Grid>
        </Box>

        {/* ── results table (expandable rows built-in) ── */}
        {summaryData.data && (
          <SummaryTable
            data={[...(summaryData.data || [])]}
            loading={summaryData.loading}
            exposureType={filters.exposureType}
          />
        )}
      </Flex>
    </Box>
  );
});

export default SummaryPage;
