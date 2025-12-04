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

// Dummy EEFC IMPORT register data (replace with API call)
const dummyEEFCImportRegister = [
  {
    conversionRefNo: "EEFCPIMP001",
    outstandingAmount: "60000",
    bookedRate: "81.55",
  },
  {
    conversionRefNo: "EEFCPIMP002",
    outstandingAmount: "35000",
    bookedRate: "82.10",
  },
];

const EEFCImportsSection = ({ showError }: any) => {
  const { values, setFieldValue, errors, touched }: any = useFormikContext();

  const emptyRow = {
    conversionReferenceNumber: "",
    outstandingAmount: "",
    bookedRate: "",
    spotBooked: "",
    cashTomSpot: "",
    bankMargin: "",
    netRate: "",
    amount: "",
    settlementRate: "",
  };

  const calculateNetRate = (row: any) => {
    const spot = parseFloat(row.spotBooked) || 0;
    const cashTom = parseFloat(row.cashTomSpot) || 0;
    const margin = parseFloat(row.bankMargin) || 0;

    const net = spot + cashTom - margin;
    return net ? net.toFixed(4) : "0.0000";
  };

  const handleChange = (index: number, field: string, value: any) => {
    let updatedRow = { ...values.eefcImportsList[index], [field]: value };
    updatedRow.netRate = calculateNetRate(updatedRow);
    setFieldValue(`eefcImportsList.${index}`, updatedRow);
  };

  const handleSelectReference = (index: number, ref: string) => {
    const selected = dummyEEFCImportRegister.find(
      (x) => x.conversionRefNo === ref
    );
    if (!selected) return;

    const updatedRow = {
      ...values.eefcImportsList[index],
      conversionReferenceNumber: ref,
      outstandingAmount: selected.outstandingAmount,
      bookedRate: selected.bookedRate,
    };

    // recalc
    updatedRow.netRate = calculateNetRate(updatedRow);

    setFieldValue(`eefcImportsList.${index}`, updatedRow);
  };

  return (
    <Box
      p={5}
      borderWidth="1px"
      borderColor="teal.200"
      bg="teal.50"
      rounded="lg"
    >
      <Flex justify="space-between" mb={4}>
        <Box fontWeight={700} fontSize="lg" color="teal.700">
          EEFC Conversion – Imports
        </Box>

        <FieldArray name="eefcImportsList">
          {({ push }) => (
            <Button
              leftIcon={<AddIcon />}
              variant="outline"
              colorScheme="teal"
              size="sm"
              onClick={() => push(emptyRow)}
            >
              Add EEFC Import Row
            </Button>
          )}
        </FieldArray>
      </Flex>

      <FieldArray name="eefcImportsList">
        {({ remove }) => (
          <VStack spacing={4}>
            {values.eefcImportsList?.map((row: any, index: number) => {
              const rowTouched = touched?.eefcImportsList?.[index] || {};
              const rowErrors = errors?.eefcImportsList?.[index] || {};

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

                    {/* Conversion Reference */}
                    <FormControl>
                      <FormLabel>Conversion Ref No</FormLabel>
                      <ChakraSelect
                        placeholder="Select Reference"
                        value={row.conversionReferenceNumber}
                        onChange={(e) =>
                          handleSelectReference(index, e.target.value)
                        }
                      >
                        {dummyEEFCImportRegister.map((item) => (
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
                      name={`eefcImportsList.${index}.outstandingAmount`}
                      value={row.outstandingAmount}
                      disabled
                    />

                    <CustomInput
                      label="Booked Rate"
                      name={`eefcImportsList.${index}.bookedRate`}
                      value={row.bookedRate}
                      disabled
                    />

                    <CustomInput
                      label="Spot Booked"
                      name={`eefcImportsList.${index}.spotBooked`}
                      value={row.spotBooked}
                      onChange={(e: any) =>
                        handleChange(index, "spotBooked", e.target.value)
                      }
                      error={rowTouched.spotBooked && rowErrors.spotBooked}
                      showError={showError}
                    />

                    <CustomInput
                      label="Cash/Tom Spot"
                      name={`eefcImportsList.${index}.cashTomSpot`}
                      value={row.cashTomSpot}
                      onChange={(e: any) =>
                        handleChange(index, "cashTomSpot", e.target.value)
                      }
                      error={rowTouched.cashTomSpot && rowErrors.cashTomSpot}
                      showError={showError}
                    />

                    <CustomInput
                      label="Bank Margin"
                      name={`eefcImportsList.${index}.bankMargin`}
                      value={row.bankMargin}
                      onChange={(e: any) =>
                        handleChange(index, "bankMargin", e.target.value)
                      }
                      error={rowTouched.bankMargin && rowErrors.bankMargin}
                      showError={showError}
                    />

                    <CustomInput
                      label="Net Rate"
                      name={`eefcImportsList.${index}.netRate`}
                      value={row.netRate}
                      disabled
                    />

                    <CustomInput
                      label="Amount"
                      name={`eefcImportsList.${index}.amount`}
                      type="number"
                      value={row.amount}
                      onChange={(e: any) =>
                        handleChange(index, "amount", e.target.value)
                      }
                    />

                    <CustomInput
                      label="Settlement Rate"
                      name={`eefcImportsList.${index}.settlementRate`}
                      value={row.settlementRate}
                      onChange={(e: any) =>
                        handleChange(index, "settlementRate", e.target.value)
                      }
                    />
                  </SimpleGrid>

                  {values.eefcImportsList.length > 1 && (
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

export default EEFCImportsSection;
