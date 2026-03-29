import {
  Box,
  Divider,
  Grid,
  SimpleGrid,
  Stack,
  Text,
  Badge,
  Flex,
} from "@chakra-ui/react";

/* ---------- Section Wrapper ---------- */
const Section = ({ title, children }: any) => (
  <Box
    bg="white"
    borderRadius="xl"
    boxShadow="sm"
    border="1px solid"
    borderColor="gray.200"
    p={5}
  >
    <Flex align="center" mb={3}>
      <Box w="4px" h="18px" bg="blue.500" borderRadius="full" mr={2} />
      <Text fontWeight="600" fontSize="md" color="gray.700">
        {title}
      </Text>
    </Flex>
    <Divider mb={4} />
    {children}
  </Box>
);

/* ---------- Label / Value ---------- */
const Item = ({ label, value }: any) => (
  <Box>
    <Text fontSize="xs" color="gray.500" mb={1}>
      {label}
    </Text>
    <Text fontWeight="600" fontSize="sm" color="gray.800">
      {value || "-"}
    </Text>
  </Box>
);

export default function AdminViewDetails({ data }: { data: any }) {
  if (!data) return null;

  const {
    basicDetails,
    currencies,
    businessUnits,
    policy,
    benchmarking,
    policyCriteria,
  } = data;

  const criteriaEntries = Array.isArray(policyCriteria?.entries)
    ? policyCriteria.entries
    : policyCriteria
      ? [
          {
            businessUnitCode: null,
            basis: policyCriteria.type,
            importMin: policyCriteria.import,
            importMax: "",
            exportMin: policyCriteria.export,
            exportMax: "",
            min: policyCriteria.import,
            max: policyCriteria.export,
          },
        ]
      : [];

  return (
    <Stack spacing={6}>
      {/* ================= BASIC DETAILS ================= */}
      <Section title="Basic Details">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
          <Item label="Name" value={basicDetails?.userName} />
          <Item label="Father Name" value={basicDetails?.fatherName} />
          <Item label="Email" value={basicDetails?.email} />
          <Item label="Contact" value={basicDetails?.contact} />
          <Item label="Designation" value={basicDetails?.designation} />
          <Item
            label="Organisation"
            value={basicDetails?.organisationName}
          />
        </SimpleGrid>

        <Box mt={4}>
          <Item label="Address" value={basicDetails?.address} />
        </Box>
      </Section>

      {/* ================= CURRENCIES ================= */}
      <Section title="Currencies">
        <Flex wrap="wrap" gap={2}>
          {currencies?.map((cur: string) => (
            <Badge
              key={cur}
              colorScheme="blue"
              variant="subtle"
              px={3}
              py={1}
              fontSize="sm"
              borderRadius="full"
            >
              {cur}
            </Badge>
          ))}
        </Flex>
      </Section>

      {/* ================= BUSINESS UNITS ================= */}
      <Section title="Business Units & Banks">
        <Stack spacing={5}>
          {businessUnits?.map((unit: any, i: number) => (
            <Box
              key={i}
              bg="gray.50"
              borderRadius="lg"
              p={4}
              border="1px solid"
              borderColor="gray.200"
            >
              <Text fontWeight="600" mb={3} color="gray.700">
                Business Unit:{" "}
                <Text as="span" color="blue.600">
                  {unit.unitCode}
                </Text>
              </Text>

              <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
                {unit.banks.map((bank: any, j: number) => (
                  <Box
                    key={j}
                    bg="white"
                    borderRadius="md"
                    p={4}
                    boxShadow="xs"
                    border="1px solid"
                    borderColor="gray.200"
                  >
                    <Stack spacing={2}>
                      <Item label="Bank Name" value={bank.bankName} />
                      <Item label="Currency" value={bank.currency} />
                      <Item label="Margin" value={bank.margin} />
                      <Item label="Bank Spread" value={bank.bankSpread} />
                    </Stack>
                  </Box>
                ))}
              </Grid>
            </Box>
          ))}
        </Stack>
      </Section>

      {/* ================= POLICY TENURE ================= */}
      <Section title="Policy Tenure">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
          <Item label="Tenure Type" value={policy?.tenureType} />
          <Item label="Mode" value={policy?.tenureMode || "rolling"} />
          <Item
            label="Values"
            value={policy?.tenureValues?.join(", ")}
          />
        </SimpleGrid>
      </Section>

      {/* ================= BENCHMARKING ================= */}
      <Section title="Benchmarking Mechanism">
        <Badge
          colorScheme="purple"
          variant="solid"
          px={4}
          py={2}
          fontSize="md"
          borderRadius="lg"
        >
          {benchmarking}
        </Badge>
      </Section>

      {/* ================= POLICY CRITERIA ================= */}
      {policyCriteria && (
        <Section title="Policy Criteria">
          <Stack spacing={5}>
            <Item label="Scope" value={policyCriteria.scope || "Consolidated"} />
            {criteriaEntries.map((entry: any, index: number) => (
              <Box
                key={`${entry.businessUnitCode || "criteria"}-${index}`}
                bg="gray.50"
                borderRadius="lg"
                p={4}
                border="1px solid"
                borderColor="gray.200"
              >
                <Text fontWeight="600" mb={3} color="gray.700">
                  {policyCriteria.scope === "standalone"
                    ? entry.businessUnitCode || `Business Unit ${index + 1}`
                    : "Consolidated"}
                </Text>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
                  <Item label="Basis" value={entry.basis || entry.type} />
                  {(entry.basis === "Gross" || entry.type === "Gross") && (
                    <>
                      <Item label="Export Min" value={entry.exportMin} />
                      <Item label="Export Max" value={entry.exportMax} />
                      <Item label="Import Min" value={entry.importMin} />
                      <Item label="Import Max" value={entry.importMax} />
                    </>
                  )}
                  {(entry.basis === "Net" || entry.type === "Net") && (
                    <>
                      <Item label="Min" value={entry.min} />
                      <Item label="Max" value={entry.max} />
                    </>
                  )}
                </SimpleGrid>
              </Box>
            ))}
          </Stack>
        </Section>
      )}
    </Stack>
  );
}
