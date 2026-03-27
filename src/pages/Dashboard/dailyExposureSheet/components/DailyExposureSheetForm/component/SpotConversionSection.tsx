"use client";

import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, IconButton, SimpleGrid, VStack } from "@chakra-ui/react";
import { FieldArray, useFormikContext } from "formik";
import { useEffect, useCallback } from "react";
import CustomInput from "../../../../../../config/component/CustomInput/CustomInput";
import store from "../../../../../../store/store";

const SpotConversionSection = ({ showError }: any) => {
  const { values, setFieldValue, errors, touched }: any = useFormikContext();
  const { auth: { banksData } } = store;

  const getBankMargin = useCallback(() => {
    const bankValue = typeof values.bank === "string"
      ? values.bank
      : values.bank?.value;
    const found = banksData.find((b: any) => b.value === bankValue);
    return found?.bankMargin ?? "";
  }, [values.bank, banksData]);

  // Recalculate all rows when bank or exposureType changes
  useEffect(() => {
    if (!values.spotList) return;

    const bankMargin = getBankMargin();
    const exposureType = values.exposureType; // 'import' or 'export'

    const updatedList = values.spotList.map((row: any) => {
      let updatedRow = { ...row };

      // Set default margin for rows that don't have one yet
      if (!updatedRow.bankMargin && bankMargin !== undefined && bankMargin !== "") {
        updatedRow.bankMargin = bankMargin;
      }

      const spot = parseFloat(updatedRow.spotBooked) || 0;
      const cashTom = parseFloat(updatedRow.cashTomSpot) || 0;
      const margin = parseFloat(updatedRow.bankMargin) || 0;

      let netRate;
      if (exposureType === "import") {
        netRate = spot - cashTom + margin; // add margin for import
      } else {
        netRate = spot - cashTom - margin; // subtract margin for export (default)
      }
      updatedRow.netConversionRate = netRate ? netRate.toFixed(4) : "0.0000";

      return updatedRow;
    });

    setFieldValue("spotList", updatedList);
  }, [values.bank, values.exposureType, getBankMargin, setFieldValue, values.spotList]); // ✅ Re‑run when bank or exposureType changes

  // Create a new row with correct net rate based on current exposureType and bank margin
  const getEmptySpotRow = () => {
    const bankMargin = getBankMargin();
    const exposureType = values.exposureType;
    const spot = 0;
    const cashTom = 0;
    const margin = parseFloat(bankMargin) || 0;

    let netRate = 0;
    if (exposureType === "import") {
      netRate = spot - cashTom + margin;
    } else {
      netRate = spot - cashTom - margin;
    }

    return {
      conversionReferenceNumber: "",
      spotBooked: "",
      cashTomSpot: "",
      bankMargin: bankMargin,
      amountConverted: "",
      netConversionRate: netRate ? netRate.toFixed(4) : "0.0000",
    };
  };

  const handleSpotFieldChange = (index: number, field: string, value: string) => {
    const currentRow = values.spotList?.[index] || {};
    const updatedRow = { ...currentRow, [field]: value };

    const spot = parseFloat(updatedRow.spotBooked) || 0;
    const cashTom = parseFloat(updatedRow.cashTomSpot) || 0;
    const margin = parseFloat(updatedRow.bankMargin) || 0;
    const exposureType = values.exposureType;

    let netRate;
    if (exposureType === "import") {
      netRate = spot - cashTom + margin;
    } else {
      netRate = spot - cashTom - margin;
    }
    updatedRow.netConversionRate = netRate ? netRate.toFixed(4) : "0.0000";

    setFieldValue(`spotList.${index}`, updatedRow);
  };

  return (
    <Box p={5} borderWidth="1px" borderColor="blue.200" bg="blue.50" rounded="lg">
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
              onClick={() => push(getEmptySpotRow())} // ✅ now uses current exposureType
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
                <Box key={index} p={4} bg="white" rounded="md" shadow="sm" w="full" position="relative">
                  <SimpleGrid columns={[1, 2, 3]} spacing={4}>
                    <CustomInput
                      label="Conversion Ref No"
                      name={`spotList.${index}.conversionReferenceNumber`}
                      value={row.conversionReferenceNumber}
                      onChange={(e: any) =>
                        handleSpotFieldChange(index, "conversionReferenceNumber", e.target.value)
                      }
                      error={rowTouched.conversionReferenceNumber && rowErrors.conversionReferenceNumber}
                      showError={showError}
                    />
                    <CustomInput
                      label="Spot Booked"
                      name={`spotList.${index}.spotBooked`}
                      value={row.spotBooked}
                      onChange={(e: any) =>
                        handleSpotFieldChange(index, "spotBooked", e.target.value)
                      }
                    />
                    <CustomInput
                      label="Cash/Tom Spot"
                      name={`spotList.${index}.cashTomSpot`}
                      value={row.cashTomSpot}
                      onChange={(e: any) =>
                        handleSpotFieldChange(index, "cashTomSpot", e.target.value)
                      }
                    />
                    <CustomInput
                      label="Bank Margin"
                      name={`spotList.${index}.bankMargin`}
                      value={row.bankMargin}
                      disabled
                      onChange={(e: any) =>
                        handleSpotFieldChange(index, "bankMargin", e.target.value)
                      }
                    />
                    <CustomInput
                      label="Amount Converted"
                      name={`spotList.${index}.amountConverted`}
                      type="number"
                      value={row.amountConverted}
                      onChange={(e: any) =>
                        handleSpotFieldChange(index, "amountConverted", e.target.value)
                      }
                    />
                    <CustomInput
                      label="Net Conversion Rate"
                      name={`spotList.${index}.netConversionRate`}
                      value={row.netConversionRate}
                      disabled
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