"use client";

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

import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { FieldArray, useFormikContext } from "formik";

import CustomInput from "../../../../../../config/component/CustomInput/CustomInput";

// Dummy Forward Register Data (replace with API later)
const dummyForwardRegister = [
  {
    hedgeDealRefNo: "FWD001",
    outstandingAmount: "40000",
    hedgeRate: "82.55",
    deliveryDateFrom: "2025-05-10",
    deliveryDateTo: "2025-05-20",
  },
  {
    hedgeDealRefNo: "FWD002",
    outstandingAmount: "25000",
    hedgeRate: "82.15",
    deliveryDateFrom: "2025-06-01",
    deliveryDateTo: "2025-06-10",
  },
];

const ForwardContractSection = ({ showError }: any) => {
  const { values, setFieldValue, touched, errors }: any = useFormikContext();

  const emptyRow = {
    hedgeDealRefNo: "",
    outstandingAmount: "",
    utilizationAmount: "",
    hedgeRate: "",
    forwardPremium: "",
    cashTomSpot: "",
    deliveryDateFrom: "",
    deliveryDateTo: "",
    netSettlementRate: "",
  };

  // Net settlement rate formula
  const calculateNetSettlementRate = (row: any) => {
    const hedge = parseFloat(row.hedgeRate) || 0;
    const premium = parseFloat(row.forwardPremium) || 0;
    const cashTom = parseFloat(row.cashTomSpot) || 0;

    const net = hedge + premium + cashTom;
    return net ? net.toFixed(4) : "0.0000";
  };

  // Handle field changes
  const handleChange = (index: number, field: string, value: any) => {
    let updatedRow = { ...values.forwardList[index], [field]: value };
    updatedRow.netSettlementRate = calculateNetSettlementRate(updatedRow);
    setFieldValue(`forwardList.${index}`, updatedRow);
  };

  // Handle Hedge Deal reference selection
  const handleSelectReference = (index: number, ref: string) => {
    const selected = dummyForwardRegister.find(
      (x) => x.hedgeDealRefNo === ref
    );
    if (!selected) return;

    const updatedRow = {
      ...values.forwardList[index],
      hedgeDealRefNo: selected.hedgeDealRefNo,
      outstandingAmount: selected.outstandingAmount,
      hedgeRate: selected.hedgeRate,
      deliveryDateFrom: selected.deliveryDateFrom,
      deliveryDateTo: selected.deliveryDateTo,
    };

    updatedRow.netSettlementRate = calculateNetSettlementRate(updatedRow);

    setFieldValue(`forwardList.${index}`, updatedRow);
  };

  return (
    <Box
      p={5}
      borderWidth="1px"
      borderColor="pink.300"
      bg="pink.50"
      rounded="lg"
    >
      <Flex justify="space-between" mb={4}>
        <Box fontWeight={700} fontSize="lg" color="pink.700">
          Forward Contract Settlement
        </Box>

        <FieldArray name="forwardList">
          {({ push }) => (
            <Button
              leftIcon={<AddIcon />}
              variant="outline"
              colorScheme="pink"
              size="sm"
              onClick={() => push(emptyRow)}
            >
              Add Forward Row
            </Button>
          )}
        </FieldArray>
      </Flex>

      <FieldArray name="forwardList">
        {({ remove }) => (
          <VStack spacing={4}>
            {values.forwardList?.map((row: any, index: number) => {
              const rowTouched = touched?.forwardList?.[index] || {};
              const rowErrors = errors?.forwardList?.[index] || {};

              return (
                <Box
                  key={index}
                  p={4}
                  bg="white"
                  shadow="sm"
                  rounded="md"
                  w="full"
                  position="relative"
                >
                  <SimpleGrid columns={[1, 2, 3]} spacing={4}>

                    {/* Hedge Deal Ref No */}
                    <FormControl>
                      <FormLabel>Hedge Deal Ref No</FormLabel>
                      <ChakraSelect
                        placeholder="Select Hedge Ref"
                        value={row.hedgeDealRefNo}
                        onChange={(e) =>
                          handleSelectReference(index, e.target.value)
                        }
                      >
                        {dummyForwardRegister.map((item) => (
                          <option
                            key={item.hedgeDealRefNo}
                            value={item.hedgeDealRefNo}
                          >
                            {item.hedgeDealRefNo}
                          </option>
                        ))}
                      </ChakraSelect>
                    </FormControl>

                    <CustomInput
                      label="Outstanding Amount"
                      name={`forwardList.${index}.outstandingAmount`}
                      value={row.outstandingAmount}
                      disabled
                    />

                    <CustomInput
                      label="Hedge Rate"
                      name={`forwardList.${index}.hedgeRate`}
                      value={row.hedgeRate}
                      disabled
                    />

                    <CustomInput
                      label="Delivery Date From"
                      name={`forwardList.${index}.deliveryDateFrom`}
                      type="date"
                      value={row.deliveryDateFrom}
                      disabled
                    />

                    <CustomInput
                      label="Delivery Date To"
                      name={`forwardList.${index}.deliveryDateTo`}
                      type="date"
                      value={row.deliveryDateTo}
                      disabled
                    />

                    <CustomInput
                      label="Utilization Amount"
                      name={`forwardList.${index}.utilizationAmount`}
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
                      name={`forwardList.${index}.forwardPremium`}
                      value={row.forwardPremium}
                      onChange={(e: any) =>
                        handleChange(index, "forwardPremium", e.target.value)
                      }
                    />

                    <CustomInput
                      label="Cash/Tom Spot"
                      name={`forwardList.${index}.cashTomSpot`}
                      value={row.cashTomSpot}
                      onChange={(e: any) =>
                        handleChange(index, "cashTomSpot", e.target.value)
                      }
                    />

                    <CustomInput
                      label="Net Settlement Rate"
                      name={`forwardList.${index}.netSettlementRate`}
                      value={row.netSettlementRate}
                      disabled
                    />

                  </SimpleGrid>

                  {values.forwardList.length > 1 && (
                    <IconButton
                      aria-label="Delete"
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

export default ForwardContractSection;
