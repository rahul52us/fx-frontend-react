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

const EEFCImportsSection = ({ showError }: any) => {
  const { values, setFieldValue, errors, touched }: any = useFormikContext();

  const emptyRow = {
    amount: "",
    settlementRate: "",
    closingAmount:""
  };

  const handleChange = (index: number, field: string, value: any) => {
    let updatedRow = { ...values.eefcImportsList[index], [field]: value };
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
                    <CustomInput
                      label="Settlement Rate"
                      placeholder="Enter settlement rate"
                      name={`eefcImportsList.${index}.settlementRate`}
                      value={row.settlementRate}
                      onChange={(e: any) =>
                        handleChange(index, "settlementRate", e.target.value)
                      }
                    />

                    <CustomInput
                      label="Amount"
                      placeholder="Enter Amount"
                      name={`eefcImportsList.${index}.amount`}
                      type="number"
                      value={row.amount}
                      onChange={(e: any) =>
                        handleChange(index, "amount", e.target.value)
                      }
                    />

                    <CustomInput
                      label="Closing Amount"
                      placeholder="Enter closing amount"
                      name={`eefcImportsList.${index}.closingAmount`}
                      value={row.closingAmount}
                      onChange={(e: any) =>
                        handleChange(index, "closingAmount", e.target.value)
                      }
                      error={
                        rowTouched.closingAmount && rowErrors.closingAmount
                      }
                      showError={showError}
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
