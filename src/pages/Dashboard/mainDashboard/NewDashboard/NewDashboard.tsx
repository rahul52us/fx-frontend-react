import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  HStack,
  Select,
  Skeleton,
  Text,
  useToast,
  VStack
} from "@chakra-ui/react";
import axios from "axios";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dashboard } from "../../../../config/constant/routes";
import store from "../../../../store/store";

import {
  FiActivity,
  FiBookOpen,
  FiClipboard,
  FiDollarSign,
  FiHome,
  FiLayers,
  FiRepeat,
  FiShield,
  FiTrendingDown,
  FiTrendingUp
} from "react-icons/fi";
import CurrencyDistributionCharts from "./CurrencyDistributionCharts";
import ExposureChart from "./ExposureChart";
// import HedgingSummaryTable from "./HedgingSummaryTable";
import HedgingSummaryTable from "./HedgingSummaryTable";
import KpiCard from "./KpiCard";
import ModuleCard from "./ModuleCard";

// import KpiCard from "@/components/dashboard/KpiCard";
// import ModuleCard from "@/components/dashboard/ModuleCard";
// import ExposureChart from "@/components/dashboard/ExposureChart";
// import CurrencyPieChart from "@/components/dashboard/CurrencyPieChart";
// import MaturityChart from "@/components/dashboard/MaturityChart";
// import RecentActivity from "@/components/dashboard/RecentActivity";

// import { toast } from "";

const modules = [
  {
    title: "Export Register",
    description: "Track export exposures & shipments",
    icon: FiTrendingUp,
    count: 156,
    color: "green.500",
    bg: "green.100"
  },
  {
    title: "Import Register",
    description: "Manage import exposures & hedging",
    icon: FiTrendingDown,
    count: 98,
    color: "blue.500",
    bg: "blue.100"
  },
  {
    title: "Forward Register",
    description: "Forward contracts & utilization",
    icon: FiRepeat,
    count: 47,
    color: "orange.400",
    bg: "orange.100"
  },
  {
    title: "PCFC Register",
    description: "Pre-shipment credit",
    icon: FiHome,
    count: 23,
    color: "purple.500",
    bg: "purple.100"
  },
  {
    title: "Settlement Register",
    description: "Exposure settlement & P/L",
    icon: FiClipboard,
    count: 89,
    color: "teal.500",
    bg: "teal.100"
  },
  {
    title: "EEFC Register",
    description: "Exchange earner's FC account",
    icon: FiDollarSign,
    count: 12,
    color: "purple.500",
    bg: "purple.100"
  },
  {
    title: "MTM Register",
    description: "Mark-to-market valuations",
    icon: FiActivity,
    count: 47,
    color: "red.500",
    bg: "red.100"
  },
  {
    title: "RP Forms",
    description: "Regulatory & reporting forms",
    icon: FiBookOpen,
    count: 8,
    color: "gray.500",
    bg: "gray.100"
  },
  {
    key: "forwardCancellation",
    title: "Forward Cancellation",
    description: "Manage forward cancellations",
    icon: FiRepeat,
    count: 0,
    color: "red.500",
    bg: "red.100",
    link: dashboard.forwardCancellation
  }
];

