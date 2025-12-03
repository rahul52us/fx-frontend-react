import { Box, Button, Flex, SimpleGrid, VStack } from "@chakra-ui/react";
import { Formik, Form as FormikForm, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import CustomInput from "../../../../../config/component/CustomInput/CustomInput"; // Adjust path as needed
import {
  primaryButtonHoverStyle,
  primaryButtonStyle,
} from "../../../../../globalStyles"; // Adjust path as needed
import {
  currencyOptions,
} from "../../../exportsRegister/component/utils/constant"; // Adjust path as needed
import ConversionManager from "./ConversionManager";
import { banks, bankSpreadOptions } from "./dummyData"; // Adjust path as needed
import ModeOfConversion from "./ModeOfConversion";

// --- 1. Helper Component for Calculations (Fixes the Hook Error) ---
const FormAutoCalculator = () => {
  const { values, setFieldValue }: any = useFormikContext();

  // A. Calculate Total Interest Rate
  useEffect(() => {
    const floatRate = parseFloat(values.floatingInterestRate) || 0;
    const spread = parseFloat(values.bankSpread) || 0;
    // Only update if value actually changes to avoid infinite loops
    const newTotal = (floatRate + spread).toFixed(2);
    if (values.totalInterestRate !== newTotal) {
      setFieldValue("totalInterestRate", newTotal);
    }
  }, [values.floatingInterestRate, values.bankSpread, setFieldValue, values.totalInterestRate]);

  // B. Calculate Weighted Average Drawdown Rate & Total Drawdown Amount
  useEffect(() => {
    let totalAmount = 0;
    let weightedSum = 0;

    // Process Spot List
    if (values.isSpotEnabled && values.spotList?.length > 0) {
      values.spotList.forEach((item: any) => {
        const amt = parseFloat(item.amountConverted) || 0;
        const rate = parseFloat(item.netConversionRate) || 0;
        totalAmount += amt;
        weightedSum += (amt * rate);
      });
    }

    // Process Forward List
    if (values.isForwardEnabled && values.forwardList?.length > 0) {
      values.forwardList.forEach((item: any) => {
        const amt = parseFloat(item.utilizationAmount) || 0;
        const rate = parseFloat(item.netSettlementRate) || 0;
        totalAmount += amt;
        weightedSum += (amt * rate);
      });
    }

    // Update Formik
    if (values.drawdownAmount !== totalAmount) {
      setFieldValue("drawdownAmount", totalAmount);
    }

    const avgRate = totalAmount > 0 ? (weightedSum / totalAmount).toFixed(4) : "0";
    if (values.drawdownRate !== avgRate) {
      setFieldValue("drawdownRate", avgRate);
    }

  }, [values.spotList, values.forwardList, values.isSpotEnabled, values.isForwardEnabled, setFieldValue, values.drawdownAmount, values.drawdownRate]);

  return null; // This component renders nothing, just handles logic
};

// --- 2. Main Component ---
const PCFCForm = ({ submitForm }: any) => {
  const [showError, setShowError] = useState(false); // Initially false, true on submit

  // --- Validation Schema ---
  const validationSchema = Yup.object().shape({
    drawdownDate: Yup.string().required("Drawdown Date is required"),
    dueDate: Yup.string().required("Due Date is required"),
    bank: Yup.string().required("Bank is required"),
    tradeReferenceNumber: Yup.string().required("Trade Reference Number is required"),
    currency: Yup.string().required("Currency is required"),
    floatingInterestRate: Yup.string().required("Interest Rate is required"),
    bankSpread: Yup.string().required("Bank Spread is required"),

    // Conditional Array Validation
    spotList: Yup.array().when("isSpotEnabled", {
      is: true,
      then: (schema) =>
        schema.of(
          Yup.object().shape({
            amountConverted: Yup.string().required("Required"),
            spotBooked: Yup.string().required("Required"),
            cashTomSpot: Yup.string().required("Required"),
          })
        ).min(1, "At least one Spot entry is required"),
      otherwise: (schema) => schema.nullable(),
    }),

    forwardList: Yup.array().when("isForwardEnabled", {
      is: true,
      then: (schema) =>
        schema.of(
          Yup.object().shape({
            hedgeDealRefNo: Yup.string().required("Required"),
            utilizationAmount: Yup.string().required("Required"),
            forwardPremium: Yup.string().required("Required"),
            cashTomSpot: Yup.string().required("Required"),
          })
        ).min(1, "At least one Forward entry is required"),
      otherwise: (schema) => schema.nullable(),
    }),
  });

  return (
    <Box bg="whiteAlpha.700" py={4}>
      <Box px={2}>
        <Formik
          initialValues={{
            drawdownDate: "",
            dueDate: "",
            pcfcInputDate: new Date().toISOString().split("T")[0],
            bank: "",
            tradeReferenceNumber: "",
            currency: "",
            drawdownAmount: 0,
            
            // Toggles
            isSpotEnabled: false,
            isForwardEnabled: false,
            
            // Arrays
            spotList: [],
            forwardList: [],
            
            // Auto-Calculated Totals
            drawdownRate: 0,
            floatingInterestRate: "",
            bankSpread: "",
            totalInterestRate: 0,
          }}
          validationSchema={validationSchema}
          enableReinitialize={false} // Prevent resets on typing
          onSubmit={(values, actions) => {
            setShowError(true);
            console.log("Submitting PCFC Form:", values);
            submitForm(values, actions, "form");
          }}
        >
          {({ values, handleChange, setFieldValue, isSubmitting, errors, touched }: any) => (
            <FormikForm>
              {/* Insert the Logic Component Here */}
              <FormAutoCalculator />

              <VStack spacing={6} align="stretch">
                
                {/* --- Section 1: Universal Headers --- */}
                <SimpleGrid columns={[1, null, 3]} spacing={6}>
                  <CustomInput
                    label="Drawdown Date"
                    name="drawdownDate"
                    type="date"
                    value={values.drawdownDate}
                    onChange={handleChange}
                    error={touched.drawdownDate && errors.drawdownDate}
                    showError={showError}
                  />
                   <CustomInput
                    label="PCFC Input Date"
                    name="pcfcInputDate"
                    type="date"
                    value={values.pcfcInputDate}
                    disabled={true} // Read Only
                  />
                  <CustomInput
                    label="Due Date"
                    name="dueDate"
                    type="date"
                    value={values.dueDate}
                    onChange={handleChange}
                    error={touched.dueDate && errors.dueDate}
                    showError={showError}
                  />
                  <CustomInput
                    label="Bank"
                    name="bank"
                    type="select"
                    placeholder="Select Bank"
                    options={banks}
                    value={banks.find((o:any) => o.value === values.bank)}
                    onChange={(opt: any) => setFieldValue("bank", opt.value)}
                    error={touched.bank && errors.bank}
                    showError={showError}
                  />
                  <CustomInput
                    label="Currency"
                    name="currency"
                    type="select"
                    placeholder="Select Pair"
                    options={currencyOptions}
                    value={currencyOptions.find((o:any) => o.value === values.currency)}
                    onChange={(opt: any) => setFieldValue("currency", opt.value)}
                    error={touched.currency && errors.currency}
                    showError={showError}
                  />
                  <CustomInput
                    label="Trade Ref No"
                    name="tradeReferenceNumber"
                    value={values.tradeReferenceNumber}
                    onChange={handleChange}
                    error={touched.tradeReferenceNumber && errors.tradeReferenceNumber}
                    showError={showError}
                  />
                </SimpleGrid>

                {/* --- Section 2: Dynamic Conversion Manager --- */}
                <ModeOfConversion />
                {/* Handles Switch Logic and Dynamic Arrays */}
                <ConversionManager showError={showError} />
                
                {/* Show general error if arrays are empty but enabled */}
                {values.isSpotEnabled && typeof errors.spotList === 'string' && showError && (
                    <Box color="red.500" fontSize="sm">{errors.spotList}</Box>
                )}
                {values.isForwardEnabled && typeof errors.forwardList === 'string' && showError && (
                    <Box color="red.500" fontSize="sm">{errors.forwardList}</Box>
                )}

                {/* --- Section 3: Aggregated Results --- */}
                <Box p={5} bg="gray.50" rounded="lg" border="1px solid" borderColor="gray.200">
                  <SimpleGrid columns={[1, 2, 4]} spacing={6}>
                      <CustomInput
                          label="Total Drawdown Amount"
                          name="drawdownAmount"
                          value={values.drawdownAmount}
                          disabled={true}
                      />
                      <CustomInput
                          label="W. Avg Drawdown Rate"
                          name="drawdownRate"
                          value={values.drawdownRate}
                          disabled={true} 
                      />
                       <CustomInput
                          label="Floating Interest (%)"
                          name="floatingInterestRate"
                          type="number"
                          value={values.floatingInterestRate}
                          onChange={handleChange}
                          error={touched.floatingInterestRate && errors.floatingInterestRate}
                          showError={showError}
                      />
                       <CustomInput
                          label="Bank Spread (%)"
                          name="bankSpread"
                          type="select"
                          options={bankSpreadOptions}
                          value={bankSpreadOptions.find((o:any) => o.value === values.bankSpread)}
                          onChange={(opt: any) => setFieldValue("bankSpread", opt.value)}
                          error={touched.bankSpread && errors.bankSpread}
                          showError={showError}
                      />
                      <CustomInput
                          label="Total Interest Rate (%)"
                          name="totalInterestRate"
                          value={values.totalInterestRate}
                          disabled={true} 
                      />
                  </SimpleGrid>
                </Box>

                <Flex justify="end">
                  <Button
                    rounded="full"
                    {...primaryButtonStyle}
                    _hover={{ ...primaryButtonHoverStyle, border: "1px solid" }}
                    transition="transform 0.3s ease-in-out"
                    type="submit"
                    size="lg"
                    isLoading={isSubmitting}
                    onClick={() => setShowError(true)}
                  >
                    Submit
                  </Button>
                </Flex>
              </VStack>
            </FormikForm>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default PCFCForm;





// "use client";

// import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Select, SimpleGrid, VStack } from "@chakra-ui/react";
// import axios from "axios";
// import { Formik, Form as FormikForm } from "formik";
// import { useEffect, useState } from "react";
// import * as Yup from "yup";
// import CustomInput from "../../../../../config/component/CustomInput/CustomInput";
// import {
//   primaryButtonHoverStyle,
//   primaryButtonStyle,
// } from "../../../../../globalStyles";
// import {
//   currencyOptions,
//   pcfcModeOfConversionOptions,
// } from "../../../exportsRegister/component/utils/constant";
// import { banks, bankSpreadOptions, forwardRegDataAllData } from "./dummyData";

// const PCFCForm = ({ submitForm }: any) => {
//   const [showError, setShowError] = useState(true);
//   const [modeOfConversion, setModeOfConversion] = useState("");
//   const [dealId, setDealId] = useState<any[]>([]);
//   const url = process.env.REACT_APP_FX_BASE_URL;
//   console.log(dealId)
//   // ✅ Validation Schema
//   const validationSchema: any = Yup.object().shape({
//     drawdownDate: Yup.string().required("Drawdown Date is required"),
//     dueDate: Yup.string().required("Due Date is required"),
//     bank: Yup.string().required("Bank is required"),
//     tradeReferenceNumber: Yup.string().required(
//       "Trade Reference Number is required"
//     ),
//     modeOfConversion: Yup.string().required("Mode of Conversion is required"),
//     currency: Yup.mixed().required("Currency is required"),
//     drawdownAmount: Yup.string().required("Drawdown Amount is required"),
//     drawdownRate: Yup.string().required("Drawdown Rate is required"),
//     floatingInterestRate: Yup.string().required(
//       "Floating Interest Rate is required"
//     ),
//     bankSpread: Yup.string().required("Bank Spread is required"),
//     totalInterestRate: Yup.string().required("Total Interest Rate is required"),
//     // ✅ Conditional validations
//     hedgeDealRefNo: Yup.string().when(
//       "modeOfConversion",
//       (mode: any, schema: any) =>
//         mode === "forward"
//           ? schema.required("Hedge Deal Ref No is required")
//           : schema.notRequired()
//     ),
//     outstandingAmount: Yup.string().when(
//       "modeOfConversion",
//       (mode: any, schema: any) =>
//         mode === "forward"
//           ? schema.required("Outstanding Amount is required")
//           : schema.notRequired()
//     ),
//     utilizationAmount: Yup.string().when(
//       "modeOfConversion",
//       (mode: any, schema: any) =>
//         mode === "spot"
//           ? schema.required("Utilization Amount is required")
//           : schema.notRequired()
//     ),
//     hedgeRate: Yup.string().when("modeOfConversion", (mode: any, schema: any) =>
//       mode === "forward"
//         ? schema.required("Hedge Rate is required")
//         : schema.notRequired()
//     ),
//     deliveryDateFrom: Yup.string().when(
//       "modeOfConversion",
//       (mode: any, schema: any) =>
//         mode === "forward"
//           ? schema.required("Delivery Date From is required")
//           : schema.notRequired()
//     ),
//     deliveryDateTo: Yup.string().when(
//       "modeOfConversion",
//       (mode: any, schema: any) =>
//         mode === "forward"
//           ? schema.required("Delivery Date To is required")
//           : schema.notRequired()
//     ),
//     forwardPremium: Yup.string().when(
//       "modeOfConversion",
//       (mode: any, schema: any) =>
//         mode === "spot"
//           ? schema.required("Forward Premium is required")
//           : schema.notRequired()
//     ),
//     cashTomSpot: Yup.string().when(
//       "modeOfConversion",
//       (mode: any, schema: any) =>
//         mode === "spot"
//           ? schema.required("Cash/Tom Spot is required")
//           : schema.notRequired()
//     ),
//     netSettlementRate: Yup.string().when(
//       "modeOfConversion",
//       (mode: any, schema: any) =>
//         mode === "spot"
//           ? schema.required("Net Settlement Rate is required")
//           : schema.notRequired()
//     ),
//     amountConverted: Yup.string().when(
//       "modeOfConversion",
//       (mode: any, schema: any) =>
//         mode === "spot"
//           ? schema.required("Amount Converted is required")
//           : schema.notRequired()
//     ),
//     spotBooked: Yup.string().when(
//       "modeOfConversion",
//       (mode: any, schema: any) =>
//         mode === "spot"
//           ? schema.required("Spot Booked is required")
//           : schema.notRequired()
//     ),
//     bankMargin: Yup.string().when(
//       "modeOfConversion",
//       (mode: any, schema: any) =>
//         mode === "forward"
//           ? schema.required("Bank Margin is required")
//           : schema.notRequired()
//     ),
//     netConversionRate: Yup.string().when(
//       "modeOfConversion",
//       (mode: any, schema: any) =>
//         mode === "spot"
//           ? schema.required("Net Conversion Rate is required")
//           : schema.notRequired()
//     ),
//   });

//   // ✅ Fetch Deal Ids
//   const fetchDealId = async () => {
//     try {
//       const response = await axios.post(`${url}/pcfcregister/dealid/`);
//       const result = response.data?.data || [];
//       const exportRegOptions = result.map((item: any, idx: number) => ({
//         label: item.poNo,
//         value: item.poNo,
//         sno: idx + 1,
//         ...item,
//       }));
//       setDealId(exportRegOptions);
//     } catch (err: any) {
//       console.error("Error fetching deal id:", err.message);
//     }
//   };

//   useEffect(() => {
//     fetchDealId();
//   }, []);

//   return (
//     <Box bg="whiteAlpha.700" py={4}>
//       <Box px={2}>
//         <Formik
//           initialValues={{}}
//           validationSchema={validationSchema}
//           enableReinitialize
//           onSubmit={(values, actions) => {
//             console.log("Form Values:", values);
//             setShowError(true);
//             submitForm(values, actions, "form");
//             actions.setSubmitting(false);
//           }}
//         >
//           {({
//             values,
//             handleChange,
//             isSubmitting,
//             errors,
//             touched,
//             setFieldValue,
//           }: any) => (
//             <FormikForm>
//               <VStack spacing={6} align="stretch">
//                 <SimpleGrid columns={[1, null, 2]} spacing={8}>
//                   <CustomInput
//                     label="Drawdown Date"
//                     name="drawdownDate"
//                     type="date"
//                     value={values.drawdownDate}
//                     onChange={handleChange}
//                     error={touched.drawdownDate && errors.drawdownDate}
//                     showError={showError}
//                   />
//                   <CustomInput
//                     label="Due Date"
//                     name="dueDate"
//                     type="date"
//                     value={values.dueDate}
//                     onChange={handleChange}
//                     error={touched.dueDate && errors.dueDate}
//                     showError={showError}
//                   />
//                   <CustomInput
//                     label="Bank"
//                     type="select"
//                     name="bank"
//                     placeholder="Enter Bank Name"
//                     options={banks}
//                       value={banks.find(
//                       (option) => option.value === values.bank
//                     )}
//                     onChange={(selectedOption: any) =>
//                       setFieldValue("bank", selectedOption.value)
//                     }
//                     error={touched.bank && errors.bank}
//                     showError={showError}
//                   />
//                   <CustomInput
//                     label="Currency"
//                     name="currency"
//                     type="select"
//                     options={currencyOptions}
//                     value={currencyOptions.find(
//                       (option) => option.value === values.currency
//                     )}
//                     onChange={(selectedOption: any) =>
//                       setFieldValue("currency", selectedOption.value)
//                     }
//                     error={touched.currency && errors.currency}
//                     showError={showError}
//                   />

//                   <CustomInput
//                     label="Drawdown Amount"
//                     name="drawdownAmount"
//                     placeholder="Enter Drawdown Amount"
//                     value={values.drawdownAmount}
//                     onChange={handleChange}
//                     error={touched.drawdownAmount && errors.drawdownAmount}
//                     showError={showError}
//                   />

//                   <CustomInput
//                     label="Mode Of Conversion"
//                     name="modeOfConversion"
//                     type="select"
//                     placeholder="Conversion Mode"
//                     options={pcfcModeOfConversionOptions}
//                     value={pcfcModeOfConversionOptions.find(
//                       (opt) => opt.value === values.modeOfConversion
//                     )}
//                     onChange={(option: any) => {
//                       setFieldValue("modeOfConversion", option.value);
//                       setModeOfConversion(option.value);
//                     }}
//                     error={touched.modeOfConversion && errors.modeOfConversion}
//                     showError={showError}
//                   />
//                   {modeOfConversion === "forward" && (
//                     <>
//   <FormControl isInvalid={touched.hedgeDealRefNo && errors.hedgeDealRefNo}>
//       <FormLabel>Hedge Deal Ref No</FormLabel>
//       <Select
//         placeholder="Select Hedge Deal Ref No"
//         value={values.hedgeDealRefNo}
//         onChange={(e) => {
//           const selectedValue = e.target.value;
//           const selectedData = forwardRegDataAllData.find(
//             (item: any) => item.hedgeDealRefNo === selectedValue
//           );
//           setFieldValue("hedgeDealRefNo", selectedValue);
//           if (selectedData) {
//             setFieldValue(
//               "outstandingAmount",
//               selectedData.outstandingAmount
//             );
//             setFieldValue("hedgeRate", selectedData.hedgeRate);
//             setFieldValue(
//               "deliveryDateFrom",
//               selectedData.deliveryDateFrom
//             );
//             setFieldValue(
//               "deliveryDateTo",
//               selectedData.deliveryDateTo
//             );
//           }
//         }}
//       >
//         {forwardRegDataAllData.map((item: any) => (
//           <option key={item.hedgeDealRefNo} value={item.hedgeDealRefNo}>
//             {item.hedgeDealRefNo}
//           </option>
//         ))}
//       </Select>
//       {touched.hedgeDealRefNo && errors.hedgeDealRefNo && (
//         <FormErrorMessage>{errors.hedgeDealRefNo}</FormErrorMessage>
//       )}
//     </FormControl>


//                       <CustomInput
//                         label="Outstanding Amount"
//                         name="outstandingAmount"
//                         value={values.outstandingAmount}
//                         onChange={handleChange}
//                         error={
//                           touched.outstandingAmount && errors.outstandingAmount
//                         }
//                         showError={showError}
//                         disabled={true}
//                         // isReadOnly
//                         />

//                         <CustomInput
//                         label="Utilization Amount"
//                         name="utilizationAmount"
//                         value={values.utilizationAmount}
//                         onChange={handleChange}
//                         error={
//                           touched.utilizationAmount && errors.utilizationAmount
//                         }
//                         showError={showError}
//                       />

//                       <CustomInput
//                         label="Hedge Rate"
//                         name="hedgeRate"
//                         value={values.hedgeRate}
//                         onChange={handleChange}
//                         error={touched.hedgeRate && errors.hedgeRate}
//                         showError={showError}
//                         disabled={true}
//                         />

//                       <CustomInput
//                         label="Delivery Date From"
//                         name="deliveryDateFrom"
//                         type="date"
//                         value={values.deliveryDateFrom}
//                         onChange={handleChange}
//                         error={
//                           touched.deliveryDateFrom && errors.deliveryDateFrom
//                         }
//                         showError={showError}
//                         disabled={true}
//                         />

//                       <CustomInput
//                         label="Delivery Date To"
//                         name="deliveryDateTo"
//                         type="date"
//                         value={values.deliveryDateTo}
//                         onChange={handleChange}
//                         error={touched.deliveryDateTo && errors.deliveryDateTo}
//                         showError={showError}
//                         disabled={true}
//                       />
//                         <CustomInput
//                         label="Forward Premium"
//                         name="forwardPremium"
//                         value={values.forwardPremium}
//                         onChange={handleChange}
//                         error={touched.forwardPremium && errors.forwardPremium}
//                         showError={showError}
//                       />
//                       <CustomInput
//                         label="Cash/Tom Spot"
//                         name="cashTomSpot"
//                         value={values.cashTomSpot}
//                         onChange={handleChange}
//                         error={touched.cashTomSpot && errors.cashTomSpot}
//                         showError={showError}
//                       />

//                             <CustomInput
//                         label="Net Conversion Rate"
//                         name="netConversionRate"
//                         value={values.netConversionRate}
//                         onChange={handleChange}
//                         error={
//                           touched.netConversionRate &&
//                           errors.netConversionRate
//                         }
//                         showError={showError}
//                       />
//                     </>
//                   )}
//                   {/* ✅ Spot Mode Section */}
//                   {modeOfConversion === "spot" && (
//                     <>
                      
                    
//                           <CustomInput
//                         label="Bank Margin"
//                         name="bankMargin"
//                         value={values.bankMargin}
//                         onChange={handleChange}
//                         error={touched.bankMargin && errors.bankMargin}
//                         showError={showError}
//                       />
//                       <CustomInput
//                         label="Net Settlement Rate"
//                         name="netSettlementRate"
//                         value={values.netSettlementRate}
//                         onChange={handleChange}
//                         error={
//                           touched.netSettlementRate && errors.netSettlementRate
//                         }
//                         showError={showError}
//                       />
//                       <CustomInput
//                         label="Amount Converted"
//                         name="amountConverted"
//                         value={values.amountConverted}
//                         onChange={handleChange}
//                         error={
//                           touched.amountConverted && errors.amountConverted
//                         }
//                         showError={showError}
//                       />
//                       <CustomInput
//                         label="Spot Booked"
//                         name="spotBooked"
//                         value={values.spotBooked}
//                         onChange={handleChange}
//                         error={touched.spotBooked && errors.spotBooked}
//                         showError={showError}
//                       />
                
//                     </>
//                   )}

//                   {/* Common Fields */}
//                   <CustomInput
//                     label="Trade Ref No"
//                     name="tradeReferenceNumber"
//                     placeholder="Ref No"
//                     value={values.tradeReferenceNumber}
//                     onChange={handleChange}
//                     error={
//                       touched.tradeReferenceNumber &&
//                       errors.tradeReferenceNumber
//                     }
//                     showError={showError}
//                   />
//                   <CustomInput
//                     label="Drawdown Rate"
//                     name="drawdownRate"
//                     placeholder="Enter Drawdown Rate"
//                     value={values.drawdownRate}
//                     onChange={handleChange}
//                     error={touched.drawdownRate && errors.drawdownRate}
//                     showError={showError}
//                   />
//                   <CustomInput
//                     label="Floating Interest Rate"
//                     name="floatingInterestRate"
//                     placeholder="Enter Interest Rate"
//                     value={values.floatingInterestRate}
//                     onChange={handleChange}
//                     error={
//                       touched.floatingInterestRate &&
//                       errors.floatingInterestRate
//                     }
//                     showError={showError}
//                   />
//                   <CustomInput
//                     label="Bank Spread"
//                     name="bankSpread"
//                     type="select"
//                     placeholder="Enter Bank Spread"
//                     options={bankSpreadOptions}
//                      value={bankSpreadOptions.find(
//                       (option) => option.value === values.bankSpread
//                     )}
//                     onChange={(selectedOption: any) =>
//                       setFieldValue("bankSpread", selectedOption.value)
//                     }
//                     error={touched.bankSpread && errors.bankSpread}
//                     showError={showError}
//                   />
//                   <CustomInput
//                     label="Total Interest Rate"
//                     name="totalInterestRate"
//                     placeholder="Enter Interest Rate"
//                     value={values.totalInterestRate}
//                     onChange={handleChange}
//                     error={
//                       touched.totalInterestRate && errors.totalInterestRate
//                     }
//                     showError={showError}
//                   />
//                 </SimpleGrid>

//                 <Flex justify="end">
//                   <Button
//                     rounded="full"
//                     fontWeight={500}
//                     {...primaryButtonStyle}
//                     _hover={{ ...primaryButtonHoverStyle, border: "1px solid" }}
//                     transition="transform 0.3s ease-in-out"
//                     type="submit"
//                     size="lg"
//                     isLoading={isSubmitting}
//                   >
//                     Submit
//                   </Button>
//                 </Flex>
//               </VStack>
//             </FormikForm>
//           )}
//         </Formik>
//       </Box>
//     </Box>
//   );
// };

// export default PCFCForm;
