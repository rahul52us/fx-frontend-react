"use client";

import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Flex,
  IconButton,
  SimpleGrid,
  Spinner,
  VStack
} from "@chakra-ui/react";
import axios from "axios";
import { FieldArray, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import CustomInput from "../../../../../../config/component/CustomInput/CustomInput";

const EEFCImportsSection = ({ showError }: any) => {
  const { values, setFieldValue, errors, touched }: any = useFormikContext();
  const url = process.env.REACT_APP_FX_BASE_URL
  const [loading,setLoading]= useState(false)
  
  const handleChange = (index: number, field: string, value: any) => {
    let updatedRow = { ...values.eefcImportsList[index], [field]: value };
    setFieldValue(`eefcImportsList.${index}`, updatedRow);
  };

  useEffect(() => {
  const fetchEEFCData = async () => {
    try {
      setLoading(true)
      const res = await axios.post(`${url}/eefcregister/eefcdata/`);

      const { prevClosingBalance,prevClosingBalanceInInr,weigtedAverageRate } = res?.data?.data || {};

      // Ensure at least one row exists
      if (!values.eefcImportsList || values.eefcImportsList.length === 0) {
        setFieldValue("eefcImportsList", [
          {
            amount: "",
            // settlementRate: "",
            closingAmount: prevClosingBalance ?? 0,
            closingAmountInr:prevClosingBalanceInInr ?? 0,
            settlementRate: weigtedAverageRate ?? 0
          },
        ]);
      } else {
        // Only update 0th index
        setFieldValue(
          "eefcImportsList.0.closingAmount",
          prevClosingBalance ?? 0
        );
        setFieldValue(
          "eefcImportsList.0.closingAmountInr",
          prevClosingBalanceInInr ?? 0
        );
        setFieldValue(
          "eefcImportsList.0.settlementRate",
          weigtedAverageRate ?? 0
        );
      }
    } catch (err) {
      console.error("EEFC fetch error", err);
    }finally{
      setLoading(false)
    }
  };

  fetchEEFCData();
  }, [url, values.eefcImportsList, setFieldValue]);




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

        {/* <FieldArray name="eefcImportsList">
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
        </FieldArray> */}

      </Flex>

      {loading ? (
        <Center>
 <Spinner color="teal.500" />
        </Center>
      ):(

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
                      disabled
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
  error={rowTouched?.amount ? rowErrors?.amount : ""}
  showError={showError}
/>

                    {/* <CustomInput
                      label="Amount"
                      placeholder="Enter Amount"
                      name={`eefcImportsList.${index}.amount`}
                      type="number"
                      value={row.amount}
                      onChange={(e: any) =>
                        handleChange(index, "amount", e.target.value)
                      }
                    /> */}

                <CustomInput
  label="Closing Amount"
  placeholder="Closing amount"
  name={`eefcImportsList.${index}.closingAmount`}
  value={row.closingAmount}
  disabled
  // isDisabled={index === 0}   // 👈 disabled only for 0th row
  error={rowTouched.closingAmount && rowErrors.closingAmount}
  showError={showError}
/>

                <CustomInput
  label="Closing Amount (INR)"
  placeholder="Closing amount in INR"
  name={`eefcImportsList.${index}.closingAmountInr`}
  value={row.closingAmountInr}
  disabled
  // isDisabled={index === 0}   // 👈 disabled only for 0th row
  error={rowTouched.closingAmountInr && rowErrors.closingAmountInr}
  showError={showError}
/>
<CustomInput
  label="Weigted Average Rate"
  placeholder="Weigted Average Rate"
  name={`eefcImportsList.${index}.weigtedAverageRate`}
  value={row.weigtedAverageRate}
  disabled
  // isDisabled={index === 0}   // 👈 disabled only for 0th row
  error={rowTouched.weigtedAverageRate && rowErrors.weigtedAverageRate}
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
      ) }

    </Box>
  );
};

export default EEFCImportsSection;
