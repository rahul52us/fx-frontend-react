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
import { useEffect, useState } from "react";
import store from "../../../../store/store";

const STORAGE_KEY = "addUserFormData";

/* ---------------- UI Card ---------------- */
const Section = ({ title, subtitle, children }: any) => (
  <Box bg="white" border="1px solid" borderColor="gray.200" rounded="2xl" p={6}>
    <Text fontSize="lg" fontWeight="600">{title}</Text>
    {subtitle && <Text fontSize="sm" color="gray.500">{subtitle}</Text>}
    <Divider my={4} />
    {children}
  </Box>
);

interface EditFormProps {
  recordIndex: number;
  onUpdate: () => void;
  onCancel: () => void;
}

const EditForm = ({ recordIndex, onUpdate, onCancel }: EditFormProps) => {
  const { auth: { user: admin } } = store;

  /* ---------------- STATES ---------------- */
  const [basic, setBasic] = useState({
    userName: "",
    fatherName: "",
    address: "",
    contact: "",
    email: "",
    designation: "",
  });

  const [businessUnits, setBusinessUnits] = useState<any[]>([
    { unitCode: "", banks: [] }
  ]);

  const adminUnits = admin?.businessUnits || [];

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const record = stored[recordIndex];

    if (!record) return;

    setBasic(record.basicDetails);
    setBusinessUnits(record.businessUnits || [{ unitCode: "", banks: [] }]);
  }, [recordIndex]);

  /* ---------------- HELPERS ---------------- */
  const usedUnits = businessUnits.map(b => b.unitCode);

  const getAvailableUnits = () => {
    return adminUnits.filter((u: any) => !usedUnits.includes(u.unitCode));
  };

  const getAvailableBanks = (buIndex: number) => {
    const unitCode = businessUnits[buIndex].unitCode;
    const selectedUnit = adminUnits.find((u: any) => u.unitCode === unitCode);
    if (!selectedUnit) return [];

    const selected = businessUnits[buIndex].banks.map((b: any) => b.bankName);
    return selectedUnit.banks.filter((b: any) => !selected.includes(b.bankName));
  };

  /* ---------------- HANDLERS ---------------- */
  const handleBasicChange = (e: any) => {
    setBasic({ ...basic, [e.target.name]: e.target.value });
  };

  const handleBUChange = (index: number, unitCode: string) => {
    const selectedUnit = adminUnits.find((u: any) => u.unitCode === unitCode);
    if (!selectedUnit) return;

    const updated = [...businessUnits];
    updated[index] = {
      unitCode,
      banks: selectedUnit.banks.map((b: any) => ({
        bankName: b.bankName,
        currency: b.currency,
        margin: b.margin,
        location: ""
      }))
    };
    setBusinessUnits(updated);
  };

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
    const bank = selectedUnit?.banks.find((b: any) => b.bankName === bankName);
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

  const removeBusinessUnit = (index: number) => {
    const updated = [...businessUnits];
    updated.splice(index, 1);
    setBusinessUnits(updated.length ? updated : [{ unitCode: "", banks: [] }]);
  };

  const restoreBusinessUnit = (unitCode: string) => {
    const selectedUnit = adminUnits.find((u: any) => u.unitCode === unitCode);
    if (!selectedUnit) return;

    setBusinessUnits([
      ...businessUnits,
      {
        unitCode,
        banks: selectedUnit.banks.map((b: any) => ({
          bankName: b.bankName,
          currency: b.currency,
          margin: b.margin,
          location: ""
        }))
      }
    ]);
  };

  const addBusinessUnit = () => {
    if (getAvailableUnits().length === 0) return;
    setBusinessUnits([...businessUnits, { unitCode: "", banks: [] }]);
  };

  /* ---------------- SAVE ---------------- */
  const handleUpdate = () => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    stored[recordIndex] = {
      ...stored[recordIndex],
      basicDetails: basic,
      businessUnits,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    onUpdate();
  };

  /* ---------------- UI ---------------- */
  return (
    <Stack spacing={8} p={4}>

      <Section title="User Details">
        <Grid templateColumns="repeat(2,1fr)" gap={4}>
          {Object.keys(basic).map((k) => (
            <FormControl key={k}>
              <FormLabel>{k.replace(/([A-Z])/g," $1")}</FormLabel>
              <Input name={k} value={(basic as any)[k]} onChange={handleBasicChange}/>
            </FormControl>
          ))}
        </Grid>
      </Section>

      <Section title="Business & Bank Mapping">
        {businessUnits.map((bu, buIndex) => {
          const selectedUnit = adminUnits.find((u:any)=>u.unitCode===bu.unitCode);

          return (
            <Box key={buIndex} p={4} bg="gray.50" rounded="xl" position="relative">

              <IconButton
                icon={<CloseIcon/>}
                aria-label="Remove BU"
                size="sm"
                colorScheme="red"
                variant="ghost"
                position="absolute"
                top="8px"
                right="8px"
                onClick={()=>removeBusinessUnit(buIndex)}
              />

              <FormControl mb={4}>
                <FormLabel>Business Unit</FormLabel>
                <Select
                  value={bu.unitCode}
                  onChange={(e)=>handleBUChange(buIndex,e.target.value)}
                >
                  <option value="">Select Business Unit</option>
                  {getAvailableUnits().concat(selectedUnit || []).map((u:any)=>(
                    <option key={u.unitCode} value={u.unitCode}>{u.unitCode}</option>
                  ))}
                </Select>
              </FormControl>

              {bu.banks.map((bank:any, bankIndex:number)=>(
                <Grid key={bankIndex} templateColumns="2fr 2fr 2fr 3fr 40px" gap={3} mb={3}>
                  <Input value={bank.bankName} isReadOnly/>
                  <Input value={bank.currency} isReadOnly/>
                  <Input value={bank.margin} isReadOnly/>
                  <Input
                    placeholder="Location"
                    value={bank.location}
                    onChange={(e)=>handleLocationChange(buIndex,bankIndex,e.target.value)}
                  />
                  <IconButton
                    icon={<CloseIcon/>}
                    aria-label="Remove Bank"
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={()=>removeBank(buIndex,bankIndex)}
                  />
                </Grid>
              ))}

              {selectedUnit && getAvailableBanks(buIndex).length > 0 && (
                <Select
                  mt={2}
                  placeholder="Restore Bank"
                  onChange={(e)=>{
                    if(e.target.value){
                      restoreBank(buIndex,e.target.value);
                      e.target.value="";
                    }
                  }}
                >
                  {getAvailableBanks(buIndex).map((b:any)=>(
                    <option key={b.bankName} value={b.bankName}>{b.bankName}</option>
                  ))}
                </Select>
              )}

            </Box>
          );
        })}

        <Button size="sm" onClick={addBusinessUnit} variant="outline" colorScheme="blue">
          + Add Business Unit
        </Button>

        {getAvailableUnits().length > 0 && (
          <Select
            placeholder="Restore Business Unit"
            mt={2}
            onChange={(e)=>{
              if(e.target.value){
                restoreBusinessUnit(e.target.value);
                e.target.value="";
              }
            }}
          >
            {getAvailableUnits().map((u:any)=>(
              <option key={u.unitCode} value={u.unitCode}>{u.unitCode}</option>
            ))}
          </Select>
        )}
      </Section>

      <Flex justify="flex-end" gap={4}>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button colorScheme="blue" onClick={handleUpdate}>Update</Button>
      </Flex>

    </Stack>
  );
};

export default EditForm;
