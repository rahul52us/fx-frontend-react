import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Select,
  Stack,
  Text,
  Radio,
  RadioGroup,
  HStack,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

/* ---------------- Helpers ---------------- */
const getTenureCount = (type: string) => {
  if (type === "monthly") return 12;
  if (type === "quarterly") return 3;
  if (type === "yearly") return 1;
  return 0;
};

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

/* ---------------- Types ---------------- */
interface Bank {
  bankName: string;
  currency: string;
  margin: string;
}

interface BusinessUnit {
  unitCode: string;
  banks: Bank[];
}

interface Policy {
  tenureType: "monthly" | "quarterly" | "yearly";
  tenureMode: "financial" | "rolling";
  tenureValues: string[];
}

/* ---------------- EditForm Component ---------------- */
interface EditFormProps {
  recordIndex: number;           // index of the record to edit in localStorage
  onUpdate?: () => void;        // optional callback after successful update
  onCancel?: () => void;        // optional cancel callback
}

const EditForm = ({ recordIndex, onUpdate, onCancel }: EditFormProps) => {
  /* ================= BASIC DETAILS ================= */
  const [basic, setBasic] = useState({
    userName: "",
    fatherName: "",
    organisationName: "",
    address: "",
    contact: "",
    email: "",
    designation: "",
  });

  /* ================= CURRENCIES ================= */
  const [currencyInput, setCurrencyInput] = useState("");
  const [currencies, setCurrencies] = useState<string[]>([]);

  /* ================= BUSINESS UNITS ================= */
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([
    { unitCode: "", banks: [{ bankName: "", currency: "", margin: "" }] },
  ]);

  /* ================= POLICY TENURE ================= */
  const [policy, setPolicy] = useState<Policy>({
    tenureType: "monthly",
    tenureMode: "financial",
    tenureValues: Array(12).fill(""),
  });

  /* ================= BENCHMARKING MECHANISM ================= */
  const [benchmarking, setBenchmarking] = useState<"budget" | "bmk" | "">("");

  /* ================= POLICY CRITERIA ================= */
  const [criteriaType, setCriteriaType] = useState<"gross" | "net" | "">("");
  const [importPercent, setImportPercent] = useState("");
  const [exportPercent, setExportPercent] = useState("");

  const importNum = parseFloat(importPercent) || 0;
  const exportNum = parseFloat(exportPercent) || 0;
  const percentValid = importNum + exportNum === 100;

  /* ================= POLICY RATIO TYPE ================= */
  const [ratioType, setRatioType] = useState<"maximum" | "minimum" | "">("");
  const [ratioImport, setRatioImport] = useState("");
  const [ratioExport, setRatioExport] = useState("");

  /* ================= LOAD DATA ON MOUNT ================= */
  useEffect(() => {
    const stored = localStorage.getItem("addFormData");
    if (!stored) return;

    const records = JSON.parse(stored);
    const record = records[recordIndex];

    if (!record) {
      alert("Record not found!");
      return;
    }

    // Populate all states
    setBasic(record.basicDetails || basic);

    setCurrencies(record.currencies || []);

    setBusinessUnits(record.businessUnits || businessUnits);

    setPolicy(record.policy || policy);

    // Benchmarking
    if (record.benchmarking === "Budget Rate") setBenchmarking("budget");
    else if (record.benchmarking === "BMK Rate") setBenchmarking("bmk");

    // Policy Criteria
    if (record.policyCriteria) {
      setCriteriaType(record.policyCriteria.type === "Gross" ? "gross" : "net");
      setImportPercent(record.policyCriteria.import || "");
      setExportPercent(record.policyCriteria.export || "");
    }

    // Policy Ratio Type
    if (record.policyRatioType) {
      setRatioType(record.policyRatioType.type === "Maximum" ? "maximum" : "minimum");
      setRatioImport(record.policyRatioType.import || "");
      setRatioExport(record.policyRatioType.export || "");
    }
  }, [recordIndex]);

  /* ================= HANDLERS ================= */
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
    setBusinessUnits([
      ...businessUnits,
      { unitCode: "", banks: [{ bankName: "", currency: "", margin: "" }] },
    ]);
  };

  const handleBUChange = (index: number, value: string) => {
    const updated = [...businessUnits];
    updated[index].unitCode = value;
    setBusinessUnits(updated);
  };

  const addBank = (buIndex: number) => {
    const updated = [...businessUnits];
    updated[buIndex].banks.push({ bankName: "", currency: "", margin: "" });
    setBusinessUnits(updated);
  };

  const removeBank = (buIndex: number, bankIndex: number) => {
    const updated = [...businessUnits];
    if (updated[buIndex].banks.length <= 1) return;
    updated[buIndex].banks.splice(bankIndex, 1);
    setBusinessUnits(updated);
  };

  const handleBankChange = (
    buIndex: number,
    bankIndex: number,
    field: "bankName" | "currency" | "margin",
    value: string
  ) => {
    const updated = [...businessUnits];
    updated[buIndex].banks[bankIndex][field] = value;
    setBusinessUnits(updated);
  };

  const handleTenureTypeChange = (value: string) => {
    setPolicy({
      ...policy,
      tenureType: value as any,
      tenureValues: Array(getTenureCount(value)).fill(""),
    });
  };

  const handleUpdate = () => {
    const payload = {
      basicDetails: basic,
      currencies,
      businessUnits,
      policy,
      benchmarking:
        benchmarking === "budget"
          ? "Budget Rate"
          : benchmarking === "bmk"
          ? "BMK Rate"
          : null,
      policyCriteria: criteriaType
        ? {
            type: criteriaType === "gross" ? "Gross" : "Net",
            import: importPercent,
            export: exportPercent,
          }
        : null,
      policyRatioType: ratioType
        ? {
            type: ratioType === "maximum" ? "Maximum" : "Minimum",
            import: ratioImport,
            export: ratioExport,
          }
        : null,
    };

    // Update the specific record in localStorage
    const existing = JSON.parse(localStorage.getItem("addFormData") || "[]");
    if (!existing[recordIndex]) {
      alert("Record not found!");
      return;
    }

    existing[recordIndex] = payload;
    localStorage.setItem("addFormData", JSON.stringify(existing));

    alert("Record updated successfully!");
    if (onUpdate) onUpdate();
  };

  return (
    <Stack spacing={6} p={6}>
      {/* 1. User & Organisation Details */}
      <Section title="User & Organisation Details">
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          {Object.keys(basic).map((key) => (
            <FormControl key={key}>
              <FormLabel fontSize="sm">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </FormLabel>
              <Input
                name={key}
                value={basic[key as keyof typeof basic]}
                onChange={handleBasicChange}
                placeholder={`Enter ${key.replace(/([A-Z])/g, " $1").trim()}`}
              />
            </FormControl>
          ))}
        </Grid>
      </Section>

      {/* 2. Currency Master */}
      <Section title="Currency Master">
        <Grid templateColumns="3fr 1fr" gap={3}>
          <Input
            placeholder="Eg: USDINR"
            value={currencyInput}
            onChange={(e) => setCurrencyInput(e.target.value.toUpperCase())}
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

      {/* 3. Business Units */}
      <Section title="Business Units & Banks">
        <Stack spacing={5}>
          {businessUnits.map((bu, buIndex) => (
            <Box key={buIndex} p={4} bg="gray.50" rounded="md" border="1px solid" borderColor="gray.200">
              <FormControl mb={4}>
                <FormLabel>Business Unit Code</FormLabel>
                <Input
                  value={bu.unitCode}
                  onChange={(e) => handleBUChange(buIndex, e.target.value)}
                  placeholder="BU001"
                />
              </FormControl>

              <Stack spacing={3}>
                {bu.banks.map((bank: any, bankIndex: number) => (
                  <Grid key={bankIndex} templateColumns="repeat(4, 1fr)" gap={3} alignItems="end">
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
                      onChange={(e) =>
                        handleBankChange(buIndex, bankIndex, "currency", e.target.value)
                      }
                    >
                      {currencies.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </Select>
                    <Input
                      placeholder="Margin (0.00)"
                      value={bank.margin}
                      onChange={(e) =>
                        handleBankChange(buIndex, bankIndex, "margin", e.target.value)
                      }
                    />
                    <Button
                      size="sm"
                      colorScheme="red"
                      variant="outline"
                      onClick={() => removeBank(buIndex, bankIndex)}
                      isDisabled={bu.banks.length === 1}
                    >
                      Remove
                    </Button>
                  </Grid>
                ))}
                <Button size="sm" variant="link" colorScheme="blue" onClick={() => addBank(buIndex)}>
                  + Add Bank
                </Button>
              </Stack>
            </Box>
          ))}
          <Button size="sm" variant="link" colorScheme="blue" onClick={addBusinessUnit}>
            + Add Business Unit
          </Button>
        </Stack>
      </Section>

      {/* 4. Policy Tenure */}
      <Section title="Policy Tenure">
        <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={5}>
          <FormControl>
            <FormLabel>Tenure Type</FormLabel>
            <Select value={policy.tenureType} onChange={(e) => handleTenureTypeChange(e.target.value)}>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Mode</FormLabel>
            <Select
              value={policy.tenureMode}
              onChange={(e) => setPolicy({ ...policy, tenureMode: e.target.value as any })}
            >
              <option value="financial">Financial Year</option>
              <option value="rolling">Rolling</option>
            </Select>
          </FormControl>
        </Grid>

        <Grid templateColumns="repeat(4, 1fr)" gap={3}>
          {policy.tenureValues.map((val, idx) => (
            <Input
              key={idx}
              placeholder={`Value ${idx + 1}`}
              value={val}
              onChange={(e) => {
                const updated = [...policy.tenureValues];
                updated[idx] = e.target.value;
                setPolicy({ ...policy, tenureValues: updated });
              }}
            />
          ))}
        </Grid>
      </Section>

      {/* 5. Benchmarking Mechanism */}
      <Section title="Benchmarking Mechanism">
        <RadioGroup value={benchmarking} onChange={(v) => setBenchmarking(v as any)}>
          <HStack spacing={8}>
            <Radio value="budget">Budget Rate</Radio>
            <Radio value="bmk">BMK Rate</Radio>
          </HStack>
        </RadioGroup>
      </Section>

      {/* 6. Policy Criteria */}
      <Section title="Policy Criteria">
        <Stack spacing={5}>
          <RadioGroup
            value={criteriaType}
            onChange={(v) => {
              setCriteriaType(v as any);
              setImportPercent("");
              setExportPercent("");
            }}
          >
            <HStack spacing={8}>
              <Radio value="gross">Gross</Radio>
              <Radio value="net">Net</Radio>
            </HStack>
          </RadioGroup>

          {criteriaType && (
            <>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <FormControl>
                  <FormLabel>Import (%)</FormLabel>
                  <Input
                    type="number"
                    value={importPercent}
                    onChange={(e) => setImportPercent(e.target.value)}
                    placeholder="e.g. 70"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Export (%)</FormLabel>
                  <Input
                    type="number"
                    value={exportPercent}
                    onChange={(e) => setExportPercent(e.target.value)}
                    placeholder="e.g. 30"
                  />
                </FormControl>
              </Grid>

              {importPercent && exportPercent && (
                <Alert status={percentValid ? "success" : "warning"}>
                  <AlertIcon />
                  {percentValid
                    ? `Valid: ${importNum}% Import + ${exportNum}% Export = 100%`
                    : `Invalid: ${importNum}% + ${exportNum}% ≠ 100%`}
                </Alert>
              )}
            </>
          )}
        </Stack>
      </Section>

      {/* 7. Policy Ratio Type */}
      <Section title="Policy Ratio Type">
        <Stack spacing={5}>
          <RadioGroup
            value={ratioType}
            onChange={(v) => {
              setRatioType(v as any);
              setRatioImport("");
              setRatioExport("");
            }}
          >
            <HStack spacing={8}>
              <Radio value="maximum">Maximum</Radio>
              <Radio value="minimum">Minimum</Radio>
            </HStack>
          </RadioGroup>

          {ratioType && (
            <>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <FormControl>
                  <FormLabel>
                    Import ({ratioType === "maximum" ? "Maximum" : "Minimum"} %)
                  </FormLabel>
                  <Input
                    type="number"
                    value={ratioImport}
                    onChange={(e) => setRatioImport(e.target.value)}
                    placeholder={ratioType === "maximum" ? "e.g. 50" : "e.g. 0"}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>
                    Export ({ratioType === "maximum" ? "Maximum" : "Minimum"} %)
                  </FormLabel>
                  <Input
                    type="number"
                    value={ratioExport}
                    onChange={(e) => setRatioExport(e.target.value)}
                    placeholder={ratioType === "maximum" ? "e.g. 20" : "e.g. 0"}
                  />
                </FormControl>
              </Grid>
            </>
          )}
        </Stack>
      </Section>

      {/* Actions */}
      <Flex justify="flex-end" gap={4} mt={6}>
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button colorScheme="blue" onClick={handleUpdate}>
          Update Record
        </Button>
      </Flex>
    </Stack>
  );
};

export default EditForm;