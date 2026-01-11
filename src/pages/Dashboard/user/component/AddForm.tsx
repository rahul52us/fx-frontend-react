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
  IconButton,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import store from "../../../../store/store";

/* ---------------- UI Card ---------------- */
const Section = ({ title, subtitle, children }: any) => (
  <Box bg="white" border="1px solid" borderColor="gray.200" rounded="2xl" p={6}>
    <Text fontSize="lg" fontWeight="600">{title}</Text>
    {subtitle && <Text fontSize="sm" color="gray.500">{subtitle}</Text>}
    <Divider my={4} />
    {children}
  </Box>
);

const AddForm = observer(({ onSubmit,onCancel }: any) => {
  const { auth: { user: admin } } = store;

  const [basic, setBasic] = useState({
    userName: "",
    fatherName: "",
    address: "",
    contact: "",
    email: "",
    designation: "",
  });

  const [businessUnits, setBusinessUnits] = useState([
    { unitCode: "", banks: [] as any[] }
  ]);

  const adminUnits = Array.isArray(admin?.businessUnits) ? admin.businessUnits : [];

  const handleBasicChange = (e: any) => {
    setBasic({ ...basic, [e.target.name]: e.target.value });
  };

  /* ---------------- Helpers ---------------- */
  const getAvailableUnits = () => {
    const selected = businessUnits.map(b => b.unitCode);
    return adminUnits.filter((u: any) => !selected.includes(u.unitCode));
  };

  const getAvailableBanks = (buIndex: number) => {
    const unitCode = businessUnits[buIndex].unitCode;
    const selectedUnit = adminUnits.find((u: any) => u.unitCode === unitCode);
    if (!selectedUnit || !Array.isArray(selectedUnit.banks)) return [];

    const selectedBanks = businessUnits[buIndex].banks.map(b => b.bankName);
    return selectedUnit.banks.filter((b: any) => !selectedBanks.includes(b.bankName));
  };

  /* ---------------- Business Unit ---------------- */
  const handleBUChange = (index: number, unitCode: string) => {
    if (!unitCode) return;

    const selectedUnit = adminUnits.find((u: any) => u.unitCode === unitCode);
    if (!selectedUnit || !Array.isArray(selectedUnit.banks)) return;

    const updated = [...businessUnits];
    updated[index] = {
      unitCode,
      banks: selectedUnit.banks.map((b: any) => ({
        bankName: b.bankName || "",
        currency: b.currency || "",
        margin: b.margin || "",
        location: ""
      }))
    };
    setBusinessUnits(updated);
  };

  const removeBusinessUnit = (index: number) => {
    const updated = [...businessUnits];
    updated.splice(index, 1);
    setBusinessUnits(updated.length ? updated : [{ unitCode: "", banks: [] }]);
  };

  const restoreBusinessUnit = (unitCode: string) => {
    const selectedUnit = adminUnits.find((u: any) => u.unitCode === unitCode);
    if (!selectedUnit || !Array.isArray(selectedUnit.banks)) return;

    setBusinessUnits([
      ...businessUnits,
      {
        unitCode,
        banks: selectedUnit.banks.map((b: any) => ({
          bankName: b.bankName || "",
          currency: b.currency || "",
          margin: b.margin || "",
          location: ""
        }))
      }
    ]);
  };

  const addBusinessUnit = () => {
    if (getAvailableUnits().length === 0) return;
    setBusinessUnits([...businessUnits, { unitCode: "", banks: [] }]);
  };

  /* ---------------- Banks ---------------- */
  const handleLocationChange = (buIndex: number, bankIndex: number, value: string) => {
    const updated = [...businessUnits];
    updated[buIndex].banks[bankIndex].location = value;
    setBusinessUnits(updated);
  };

  const removeBank = (buIndex: number, bankIndex: number) => {
    const updated = [...businessUnits];
    updated[buIndex].banks.splice(bankIndex, 1);
    setBusinessUnits(updated);
  };

  const restoreBank = (buIndex: number, bankName: string) => {
    const unitCode = businessUnits[buIndex].unitCode;
    const selectedUnit = adminUnits.find((u: any) => u.unitCode === unitCode);
    if (!selectedUnit || !Array.isArray(selectedUnit.banks)) return;

    const bank = selectedUnit.banks.find((b: any) => b.bankName === bankName);
    if (!bank) return;

    const updated = [...businessUnits];
    updated[buIndex].banks.push({
      bankName: bank.bankName,
      currency: bank.currency,
      margin: bank.margin,
      location: ""
    });
    setBusinessUnits(updated);
  };

  /* ---------------- Submit ---------------- */
  const handleSubmit = () => {
    const payload = {
      basicDetails: basic,
      businessUnits,
      createdByAdmin: admin?._id,
      createdAt: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem("addUserFormData") || "[]");
    localStorage.setItem("addUserFormData", JSON.stringify([...existing, payload]));

    onCancel()
    onSubmit(payload);
  };

  /* ---------------- UI ---------------- */
  return (
    <Stack spacing={8}>

      <Section title="User Details">
        <Grid templateColumns="repeat(2,1fr)" gap={4}>
          {Object.keys(basic).map((k) => (
            <FormControl key={k}>
              <FormLabel>{k.replace(/([A-Z])/g, " $1")}</FormLabel>
              <Input name={k} value={(basic as any)[k]} onChange={handleBasicChange} />
            </FormControl>
          ))}
        </Grid>
      </Section>

      <Section title="Business & Bank Mapping">
        <Stack spacing={6}>
          {businessUnits.map((bu, buIndex) => {
            const selectedUnit = adminUnits.find((u: any) => u.unitCode === bu.unitCode);

            return (
              <Box key={buIndex} p={5} bg="gray.50" rounded="xl" position="relative">
                <IconButton
                  icon={<CloseIcon />}
                  aria-label="Remove BU"
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                  position="absolute"
                  top="8px"
                  right="8px"
                  onClick={() => removeBusinessUnit(buIndex)}
                />

                <FormControl mb={4}>
                  <FormLabel>Business Unit</FormLabel>
                  <Select value={bu.unitCode} onChange={(e) => handleBUChange(buIndex, e.target.value)}>
                    <option value="">Select Business Unit</option>
                    {getAvailableUnits().concat(selectedUnit || []).map((u: any) => (
                      <option key={u.unitCode} value={u.unitCode}>{u.unitCode}</option>
                    ))}
                  </Select>
                </FormControl>

                {selectedUnit && bu.banks.map((bank, bankIndex) => (
                  <Grid key={bankIndex} templateColumns="2fr 2fr 2fr 3fr 40px" gap={3} mb={2}>
                    <Input value={bank.bankName} isReadOnly />
                    <Input value={bank.currency} isReadOnly />
                    <Input value={bank.margin} isReadOnly />
                    <Input
                      placeholder="Location"
                      value={bank.location}
                      onChange={(e) => handleLocationChange(buIndex, bankIndex, e.target.value)}
                    />
                    <IconButton
                      icon={<CloseIcon />}
                      aria-label="Remove Bank"
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => removeBank(buIndex, bankIndex)}
                    />
                  </Grid>
                ))}

                {selectedUnit && getAvailableBanks(buIndex).length > 0 && (
                  <Select
                    mt={2}
                    placeholder="Restore Bank"
                    onChange={(e) => {
                      if (e.target.value) {
                        restoreBank(buIndex, e.target.value);
                        e.target.value = "";
                      }
                    }}
                  >
                    {getAvailableBanks(buIndex).map((b: any) => (
                      <option key={b.bankName} value={b.bankName}>{b.bankName}</option>
                    ))}
                  </Select>
                )}
              </Box>
            );
          })}

          <Button size="sm" onClick={addBusinessUnit}>+ Add Business Unit</Button>

          {getAvailableUnits().length > 0 && (
            <Select
              placeholder="Restore Business Unit"
              onChange={(e) => {
                if (e.target.value) {
                  restoreBusinessUnit(e.target.value);
                  e.target.value = "";
                }
              }}
            >
              {getAvailableUnits().map((u: any) => (
                <option key={u.unitCode} value={u.unitCode}>{u.unitCode}</option>
              ))}
            </Select>
          )}
        </Stack>
      </Section>

      <Flex justify="flex-end" gap={4}>
        {onCancel && <Button onClick={onCancel}>Cancel</Button>}
        <Button colorScheme="blue" onClick={handleSubmit}>Create User</Button>
      </Flex>

    </Stack>
  );
});

export default AddForm;
