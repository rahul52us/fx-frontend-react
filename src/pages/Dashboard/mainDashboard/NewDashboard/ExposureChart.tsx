import { Box, Text, VStack, SimpleGrid } from "@chakra-ui/react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const toPercentage = (value?: string) =>
  Number.parseFloat(value || "0") || 0;

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

  const charts = [
    {
      label: "Exports",
      hedged: exportHedged,
      unhedged: exportUnhedged
    },
    {
      label: "Imports",
      hedged: importHedged,
      unhedged: importUnhedged
    },
    {
      label: "Net Exposure",
      hedged: netHedged,
      unhedged: netUnhedged
    }
  ];

  const createChartData = (hedged: number, unhedged: number) => ({
    labels: ["Hedged", "Unhedged"],
    datasets: [
      {
        data: [hedged, unhedged],
        backgroundColor: ["#38A169", "#3182CE"],
        borderWidth: 0,
        hoverOffset: 5
      }
    ]
  });

  const createOptions = () => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: "#fff",
        borderColor: "#E2E8F0",
        borderWidth: 1,
        titleColor: "#1A202C",
        bodyColor: "#1A202C",
        cornerRadius: 8,
        padding: 10,
        callbacks: {
          label: (context: any) => {
            return `${context.label}: ${context.raw}%`;
          }
        }
      }
    }
  });

  return (
    <Box
      p="6"
      borderRadius="2xl"
      bg="white"
      boxShadow="sm"
      borderWidth={1}
      borderColor="gray.200"
      animation="fadeInUp 0.4s ease forwards"
      sx={{ animationDelay: "300ms" }}
    >
      <VStack align="start" spacing="1" mb="5">
        <Text fontWeight="semibold" color="gray.800">
          Hedge Status
        </Text>

        <Text fontSize="xs" color="gray.500">
          Hedged vs unhedged exposure (%)
        </Text>
      </VStack>

      <SimpleGrid
        columns={{ base: 1, md: 3 }}
        spacing={{ base: 6, md: 4 }}
        alignItems="center"
      >
        {charts.map((chart) => (
          <VStack key={chart.label} spacing="3">
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="gray.700"
            >
              {chart.label}
            </Text>

            <Box
              position="relative"
              w="180px"
              h="180px"
            >
              <Pie
                data={createChartData(
                  chart.hedged,
                  chart.unhedged
                )}
                options={createOptions()}
              />

              {/* Center Percentage */}
              <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                textAlign="center"
                pointerEvents="none"
              >
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  color="gray.800"
                  lineHeight="1"
                >
                  {chart.hedged}%
                </Text>

                <Text
                  fontSize="10px"
                  color="gray.500"
                  mt="1"
                >
                  Hedged
                </Text>
              </Box>
            </Box>

            {/* Legend */}
            <Box
              display="flex"
              alignItems="center"
              gap="4"
              fontSize="xs"
              color="gray.600"
            >
              <Box display="flex" alignItems="center" gap="1.5">
                <Box
                  w="8px"
                  h="8px"
                  borderRadius="full"
                  bg="#38A169"
                />
                <Text>
                  Hedged {chart.hedged}%
                </Text>
              </Box>

              <Box display="flex" alignItems="center" gap="1.5">
                <Box
                  w="8px"
                  h="8px"
                  borderRadius="full"
                  bg="#3182CE"
                />
                <Text>
                  Unhedged {chart.unhedged}%
                </Text>
              </Box>
            </Box>
          </VStack>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default ExposureChart;