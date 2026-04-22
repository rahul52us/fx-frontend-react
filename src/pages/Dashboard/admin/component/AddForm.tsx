import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import store from "../../../../store/store";

const TENURE_INPUT_COUNT = 12;

const Section = ({ title, subtitle, children }: any) => (
  <Box
    bg="white"
    border="1px solid"
    borderColor="gray.200"
    rounded="xl"
    p={5}
    boxShadow="sm"
  >
    <Box mb={4}>
      <Text fontSize="md" fontWeight="600" color="gray.800">
        {title}
      </Text>
      {subtitle && (
        <Text fontSize="sm" color="gray.500">
          {subtitle}
        </Text>
      )}
    </Box>
    <Divider mb={4} />
    {children}
  </Box>
);

interface AddFormProps {
  onSubmit: (payload: any) => void;
  onCancel?: () => void;
}

interface BankConfig {
  bankName: string;
  currency: string;
  margin: string;
  bankSpread: string;
}

interface BusinessUnitConfig {
  unitCode: string;
  banks: BankConfig[];
}

type CriteriaScope = "consolidated" | "standalone" | "";
type CriteriaBasis = "gross" | "net" | "";

// For gross: export and import each have a "min" or "max" selector (not a value)
interface PolicyCriteriaEntry {
  businessUnitCode: string | null;
  basis: CriteriaBasis;
  exposureType: "export" | "import" | "";
  grossType: "min" | "max" | "";
  netType: "min" | "max" | "";
}

// Tenure entry per scope unit
interface TenureEntry {
  businessUnitCode: string | null;
  values: string[];
}

const createEmptyBank = (): BankConfig => ({
  bankName: "",
  currency: "",
  margin: "",
  bankSpread: "",
});

const createEmptyBusinessUnit = (): BusinessUnitConfig => ({
  unitCode: "",
  banks: [createEmptyBank()],
});

const createCriteriaEntry = (businessUnitCode: string | null = null): PolicyCriteriaEntry => ({
  businessUnitCode,
  basis: "",
  exposureType: "",
  grossType: "",
  netType: "",
});

const createTenureEntry = (businessUnitCode: string | null = null): TenureEntry => ({
  businessUnitCode,
  values: Array(TENURE_INPUT_COUNT).fill(""),
});

const normalizeCriteriaEntries = (
  scope: CriteriaScope,
  units: BusinessUnitConfig[],
  currentEntries: PolicyCriteriaEntry[]
) => {
  if (!scope) return [];

  if (scope === "consolidated") {
    return [currentEntries[0] || createCriteriaEntry(null)];
  }

  return units.map((unit, index) => {
    const existing =
      currentEntries.find((entry) => entry.businessUnitCode === unit.unitCode) ||
      currentEntries[index];

    return {
      ...(existing || createCriteriaEntry(unit.unitCode || null)),
      businessUnitCode: unit.unitCode || null,
    };
  });
};

const normalizeTenureEntries = (
  scope: CriteriaScope,
  units: BusinessUnitConfig[],
  currentEntries: TenureEntry[]
): TenureEntry[] => {
  if (!scope) return [currentEntries[0] || createTenureEntry(null)];

  if (scope === "consolidated") {
    return [currentEntries[0] || createTenureEntry(null)];
  }

  return units.map((unit, index) => {
    const existing =
      currentEntries.find((entry) => entry.businessUnitCode === unit.unitCode) ||
      currentEntries[index];
    return {
      ...(existing || createTenureEntry(unit.unitCode || null)),
      businessUnitCode: unit.unitCode || null,
    };
  });
};

const getCriteriaLabel = (scope: CriteriaScope, unitCode: string | null, index: number) => {
  if (scope === "consolidated") return "Consolidated";
  return unitCode?.trim() ? unitCode : `Business Unit ${index + 1}`;
};

