"use client";
import { Box, Button, Flex, SimpleGrid, VStack } from "@chakra-ui/react";
import { Formik, Form as FormikForm, useFormikContext } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import CustomInput from "../../../../config/component/CustomInput/CustomInput";
import {
  primaryButtonHoverStyle,
  primaryButtonStyle,
} from "../../../../globalStyles";
import { forwardDeals } from "./forwardCancellationDummy";

// ---------------------------------------------
// 🔹 Auto Calculation Hook
// ---------------------------------------------
const AutoCalculation = () => {
  const { values, setFieldValue } = useFormikContext<any>();

  useEffect(() => {
    const cancellationAmt = parseFloat(values.cancellationAmount || "0");
    const bookedRate = parseFloat(values.bookedRate || "0");
    const fwdPremium = parseFloat(values.fwdPremium || "0");
    const cashTomSpot = parseFloat(values.cashTomSpot || "0");
    const bankMargin = parseFloat(values.bankMargin || "0");

    // Example Net Cancellation Rate formula
    const netRate = bookedRate + fwdPremium + cashTomSpot - bankMargin;

    // Example P/L in FCY
    const plFCY = cancellationAmt * (bookedRate - netRate);

    // Example P/L in INR
    const washRate = parseFloat(values.washRate || "1");
    const plINR =
      values.currency === "INR" ? plFCY : plFCY * washRate;

    if (!isNaN(netRate)) setFieldValue("netCancellationRate", netRate.toFixed(2));
    if (!isNaN(plFCY)) setFieldValue("plInFCY", plFCY.toFixed(2));
    if (!isNaN(plINR)) setFieldValue("plInINR", plINR.toFixed(2));
  }, [
    values.cancellationAmount,
    values.bookedRate,
    values.fwdPremium,
    values.cashTomSpot,
    values.bankMargin,
    values.currency,
    values.washRate,
    setFieldValue,
  ]);

  return null;
};

