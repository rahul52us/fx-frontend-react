"use client";

import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Select as ChakraSelect,
    Flex,
    FormControl,
    FormLabel,
    IconButton,
    SimpleGrid,
    VStack,
} from "@chakra-ui/react";
import { FieldArray, useFormikContext } from "formik";
import CustomInput from "../../../../../../config/component/CustomInput/CustomInput";

// Dummy PCFC register data (replace with API)
const dummyPCFCRegister = [
  {
    conversionRefNo: "PCFC001",
    outstandingAmount: "45000",
    hedgeRate: "82.30",
    deliveryDateFrom: "2025-04-05",
    deliveryDateTo: "2025-04-15",
  },
  {
    conversionRefNo: "PCFC002",
    outstandingAmount: "28000",
    hedgeRate: "82.05",
    deliveryDateFrom: "2025-04-18",
    deliveryDateTo: "2025-04-30",
  },
];

const PCFCRepaymentSection = ({ showError }: any) => {
  const { values, setFieldValue, touched, errors }: any = useFormikContext();

  const emptyRow = {
    conversionReferenceNumber: "",
    outstandingAmount: "",
    hedgeRate: "",
    deliveryDateFrom: "",
    deliveryDateTo: "",
    utilizationAmount: "",
    forwardPremium: "",
    cashTomSpot: "",
    netSettlementRate: "",
  };

  // calculate net settlement rate
  const calculateNetSettlementRate = (row: any) => {
    const hedge = parseFloat(row.hedgeRate) || 0;
    const premium = parseFloat(row.forwardPremium) || 0;
    const cashTom = parseFloat(row.cashTomSpot) || 0;
    const net = hedge + premium + cashTom;
    return net ? net.toFixed(4) : "0.0000";
  };

  // on change of any field
  const handleChange = (index: number, field: string, value: any) => {
    let updatedRow = { ...values.pcfcList[index], [field]: value };
    updatedRow.netSettlementRate = calculateNetSettlementRate(updatedRow);
    setFieldValue(`pcfcList.${index}`, updatedRow);
  };

  // when selecting the PCFC reference
  const handleSelectReference = (index: number, ref: string) => {
    const selected = dummyPCFCRegister.find(
      (x) => x.conversionRefNo === ref
    );
    if (!selected) return;

    const updatedRow = {
      ...values.pcfcList[index],
      conversionReferenceNumber: ref,
      outstandingAmount: selected.outstandingAmount,
      hedgeRate: selected.hedgeRate,
      deliveryDateFrom: selected.deliveryDateFrom,
      deliveryDateTo: selected.deliveryDateTo,
    };

    updatedRow.netSettlementRate = calculateNetSettlementRate(updatedRow);

    setFieldValue(`pcfcList.${index}`, updatedRow);
  };

  return (
    <Box
      p={5}
      borderWidth="1px"
      borderColor="orange.200"
      bg="orange.50"
      rounded="lg"
    >
      <Flex justify="space-between" mb={4}>
        <Box fontWeight={700} fontSize="lg" color="orange.700">
          PCFC Repayment
        </Box>

        <FieldArray name="pcfcList">
          {({ push }) => (
            <Button
              leftIcon={<AddIcon />}
              variant="outline"
              colorScheme="orange"
              size="sm"
              onClick={() => push(emptyRow)}
            >
              Add PCFC Row
            </Button>
          )}
        </FieldArray>
      </Flex>

      <FieldArray name="pcfcList">
        {({ remove }) => (
          <VStack spacing={4}>
            {values.pcfcList?.map((row: any, index: number) => {
              const rowTouched = touched?.pcfcList?.[index] || {};
              const rowErrors = errors?.pcfcList?.[index] || {};

              return (
                <Box
                  key={index}
                  p={4}
                  bg="white"
                  rounded="md"
                  shadow="sm"
                  w="full"
                  position="relative"
                >
                  <SimpleGrid columns={[1, 2, 3]} spacing={4}>
                    {/* Conversion Ref Dropdown */}
                    <FormControl>
                      <FormLabel>Conversion Ref No</FormLabel>
                      <ChakraSelect
                        placeholder="Select Reference"
                        value={row.conversionReferenceNumber}
                        onChange={(e) =>
                          handleSelectReference(index, e.target.value)
                        }
                      >
                        {dummyPCFCRegister.map((item) => (
                          <option
                            key={item.conversionRefNo}
                            value={item.conversionRefNo}
                          >
                            {item.conversionRefNo}
                          </option>
                        ))}
                      </ChakraSelect>
                    </FormControl>

                    <CustomInput
                      label="Outstanding Amount"
                      name={`pcfcList.${index}.outstandingAmount`}
                      value={row.outstandingAmount}
                      disabled
                    />

                    <CustomInput
                      label="Hedge Rate"
                      name={`pcfcList.${index}.hedgeRate`}
                      value={row.hedgeRate}
                      disabled
                    />

                    <CustomInput
                      label="Delivery Date From"
                      name={`pcfcList.${index}.deliveryDateFrom`}
                      type="date"
                      value={row.deliveryDateFrom}
                      disabled
                    />

                    <CustomInput
                      label="Delivery Date To"
                      name={`pcfcList.${index}.deliveryDateTo`}
                      type="date"
                      value={row.deliveryDateTo}
                      disabled
                    />

                    <CustomInput
                      label="Utilization Amount"
                      name={`pcfcList.${index}.utilizationAmount`}
                      type="number"
                      value={row.utilizationAmount}
                      onChange={(e: any) =>
                        handleChange(index, "utilizationAmount", e.target.value)
                      }
                      error={
                        rowTouched.utilizationAmount &&
                        rowErrors.utilizationAmount
                      }
                      showError={showError}
                    />

                    <CustomInput
                      label="Forward Premium"
                      name={`pcfcList.${index}.forwardPremium`}
                      value={row.forwardPremium}
                      onChange={(e: any) =>
                        handleChange(index, "forwardPremium", e.target.value)
                      }
                    />

                    <CustomInput
                      label="Cash/Tom Spot"
                      name={`pcfcList.${index}.cashTomSpot`}
                      value={row.cashTomSpot}
                      onChange={(e: any) =>
                        handleChange(index, "cashTomSpot", e.target.value)
                      }
                    />

                    <CustomInput
                      label="Net Settlement Rate"
                      name={`pcfcList.${index}.netSettlementRate`}
                      value={row.netSettlementRate}
                      disabled
                    />
                  </SimpleGrid>

                  {values.pcfcList.length > 1 && (
                    <IconButton
                      aria-label="Delete row"
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      position="absolute"
                      top={2}
                      right={2}
                      onClick={() => remove(index)}
                    />
                  )}
                </Box>
              );
            })}
          </VStack>
        )}
      </FieldArray>
    </Box>
  );
};

export default PCFCRepaymentSection;
