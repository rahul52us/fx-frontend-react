import {
  Box,
  Flex,
  HStack,
  SimpleGrid,
  Skeleton,
  Text,
  Tooltip
} from "@chakra-ui/react";
import React from "react";

type TxRecord = Record<string, number | string>;

export interface TransactionWithin15DaysProps {
  data?: {
    export?: TxRecord;
    import?: TxRecord;
  } | null;
  loading?: boolean;
}

/* ---------- Config ---------- */

const FIELD_LABELS: Record<string, string> = {
  exportInput: "Export input",
  importInput: "Import input",
  forwardBooked: "Forward booked",
  settlementAmount: "Settlement",
  settlementAmountInInr: "Settlement (INR)",
  forwardUtilizedExposure: "Utilized on exposure",
  forwardUtilizedPcfc: "Utilized on PCFC",
  cancellationAmount: "Cancelled"
};

/** Amount field -> the rate field(s) that belong to it (first match wins). */
const RATE_FOR: Record<string, string[]> = {
  exportInput: ["expWeightedAvgRate"],
  importInput: ["impWeightedAvgRate"],
  forwardBooked: ["forwardWeightedRate"],
  forwardUtilizedExposure: ["forwardUtilizedWeightedAvgRateExposure"],
  forwardUtilizedPcfc: ["forwardUtilizedWeightedAvgRatePcfc"],
  cancellationAmount: ["bookedRate", "bookedrate"]
};

const HERO_KEYS = ["exportInput", "importInput"];
const COVER_KEY = "forwardBooked";

/* ---------- Helpers ---------- */

const isRateField = (key: string) => key.toLowerCase().includes("rate");

const formatLabel = (key: string): string =>
  FIELD_LABELS[key] ??
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();

const toNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return isNaN(n) ? null : n;
};

const formatValue = (key: string, value: unknown): string => {
  const n = toNumber(value);
  if (n === null) return value === null || value === undefined || value === "" ? "—" : String(value);
  return isRateField(key)
    ? n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })
    : n.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

interface Metric {
  key: string;
  label: string;
  value: string;
  rate?: string;
}

/** Splits a raw record into a hero metric, a cover ratio, and secondary metrics. */
const buildModel = (record?: TxRecord) => {
  const rec = record || {};
  const keys = Object.keys(rec);
  const consumedRates = new Set<string>();

  const toMetric = (key: string): Metric => {
    const rateKey = (RATE_FOR[key] || []).find((rk) => rk in rec);
    if (rateKey) consumedRates.add(rateKey);
    return {
      key,
      label: formatLabel(key),
      value: formatValue(key, rec[key]),
      rate: rateKey ? formatValue(rateKey, rec[rateKey]) : undefined
    };
  };

  const heroKey = HERO_KEYS.find((k) => k in rec);
  const hero = heroKey ? toMetric(heroKey) : undefined;

  const heroNum = heroKey ? toNumber(rec[heroKey]) : null;
  const bookedNum = toNumber(rec[COVER_KEY]);
  const cover =
    heroNum && heroNum > 0 && bookedNum !== null
      ? Math.max(0, Math.min(100, (bookedNum / heroNum) * 100))
      : null;

  // Pair amounts with their rates first, then pick up anything left over.
  const rest: Metric[] = [];
  keys
    .filter((k) => k !== heroKey && !isRateField(k))
    .forEach((k) => rest.push(toMetric(k)));
  keys
    .filter((k) => isRateField(k) && k !== heroKey && !consumedRates.has(k) && !(heroKey && (RATE_FOR[heroKey] || []).includes(k)))
    .forEach((k) =>
      rest.push({ key: k, label: formatLabel(k), value: formatValue(k, rec[k]) })
    );

  return { hero, cover, rest, isEmpty: keys.length === 0 };
};

/* ---------- Small pieces ---------- */

const RateChip = ({ rate, color }: { rate: string; color: string }) => (
  <Tooltip label="Weighted average rate" hasArrow fontSize="xs">
    <Box
      as="span"
      display="inline-block"
      fontSize="10px"
      fontWeight="semibold"
      lineHeight="1"
      px="1.5"
      py="1"
      borderRadius="sm"
      bg={`${color}.50`}
      color={`${color}.700`}
      whiteSpace="nowrap"
    >
      @ {rate}
    </Box>
  </Tooltip>
);