// ---------------------------------------------
// 🔹 Main Component
// ---------------------------------------------
const ForwardCancellationForm = ({ submitForm }: any) => {
  // ---------------- Validation Schema ----------------
  const validationSchema = Yup.object().shape({
    transactionDate: Yup.string().required("Transaction Date is required"),
    forwardDealId: Yup.string().required("Forward Deal ID is required"),
    cancellationAmount: Yup.number().required("Cancellation Amount is required"),
    spotBooked: Yup.number().required("Spot Booked is required"),
    fwdPremium: Yup.number().required("Forward Premium is required"),
    cashTomSpot: Yup.number().required("Cash/Tom Spot is required"),
  });

  // ---------------- Initial Values ----------------
  const initialValues = {
    dealType: "Cancellation",
    transactionDate: "",
    forwardDealId: "",
    exposureType: "",
    bank: "",
    currency: "",
    outstandingAmount: "",
    bookedRate: "",
    deliveryDateFrom: "",
    deliveryDateTo: "",
    bankMargin: "",
    cancellationAmount: "",
    spotBooked: "",
    fwdPremium: "",
    cashTomSpot: "",
    netCancellationRate: "",
    plInFCY: "",
    washRate: "",
    plInINR: "",
  };

  return (
    <Box bg="whiteAlpha.700" py={4}>
      <Box maxW="5xl" mx="auto" px={2}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={(values, actions) => {
            console.log("Submitted Values:", values);
            submitForm(values, actions, "form");
            actions.setSubmitting(false);
          }}
        >
          {({
            values,
            handleChange,
            setFieldValue,
            isSubmitting,
            errors,
            touched,
          }) => (
            <FormikForm>
              {/* ✅ Move useEffect logic outside with a subcomponent */}
              <AutoCalculation />

              <VStack spacing={6} align="stretch">
                <SimpleGrid columns={[1, null, 2]} spacing={8}>
                  {/* Transaction Date */}
                  <CustomInput
                    label="Transaction Date"
                    name="transactionDate"
                    type="date"
                    value={values.transactionDate}
                    onChange={handleChange}
                    required
                    error={touched.transactionDate && errors.transactionDate}
                  />

                  {/* Forward Deal ID Dropdown */}
                  <CustomInput
                    label="Forward Deal ID"
                    name="forwardDealId"
                    type="select"
                    options={forwardDeals.map((deal) => ({
                      label: deal.forwardDealId,
                      value: deal.forwardDealId,
                    }))}
                    value={
                      forwardDeals.find(
                        (d) => d.forwardDealId === values.forwardDealId
                      )
                        ? {
                            label: values.forwardDealId,
                            value: values.forwardDealId,
                          }
                        : null
                    }
                    onChange={(option: any) => {
                      const selected = forwardDeals.find(
                        (deal) => deal.forwardDealId === option.value
                      );
                      if (selected) {
                        Object.keys(selected).forEach((key) => {
                          setFieldValue(key, (selected as any)[key]);
                        });
                      }
                      setFieldValue("forwardDealId", option.value);
                    }}
                    error={touched.forwardDealId && errors.forwardDealId}
                  />

                  {/* Automated Fields */}
                  <CustomInput label="Exposure Type" name="exposureType" value={values.exposureType} disabled />
                  <CustomInput label="Bank" name="bank" value={values.bank} disabled />
                  <CustomInput label="Currency" name="currency" value={values.currency} disabled />
                  <CustomInput label="Outstanding Amount" name="outstandingAmount" value={values.outstandingAmount} disabled />
                  <CustomInput label="Booked Rate" name="bookedRate" value={values.bookedRate} disabled />
                  <CustomInput label="Delivery Date From" name="deliveryDateFrom" value={values.deliveryDateFrom} disabled />
                  <CustomInput label="Delivery Date To" name="deliveryDateTo" value={values.deliveryDateTo} disabled />
                  <CustomInput label="Bank Margin" name="bankMargin" value={values.bankMargin} disabled />

                  {/* Manual Fields */}
                  <CustomInput
                    label="Cancellation Amount"
                    name="cancellationAmount"
                    placeholder="Enter Cancellation Amount"
                    value={values.cancellationAmount}
                    onChange={handleChange}
                    error={touched.cancellationAmount && errors.cancellationAmount}
                  />

                  <CustomInput
                    label="Spot Booked"
                    name="spotBooked"
                    placeholder="Enter Spot Booked"
                    value={values.spotBooked}
                    onChange={handleChange}
                    error={touched.spotBooked && errors.spotBooked}
                  />

                  <CustomInput
                    label="Forward Premium"
                    name="fwdPremium"
                    placeholder="Enter Forward Premium"
                    value={values.fwdPremium}
                    onChange={handleChange}
                    error={touched.fwdPremium && errors.fwdPremium}
                  />

                  <CustomInput
                    label="Cash/Tom Spot"
                    name="cashTomSpot"
                    placeholder="Enter Cash/Tom Spot"
                    value={values.cashTomSpot}
                    onChange={handleChange}
                    error={touched.cashTomSpot && errors.cashTomSpot}
                  />

                  {/* Auto Calculated Fields */}
                  <CustomInput
                    label="Net Cancellation Rate"
                    name="netCancellationRate"
                    value={values.netCancellationRate}
                    placeholder="Auto-calculated"
                    disabled
                  />

                  {/* Conditional: Non-INR Currencies */}
                  {values.currency !== "INR" && (
                    <>
                      <CustomInput
                        label="Wash Rate"
                        name="washRate"
                        placeholder="Enter Wash Rate"
                        value={values.washRate}
                        onChange={handleChange}
                      />

                      <CustomInput
                        label="Profit & Loss on Cancellation (in FCY)"
                        name="plInFCY"
                        value={values.plInFCY}
                        placeholder="Auto-calculated"
                        disabled
                      />
                    </>
                  )}

                  {/* Always Visible */}
                  <CustomInput
                    label="Profit & Loss on Cancellation (in INR)"
                    name="plInINR"
                    value={values.plInINR}
                    placeholder="Auto-calculated"
                    disabled
                  />
                </SimpleGrid>

                {/* Submit Button */}
                <Flex justify="end">
                  <Button
                    rounded="full"
                    fontWeight={500}
                    {...primaryButtonStyle}
                    _hover={{ ...primaryButtonHoverStyle, border: "1px solid" }}
                    type="submit"
                    size="lg"
                    isLoading={isSubmitting}
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

export default ForwardCancellationForm;



// import { Box, Button, Flex, SimpleGrid, VStack } from "@chakra-ui/react";
// import { Formik, Form as FormikForm } from "formik";
// import * as Yup from "yup";
// import CustomInput from "../../../../config/component/CustomInput/CustomInput";
// import {
//   primaryButtonHoverStyle,
//   primaryButtonStyle,
// } from "../../../../globalStyles";
// import { forwardDeals } from "./forwardCancellationDummy";

// const ForwardCancellationForm = ({ submitForm }: any) => {
//   const validationSchema = Yup.object().shape({
//     transactionDate: Yup.string().required("Transaction Date is required"),
//     forwardDealId: Yup.string().required("Forward Deal ID is required"),
//     cancellationAmount: Yup.string().required("Cancellation Amount is required"),
//     spotBooked: Yup.string().required("Spot Booked is required"),
//     fwdPremium: Yup.string().required("Forward Premium is required"),
//     cashTomSpot: Yup.string().required("Cash Tom Spot is required"),
//   });

//   const initialValues = {
//     transactionDate: "",
//     forwardDealId: "",
//     exposureType: "",
//     bank: "",
//     currency: "",
//     outstandingAmount: "",
//     bookedRate: "",
//     deliveryDateFrom: "",
//     deliveryDateTo: "",
//     bankMargin: "",
//     cancellationAmount: "",
//     spotBooked: "",
//     fwdPremium: "",
//     cashTomSpot: "",
//   };

//   return (
//     <Box bg="whiteAlpha.700" py={4}>
//       <Box maxW="5xl" mx="auto" px={2}>
//         <Formik
//           initialValues={initialValues}
//           validationSchema={validationSchema}
//           enableReinitialize
//           onSubmit={(values, actions) => {
//             console.log("Submitted Values:", values);
//             submitForm(values, actions, "form");
//             actions.setSubmitting(false);
//           }}
//         >
//           {({ values, handleChange, setFieldValue, isSubmitting, errors, touched }) => (
//             <FormikForm>
//               <VStack spacing={6} align="stretch">
//                 <SimpleGrid columns={[1, null, 2]} spacing={8}>
                  
//                   {/* Transaction Date */}
//                   <CustomInput
//                     label="Transaction Date"
//                     name="transactionDate"
//                     type="date"
//                     value={values.transactionDate}
//                     onChange={handleChange}
//                     required
//                     error={touched.transactionDate && errors.transactionDate}
//                   />

//                   {/* Forward Deal ID Dropdown */}
//                   <CustomInput
//                     label="Forward Deal ID"
//                     name="forwardDealId"
//                     type="select"
//                     options={forwardDeals.map((deal) => ({
//                       label: deal.forwardDealId,
//                       value: deal.forwardDealId,
//                     }))}
//                     value={
//                       forwardDeals.find((d) => d.forwardDealId === values.forwardDealId)
//                         ? {
//                             label: values.forwardDealId,
//                             value: values.forwardDealId,
//                           }
//                         : null
//                     }
//                     onChange={(option: any) => {
//                       const selected = forwardDeals.find(
//                         (deal) => deal.forwardDealId === option.value
//                       );
//                       if (selected) {
//                         // auto fill fields
//                         Object.keys(selected).forEach((key) => {
//                           setFieldValue(key, (selected as any)[key]);
//                         });
//                       }
//                       setFieldValue("forwardDealId", option.value);
//                     }}
//                     error={touched.forwardDealId && errors.forwardDealId}
//                   />

//                   <CustomInput label="Exposure Type" name="exposureType" value={values.exposureType} disabled />
//                   <CustomInput label="Bank" name="bank" value={values.bank} disabled />
//                   <CustomInput label="Currency" name="currency" value={values.currency} disabled />
//                   <CustomInput label="Outstanding Amount" name="outstandingAmount" value={values.outstandingAmount} disabled />
//                   <CustomInput label="Booked Rate" name="bookedRate" value={values.bookedRate} disabled />
//                   <CustomInput label="Delivery Date From" name="deliveryDateFrom" value={values.deliveryDateFrom} disabled />
//                   <CustomInput label="Delivery Date To" name="deliveryDateTo" value={values.deliveryDateTo} disabled />
//                   <CustomInput label="Bank Margin" name="bankMargin" value={values.bankMargin} disabled />

//                   <CustomInput
//                     label="Cancellation Amount"
//                     name="cancellationAmount"
//                     placeholder="Enter Cancellation Amount"
//                     value={values.cancellationAmount}
//                     onChange={handleChange}
//                     error={touched.cancellationAmount && errors.cancellationAmount}
//                   />

//                   <CustomInput
//                     label="Spot Booked"
//                     name="spotBooked"
//                     placeholder="Enter Spot Booked"
//                     value={values.spotBooked}
//                     onChange={handleChange}
//                     error={touched.spotBooked && errors.spotBooked}
//                   />

//                   <CustomInput
//                     label="Forward Premium"
//                     name="fwdPremium"
//                     placeholder="Enter Forward Premium"
//                     value={values.fwdPremium}
//                     onChange={handleChange}
//                     error={touched.fwdPremium && errors.fwdPremium}
//                   />

//                   <CustomInput
//                     label="Cash/Tom Spot"
//                     name="cashTomSpot"
//                     placeholder="Enter Cash/Tom Spot"
//                     value={values.cashTomSpot}
//                     onChange={handleChange}
//                     error={touched.cashTomSpot && errors.cashTomSpot}
//                   />
//                 </SimpleGrid>

//                 <Flex justify="end">
//                   <Button
//                     rounded="full"
//                     fontWeight={500}
//                     {...primaryButtonStyle}
//                     _hover={{ ...primaryButtonHoverStyle, border: "1px solid" }}
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

// export default ForwardCancellationForm;
