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
import { formatCamelCaseLabel } from "../../../../config/constant/function";

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

  const { basicDetails, businessUnits } = data;

  return (
    <Stack spacing={6}>
      {/* ================= BASIC DETAILS ================= */}
      <Section title="User Details">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
          <Item label="Name" value={basicDetails?.userName} />
          <Item label="Father Name" value={basicDetails?.fatherName} />
          <Item label="Email" value={basicDetails?.email} />
          <Item label="Contact" value={basicDetails?.contact} />
          <Item label="Designation" value={basicDetails?.designation} />
        </SimpleGrid>

        <Box mt={4}>
          <Item label="Address" value={basicDetails?.address} />
        </Box>
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
              <Flex justify="space-between" align="center" mb={3}>
                <Text fontWeight="600" color="gray.700">
                  Business Unit:
                  <Text as="span" ml={2} color="blue.600">
                    {unit.unitCode}
                  </Text>
                </Text>

                <Badge colorScheme="blue" variant="subtle">
                  {unit.banks.length} Banks
                </Badge>
              </Flex>

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
                      <Item label="Location" value={bank.location} />
                    </Stack>
                  </Box>
                ))}
              </Grid>
            </Box>
          ))}
        </Stack>
      </Section>

      {/* ================= PERMISSIONS ================= */}
      {data?.permissions && (
        <Section title="Permissions">
          <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
            {Object.keys(data.permissions).map((moduleKey) => (
              <Box
                key={moduleKey}
                p={4}
                bg="gray.50"
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.200"
              >
                <Text fontWeight="bold" mb={3} textTransform="capitalize" color="blue.600">
                  {formatCamelCaseLabel(moduleKey)}
                </Text>
                <Flex wrap="wrap" gap={2}>
                  {Object.keys(data.permissions[moduleKey]).map((permKey) => (
                    data.permissions[moduleKey][permKey] && (
                      <Badge key={permKey} colorScheme="green" variant="solid" px={2} py={1} borderRadius="md">
                        {formatCamelCaseLabel(permKey)}
                      </Badge>
                    )
                  ))}
                </Flex>
              </Box>
            ))}
          </Grid>
        </Section>
      )}
    </Stack>
  );
}
