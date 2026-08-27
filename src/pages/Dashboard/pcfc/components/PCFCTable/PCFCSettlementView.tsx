import {
  Badge,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { formatTableDate } from "../../../../../config/constant/dateUtils";

type SettlementRow = {
  invoiceBcNumber?: string;
  settlementDate?: string;
  settledAmount?: number | string;
};

type PCFCSettlementViewProps = {
  settlementView?: SettlementRow[] | string | null;
};

const normalizeSettlementRows = (
  settlementView?: SettlementRow[] | string | null
): SettlementRow[] => {
  if (Array.isArray(settlementView)) {
    return settlementView.filter(
      (item) => item && typeof item === "object"
    );
  }

  return [];
};

const formatNumber = (value: any) => {
  if (value === null || value === undefined || value === "") {
    return "--";
  }

  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return String(value);
  }

  return numericValue.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
};

const SummaryCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <Box
    bg="white"
    border="1px solid"
    borderColor="gray.200"
    borderRadius="lg"
    px={4}
    py={3.5}
  >
    <Text
      fontSize="11px"
      fontWeight={600}
      color="gray.500"
      textTransform="uppercase"
      letterSpacing="0.04em"
      mb={1.5}
    >
      {label}
    </Text>
    <Text fontSize={{ base: "md", md: "lg" }} fontWeight={700} color="gray.800">
      {value}
    </Text>
  </Box>
);

const PCFCSettlementView = ({
  settlementView,
}: PCFCSettlementViewProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const rows = useMemo(
    () => normalizeSettlementRows(settlementView),
    [settlementView]
  );

  const totalSettledAmount = useMemo(
    () =>
      rows.reduce((sum, item) => {
        const amount = Number(item.settledAmount);
        return sum + (Number.isNaN(amount) ? 0 : amount);
      }, 0),
    [rows]
  );

  if (!rows.length) {
    return (
      <Text color="gray.500" fontSize="sm" fontWeight={500}>
        No settlements
      </Text>
    );
  }

  return (
    <>
      <Button
        onClick={onOpen}
        variant="outline"
        size="sm"
        bg="white"
        color="gray.700"
        borderColor="gray.300"
        borderRadius="md"
        fontWeight={600}
        px={3.5}
        _hover={{
          bg: "gray.50",
          borderColor: "gray.400",
        }}
        _active={{
          bg: "gray.100",
        }}
      >
        <Flex align="center" gap={2}>
          <Text>View settlements</Text>
          <Badge
            bg="green.50"
            color="green.700"
            borderRadius="full"
            px={2}
            fontSize="10px"
            fontWeight={700}
          >
            {rows.length}
          </Badge>
        </Flex>
      </Button>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xl">
        <DrawerOverlay bg="blackAlpha.400" />

        <DrawerContent bg="gray.50">
          <DrawerCloseButton
            top={4}
            right={4}
            color="gray.500"
            _hover={{
              bg: "gray.100",
              color: "gray.800",
            }}
          />

          <DrawerHeader
            bg="white"
            borderBottom="1px solid"
            borderColor="gray.200"
            px={{ base: 4, md: 6 }}
            py={4}
          >
            <Box pr={10}>
              <Text fontSize="lg" fontWeight={700} color="gray.900" lineHeight="short">
                Settlement View
              </Text>
              <Text mt={1} fontSize="sm" fontWeight={400} color="gray.500">
                Review invoice-wise settlement details for this PCFC entry.
              </Text>
            </Box>
          </DrawerHeader>

          <DrawerBody px={{ base: 3, md: 5 }} py={5}>
            <Flex direction="column" gap={5}>
              <SimpleGrid columns={{ base: 2, md: 2 }} spacing={3}>
                <SummaryCard label="Total settlements" value={rows.length} />
                <SummaryCard
                  label="Settled amount"
                  value={formatNumber(totalSettledAmount)}
                />
              </SimpleGrid>

              <Box
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="xl"
                overflow="hidden"
                boxShadow="sm"
              >
                <Box overflowX="auto">
                  <Table size="sm" variant="simple">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th
                          py={3}
                          pl={{ base: 4, md: 5 }}
                          color="gray.500"
                          fontSize="10px"
                          fontWeight={700}
                          letterSpacing="0.05em"
                        >
                          Invoice BC Number
                        </Th>
                        <Th
                          py={3}
                          color="gray.500"
                          fontSize="10px"
                          fontWeight={700}
                          letterSpacing="0.05em"
                        >
                          Settlement Date
                        </Th>
                        <Th
                          py={3}
                          pr={{ base: 4, md: 5 }}
                          color="gray.500"
                          fontSize="10px"
                          fontWeight={700}
                          letterSpacing="0.05em"
                          isNumeric
                        >
                          Settled Amount
                        </Th>
                      </Tr>
                    </Thead>

                    <Tbody>
                      {rows.map((item, index) => (
                        <Tr
                          key={`${item.invoiceBcNumber || "settlement"}-${index}`}
                          _hover={{ bg: "gray.50" }}
                          transition="background 0.15s ease"
                        >
                          <Td py={3.5} pl={{ base: 4, md: 5 }}>
                            <Text fontSize="sm" fontWeight={600} color="gray.700">
                              {item.invoiceBcNumber || "--"}
                            </Text>
                          </Td>
                          <Td py={3.5}>
                            <Text fontSize="sm" color="gray.700">
                              {formatTableDate(item.settlementDate)}
                            </Text>
                          </Td>
                          <Td py={3.5} pr={{ base: 4, md: 5 }} isNumeric>
                            <Text fontSize="sm" fontWeight={600} color="gray.800">
                              {formatNumber(item.settledAmount)}
                            </Text>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </Box>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default PCFCSettlementView;