const AddForm = ({ onSubmit, onCancel }: AddFormProps) => {
  const {
    adminStore: { createAdmin },
    auth: { user, openNotification },
  } = store;

  const [basic, setBasic] = useState({
    userName: "",
    organisationName: "",
    address: "",
    contact: "",
    email: "",
    designation: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [currencyInput, setCurrencyInput] = useState("");
  const [currencies, setCurrencies] = useState<string[]>([]);

  const [businessUnits, setBusinessUnits] = useState<BusinessUnitConfig[]>([
    createEmptyBusinessUnit(),
  ]);

  const [policy, setPolicy] = useState({
    tenureType: "monthly",
    tenureMode: "rolling",
  });

  const [tenureEntries, setTenureEntries] = useState<TenureEntry[]>([createTenureEntry(null)]);

  const [benchmarking, setBenchmarking] = useState<"budget" | "bmk" | "">("");

  const [criteriaScope, setCriteriaScope] = useState<CriteriaScope>("");
  const [criteriaEntries, setCriteriaEntries] = useState<PolicyCriteriaEntry[]>([]);

  const [submitted, setSubmitted] = useState(false);

  const passwordsMatch = basic.password === basic.confirmPassword;

  // Sync criteria entries when scope or business units change
  useEffect(() => {
    setCriteriaEntries((current) =>
      normalizeCriteriaEntries(criteriaScope, businessUnits, current)
    );
  }, [criteriaScope, businessUnits]);

  // Sync tenure entries when scope or business units change
  useEffect(() => {
    setTenureEntries((current) =>
      normalizeTenureEntries(criteriaScope, businessUnits, current)
    );
  }, [criteriaScope, businessUnits]);

  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBasic({ ...basic, [e.target.name]: e.target.value });
  };

  const addCurrency = () => {
    if (!currencyInput.trim()) return;
    const value = currencyInput.toUpperCase().trim();
    if (currencies.includes(value)) return;
    setCurrencies([...currencies, value]);
    setCurrencyInput("");
  };

  const addBusinessUnit = () => {
    setBusinessUnits([...businessUnits, createEmptyBusinessUnit()]);
  };

  const handleBUChange = (i: number, value: string) => {
    const updated = [...businessUnits];
    updated[i].unitCode = value;
    setBusinessUnits(updated);
  };

  const addBank = (buIndex: number) => {
    const updated = [...businessUnits];
    updated[buIndex].banks.push(createEmptyBank());
    setBusinessUnits(updated);
  };

  const removeBank = (buIndex: number, bankIndex: number) => {
    const updated = [...businessUnits];
    const banks = updated[buIndex].banks;
    if (banks.length === 1) return;
    banks.splice(bankIndex, 1);
    setBusinessUnits(updated);
  };

  const handleBankChange = (
    buIndex: number,
    bankIndex: number,
    key: keyof BankConfig,
    value: string
  ) => {
    const updated = [...businessUnits];
    updated[buIndex].banks[bankIndex][key] = value;
    setBusinessUnits(updated);
  };

  const handleTenureTypeChange = (type: string) => {
    setPolicy({ ...policy, tenureType: type });
  };

  const handleTenureValueChange = (entryIndex: number, valueIndex: number, value: string) => {
    setTenureEntries((current) => {
      const updated = [...current];
      const entry = { ...updated[entryIndex] };
      const values = [...entry.values];
      values[valueIndex] = value;
      entry.values = values;
      updated[entryIndex] = entry;
      return updated;
    });
  };

  const handleCriteriaScopeChange = (value: CriteriaScope) => {
    setCriteriaScope(value);
    setCriteriaEntries((current) => normalizeCriteriaEntries(value, businessUnits, current));
    setTenureEntries((current) => normalizeTenureEntries(value, businessUnits, current));
  };

  const handleCriteriaEntryChange = (
    index: number,
    field: keyof PolicyCriteriaEntry,
    value: string
  ) => {
    setCriteriaEntries((current) => {
      const updated = [...current];
      const existing = updated[index] || createCriteriaEntry(null);
      updated[index] = { ...existing, [field]: value };

      if (field === "basis") {
        if (value === "gross") {
          updated[index].netType = "";
        } else if (value === "net") {
          updated[index].exposureType = "";
          updated[index].grossType = "";
        }
      }

      return updated;
    });
  };

  // Label map for basic fields
  const fieldLabels: Record<string, string> = {
    userName: "Full Name",
    organisationName: "Organisation Name",
    address: "Address",
    contact: "Contact",
    email: "Email",
    designation: "Designation",
  };

  const validateForm = () => {
    const errorMessages: string[] = [];

    Object.entries(basic).forEach(([key, value]) => {
      if (!value) {
        const label = fieldLabels[key] || key.replace(/([A-Z])/g, " $1");
        errorMessages.push(`${label} is required`);
      }
    });

    if (basic.password && basic.password.length < 6) {
      errorMessages.push("Password must be at least 6 characters");
    }

    if (basic.password !== basic.confirmPassword) {
      errorMessages.push("Passwords do not match");
    }

    if (currencies.length === 0) {
      errorMessages.push("At least one currency is required");
    }

    businessUnits.forEach((bu, buIndex) => {
      if (!bu.unitCode) {
        errorMessages.push(`Business Unit ${buIndex + 1}: Unit code is required`);
      }

      bu.banks.forEach((bank, bankIndex) => {
        if (!bank.bankName) {
          errorMessages.push(`BU ${buIndex + 1} - Bank ${bankIndex + 1}: Bank name required`);
        }
        if (!bank.currency) {
          errorMessages.push(`BU ${buIndex + 1} - Bank ${bankIndex + 1}: Currency required`);
        }
        if (!bank.margin) {
          errorMessages.push(`BU ${buIndex + 1} - Bank ${bankIndex + 1}: Margin required`);
        }
        if (!bank.bankSpread) {
          errorMessages.push(`BU ${buIndex + 1} - Bank ${bankIndex + 1}: Bank spread required`);
        }
      });
    });

    if (!criteriaScope) {
      errorMessages.push("Policy criteria scope is required");
    }

    if (criteriaScope) {
      const expectedEntries = criteriaScope === "standalone" ? businessUnits.length : 1;
      if (criteriaEntries.length !== expectedEntries) {
        errorMessages.push("Policy criteria is not configured for all required business units");
      }

      criteriaEntries.forEach((entry, index) => {
        const label = getCriteriaLabel(criteriaScope, entry.businessUnitCode, index);
        if (!entry.basis) {
          errorMessages.push(`${label}: Select gross or net`);
          return;
        }

        if (entry.basis === "gross") {
          if (!entry.exposureType || !entry.grossType) {
            errorMessages.push(`${label}: Gross criteria requires exposure type and min/max selection`);
          }
        }

        if (entry.basis === "net") {
          if (!entry.netType) {
            errorMessages.push(`${label}: Net criteria requires min/max selection`);
          }
        }
      });
    }

    return errorMessages;
  };

  const handleSubmit = async () => {
    setSubmitted(true);

    const errors = validateForm();
    if (errors.length > 0) {
      openNotification({
        title: "Validation Error",
        message: errors.map((err: any) => `• ${err}`).join("\n"),
        type: "error",
        placement: "top-right",
      });
      return;
    }

    const payload = {
      basicDetails: {
        userName: basic.userName,
        organisationName: basic.organisationName,
        address: basic.address,
        contact: basic.contact,
        email: basic.email,
        designation: basic.designation,
        password: basic.password,
      },
      currencies,
      businessUnits,
      policy: {
        tenureType: policy.tenureType,
        tenureMode: "rolling",
        tenureEntries: normalizeTenureEntries(criteriaScope, businessUnits, tenureEntries),
      },
      benchmarking:
        benchmarking === "budget"
          ? "Budget Rate"
          : benchmarking === "bmk"
            ? "BMK Rate"
            : "",
      policyCriteria: criteriaScope
        ? {
            scope: criteriaScope,
            entries: normalizeCriteriaEntries(criteriaScope, businessUnits, criteriaEntries).map(
              (entry) => ({
                businessUnitCode: criteriaScope === "standalone" ? entry.businessUnitCode : null,
                basis: entry.basis === "gross" ? "Gross" : "Net",
                exposureType: entry.basis === "gross" ? { value: entry.exposureType } : "",
                grossType: entry.basis === "gross" ? entry.grossType : "",
                netType: entry.basis === "net" ? entry.netType : "",
              })
            ),
          }
        : null,
    };

    const existing = JSON.parse(localStorage.getItem("addFormData") || "[]");
    const updated = [...existing, payload];
    localStorage.setItem("addFormData", JSON.stringify(updated));

    try {
      const response = await createAdmin({ ...payload, userId: user?.userId });
      if (response?.status === "success") {
        openNotification({
          title: "Success",
          message: response.message,
          type: "success",
        });
        onSubmit(payload);
      } else {
        openNotification({
          title: "Error",
          message: response.message,
          type: "error",
        });
      }
    } catch (err: any) {
      openNotification({
        title: "Error",
        message: err.message,
        type: "error",
      });
    }
  };

  return (
    <Stack spacing={6}>
      {/* ── User & Organisation Details ── */}
      <Section
        title="User & Organisation Details"
        subtitle="Basic identification, contact information and credentials"
      >
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          {(["userName", "organisationName", "address", "contact", "email", "designation"] as const).map(
            (key) => (
              <FormControl key={key}>
                <FormLabel fontSize="sm" color="gray.600">
                  {fieldLabels[key]}
                </FormLabel>
                <Input
                  placeholder={`Enter ${fieldLabels[key]}`}
                  name={key}
                  value={basic[key]}
                  onChange={handleBasicChange}
                />
              </FormControl>
            )
          )}

          <FormControl>
            <FormLabel fontSize="sm" color="gray.600">
              Password
            </FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={basic.password}
                onChange={handleBasicChange}
              />
              <InputRightElement>
                <IconButton
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm" color="gray.600">
              Confirm Password
            </FormLabel>
            <InputGroup>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={basic.confirmPassword}
                onChange={handleBasicChange}
              />
              <InputRightElement>
                <IconButton
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          {submitted && !passwordsMatch && basic.password && basic.confirmPassword && (
            <Alert status="error" fontSize="sm" variant="left-accent">
              <AlertIcon />
              Passwords do not match
            </Alert>
          )}
        </Grid>
      </Section>

      {/* ── Currency Master ── */}
      <Section
        title="Currency Master"
        subtitle="Create currencies used across all business units"
      >
        <Grid templateColumns="3fr 1fr" gap={3}>
          <Input
            placeholder="Eg: USDINR"
            value={currencyInput}
            onChange={(e) => setCurrencyInput(e.target.value)}
          />
          <Button colorScheme="blue" onClick={addCurrency}>
            Add
          </Button>
        </Grid>
        {currencies.length > 0 && (
          <Flex wrap="wrap" gap={2} mt={4}>
            {currencies.map((cur) => (
              <Box
                key={cur}
                px={3}
                py={1}
                bg="blue.50"
                border="1px solid"
                borderColor="blue.200"
                rounded="full"
                fontSize="sm"
              >
                {cur}
              </Box>
            ))}
          </Flex>
        )}
      </Section>

      {/* ── Business Units & Bank Configuration ── */}
      <Section
        title="Business Units & Bank Configuration"
        subtitle="Configure banks, margins and bank spread per business unit"
      >
        <Stack spacing={5}>
          {businessUnits.map((bu, buIndex) => (
            <Box
              key={buIndex}
              bg="gray.50"
              border="1px solid"
              borderColor="gray.200"
              rounded="lg"
              p={4}
            >
              <FormControl mb={4}>
                <FormLabel fontSize="sm">Business Unit Code</FormLabel>
                <Input
                  placeholder="Eg: BU001"
                  value={bu.unitCode}
                  onChange={(e) => handleBUChange(buIndex, e.target.value)}
                />
              </FormControl>
              <Stack spacing={3}>
                {bu.banks.map((bank, bankIndex) => (
                  <Grid
                    key={bankIndex}
                    templateColumns="repeat(5, 1fr)"
                    gap={3}
                    alignItems="end"
                  >
                    <Input
                      placeholder="Bank Name"
                      value={bank.bankName}
                      onChange={(e) =>
                        handleBankChange(buIndex, bankIndex, "bankName", e.target.value)
                      }
                    />
                    <Select
                      placeholder="Currency"
                      value={bank.currency}
                      isDisabled={currencies.length === 0}
                      onChange={(e) =>
                        handleBankChange(buIndex, bankIndex, "currency", e.target.value)
                      }
                    >
                      {currencies.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </Select>
                    <Input
                      placeholder="Margin (Eg: 0.001)"
                      value={bank.margin}
                      onChange={(e) =>
                        handleBankChange(buIndex, bankIndex, "margin", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Bank Spread (Eg: 0.001)"
                      value={bank.bankSpread}
                      onChange={(e) =>
                        handleBankChange(buIndex, bankIndex, "bankSpread", e.target.value)
                      }
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      borderColor="blue.400"
                      color="blue.600"
                      _hover={{ bg: "blue.50" }}
                      onClick={() => removeBank(buIndex, bankIndex)}
                      isDisabled={bu.banks.length === 1}
                    >
                      Remove
                    </Button>
                  </Grid>
                ))}
                <Button
                  size="sm"
                  variant="ghost"
                  color="blue.600"
                  _hover={{ bg: "blue.50" }}
                  onClick={() => addBank(buIndex)}
                >
                  + Add Bank
                </Button>
              </Stack>
            </Box>
          ))}
          <Button
            size="sm"
            variant="ghost"
            color="blue.600"
            _hover={{ bg: "blue.50" }}
            onClick={addBusinessUnit}
          >
            + Add Business Unit
          </Button>
        </Stack>
      </Section>

      {/* ── Benchmarking Mechanism ── */}
      <Section
        title="Benchmarking Mechanism"
        subtitle="Select the rate type to be used for benchmarking"
      >
        <RadioGroup value={benchmarking} onChange={(v) => setBenchmarking(v as any)}>
          <Stack direction="row" spacing={8}>
            <Radio value="budget">Budget Rate</Radio>
            <Radio value="bmk">BMK Rate</Radio>
          </Stack>
        </RadioGroup>
      </Section>

      {/* ── Policy Criteria ── */}
      <Section
        title="Policy Criteria"
        subtitle="Choose consolidated or standalone, then configure gross or net limits"
      >
        <Stack spacing={5}>
          <FormControl w="50%">
            <FormLabel fontSize="sm">Criteria Scope</FormLabel>
            <Select
              placeholder="Select criteria scope"
              value={criteriaScope}
              onChange={(e) => handleCriteriaScopeChange(e.target.value as CriteriaScope)}
            >
              <option value="consolidated">Consolidated</option>
              <option value="standalone">Standalone</option>
            </Select>
          </FormControl>

          {criteriaEntries.map((entry, index) => (
            <Box
              key={`${criteriaScope}-${entry.businessUnitCode || index}`}
              border="1px solid"
              borderColor="gray.200"
              rounded="lg"
              p={4}
              bg="gray.50"
            >
              <Stack spacing={4}>
                <Text fontWeight="600" color="gray.700">
                  {getCriteriaLabel(criteriaScope, entry.businessUnitCode, index)}
                </Text>

                <FormControl>
                  <FormLabel fontSize="sm">Gross / Net</FormLabel>
                  <RadioGroup
                    value={entry.basis}
                    onChange={(v) =>
                      handleCriteriaEntryChange(index, "basis", v as CriteriaBasis)
                    }
                  >
                    <HStack spacing={8}>
                      <Radio value="gross">Gross</Radio>
                      <Radio value="net">Net</Radio>
                    </HStack>
                  </RadioGroup>
                </FormControl>

                {/* Gross: select Exposure Type then Min/Max */}
                {entry.basis === "gross" && (
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <FormControl>
                      <FormLabel fontSize="sm">Exposure Type</FormLabel>
                      <Select
                        placeholder="Select exposure type"
                        value={entry.exposureType}
                        onChange={(e) =>
                          handleCriteriaEntryChange(index, "exposureType", e.target.value)
                        }
                      >
                        <option value="export">Export</option>
                        <option value="import">Import</option>
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm">Type</FormLabel>
                      <Select
                        placeholder="Select type"
                        value={entry.grossType}
                        onChange={(e) =>
                          handleCriteriaEntryChange(index, "grossType", e.target.value)
                        }
                      >
                        <option value="min">Min</option>
                        <option value="max">Max</option>
                      </Select>
                    </FormControl>
                  </Grid>
                )}

                {/* Net: select Min/Max */}
                {entry.basis === "net" && (
                  <FormControl>
                    <FormLabel fontSize="sm">Type</FormLabel>
                    <Select
                      placeholder="Select type"
                      value={entry.netType}
                      onChange={(e) =>
                        handleCriteriaEntryChange(index, "netType", e.target.value)
                      }
                    >
                      <option value="min">Min</option>
                      <option value="max">Max</option>
                    </Select>
                  </FormControl>
                )}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Section>

      {/* ── Policy Ratio Tenure ── */}
      <Section
        title="Policy Ratio Tenure"
        subtitle="Tenure values always use rolling mode and always show 12 inputs"
      >
        <Stack spacing={5}>
          <FormControl maxW="320px">
            <FormLabel fontSize="sm">Tenure Type</FormLabel>
            <Select
              value={policy.tenureType}
              onChange={(e) => handleTenureTypeChange(e.target.value)}
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </Select>
          </FormControl>

          {/* Render one set of 12 inputs per scope unit (consolidated = 1, standalone = per BU) */}
          {tenureEntries.map((tenureEntry, entryIndex) => (
            <Box
              key={`tenure-${tenureEntry.businessUnitCode || entryIndex}`}
              border="1px solid"
              borderColor="gray.200"
              rounded="lg"
              p={4}
              bg="gray.50"
            >
              {criteriaScope === "standalone" && (
                <Text fontWeight="600" color="gray.700" mb={3}>
                  {tenureEntry.businessUnitCode?.trim()
                    ? tenureEntry.businessUnitCode
                    : `Business Unit ${entryIndex + 1}`}
                </Text>
              )}
              {criteriaScope === "consolidated" && (
                <Text fontWeight="600" color="gray.700" mb={3}>
                  Consolidated
                </Text>
              )}
              <Grid templateColumns="repeat(4, 1fr)" gap={3}>
                {tenureEntry.values.map((val: string, idx: number) => (
                  <Input
                    key={idx}
                    placeholder={`Value ${idx + 1}`}
                    value={val}
                    onChange={(e) => handleTenureValueChange(entryIndex, idx, e.target.value)}
                  />
                ))}
              </Grid>
            </Box>
          ))}

          {/* Fallback when no scope selected yet */}
          {!criteriaScope && (
            <Box
              border="1px solid"
              borderColor="gray.200"
              rounded="lg"
              p={4}
              bg="gray.50"
            >
              <Grid templateColumns="repeat(4, 1fr)" gap={3}>
                {tenureEntries[0]?.values.map((val: string, idx: number) => (
                  <Input
                    key={idx}
                    placeholder={`Value ${idx + 1}`}
                    value={val}
                    onChange={(e) => handleTenureValueChange(0, idx, e.target.value)}
                  />
                ))}
              </Grid>
            </Box>
          )}
        </Stack>
      </Section>

      <Flex justify="flex-end" gap={3}>
        {onCancel && (
          <Button
            variant="outline"
            borderColor="blue.400"
            color="blue.600"
            _hover={{ bg: "blue.50" }}
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button colorScheme="blue" onClick={handleSubmit}>
          Save
        </Button>
      </Flex>
    </Stack>
  );
};

export default AddForm;