const StatTile = ({ metric, color }: { metric: Metric; color: string }) => (
  <Box bg="gray.50" borderRadius="md" px="3" py="2" minW="0">
    <Text fontSize="11px" color="gray.500" noOfLines={1} title={metric.label}>
      {metric.label}
    </Text>
    <Text
      mt="0.5"
      fontSize="md"
      fontWeight="semibold"
      color="gray.800"
      lineHeight="1.3"
      noOfLines={1}
      title={metric.value}
    >
      {metric.value}
    </Text>
    {metric.rate && (
      <Box mt="1">
        <RateChip rate={metric.rate} color={color} />
      </Box>
    )}
  </Box>
);

/* ---------- One side (Export / Import) ---------- */

const SidePanel = ({
  title,
  color,
  record,
  loading
}: {
  title: string;
  color: "green" | "blue";
  record?: TxRecord;
  loading?: boolean;
}) => {
  const { hero, cover, rest, isEmpty } = buildModel(record);

  return (
    <Box
      position="relative"
      bg="white"
      borderWidth="1px"
      borderColor="gray.100"
      borderRadius="lg"
      overflow="hidden"
      px="4"
      pt="4"
      pb="3"
    >
      {/* accent edge identifies the side without extra labels */}
      <Box position="absolute" top="0" left="0" bottom="0" w="3px" bg={`${color}.400`} />

      <Text fontSize="xs" fontWeight="semibold" color="gray.600">
        {title}
      </Text>

      {loading ? (
        <Box mt="3">
          <Skeleton h="28px" w="55%" borderRadius="sm" />
          <Skeleton h="6px" mt="4" borderRadius="full" />
          <SimpleGrid columns={2} spacing="2" mt="4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} h="56px" borderRadius="md" />
            ))}
          </SimpleGrid>
        </Box>
      ) : isEmpty ? (
        <Text fontSize="xs" color="gray.400" py="6" textAlign="center">
          No transactions in the next 15 days
        </Text>
      ) : (
        <>
          {hero && (
            <Flex align="baseline" gap="2" mt="1" wrap="wrap">
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color="gray.800"
                lineHeight="1.2"
                title={hero.value}
              >
                {hero.value}
              </Text>
              {hero.rate && <RateChip rate={hero.rate} color={color} />}
            </Flex>
          )}
          {hero && (
            <Text fontSize="11px" color="gray.500">
              {hero.label}
            </Text>
          )}

          {cover !== null && (
            <Box mt="3">
              <Flex justify="space-between" mb="1">
                <Text fontSize="11px" color="gray.500">
                  Hedged with forwards
                </Text>
                <Text fontSize="11px" fontWeight="semibold" color="gray.700">
                  {cover.toFixed(0)}%
                </Text>
              </Flex>
              <Box h="6px" bg="gray.100" borderRadius="full" overflow="hidden">
                <Box
                  h="full"
                  w={`${cover}%`}
                  bg={`${color}.400`}
                  borderRadius="full"
                  transition="width 0.4s ease"
                />
              </Box>
            </Box>
          )}

          {rest.length > 0 && (
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing="2" mt="4">
              {rest.map((m) => (
                <StatTile key={m.key} metric={m} color={color} />
              ))}
            </SimpleGrid>
          )}
        </>
      )}
    </Box>
  );
};

/* ---------- Main component ---------- */

export const TransactionWithin15Days: React.FC<TransactionWithin15DaysProps> = ({
  data,
  loading = false
}) => (
  <Box>
    <HStack justify="space-between" align="baseline" mb="2" px="1">
      <Text fontSize="md" fontWeight="semibold" color="gray.800">
        Transactions within 15 days
      </Text>
      <Text fontSize="xs" color="gray.400">
        Upcoming hedging activity
      </Text>
    </HStack>

    <SimpleGrid columns={{ base: 1, md: 2 }} spacing="3">
      <SidePanel title="Export" color="green" record={data?.export} loading={loading} />
      <SidePanel title="Import" color="blue" record={data?.import} loading={loading} />
    </SimpleGrid>
  </Box>
);

export default TransactionWithin15Days;