"use client";

import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Flex,
    IconButton,
    SimpleGrid,
    VStack,
} from "@chakra-ui/react";
import { FieldArray, useFormikContext } from "formik";
import CustomInput from "../../../../../../config/component/CustomInput/CustomInput";
// import CustomInput from "../../../../../config/component/CustomInput/CustomInput";

const SpotConversionSection = ({ showError }: any) => {
  const { values, setFieldValue, errors, touched }: any = useFormikContext();

  // A template for new rows
  const emptySpotRow = {
    conversionReferenceNumber: "",
    spotBooked: "",
    cashTomSpot: "",
    bankMargin: "",
    netRate: "",
    amount: "",
    settlementRate: "",
  };

  // Calculate per-row Net Rate
  const calculateNetRate = ( updatedRow: any) => {
    const spot = parseFloat(updatedRow.spotBooked) || 0;
    const cashTom = parseFloat(updatedRow.cashTomSpot) || 0;
    const margin = parseFloat(updatedRow.bankMargin) || 0;

    // Excel logic — adjust + or - as per your bank rules
    const net = spot + cashTom - margin;

    updatedRow.netRate = net ? net.toFixed(4) : "0.0000";
    return updatedRow;
  };

  // Called when user edits any of the row inputs
  const handleRowChange = (index: number, field: string, value: any) => {
    let row:any = { ...values.spotList[index], [field]: value };
    row = calculateNetRate( row);
    setFieldValue(`spotList.${index}`, row);
  };

  return (
    <Box
      p={5}
      borderWidth="1px"
      borderColor="blue.200"
      bg="blue.50"
      rounded="lg"
    >
      <Flex justify="space-between" mb={4}>
        <Box fontWeight={700} fontSize="lg" color="blue.700">
          Spot Conversion Details
        </Box>

        <FieldArray name="spotList">
          {({ push }) => (
            <Button
              size="sm"
              leftIcon={<AddIcon />}
              variant="outline"
              colorScheme="blue"
              onClick={() => push(emptySpotRow)}
            >
              Add Spot Row
            </Button>
          )}
        </FieldArray>
      </Flex>

      <FieldArray name="spotList">
        {({ remove }) => (
          <VStack spacing={4}>
            {values.spotList?.map((row: any, index: number) => {
              const rowTouched = touched?.spotList?.[index] || {};
              const rowErrors = errors?.spotList?.[index] || {};

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
                    <CustomInput
                      label="Conversion Ref No"
                      name={`spotList.${index}.conversionReferenceNumber`}
                      value={row.conversionReferenceNumber}
                      onChange={(e: any) =>
                        handleRowChange(
                          index,
                          "conversionReferenceNumber",
                          e.target.value
                        )
                      }
                      error={
                        rowTouched.conversionReferenceNumber &&
                        rowErrors.conversionReferenceNumber
                      }
                      showError={showError}
                    />

                    <CustomInput
                      label="Spot Booked"
                      name={`spotList.${index}.spotBooked`}
                      value={row.spotBooked}
                      onChange={(e: any) =>
                        handleRowChange(index, "spotBooked", e.target.value)
                      }
                      error={rowTouched.spotBooked && rowErrors.spotBooked}
                      showError={showError}
                    />

                    <CustomInput
                      label="Cash/Tom Spot"
                      name={`spotList.${index}.cashTomSpot`}
                      value={row.cashTomSpot}
                      onChange={(e: any) =>
                        handleRowChange(index, "cashTomSpot", e.target.value)
                      }
                      error={rowTouched.cashTomSpot && rowErrors.cashTomSpot}
                      showError={showError}
                    />

                    <CustomInput
                      label="Bank Margin"
                      name={`spotList.${index}.bankMargin`}
                      value={row.bankMargin}
                      onChange={(e: any) =>
                        handleRowChange(index, "bankMargin", e.target.value)
                      }
                      error={rowTouched.bankMargin && rowErrors.bankMargin}
                      showError={showError}
                    />

                    <CustomInput
                      label="Net Rate"
                      name={`spotList.${index}.netRate`}
                      value={row.netRate}
                      disabled
                    />

                    <CustomInput
                      label="Amount"
                      name={`spotList.${index}.amount`}
                      type="number"
                      value={row.amount}
                      onChange={(e: any) =>
                        handleRowChange(index, "amount", e.target.value)
                      }
                    />

                    <CustomInput
                      label="Settlement Rate"
                      name={`spotList.${index}.settlementRate`}
                      value={row.settlementRate}
                      onChange={(e: any) =>
                        handleRowChange(index, "settlementRate", e.target.value)
                      }
                    />
                  </SimpleGrid>

                  {values.spotList.length > 1 && (
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

export default SpotConversionSection;
