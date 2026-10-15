import { Badge, Box, Divider, Flex, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const HEDGED_COLOR = "#38A169";
const UNHEDGED_COLOR = "#3182CE";

const toPercentage = (value?: string) => Number.parseFloat(value || "0") || 0;

const formatAmount = (value?: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

type AmountRow = {
  label: string;
  hint: string;
  value: number;
  color: string;
};

type ChartCard = {
  label: string;
  caption: string;
  accent: string;
  hedged: number;
  unhedged: number;
  amounts: AmountRow[];
};

const ExposureChart = ({ data }: { data?: any }) => {
  const exportHedged = toPercentage(
    data?.totalExportHedgeStatus?.totalExportHedgeStatus
  );
  const exportUnhedged = toPercentage(
    data?.totalExportHedgeStatus?.totalExportUnhedgeStatus
  );

  const importHedged = toPercentage(
    data?.totalImportHedgeStatus?.totalImportHedgeStatus
  );
  const importUnhedged = toPercentage(
    data?.totalImportHedgeStatus?.totalImportUnedgeStatus
  );

  const netHedged = toPercentage(
    data?.totalNetExposureHedgeStatus?.netExposureHedgeStatus
  );
  const netUnhedged = Math.max(0, 100 - netHedged);

  const exportAmounts = {
    hedged: Number(data?.totalExportHedgeStatus?.totalHedgeExport) || 0,
    forward: Number(data?.totalExportHedgeStatus?.totalHedgeForward) || 0,
  };

  const importAmounts = {
    hedged: Number(data?.totalImportHedgeStatus?.totalHedgeImport) || 0,
    forward: Number(data?.totalImportHedgeStatus?.totalHedgeForward) || 0,
  };

  const netAmounts = {
    exposure: Number(data?.totalNetExposureHedgeStatus?.netExposure) || 0,
    hedged: Number(data?.totalNetExposureHedgeStatus?.netHedging) || 0,
  };

  const charts: ChartCard[] = [
    {
      label: "Exports",
      caption: "Receivables exposed to currency movement",
      accent: "green.400",
      hedged: exportHedged,
      unhedged: exportUnhedged,
      amounts: [
        {
          label: "Hedged Amount",
          hint: "Export value covered by hedges",
          value: exportAmounts.hedged,
          color: HEDGED_COLOR,
        },
        {
          label: "Total Forward Hedge",
          hint: "Total forward contracts booked",
          value: exportAmounts.forward,
          color: "#805AD5",
        },
      ],
    },
    {
      label: "Imports",
      caption: "Payables exposed to currency movement",
      accent: "blue.400",
      hedged: importHedged,
      unhedged: importUnhedged,
      amounts: [
        {
          label: "Hedged Amount",
          hint: "Import value covered by hedges",
          value: importAmounts.hedged,
          color: HEDGED_COLOR,
        },
        {
          label: "Total Forward Hedge",
          hint: "Total forward contracts booked",
          value: importAmounts.forward,
          color: "#805AD5",
        },
      ],
    },
    {
      label: "Net Exposure",
      caption: "Exports minus imports, after hedging",
      accent: "purple.400",
      hedged: netHedged,
      unhedged: netUnhedged,
      amounts: [
        {
          label: "Net Exposure",
          hint: "Total open exposure",
          value: netAmounts.exposure,
          color: "#718096",
        },
        {
          label: "Net Hedging",
          hint: "Portion covered by hedges",
          value: netAmounts.hedged,
          color: HEDGED_COLOR,
        },
        {
          label: "Unhedged Amount",
          hint: "Exposure still at risk",
          value: Math.max(0, netAmounts.exposure - netAmounts.hedged),
          color: UNHEDGED_COLOR,
        },
      ],
    },
  ];

  const createChartData = (hedged: number, unhedged: number) => ({
    labels: ["Hedged", "Unhedged"],
    datasets: [
      {
        data: [Math.max(0, hedged), Math.max(0, unhedged)],
        backgroundColor: [HEDGED_COLOR, UNHEDGED_COLOR],
        borderColor: "#fff",
        borderWidth: 3,
        hoverOffset: 4,
        borderRadius: 4,
        spacing: 1,
      },
    ],
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "72%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#fff",
        borderColor: "#E2E8F0",
        borderWidth: 1,
        titleColor: "#1A202C",
        bodyColor: "#1A202C",
        cornerRadius: 8,
        padding: 10,
        callbacks: {
          label: (context: any) => ` ${context.label}: ${context.raw}%`,
        },
      },
    },
  };

  return (
    <Box
      p={{ base: 4, md: 6 }}
      borderRadius="2xl"
      bg="white"
      boxShadow="sm"
      borderWidth={1}
      borderColor="gray.200"
      animation="fadeInUp 0.4s ease forwards"
      sx={{ animationDelay: "300ms" }}
    >
      {/* Header */}
      <Flex
        justify="space-between"
        align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        gap="3"
        mb="6"
      >
        <VStack align="start" spacing="0.5">
          <Text fontSize="lg" fontWeight="semibold" color="gray.800">
            Hedge Status
          </Text>
          <Text fontSize="sm" color="gray.500">
            Hedged vs unhedged exposure across exports, imports and net position
          </Text>
        </VStack>

        <Flex gap="4" fontSize="xs" color="gray.600">
          <Flex align="center" gap="2">
            <Box w="10px" h="10px" borderRadius="full" bg={HEDGED_COLOR} />
            <Text>Hedged</Text>
          </Flex>
          <Flex align="center" gap="2">
            <Box w="10px" h="10px" borderRadius="full" bg={UNHEDGED_COLOR} />
            <Text>Unhedged</Text>
          </Flex>
        </Flex>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, md: 5 }}>
        {charts.map((chart) => (
          <Box
            key={chart.label}
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="xl"
            overflow="hidden"
            bg="white"
            minW={0}
            transition="all 0.2s ease"
            _hover={{ boxShadow: "md", borderColor: "gray.300" }}
          >
            {/* Accent bar */}
            <Box h="4px" bg={chart.accent} />

            <VStack spacing="5" p="5" align="stretch">
              {/* Card title */}
              <VStack align="start" spacing="0.5">
                <Text fontSize="md" fontWeight="semibold" color="gray.800">
                  {chart.label}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {chart.caption}
                </Text>
              </VStack>

              {/* Donut */}
              <Flex justify="center">
                <Box position="relative" w="180px" h="180px">
                  <Doughnut
                    data={createChartData(chart.hedged, chart.unhedged)}
                    options={options}
                  />
                  <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    textAlign="center"
                    pointerEvents="none"
                  >
                    <Text
                      fontSize="2xl"
                      fontWeight="bold"
                      color="gray.800"
                      lineHeight="1"
                    >
                      {chart.hedged}%
                    </Text>
                    <Text fontSize="xs" color="gray.500" mt="1">
                      Hedged
                    </Text>
                  </Box>
                </Box>
              </Flex>

              {/* Percentage pills */}
              <Flex gap="2" justify="center" wrap="wrap">
                <Badge
                  px="2.5"
                  py="1"
                  borderRadius="full"
                  bg="green.50"
                  color="green.700"
                  fontWeight="medium"
                  textTransform="none"
                  fontSize="xs"
                >
                  ● Hedged {chart.hedged}%
                </Badge>
                <Badge
                  px="2.5"
                  py="1"
                  borderRadius="full"
                  bg="blue.50"
                  color="blue.700"
                  fontWeight="medium"
                  textTransform="none"
                  fontSize="xs"
                >
                  ● Unhedged {chart.unhedged}%
                </Badge>
              </Flex>

              <Divider borderColor="gray.100" />

              {/* Amount breakdown */}
              <Box>
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  color="gray.500"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  mb="3"
                >
                  Amount Breakdown
                </Text>

                <VStack spacing="2" align="stretch">
                  {chart.amounts.map((item) => (
                    <Flex
                      key={item.label}
                      justify="space-between"
                      align="center"
                      gap="3"
                      p="3"
                      borderRadius="lg"
                      bg="gray.50"
                      borderLeftWidth="3px"
                      borderLeftColor={item.color}
                    >
                      <Box minW={0}>
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          color="gray.700"
                        >
                          {item.label}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {item.hint}
                        </Text>
                      </Box>
                      <Text
                        fontSize="sm"
                        fontWeight="bold"
                        color="gray.900"
                        textAlign="right"
                        whiteSpace="nowrap"
                      >
                        {formatAmount(item.value)}
                      </Text>
                    </Flex>
                  ))}
                </VStack>
              </Box>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default ExposureChart;