"use client";

import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  SimpleGrid,
  VStack
} from "@chakra-ui/react";
import { FieldArray, useFormikContext } from "formik";
import CustomInput from "../../../../../../config/component/CustomInput/CustomInput";

// Dummy EEFC register data (replace with API later)
// const dummyEEFCExportsRegister = [
//   {
//     conversionRefNo: "EEFCEXP001",
//     outstandingAmount: "50000",
//     hedgeRate: "82.35",
//     deliveryDateFrom: "2025-03-10",
//     deliveryDateTo: "2025-03-15",
//   },
//   {
//     conversionRefNo: "EEFCEXP002",
//     outstandingAmount: "20000",
//     hedgeRate: "82.12",
//     deliveryDateFrom: "2025-03-18",
//     deliveryDateTo: "2025-03-25",
//   },
// ];

const EEFCExportsSection = ({ showError }: any) => {
  const { values, setFieldValue, errors, touched }: any = useFormikContext();

  // template for a new row
  const emptyRow = {
    utilizationAmount: "",
    netConversionRate: "",
    // conversionReferenceNumber: "",
    // outstandingAmount: "",
    // hedgeRate: "",
    // forwardPremium: "",
    // cashTomSpot: "",
    // deliveryDateFrom: "",
    // deliveryDateTo: "",
  };

  // Recalculate per-row net settlement rate
  const calculateNetSettlementRate = (row: any) => {
    const hedge = parseFloat(row.hedgeRate) || 0;
    const premium = parseFloat(row.forwardPremium) || 0;
    const cashTom = parseFloat(row.cashTomSpot) || 0;

    const net = hedge + premium + cashTom;
    return net ? net.toFixed(4) : "0.0000";
  };

  // When any field changes
  const handleChange = (index: number, field: string, value: any) => {
    let updatedRow = { ...values.eefcExportsList[index], [field]: value };

    // recalc net settlement rate
    updatedRow.netSettlementRate = calculateNetSettlementRate(updatedRow);

    setFieldValue(`eefcExportsList.${index}`, updatedRow);
  };

  // When conversionRefNo is selected
  // const handleSelectReference = (index: number, ref: string) => {
  //   const selected = dummyEEFCExportsRegister.find(
  //     (x) => x.conversionRefNo === ref
  //   );

  //   if (!selected) return;

  //   const updatedRow = {
  //     ...values.eefcExportsList[index],
  //     conversionReferenceNumber: ref,
  //     outstandingAmount: selected.outstandingAmount,
  //     hedgeRate: selected.hedgeRate,
  //     deliveryDateFrom: selected.deliveryDateFrom,
  //     deliveryDateTo: selected.deliveryDateTo,
  //   };

  //   // recalc
  //   updatedRow.netSettlementRate = calculateNetSettlementRate(updatedRow);

  //   setFieldValue(`eefcExportsList.${index}`, updatedRow);
  // };

  return (
    <Box
      p={5}
      borderWidth="1px"
      borderColor="green.200"
      bg="green.50"
      rounded="lg"
    >
      <Flex justify="space-between" mb={4}>
        <Box fontWeight={700} fontSize="lg" color="green.700">
          EEFC Conversion – Exports
        </Box>

        <FieldArray name="eefcExportsList">
          {({ push }) => (
            <Button
              leftIcon={<AddIcon />}
              variant="outline"
              colorScheme="green"
              size="sm"
              onClick={() => push(emptyRow)}
            >
              Add EEFC Export Row
            </Button>
          )}
        </FieldArray>
      </Flex>

      <FieldArray name="eefcExportsList">
        {({ remove }) => (
          <VStack spacing={4}>
            {values.eefcExportsList?.map((row: any, index: number) => {
              const rowTouched = touched?.eefcExportsList?.[index] || {};
              const rowErrors = errors?.eefcExportsList?.[index] || {};

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
                  <SimpleGrid columns={[1, 2, 2]} spacing={4}>

                    <CustomInput
                      label="Utilization Amount"
                      placeholder="Enter Utilization Amount"
                      name={`eefcExportsList.${index}.utilizationAmount`}
                      type="number"
                      value={row.utilizationAmount}
                      onChange={(e: any) =>
                        handleChange(
                          index,
                          "utilizationAmount",
                          e.target.value
                        )
                      }
                      error={
                        rowTouched.utilizationAmount &&
                        rowErrors.utilizationAmount
                      }
                      showError={showError}
                    />
                        <CustomInput
                       label="Net Conversion Rate"
                       placeholder="Net Conversion Rate"
                       name={`eefcExportsList.${index}.netConversionRate`}
                       value={row.netConversionRate}
                       // disabled
                     />

                    {/* Conversion Ref No */}
                    {/* <FormControl>
                      <FormLabel>Conversion Reference No</FormLabel>
                      <ChakraSelect
                        placeholder="Select Reference"
                        value={row.conversionReferenceNumber}
                        onChange={(e) =>
                          handleSelectReference(index, e.target.value)
                        }
                      >
                        {dummyEEFCExportsRegister.map((item) => (
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
                      name={`eefcExportsList.${index}.outstandingAmount`}
                      value={row.outstandingAmount}
                      disabled
                    />

                    <CustomInput
                      label="Hedge Rate"
                      name={`eefcExportsList.${index}.hedgeRate`}
                      value={row.hedgeRate}
                      disabled
                    />

                    <CustomInput
                      label="Delivery Date From"
                      name={`eefcExportsList.${index}.deliveryDateFrom`}
                      type="date"
                      value={row.deliveryDateFrom}
                      disabled
                    />

                    <CustomInput
                      label="Delivery Date To"
                      name={`eefcExportsList.${index}.deliveryDateTo`}
                      type="date"
                      value={row.deliveryDateTo}
                      disabled
                    />

                 

                    <CustomInput
                      label="Forward Premium"
                      name={`eefcExportsList.${index}.forwardPremium`}
                      value={row.forwardPremium}
                      onChange={(e: any) =>
                        handleChange(index, "forwardPremium", e.target.value)
                      }
                      showError={showError}
                    />

                    <CustomInput
                      label="Cash/Tom Spot"
                      name={`eefcExportsList.${index}.cashTomSpot`}
                      value={row.cashTomSpot}
                      onChange={(e: any) =>
                        handleChange(index, "cashTomSpot", e.target.value)
                      }
                      showError={showError}
                    /> */}

                  </SimpleGrid>

                  {values.eefcExportsList.length > 1 && (
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

export default EEFCExportsSection;
