import {
  Box,
  Button,
  Flex,
  HStack,
  SimpleGrid,
  Skeleton,
  Text,
  VStack
} from "@chakra-ui/react";
import React, { useState } from "react";

type TxRecord = Record<string, number | string>;

export interface TransactionWithin15DaysProps {
  data?: {
    export?: TxRecord;
    import?: TxRecord;
  } | null;
  loading?: boolean;
  /** Rows shown per side before "Show all" is needed. Default 6. */
  collapsedCount?: number;
}

const FIELD_LABELS: Record<string, string> = {
  exportInput: "Export Input",
  expWeightedAvgRate: "Weighted Avg Rate",
  importInput: "Import Input",
  impWeightedAvgRate: "Weighted Avg Rate",
  forwardBooked: "Forward Booked",
  forwardWeightedRate: "Forward Weighted Rate",
  settlementAmount: "Settlement Amount",
  settlementAmountInInr: "Settlement Amount (INR)",
  forwardUtilizedExposure: "Forward Utilized Exposure",
  forwardUtilizedWeightedAvgRateExposure: "Utilized Exposure Avg Rate",
  forwardUtilizedPcfc: "Forward Utilized PCFC",
  forwardUtilizedWeightedAvgRatePcfc: "Utilized PCFC Avg Rate",
  cancellationAmount: "Cancellation Amount",
  bookedrate: "Booked Rate",
  bookedRate: "Booked Rate"
};

const isRateField = (key: string): boolean =>
  key.toLowerCase().includes("rate");

const formatFieldLabel = (key: string): string => {
  if (FIELD_LABELS[key]) return FIELD_LABELS[key];
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
};

const formatFieldValue = (key: string, value: unknown): string => {
  if (value === null || value === undefined || value === "") return "—";
  const num = Number(value);
  if (isNaN(num)) return String(value);

  if (isRateField(key)) {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    });
  }
  return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

/* ---------- One side (Export / Import) ---------- */

const SideColumn = ({
  title,
  dotColor,
  record,
  loading,
  limit,
  expanded
}: {
  title: string;
  dotColor: string;
  record?: TxRecord;
  loading?: boolean;
  limit: number;
  expanded: boolean;
}) => {
  const entries = Object.entries(record || {});
  const visible = expanded ? entries : entries.slice(0, limit);

  return (
    <Box minW="0">
      <HStack spacing="2" mb="1">
        <Box w="8px" h="8px" borderRadius="full" bg={dotColor} />
        <Text fontSize="xs" fontWeight="semibold" color="gray.700">
          {title}
        </Text>
      </HStack>

      {loading ? (
        <VStack spacing="2" align="stretch" pt="1">
          {Array.from({ length: limit }).map((_, i) => (
            <Flex key={i} justify="space-between">
              <Skeleton h="10px" w="45%" borderRadius="sm" />
              <Skeleton h="10px" w="20%" borderRadius="sm" />
            </Flex>
          ))}
        </VStack>
      ) : entries.length === 0 ? (
        <Text fontSize="xs" color="gray.400" py="3">
          No records
        </Text>
      ) : (
        <Box>
          {visible.map(([key, value]) => {
            const rate = isRateField(key);
            return (
              <Flex
                key={key}
                justify="space-between"
                align="baseline"
                gap="3"
                py="1"
                borderBottomWidth="1px"
                borderColor="gray.50"
                _last={{ borderBottomWidth: 0 }}
              >
                <Text
                  fontSize="xs"
                  color={rate ? "gray.400" : "gray.500"}
                  noOfLines={1}
                  title={formatFieldLabel(key)}
                >
                  {formatFieldLabel(key)}
                </Text>
                <Text
                  fontSize="xs"
                  fontWeight={rate ? "medium" : "semibold"}
                  color={rate ? "gray.500" : "gray.800"}
                  // fontVariantNumeric="tabular-nums"
                  whiteSpace="nowrap"
                >
                  {formatFieldValue(key, value)}
                </Text>
              </Flex>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

/* ---------- Main component ---------- */

export const TransactionWithin15Days: React.FC<TransactionWithin15DaysProps> = ({
  data,
  loading = false,
  collapsedCount = 6
}) => {
  const [expanded, setExpanded] = useState(false);

  const exportCount = Object.keys(data?.export || {}).length;
  const importCount = Object.keys(data?.import || {}).length;
  const hasMore = Math.max(exportCount, importCount) > collapsedCount;

  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="gray.100"
      borderRadius="lg"
      px="4"
      py="3"
    >
      <Flex justify="space-between" align="baseline" mb="2">
        <Text fontSize="sm" fontWeight="semibold" color="gray.800">
          Transactions within 15 days
        </Text>
        <Text fontSize="xs" color="gray.400">
          Upcoming hedging activity
        </Text>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacingX="0" spacingY="3">
        <Box pr={{ md: "5" }}>
          <SideColumn
            title="Export"
            dotColor="green.400"
            record={data?.export}
            loading={loading}
            limit={collapsedCount}
            expanded={expanded}
          />
        </Box>
        <Box
          pl={{ md: "5" }}
          borderLeftWidth={{ base: 0, md: "1px" }}
          borderColor="gray.100"
        >
          <SideColumn
            title="Import"
            dotColor="blue.400"
            record={data?.import}
            loading={loading}
            limit={collapsedCount}
            expanded={expanded}
          />
        </Box>
      </SimpleGrid>

      {!loading && hasMore && (
        <Flex justify="center" mt="1">
          <Button
            size="xs"
            variant="ghost"
            color="gray.500"
            fontWeight="medium"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Show less" : "Show all"}
          </Button>
        </Flex>
      )}
    </Box>
  );
};

export default TransactionWithin15Days;