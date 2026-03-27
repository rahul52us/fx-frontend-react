import {
    Box,
    Container,
    Flex,
    Grid,
    HStack,
    Text,
    useToast,
    VStack
} from "@chakra-ui/react";

import {
    FiActivity,
    FiBarChart2,
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
import KpiCard from "./KpiCard";
import ExposureChart from "./ExposureChart";
import CurrencyPieChart from "./CurrencyPieChart";
import MaturityChart from "./MaturityChart";
import RecentActivity from "./RecentActivity";
import ModuleCard from "./ModuleCard";

// import KpiCard from "@/components/dashboard/KpiCard";
// import ModuleCard from "@/components/dashboard/ModuleCard";
// import ExposureChart from "@/components/dashboard/ExposureChart";
// import CurrencyPieChart from "@/components/dashboard/CurrencyPieChart";
// import MaturityChart from "@/components/dashboard/MaturityChart";
// import RecentActivity from "@/components/dashboard/RecentActivity";

// import { toast } from "";

const kpis = [
  {
    title: "Total Export Exposure",
    value: "$12.4M",
    change: "+8.2% from last month",
    changeType: "positive" as const,
    icon: FiTrendingUp,
    color: "green.500",
    bg: "green.100"
  },
  {
    title: "Total Import Exposure",
    value: "$9.8M",
    change: "+3.1% from last month",
    changeType: "negative" as const,
    icon: FiTrendingDown,
    color: "blue.500",
    bg: "blue.100"
  },
  {
    title: "Open Forwards",
    value: "47",
    change: "12 maturing this month",
    changeType: "neutral" as const,
    icon: FiRepeat,
    color: "orange.400",
    bg: "orange.100"
  },
  {
    title: "Hedged Exposure",
    value: "72%",
    change: "+5% vs target",
    changeType: "positive" as const,
    icon: FiShield,
    color: "purple.500",
    bg: "purple.100"
  }
];

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
  }
];

const NewDashboard = () => {

    const toast = useToast();
  const handleModuleClick = (title: string) => {
    toast({
      title,
      status: "info",
      duration: 3000,
      isClosable: true
    })
  };

  return (
    <Box minH="100vh" bg="gray.50">
      
      {/* Header */}
      <Box
        position="sticky"
        top="0"
        zIndex="50"
        bg="whiteAlpha.800"
        backdropFilter="blur(8px)"
        borderBottom="1px solid"
        borderColor="gray.200"
      >
        <Box >
          <Flex justify="space-between" align="center">
            
            {/* Left */}
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

            {/* Right */}
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
      </Box>

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
              {kpis.map((kpi, i) => (
                <KpiCard
                  key={kpi.title}
                  {...kpi}
                  delay={i * 80}
                  onClick={() => handleModuleClick(kpi.title)}
                />
              ))}
            </Grid>
          </Box>

          {/* Charts */}
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color="gray.500" textTransform="uppercase" mb="4">
              Analytics
            </Text>

            <Grid templateColumns={{ base: "1fr", lg: "repeat(2,1fr)" }} gap="4">
              <ExposureChart />
              <CurrencyPieChart />
            </Grid>
          </Box>

          {/* Middle */}
          <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap="4">
            <MaturityChart />
            <RecentActivity />
          </Grid>

          {/* Modules */}
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color="gray.500" textTransform="uppercase" mb="4">
              Registers & Forms
            </Text>

            <Grid templateColumns={{ base: "1fr", sm: "repeat(2,1fr)", lg: "repeat(4,1fr)" }} gap="4">
              {modules.map((mod, i) => (
                <ModuleCard
                  key={mod.title}
                  {...mod}
                  delay={i * 60}
                  onClick={() => handleModuleClick(mod.title)}
                />
              ))}
            </Grid>
          </Box>

        </VStack>
      </Container>
    </Box>
  );
};

export default NewDashboard;