const NewDashboard = observer(() => {
    const navigate = useNavigate();
    const {
        auth: { getDashboardCountsss, viewAsUserId },
      } = store;

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [dashboardLoading, setDashboardLoading] = useState(true);

    // USD Summary States
    const [usdSummaryData, setUsdSummaryData] = useState<any>(null);
    const [usdLoading, setUsdLoading] = useState(false);
    const [usdFilters, setUsdFilters] = useState({
      currency: "",
      bank: "",
      businessUnit: "",
      year: new Date().getFullYear().toString(),
      financialYear: ""
    });
    const [usersList, setUsersList] = useState<any[]>([]);
    const [selectedUserDetails, setSelectedUserDetails] = useState<any>(null);

    // Fetch users to populate currency/bank dropdowns
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await store.User.getUsersWithAuth({ role: "user" });
          const userData = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
          setUsersList(userData);
        } catch (err) {
          console.error("Failed to fetch users", err);
        }
      };
      if (store.auth.user?.role === "admin") {
        fetchUsers();
      }
    }, []);

    // Update selected user details when viewAsUserId changes
    useEffect(() => {
      if (viewAsUserId && usersList.length > 0) {
        const user = usersList.find((u: any) => u.userId === viewAsUserId);
        setSelectedUserDetails(user);
        // Reset filters when user changes
        setUsdFilters(prev => ({ ...prev, currency: "", bank: "", businessUnit: "" }));
      }
    }, [viewAsUserId, usersList]);

    useEffect(() => {
      const fetchDashboard = async () => {
        setDashboardLoading(true);
        try {
          const response = await axios.post("/api/dashboard/", {
            currency: usdFilters.currency,
            businessUnit: usdFilters.businessUnit,
            bank: usdFilters.bank
          });
          const result = response.data?.chartData
            ? response.data
            : response.data?.data;
          setDashboardData(result || null);
        } catch (error) {
          console.error("Failed to fetch dashboard data", error);
          setDashboardData(null);
        } finally {
          setDashboardLoading(false);
        }
      };

      fetchDashboard();
    }, [usdFilters.currency, usdFilters.businessUnit, usdFilters.bank, viewAsUserId]);

    // Fetch USD Summary Data
    useEffect(() => {
      const fetchUSD = async () => {
        setUsdLoading(true);
        try {
          const payload = {
            userId: viewAsUserId,
            exposureType: { value: "total" },
            currency: usdFilters.currency,
            year: usdFilters.financialYear ? "" : usdFilters.year,
            financialYear: usdFilters.financialYear,
            businessUnit: usdFilters.businessUnit,
            bank: usdFilters.bank
          };
          const { data } = await axios.post(`/mtmview/summary/`, payload);
          setUsdSummaryData(data?.data);
        } catch (error) {
          console.error("Failed to fetch USD summary", error);
        } finally {
          setUsdLoading(false);
        }
      };
      if (viewAsUserId) {
        fetchUSD();
      }
    }, [viewAsUserId, usdFilters]);

    useEffect(() => {
        const fetchData = async () => {
          setLoading(true);
          try {
            const response: any = await getDashboardCountsss({ userId: viewAsUserId });
            if (response?.status === "success") {
              setData(response.data);
            }
          } catch (error: any) {
            console.error("Failed to fetch dashboard counts", error);
          } finally {
            setLoading(false);
          }
        };
        if (viewAsUserId) {
          fetchData();
        }
      }, [getDashboardCountsss, viewAsUserId]);

    const toast = useToast();
  const handleModuleClick = (link?: string, title?: string) => {
    if (link) {
        navigate(link);
    } else {
        toast({
            title: title || "Module Clicked",
            status: "info",
            duration: 3000,
            isClosable: true
          })
    }
  };

  // Map real data to modules
  const updatedModules = modules.map(mod => {
    const key = mod.title === "Export Register" ? "export" :
                mod.title === "Import Register" ? "import" :
                mod.title === "Forward Register" ? "forwardRegister" :
                mod.title === "PCFC Register" ? "pcfc" :
                mod.title === "Settlement Register" ? "exposure" :
                mod.title === "EEFC Register" ? "eefc" :
                mod.title === "Forward Cancellation" ? "forwardCancellation" : null;
    
    const count = key && data?.[key]?.total ? data[key].total : 0;
    const pending = key && data?.[key]?.pending ? data[key].pending : 0;
    const approved = key && data?.[key]?.approved ? data[key].approved : 0;
    const rejected = key && data?.[key]?.rejected ? data[key].rejected : 0;
    
    // Assign links if not present or mapping
    let link = (mod as any).link;
    if (!link) {
        if (mod.title === "Export Register") link = dashboard.exportRegister;
        if (mod.title === "Import Register") link = dashboard.importRegister;
        if (mod.title === "Forward Register") link = dashboard.forwardRegister;
        if (mod.title === "PCFC Register") link = dashboard.pcfc;
        if (mod.title === "Settlement Register") link = dashboard.dailyExposureSheet;
        if (mod.title === "EEFC Register") link = dashboard.eefcRegister;
        if (mod.title === "MTM Register") link = dashboard.mtm;
        if (mod.title === "RP Forms") link = dashboard.rp;
    }

    return { ...mod, count, pending, approved, rejected, link };
  });

  // Dynamic USD Summary mapping
  const colors = [
    { color: "green.500", bg: "green.100", icon: FiTrendingUp },
    { color: "blue.500", bg: "blue.100", icon: FiTrendingDown },
    { color: "purple.500", bg: "purple.100", icon: FiLayers },
    { color: "orange.400", bg: "orange.100", icon: FiRepeat },
    { color: "teal.500", bg: "teal.100", icon: FiShield },
    { color: "red.500", bg: "red.100", icon: FiActivity }
  ];

  const usdSummaryKpis = Object.entries(usdSummaryData || {})
    .filter(([key, value]: any) => value && typeof value === 'object' && value.total !== undefined && !key.toLowerCase().includes('rate'))
    .map(([key, value]: any, index) => {
       const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase());
       
       const possibleRateKey = Object.keys(usdSummaryData).find(k => 
         k.toLowerCase().includes(key.toLowerCase()) && 
         k.toLowerCase().includes('rate')
       );
       
       let secondaryText = "";
       if (possibleRateKey && usdSummaryData[possibleRateKey]?.total !== undefined) {
           secondaryText = `Rate: ${Number(usdSummaryData[possibleRateKey].total).toFixed(4)}`;
       } else {
           secondaryText = "Total Amount";
       }

       return {
          title,
          value: Number(value.total).toLocaleString() || "0",
          change: secondaryText,
          changeType: "neutral" as const,
          ...colors[index % colors.length]
       };
    });

  const chartData = dashboardData?.chartData;
  const tableInformation = dashboardData?.tableInformation;
  const policyEntries =
    selectedUserDetails?.policyCriteria?.entries || store.auth.user?.policyCriteria?.entries || [];
  const selectedPolicy =
    policyEntries.find((entry: any) =>
      usdFilters.businessUnit && entry.businessUnitCode === usdFilters.businessUnit
    ) || policyEntries.find((entry: any) => !entry.businessUnitCode) || policyEntries[0];
  const dashboardBasis = selectedPolicy?.basis?.toLowerCase() === "net" ? "net" : "gross";
  const kpis = [
    {
      title: "Export Hedge Status",
      value: chartData?.totalExportHedgeStatus?.totalExportHedgeStatus || "0 %",
      change: `Hedged forward: ${Number(chartData?.totalExportHedgeStatus?.totalHedgeForward || 0).toLocaleString()}`,
      icon: FiTrendingUp,
      color: "green.500",
      bg: "green.100"
    },
    {
      title: "Import Hedge Status",
      value: chartData?.totalImportHedgeStatus?.totalImportHedgeStatus || "0 %",
      change: `Hedged forward: ${Number(chartData?.totalImportHedgeStatus?.totalHedgeForward || 0).toLocaleString()}`,
      icon: FiTrendingDown,
      color: "blue.500",
      bg: "blue.100"
    },
    {
      title: "Net Exposure Hedge Status",
      value: chartData?.totalNetExposureHedgeStatus?.netExposureHedgeStatus || "0 %",
      change: `Net exposure: ${Number(chartData?.totalNetExposureHedgeStatus?.netExposure || 0).toLocaleString()}`,
      icon: FiShield,
      color: "purple.500",
      bg: "purple.100"
    },
    {
      title: "Forward MTM (INR)",
      value: Number(tableInformation?.currencyWiseForwardMtm?.currency?.mtmInInr || 0).toLocaleString(),
      change: `Total: INR ${Number(tableInformation?.currencyWiseForwardMtm?.totalInrValue || 0).toLocaleString()}`,
      icon: FiRepeat,
      color: "orange.400",
      bg: "orange.100"
    }
  ];

  const formatAmount = (value: unknown) =>
    Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

  const financialYears: string[] = [];
  const currentYear = new Date().getFullYear();
  for (let i = 0; i < 6; i++) {
    const y = currentYear - i;
    const fy = `${y - 1}-${y.toString().slice(-2)}`;
    financialYears.push(fy);
  }

  return (
    <Box minH="100vh" bg="gray.50">
      
      {/* Header */}
      {/* <Box
        top="0"
        zIndex="50"
        bg="whiteAlpha.800"
        backdropFilter="blur(8px)"
        borderBottom="1px solid"
        borderColor="gray.200"
      >
        <Box >
          <Flex justify="space-between" align="center">
            
            <HStack spacing="3">
              <Box p="2" borderRadius="xl" bg="blue.100">
                <Box as={FiBarChart2} boxSize="6" color="blue.500" />
              </Box>

              <Box>
                <Text fontSize="xl" fontWeight="bold">
                  FX Management
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Foreign Exchange Dashboard
                </Text>
              </Box>
            </HStack>

            <HStack
              display={{ base: "none", sm: "flex" }}
              spacing="2"
              fontSize="xs"
              color="gray.500"
              bg="gray.100"
              px="3"
              py="1.5"
              borderRadius="full"
            >
              <FiLayers />
              <Text>Live Data</Text>
              <Box w="2" h="2" bg="green.400" borderRadius="full" />
            </HStack>

          </Flex>
        </Box>
      </Box> */}

      {/* Main */}
      <Container maxW="8xl" py="8">
        <VStack spacing="8" align="stretch">

          {/* KPI */}
          <Box>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="gray.500"
              textTransform="uppercase"
              mb="4"
            >
              Key Metrics
            </Text>

            <Grid templateColumns={{ base: "1fr", sm: "repeat(2,1fr)", lg: "repeat(4,1fr)" }} gap="4">
              {dashboardLoading ? Array(4).fill(0).map((_, index) => (
                <Skeleton key={index} height="120px" borderRadius="xl" />
              )) : kpis.map((kpi, i) => (
                <KpiCard
                  key={kpi.title}
                  {...kpi}
                  delay={i * 80}
                  onClick={() => handleModuleClick(undefined, kpi.title)}
                />
              ))}
            </Grid>
          </Box>

          {/* USD Summary Section */}
          <Box bg="purple.50" p={{ base: 4, md: 6 }} borderRadius="2xl" border="2px solid" borderColor="purple.100" shadow="sm">
            <Flex justify="space-between" align="center" mb="6" flexWrap="wrap" gap="4">
              <HStack>
                <Box p="2" bg="purple.100" borderRadius="lg">
                  <FiDollarSign color="purple" />
                </Box>
                <Text fontSize="md" fontWeight="bold" color="purple.800" textTransform="uppercase">
                  Financial Summary
                </Text>
              </HStack>
              <HStack spacing="3" flexWrap="wrap">
                {/* User Select for Admins */}
                {store.auth.user?.role === "admin" && (
                  <Select
                    size="sm"
                    borderRadius="md"
                    value={viewAsUserId || ""}
                    onChange={(e) => store.auth.setViewAsUserId(e.target.value)}
                    bg="white"
                    w="150px"
                    borderColor="purple.200"
                  >
                    {usersList.map((user: any) => (
                      <option key={user.userId} value={user.userId}>
                        {user.basicDetails?.email?.split('@')[0] || user.firstName || "User"}
                      </option>
                    ))}
                  </Select>
                )}

                <Select
                  size="sm"
                  borderRadius="md"
                  placeholder="Currency"
                  value={usdFilters.currency}
                  onChange={(e) => setUsdFilters(prev => ({ ...prev, currency: e.target.value }))}
                  bg="white"
                  w="140px"
                  isDisabled={!viewAsUserId}
                  borderColor="purple.200"
                >
                  {selectedUserDetails?.currencies?.map((curr: string) => (
                    <option key={curr} value={curr}>{curr}</option>
                  ))}
                </Select>
                <Select
                  size="sm"
                  borderRadius="md"
                  placeholder="All business units"
                  value={usdFilters.businessUnit}
                  onChange={(e) => setUsdFilters(prev => ({ ...prev, businessUnit: e.target.value, bank: "" }))}
                  bg="white"
                  w="160px"
                  isDisabled={!viewAsUserId}
                  borderColor="purple.200"
                >
                  {selectedUserDetails?.businessUnits?.map((unit: any) => (
                    <option key={unit.unitCode} value={unit.unitCode}>{unit.unitCode}</option>
                  ))}
                </Select>
                <Select
                  size="sm"
                  borderRadius="md"
                  placeholder="All Banks"
                  value={usdFilters.bank}
                  onChange={(e) => setUsdFilters(prev => ({ ...prev, bank: e.target.value }))}
                  bg="white"
                  w="140px"
                  isDisabled={!viewAsUserId}
                  borderColor="purple.200"
                >
                  {Array.from(new Set(selectedUserDetails?.businessUnits
                    ?.filter((unit: any) => !usdFilters.businessUnit || unit.unitCode === usdFilters.businessUnit)
                    .flatMap((bu: any) => bu.banks || []).map((b: any) => b.bankName)))
                    .map((bankName: any, idx: number) => (
                      <option key={`${bankName}-${idx}`} value={bankName}>
                        {bankName}
                      </option>
                  ))}
                </Select>
                
                {/* Period Selection */}
                {usdFilters.financialYear ? (
                  <Select
                    size="sm"
                    borderRadius="md"
                    value={usdFilters.financialYear}
                    onChange={(e) => setUsdFilters(prev => ({ ...prev, financialYear: e.target.value, year: "" }))}
                    bg="white"
                    w="110px"
                    borderColor="purple.200"
                  >
                    {financialYears.map((fy) => (
                      <option key={fy} value={fy}>{fy}</option>
                    ))}
                  </Select>
                ) : (
                  <Select
                    size="sm"
                    borderRadius="md"
                    value={usdFilters.year}
                    onChange={(e) => setUsdFilters(prev => ({ ...prev, year: e.target.value, financialYear: "" }))}
                    bg="white"
                    w="100px"
                    borderColor="purple.200"
                  >
                    {Array.from({ length: 6 }).map((_, i) => {
                      const y = new Date().getFullYear() - i;
                      return <option key={y} value={y.toString()}>{y}</option>;
                    })}
                  </Select>
                )}
                
                <Button 
                  size="sm" 
                  colorScheme="purple" 
                  variant="outline"
                  bg="white"
                  onClick={() => {
                    if (usdFilters.financialYear) {
                      setUsdFilters(prev => ({ ...prev, financialYear: "", year: currentYear.toString() }));
                    } else {
                      setUsdFilters(prev => ({ ...prev, financialYear: financialYears[0], year: "" }));
                    }
                  }}
                >
                  {usdFilters.financialYear ? "Year" : "FY"}
                </Button>
              </HStack>
            </Flex>

            <Grid templateColumns={{ base: "1fr", sm: "repeat(2,1fr)", lg: "repeat(4,1fr)" }} gap="4">
              {usdLoading ? (
                Array(8).fill(0).map((_, i) => (
                    <Skeleton key={i} height="120px" borderRadius="xl" />
                ))
              ) : (
                usdSummaryKpis.map((kpi, i) => (
                    <KpiCard
                      key={kpi.title}
                      {...kpi}
                      delay={i * 40}
                      onClick={() => handleModuleClick(dashboard.mtmUSDSummary, kpi.title)}
                    />
                  ))
              )}
            </Grid>
          </Box>

          <HedgingSummaryTable
            data={usdSummaryData}
            loading={usdLoading}
            basis={dashboardBasis}
          />

          {/* Charts */}
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color="gray.500" textTransform="uppercase" mb="4">
              Analytics
            </Text>

            <Grid templateColumns="1fr" gap="4">
              <ExposureChart data={chartData} />
              <CurrencyDistributionCharts
                data={chartData?.currencyDistribution}
                basis={dashboardBasis}
              />
            </Grid>
          </Box>

          <Box>
            <Text fontSize="sm" fontWeight="semibold" color="gray.500" textTransform="uppercase" mb="4">
              Financial Position
            </Text>
            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="4">
              <Box p="5" borderRadius="xl" bg="white" boxShadow="sm">
                <Text fontWeight="semibold" color="gray.800" mb="4">Currency-wise Forward MTM</Text>
                <VStack align="stretch" spacing="2">
                  <Flex justify="space-between"><Text color="gray.500">Outstanding amount</Text><Text>{formatAmount(tableInformation?.currencyWiseForwardMtm?.currency?.outStandingAmount)}</Text></Flex>
                  <Flex justify="space-between"><Text color="gray.500">Hedge rate</Text><Text>{formatAmount(tableInformation?.currencyWiseForwardMtm?.currency?.hedgeRate)}</Text></Flex>
                  <Flex justify="space-between"><Text color="gray.500">Current forward rate</Text><Text>{formatAmount(tableInformation?.currencyWiseForwardMtm?.currency?.currentForwardRate)}</Text></Flex>
                  <Flex justify="space-between"><Text color="gray.500">MTM in INR</Text><Text fontWeight="semibold">{formatAmount(tableInformation?.currencyWiseForwardMtm?.currency?.mtmInInr)}</Text></Flex>
                </VStack>
              </Box>
              <Box p="5" borderRadius="xl" bg="white" boxShadow="sm">
                <Text fontWeight="semibold" color="gray.800" mb="4">Closing Balance</Text>
                <VStack align="stretch" spacing="2">
                  <Flex justify="space-between"><Text color="gray.500">INR balance</Text><Text>{formatAmount(tableInformation?.closingBalance?.INR?.closingBalance)}</Text></Flex>
                  <Flex justify="space-between"><Text color="gray.500">INR closing rate</Text><Text>{formatAmount(tableInformation?.closingBalance?.INR?.closingRate)}</Text></Flex>
                  <Flex justify="space-between"><Text color="gray.500">{usdFilters.currency || "Currency"} balance</Text><Text>{formatAmount(tableInformation?.closingBalance?.currency?.closingBalance)}</Text></Flex>
                  <Flex justify="space-between"><Text color="gray.500">Currency closing rate</Text><Text>{formatAmount(tableInformation?.closingBalance?.currency?.closingRate)}</Text></Flex>
                </VStack>
              </Box>
              <Box p="5" borderRadius="xl" bg="white" boxShadow="sm">
                <Text fontWeight="semibold" color="gray.800" mb="4">PCFC Outstanding</Text>
                <VStack align="stretch" spacing="2">
                  <Flex justify="space-between"><Text color="gray.500">Outstanding</Text><Text>{formatAmount(tableInformation?.totalPcfcOutstanding?.outstanding)}</Text></Flex>
                  <Flex justify="space-between"><Text color="gray.500">Drawdown rate</Text><Text>{formatAmount(tableInformation?.totalPcfcOutstanding?.drawdownRate)}</Text></Flex>
                </VStack>
              </Box>
            </Grid>
          </Box>

          {/* Modules */}
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color="gray.500" textTransform="uppercase" mb="4">
              Registers & Forms
            </Text>

            <Grid templateColumns={{ base: "1fr", sm: "repeat(2,1fr)", lg: "repeat(4,1fr)" }} gap="4">
              {loading ? (
                Array(8).fill(0).map((_, i) => (
                    <Skeleton key={i} height="80px" borderRadius="xl" />
                ))
              ) : (
                updatedModules.map((mod, i) => (
                    <ModuleCard
                      key={mod.title}
                      {...mod}
                      delay={i * 60}
                      onClick={() => handleModuleClick(mod.link, mod.title)}
                    />
                  ))
              )}
            </Grid>
          </Box>

        </VStack>
      </Container>
    </Box>
  );
});

export default NewDashboard;