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
import { useState } from "react";

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

interface AddFormProps {
  onSubmit: (payload: any) => void;
  onCancel?: () => void;
}

const AddForm = ({ onSubmit, onCancel }: AddFormProps) => {
  /* ================= USER / ORG ================= */
  const [basic, setBasic] = useState({
    userName: "",
    fatherName: "",
    organisationName: "",
    address: "",
    contact: "",
    email: "",
    designation: "",
  });

  /* ================= GLOBAL CURRENCY ================= */
  const [currencyInput, setCurrencyInput] = useState("");
  const [currencies, setCurrencies] = useState<string[]>([]);

  /* ================= BUSINESS UNITS ================= */
  const [businessUnits, setBusinessUnits] = useState<any[]>([
    {
      unitCode: "",
      banks: [{ bankName: "", currency: "", margin: "" }],
    },
  ]);

  /* ================= POLICY TENURE ================= */
  const [policy, setPolicy] = useState({
    tenureType: "monthly",
    tenureMode: "financial",
    tenureValues: Array(12).fill(""),
  });

  /* ================= BENCHMARKING MECHANISM ================= */
  const [benchmarking, setBenchmarking] = useState<"budget" | "bmk" | "">("");

  /* ================= POLICY CRITERIA (Gross/Net + Import/Export %) ================= */
  const [criteriaType, setCriteriaType] = useState<"gross" | "net" | "">("");
  const [importPercent, setImportPercent] = useState("");
  const [exportPercent, setExportPercent] = useState("");

  const importNum = parseFloat(importPercent) || 0;
  const exportNum = parseFloat(exportPercent) || 0;
  const percentValid = importNum + exportNum === 100;

  /* ================= POLICY RATIO TYPE (Maximum/Minimum + Import/Export %) ================= */
  const [ratioType, setRatioType] = useState<"maximum" | "minimum" | "">("");
  const [ratioImport, setRatioImport] = useState("");
  const [ratioExport, setRatioExport] = useState("");

  /* ================= HANDLERS ================= */
  const handleBasicChange = (e: any) => {
    setBasic({ ...basic, [e.target.name]: e.target.value });
  };

  const addCurrency = () => {
    if (!currencyInput) return;
    const value = currencyInput.toUpperCase();
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

  const handleBUChange = (i: number, value: string) => {
    const updated = [...businessUnits];
    updated[i].unitCode = value;
    setBusinessUnits(updated);
  };

  const addBank = (buIndex: number) => {
    businessUnits[buIndex].banks.push({
      bankName: "",
      currency: "",
      margin: "",
    });
    setBusinessUnits([...businessUnits]);
  };

  const removeBank = (buIndex: number, bankIndex: number) => {
    const banks = businessUnits[buIndex].banks;
    if (banks.length === 1) return;
    banks.splice(bankIndex, 1);
    setBusinessUnits([...businessUnits]);
  };

  const handleBankChange = (
    buIndex: number,
    bankIndex: number,
    key: string,
    value: string
  ) => {
    businessUnits[buIndex].banks[bankIndex][key] = value;
    setBusinessUnits([...businessUnits]);
  };

  const handleTenureTypeChange = (type: string) => {
    setPolicy({
      ...policy,
      tenureType: type,
      tenureValues: Array(getTenureCount(type)).fill(""),
    });
  };

  const handleSubmit = () => {
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
        : "",
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

  // ✅ GET EXISTING ARRAY
  const existing =
    JSON.parse(localStorage.getItem("addFormData") || "[]");

  // ✅ APPEND NEW RECORD
  const updated = [...existing, payload];

  // ✅ SAVE BACK
  localStorage.setItem("addFormData", JSON.stringify(updated));

  // notify parent
  onSubmit(payload);
};



  /* ================= UI ================= */
  return (
    <Stack spacing={6}>
      {/* ================= USER DETAILS ================= */}
      <Section
        title="User & Organisation Details"
        subtitle="Basic identification and contact information"
      >
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          {Object.entries(basic).map(([key]) => (
            <FormControl key={key}>
              <FormLabel fontSize="sm" color="gray.600">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </FormLabel>
              <Input
                placeholder={`Enter ${key.replace(/([A-Z])/g, " $1").trim()}`}
                name={key}
                value={basic[key as keyof typeof basic]}
                onChange={handleBasicChange}
              />
            </FormControl>
          ))}
        </Grid>
      </Section>

      {/* ================= GLOBAL CURRENCY ================= */}
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

      {/* ================= BUSINESS UNITS ================= */}
      <Section
        title="Business Units & Bank Configuration"
        subtitle="Configure banks and margins per business unit"
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
                {bu.banks.map((bank: any, bankIndex: number) => (
                  <Grid
                    key={bankIndex}
                    templateColumns="2fr 2fr 2fr 1fr"
                    gap={3}
                    alignItems="end"
                  >
                    <Input
                      placeholder="Bank Name"
                      value={bank.bankName}
                      onChange={(e) =>
                        handleBankChange(
                          buIndex,
                          bankIndex,
                          "bankName",
                          e.target.value
                        )
                      }
                    />
                    <Select
                      placeholder="Currency"
                      value={bank.currency}
                      isDisabled={currencies.length === 0}
                      onChange={(e) =>
                        handleBankChange(
                          buIndex,
                          bankIndex,
                          "currency",
                          e.target.value
                        )
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
                        handleBankChange(
                          buIndex,
                          bankIndex,
                          "margin",
                          e.target.value
                        )
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

      {/* ================= POLICY RATIO TENURE ================= */}
      <Section
        title="Policy Ratio Tenure"
        subtitle="Define tenure and calculation mode"
      >
        <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4}>
          <FormControl>
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
          {policy.tenureType !== "monthly" && (
            <FormControl>
              <FormLabel fontSize="sm">Mode</FormLabel>
              <Select
                value={policy.tenureMode}
                onChange={(e) =>
                  setPolicy({ ...policy, tenureMode: e.target.value })
                }
              >
                <option value="financial">Financial</option>
                <option value="rolling">Rolling</option>
              </Select>
            </FormControl>
          )}
        </Grid>
        <Grid templateColumns="repeat(4, 1fr)" gap={3}>
          {policy.tenureValues.map((val: string, idx: number) => (
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

      {/* ================= BENCHMARKING MECHANISM ================= */}
      <Section
        title="Benchmarking Mechanism"
        subtitle="Select the rate type to be used for benchmarking"
      >
        <RadioGroup
          value={benchmarking}
          onChange={(v) => setBenchmarking(v as any)}
        >
          <Stack direction="row" spacing={8}>
            <Radio value="budget">Budget Rate</Radio>
            <Radio value="bmk">BMK Rate</Radio>
          </Stack>
        </RadioGroup>
      </Section>

      {/* ================= POLICY CRITERIA (Gross/Net) ================= */}
      <Section
        title="Policy Criteria"
        subtitle="Choose Gross/Net and define Import vs Export ratio"
      >
        <Stack spacing={5}>
          <FormControl>
            <FormLabel fontSize="sm">Criteria Type</FormLabel>
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
          </FormControl>

          {criteriaType && (
            <>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <FormControl>
                  <FormLabel fontSize="sm">Import (%)</FormLabel>
                  <Input
                    type="number"
                    placeholder="e.g. 70"
                    value={importPercent}
                    onChange={(e) => setImportPercent(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm">Export (%)</FormLabel>
                  <Input
                    type="number"
                    placeholder="e.g. 30"
                    value={exportPercent}
                    onChange={(e) => setExportPercent(e.target.value)}
                  />
                </FormControl>
              </Grid>

              {!percentValid && importPercent && exportPercent && (
                <Alert status="warning" variant="left-accent">
                  <AlertIcon />
                  Import + Export must equal 100%. Current total:{" "}
                  {importNum + exportNum}%
                </Alert>
              )}
              {percentValid && importPercent && exportPercent && (
                <Alert status="success" variant="left-accent">
                  <AlertIcon />
                  Valid ratio: {importNum}% Import / {exportNum}% Export
                </Alert>
              )}
            </>
          )}
        </Stack>
      </Section>

      {/* ================= POLICY RATIO TYPE (Maximum/Minimum) ================= */}
      <Section
        title="Policy Ratio Type"
        subtitle="Define maximum or minimum allowable ratios for Import and Export"
      >
        <Stack spacing={5}>
          <FormControl>
            <FormLabel fontSize="sm">Ratio Type</FormLabel>
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
          </FormControl>

          {ratioType && (
            <>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <FormControl>
                  <FormLabel fontSize="sm">
                    Import ({ratioType === "maximum" ? "Maximum" : "Minimum"} %)
                  </FormLabel>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    placeholder={ratioType === "maximum" ? "e.g. 50" : "e.g. 0"}
                    value={ratioImport}
                    onChange={(e) => setRatioImport(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm">
                    Export ({ratioType === "maximum" ? "Maximum" : "Minimum"} %)
                  </FormLabel>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    placeholder={ratioType === "maximum" ? "e.g. 20" : "e.g. 0"}
                    value={ratioExport}
                    onChange={(e) => setRatioExport(e.target.value)}
                  />
                </FormControl>
              </Grid>

              <Text fontSize="sm" color="gray.600">
                {ratioType === "maximum"
                  ? "These values represent the highest allowable percentages for Import and Export."
                  : "These values represent the lowest allowable (minimum threshold) percentages for Import and Export."}
              </Text>
            </>
          )}
        </Stack>
      </Section>

      {/* ================= ACTIONS ================= */}
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