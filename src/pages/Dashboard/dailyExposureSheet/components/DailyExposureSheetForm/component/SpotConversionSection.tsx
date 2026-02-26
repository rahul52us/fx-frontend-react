"use client";

import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, IconButton, SimpleGrid, VStack } from "@chakra-ui/react";
import { FieldArray, useFormikContext } from "formik";
import { useEffect } from "react";
import CustomInput from "../../../../../../config/component/CustomInput/CustomInput";
import store from "../../../../../../store/store";

const SpotConversionSection = ({ showError }: any) => {
  const { values, setFieldValue, errors, touched }: any = useFormikContext();
  const { auth: { banksData } } = store;

  const getBankMargin = () => {
    const bankValue = typeof values.bank === "string"
      ? values.bank
      : values.bank?.value;
    const found = banksData.find((b: any) => b.value === bankValue);
    return found?.bankMargin ?? "";
  };

  // ✅ Fix 2: Patch existing empty rows when bank is available
  useEffect(() => {
    const margin = getBankMargin();
    if (!margin) return;

    const updatedList = values.spotList?.map((row: any) => {
      if (!row.bankMargin) {
        return { ...row, bankMargin: margin };
      }
      return row;
    });

    setFieldValue("spotList", updatedList);
  }, [values.bank]);

  // ✅ Fix 1: Function so margin is fresh on every click
  const getEmptySpotRow = () => ({
    conversionReferenceNumber: "",
    spotBooked: "",
    cashTomSpot: "",
    bankMargin: getBankMargin(),
    amountConverted: "",
    netConversionRate: "0.0000",
  });

  const handleSpotFieldChange = (index: number, field: string, value: string) => {
    const currentRow = values.spotList?.[index] || {};
    const updatedRow = { ...currentRow, [field]: value };

    const spot = parseFloat(updatedRow.spotBooked) || 0;
    const cashTom = parseFloat(updatedRow.cashTomSpot) || 0;
    const margin = parseFloat(updatedRow.bankMargin) || 0;

    const netRate = spot - cashTom - margin;
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
              onClick={() => push(getEmptySpotRow())}  // ✅ function call
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


// "use client";

// import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
// import {
//   Box,
//   Button,
//   Flex,
//   IconButton,
//   SimpleGrid,
//   VStack,
// } from "@chakra-ui/react";
// import { FieldArray, useFormikContext } from "formik";
// import CustomInput from "../../../../../../config/component/CustomInput/CustomInput";
// import store from "../../../../../../store/store";

// const SpotConversionSection = ({ showError }: any) => {
//   const { values, setFieldValue, errors, touched }: any = useFormikContext();

//  // ✅ Look up margin from banksData using the bank string
//   const { auth: { banksData } } = store;
//   const getBankMargin = () => {
//     const bankValue = typeof values.bank === "string" 
//       ? values.bank                // "HDFC"
//       : values.bank?.value;        // { value: "HDFC", ... }
//     const found = banksData.find((b: any) => b.value === bankValue);
//     return found?.bankMargin ?? "";
//   };

//   const emptySpotRow = {
//     conversionReferenceNumber: "",
//     spotBooked: "",
//     cashTomSpot: "",
//     bankMargin: getBankMargin(),   // ✅ now correctly resolves "HDFC" → "0.01"
//     amountConverted: "",
//     netConversionRate: "0.0000",
//   };

// console.log('values',values,getBankMargin())

//   // const emptySpotRow = {
//   //   conversionReferenceNumber: "",
//   //   spotBooked: "",
//   //   cashTomSpot: "",
//   //   bankMargin: "",
//   //   amountConverted: "",
//   //   netConversionRate: "",
//   // };

//   const handleSpotFieldChange = (index: number, field: string, value: string) => {
//   const currentRow = values.spotList?.[index] || {};
//   const updatedRow = { ...currentRow, [field]: value };

//   const spot = parseFloat(updatedRow.spotBooked) || 0;
//   const cashTom = parseFloat(updatedRow.cashTomSpot) || 0;
//   const margin = parseFloat(updatedRow.bankMargin) || 0;

//   // Net Conversion Rate = Spot - Cash/Tom - Bank Margin
//   const netRate = spot - cashTom - margin;
//   updatedRow.netConversionRate = netRate ? netRate.toFixed(4) : "0.0000";

//   setFieldValue(`spotList.${index}`, updatedRow);
// };

//   return (
//     <Box p={5} borderWidth="1px" borderColor="blue.200" bg="blue.50" rounded="lg">
//       <Flex justify="space-between" mb={4}>
//         <Box fontWeight={700} fontSize="lg" color="blue.700">
//           Spot Conversion Details
//         </Box>

//         <FieldArray name="spotList">
//           {({ push }) => (
//             <Button
//               size="sm"
//               leftIcon={<AddIcon />}
//               variant="outline"
//               colorScheme="blue"
//               onClick={() => push(emptySpotRow)}
//             >
//               Add Spot Row
//             </Button>
//           )}
//         </FieldArray>
//       </Flex>

//       <FieldArray name="spotList">
//         {({ remove }) => (
//           <VStack spacing={4}>
//             {values.spotList?.map((row: any, index: number) => {
//               const rowTouched = touched?.spotList?.[index] || {};
//               const rowErrors = errors?.spotList?.[index] || {};

//               return (
//                 <Box
//                   key={index}
//                   p={4}
//                   bg="white"
//                   rounded="md"
//                   shadow="sm"
//                   w="full"
//                   position="relative"
//                 >
//                   <SimpleGrid columns={[1, 2, 3]} spacing={4}>
//                     <CustomInput
//                       label="Conversion Ref No"
//                       name={`spotList.${index}.conversionReferenceNumber`}
//                       value={row.conversionReferenceNumber}
//                       onChange={(e: any) =>
//                         setFieldValue(
//                           `spotList.${index}.conversionReferenceNumber`,
//                           e.target.value
//                         )
//                       }
//                       error={
//                         rowTouched.conversionReferenceNumber &&
//                         rowErrors.conversionReferenceNumber
//                       }
//                       showError={showError}
//                     />

//                       <CustomInput
//   label="Spot Booked"
//   name={`spotList.${index}.spotBooked`}
//   value={row.spotBooked}
//   onChange={(e: any) => handleSpotFieldChange(index, "spotBooked", e.target.value)}
// />

// <CustomInput
//   label="Cash/Tom Spot"
//   name={`spotList.${index}.cashTomSpot`}
//   value={row.cashTomSpot}
//   onChange={(e: any) => handleSpotFieldChange(index, "cashTomSpot", e.target.value)}
// />

// <CustomInput
//   label="Bank Margin"
//   name={`spotL  ist.${index}.bankMargin`}
//   value={row.bankMargin}
//   onChange={(e: any) => handleSpotFieldChange(index, "bankMargin", e.target.value)}
// />

//                     {/* <CustomInput
//                       label="Spot Booked"
//                       name={`spotList.${index}.spotBooked`}
//                       value={row.spotBooked}
//                       onChange={(e: any) =>
//                         setFieldValue(
//                           `spotList.${index}.spotBooked`,
//                           e.target.value
//                         )
//                       }
//                     />

//                     <CustomInput
//                       label="Cash/Tom Spot"
//                       name={`spotList.${index}.cashTomSpot`}
//                       value={row.cashTomSpot}
//                       onChange={(e: any) =>
//                         setFieldValue(
//                           `spotList.${index}.cashTomSpot`,
//                           e.target.value
//                         )
//                       }
//                     />

//                     <CustomInput
//                       label="Bank Margin"
//                       name={`spotList.${index}.bankMargin`}
//                       value={row.bankMargin}
//                       onChange={(e: any) =>
//                         setFieldValue(
//                           `spotList.${index}.bankMargin`,
//                           e.target.value
//                         )
//                       }
//                     /> */}

//                     <CustomInput
//                       label="Amount Converted"
//                       name={`spotList.${index}.amountConverted`}
//                       type="number"
//                       value={row.amountConverted}
//                       onChange={(e: any) =>
//                         setFieldValue(
//                           `spotList.${index}.amountConverted`,
//                           e.target.value
//                         )
//                       }
//                     />

//                     <CustomInput
//                       label="Net Conversion Rate"
//                       name={`spotList.${index}.netConversionRate`}
//                       value={row.netConversionRate}
//                       disabled
//                     />
//                   </SimpleGrid>

//                   {values.spotList.length > 1 && (
//                     <IconButton
//                       aria-label="Delete row"
//                       icon={<DeleteIcon />}
//                       size="sm"
//                       colorScheme="red"
//                       position="absolute"
//                       top={2}
//                       right={2}
//                       onClick={() => remove(index)}
//                     />
//                   )}
//                 </Box>
//               );
//             })}
//           </VStack>
//         )}
//       </FieldArray>
//     </Box>
//   );
// };

// export default SpotConversionSection;
