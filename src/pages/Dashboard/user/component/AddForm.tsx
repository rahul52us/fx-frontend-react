import { CloseIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  Input,
  Select,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { formatCamelCaseLabel } from "../../../../config/constant/function";
import store from "../../../../store/store";
import { registerPermissions } from "../../Users/component/UserDetails/utils/constant";
import { transformPermissionsForDB } from "../../Users/component/UserDetails/utils/function";

/* ---------------- UI Card ---------------- */
const Section = ({ title, subtitle, children }: any) => (
  <Box bg="white" border="1px solid" borderColor="gray.200" rounded="2xl" p={6}>
    <Text fontSize="lg" fontWeight="600">{title}</Text>
    {subtitle && <Text fontSize="sm" color="gray.500">{subtitle}</Text>}
    <Divider my={4} />
    {children}
  </Box>
);

const AddForm = observer(({ onSubmit, onCancel }: any) => {
  const { auth: { user: admin } } = store;
  const toast = useToast();

  const [basic, setBasic] = useState({
    userName: "",
    fatherName: "",
    address: "",
    contact: "",
    email: "",
    designation: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [businessUnits, setBusinessUnits] = useState([
    { unitCode: "", banks: [] as any[] }
  ]);

  const [permissions, setPermissions] = useState(registerPermissions);

  const handlePermissionChange = (moduleKey: string, permissionKey: string) => {
    setPermissions((prev: any) => ({
      ...prev,
      [moduleKey]: {
        ...prev[moduleKey],
        [permissionKey]: !prev[moduleKey][permissionKey]
      }
    }));
  };

  const adminUnits = Array.isArray(admin?.businessUnits) ? admin.businessUnits : [];

  const handleBasicChange = (e: any) => {
    const { name, value } = e.target;
    const updated = { ...basic, [name]: value };

    if (name === "password" || name === "confirmPassword") {
      if (
        updated.password &&
        updated.confirmPassword &&
        updated.password !== updated.confirmPassword
      ) {
        setPasswordError("Passwords do not match");
      } else {
        setPasswordError("");
      }
    }

    setBasic(updated);
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
        bankSpread: b.bankSpread || "",
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
          bankSpread: b.bankSpread || "",
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
      bankSpread: bank.bankSpread || "",
      location: ""
    });
    setBusinessUnits(updated);
  };

  /* ---------------- Submit ---------------- */
  const handleSubmit = async () => {
    if (!basic.password || !basic.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Password and Confirm Password are required",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    if (basic.password !== basic.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    const { confirmPassword, ...basicDetailsWithoutConfirm } = basic;

    const payload = {
      basicDetails: { ...basicDetailsWithoutConfirm, permissions: transformPermissionsForDB(permissions) },
      businessUnits,
      createdByAdmin: admin?._id,
      createdAt: new Date().toISOString(),
      role: 'user', // Add role to differentiate from admin

    };

    setLoading(true);
    try {
      let response = await store.User.createUserWithAuth(payload);
      if (response?.status === "success") {
        toast({
          title: "Success",
          description: "User created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onSubmit();

      }
      else {
        toast({
          title: "Error",
          description: response?.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      // Show success message
      //       // Only close drawer on success
    } catch (error: any) {
      // Extract error message from API response
      const errorMessage = error?.message || error?.error || "Failed to create user";

      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      console.error("Create user error:", error);
      // Do NOT call onSubmit() or onCancel() here - keep drawer open on error
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <Stack spacing={8}>

      <Section title="User Details">
        <Grid templateColumns="repeat(2,1fr)" gap={4}>
          {Object.keys(basic).filter(k => k !== "fatherName").map((k) => (
            <FormControl key={k} isInvalid={k === "confirmPassword" && !!passwordError}>
              <FormLabel>
                {k === "userName" ? "Name" : k.replace(/([A-Z])/g, " $1")}
              </FormLabel>

              {k === "password" || k === "confirmPassword" ? (
                <Flex align="center">
                  <Input
                    name={k}
                    type={
                      k === "password"
                        ? showPassword
                          ? "text"
                          : "password"
                        : showConfirmPassword
                          ? "text"
                          : "password"
                    }
                    value={(basic as any)[k]}
                    onChange={handleBasicChange}
                  />
                  <IconButton
                    ml={2}
                    size="sm"
                    variant="ghost"
                    aria-label="Toggle password"
                    icon={
                      k === "password"
                        ? showPassword
                          ? <ViewOffIcon />
                          : <ViewIcon />
                        : showConfirmPassword
                          ? <ViewOffIcon />
                          : <ViewIcon />
                    }
                    onClick={() =>
                      k === "password"
                        ? setShowPassword(!showPassword)
                        : setShowConfirmPassword(!showConfirmPassword)
                    }
                  />
                </Flex>
              ) : (
                <Input
                  name={k}
                  value={(basic as any)[k]}
                  onChange={handleBasicChange}
                />
              )}

              {k === "confirmPassword" && passwordError && (
                <Text color="red.500" fontSize="sm">{passwordError}</Text>
              )}
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
                  <Grid key={bankIndex} templateColumns="2fr 2fr 2fr 2fr 3fr 40px" gap={3} mb={2}>
                    <Input value={bank.bankName} isReadOnly />
                    <Input value={bank.currency} isReadOnly />
                    <Input value={bank.margin} isReadOnly />
                    <Input value={bank.bankSpread || ""} isReadOnly />
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

      <Section title="Permissions">
        <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
          {Object.keys(permissions).map((moduleKey) => (
            <Box key={moduleKey} p={4} borderWidth="1px" borderRadius="lg" bg="gray.50">
              <Text fontWeight="bold" mb={3} textTransform="capitalize">
                {formatCamelCaseLabel(moduleKey)}
              </Text>
              <Stack spacing={2}>
                {Object.keys(permissions[moduleKey]).map((permKey) => (
                  <Checkbox
                    key={permKey}
                    isChecked={permissions[moduleKey][permKey]}
                    onChange={() => handlePermissionChange(moduleKey, permKey)}
                    colorScheme="blue"
                  >
                    {formatCamelCaseLabel(permKey)}
                  </Checkbox>
                ))}
              </Stack>
            </Box>
          ))}
        </Grid>
      </Section>

      <Flex justify="flex-end" gap={4}>
        {onCancel && <Button onClick={onCancel} isDisabled={loading}>Cancel</Button>}
        <Button colorScheme="blue" onClick={handleSubmit} isLoading={loading} loadingText="Creating...">Create User</Button>
      </Flex>
    </Stack >
  );
});

export default AddForm;
