import { Box, SimpleGrid, Tag, Text, VStack } from "@chakra-ui/react";
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

type CurrencyValues = Record<string, number | string>;

interface CurrencyDistribution {
  export?: CurrencyValues;
  import?: CurrencyValues;
  net?: CurrencyValues;
}

interface CurrencyDistributionChartsProps {
  data?: CurrencyDistribution;
  basis: "gross" | "net";
}

const getCurrencySlices = (values?: CurrencyValues) =>
  Object.entries(values || {}).filter(
    ([currency, value]) =>
      currency !== "totalInrValue" &&
      Number.isFinite(Number(value)) &&
      Number(value) > 0
  );

const getCurrencyColor = (index: number) => {
  const colors = [
    "#3182CE",
    "#38A169",
    "#D69E2E",
    "#805AD5",
    "#319795"
  ];

  return (
    colors[index] ||
    `hsl(${(index * 67) % 360}, 58%, 48%)`
  );
};

const CurrencyDonut = ({
  title,
  values
}: {
  title: string;
  values?: CurrencyValues;
}) => {
  const slices = getCurrencySlices(values);

  const totalInrValue = Number(
    values?.totalInrValue || 0
  );

  const chartData = {
    labels: slices.map(([currency]) => currency),

    datasets: [
      {
        data: slices.map(([, amount]) =>
          Number(amount)
        ),

        backgroundColor: slices.map((_, index) =>
          getCurrencyColor(index)
        ),

        borderWidth: 0,
        spacing: 3,
        hoverOffset: 6
      }
    ]
  };

  const options: any = {
    cutout: "60%",

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          font: {
            size: 12
          }
        }
      },

      tooltip: {
        backgroundColor: "#fff",
        borderColor: "#E2E8F0",
        borderWidth: 1,
        titleColor: "#1A202C",
        bodyColor: "#1A202C",
        cornerRadius: 8,

        callbacks: {
          label: (context: any) =>
            `${context.label}: ${Number(
              context.raw
            ).toLocaleString()}`
        }
      }
    }
  };

  return (
    <Box
      p="6"
      borderRadius="xl"
      bg="white"
      boxShadow="sm"
      animation="fadeInUp 0.4s ease forwards"
    >
      <VStack
        align="start"
        spacing="1"
        mb="4"
      >
        <Text
          fontWeight="semibold"
          color="gray.800"
        >
          {title}
        </Text>

        <Text
          // fontSize="sm"
          color="gray.500"
        >
          Total INR:{" "}
          <Tag colorScheme="blue" rounded={'full'}>

          {totalInrValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </Tag>
        </Text>
      </VStack>

      <Box
        h="280px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {slices.length > 0 ? (
          <Doughnut
            data={chartData}
            options={options}
          />
        ) : (
          <Text
            fontSize="sm"
            color="gray.500"
          >
            No currency distribution available
          </Text>
        )}
      </Box>
    </Box>
  );
};

const CurrencyDistributionCharts = ({
  data,
  basis
}: CurrencyDistributionChartsProps) => {
  // GROSS
  if (basis === "gross") {
    return (
      <SimpleGrid
        columns={{
          base: 1,
          md: 2
        }}
        spacing="4"
      >
        <CurrencyDonut
          title="Export Currency Distribution"
          values={data?.export}
        />

        <CurrencyDonut
          title="Import Currency Distribution"
          values={data?.import}
        />
      </SimpleGrid>
    );
  }

  // NET
  const netValues =
    data?.net ||
    (() => {
      const exportCurrencies = getCurrencySlices(data?.export);
      const importCurrencies = getCurrencySlices(data?.import);

      const combined: CurrencyValues = {
        totalInrValue:
          Number(data?.export?.totalInrValue || 0) +
          Number(data?.import?.totalInrValue || 0)
      };

      [...exportCurrencies, ...importCurrencies].forEach(
        ([currency, amount]) => {
          combined[currency] =
            Number(combined[currency] || 0) + Number(amount);
        }
      );

      return combined;
    })();

  return (
    <CurrencyDonut
      title="Net Currency Distribution"
      values={netValues}
    />
  );
};

export default CurrencyDistributionCharts;