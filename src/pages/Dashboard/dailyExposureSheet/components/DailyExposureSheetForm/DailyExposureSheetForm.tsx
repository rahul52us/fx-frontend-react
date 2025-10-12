"use client";

import { Box, Button, Flex, SimpleGrid, VStack } from "@chakra-ui/react";
import { Formik, Form as FormikForm } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import CustomInput from "../../../../../config/component/CustomInput/CustomInput";
import {
  primaryButtonHoverStyle,
  primaryButtonStyle,
} from "../../../../../globalStyles";
import {
  exposureTypeOptions,
  modeOfConversionOptions,
  settlementTypeOptions,
} from "../../../exportsRegister/component/utils/constant";

const DailyExposureSheetForm = ({ submitForm }: any) => {
  const [showError, setShowError] = useState(false);
  const validationSchema = Yup.object({
    settlementDate: Yup.string().required("Settlement Date is required"),
   
    exposureType: Yup.mixed().required("Exposure Type is required"),
    settlementType: Yup.string().required("Settlement Type is required"),
    poNumber: Yup.string().required("PO Number is required"),
    invoiceBcNumber: Yup.string().required("Invoice BC Number is required"),
    modeOfConversion: Yup.string().required("Mode of Conversion is required"),
    conversionReferenceNumber: Yup.string().required(
      "Conversion Reference Number is required"
    ),
    settledAmount: Yup.number().required("Settled Amount is required"),
    forwardPremium: Yup.string().required(
      "Forward Premium Reversed is required"
    ),
    spotBooked: Yup.string().required("Spot Booked is required"),
    cashTomSpot: Yup.string().required("Cash to Spot is required"),
    bankMargin: Yup.string().required("Bank Margin is required"),
  });

  return (
    <Box bg="whiteAlpha.700">
      <Box maxW="5xl" mx="auto" p={2} borderRadius="2xl">
        <Formik
          initialValues={{}}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={(values, actions) => {
            setShowError(true);
            submitForm(values, actions, "form");
          }}
        >
          {({ values, handleChange, isSubmitting, errors, touched }: any) => (
            <FormikForm>
              <VStack spacing={6} align="stretch">
                <SimpleGrid columns={[1, null, 2]} spacing={8}>
                  <CustomInput
                    label="Exposure Type"
                    name="exposureType"
                    type="select"
                    options={exposureTypeOptions}
                    value={exposureTypeOptions.find(
                      (opt) => opt.value === values.exposureType
                    )}
                    onChange={(option) =>
                      handleChange({
                        target: { name: "exposureType", value: option.value },
                      })
                    }
                    error={touched.exposureType && errors.exposureType}
                    showError={showError}
                  />
                  <CustomInput
                    label="Settlement Type"
                    name="settlementType"
                    type="select"
                    options={settlementTypeOptions}
                    value={settlementTypeOptions.find(
                      (opt) => opt.value === values.settlementType
                    )}
                    onChange={(option) =>
                      handleChange({
                        target: { name: "settlementType", value: option.value },
                      })
                    }
                    error={touched.settlementType && errors.settlementType}
                    showError={showError}
                  />
                
                  <CustomInput
                    label="Settlement Date"
                    name="settlementDate"
                    type="date"
                    value={values.settlementDate}
                    onChange={handleChange}
                    error={errors.settlementDate}
                    showError={showError}
                  />
                  <CustomInput
                    label="PO Number"
                    name="poNumber"
                    placeholder="Enter PO Number"
                    value={values.poNumber}
                    onChange={handleChange}
                    error={touched.poNumber && errors.poNumber}
                    showError={showError}
                  />
                  <CustomInput
                    label="Invoice LC/BC Number"
                    name="invoiceBcNumber"
                    placeholder="Enter Invoice LC/BC Number"
                    value={values.invoiceBcNumber}
                    onChange={handleChange}
                    error={touched.invoiceBcNumber && errors.invoiceBcNumber}
                    showError={showError}
                  />
                  <CustomInput
                    label="Mode Of Conversion"
                    name="modeOfConversion"
                    type="select"
                    placeholder="Conversion Mode"
                    options={modeOfConversionOptions}
                    value={modeOfConversionOptions.find(
                      (opt) => opt.value === values.modeOfConversion
                    )}
                    onChange={(option) =>
                      handleChange({
                        target: {
                          name: "modeOfConversion",
                          value: option.value,
                        },
                      })
                    }
                    error={touched.modeOfConversion && errors.modeOfConversion}
                    showError={showError}
                  />
                  <CustomInput
                    label="Conversion Ref No"
                    name="conversionReferenceNumber"
                    placeholder="Conversion Reference Number"
                    value={values.conversionReferenceNumber}
                    onChange={handleChange}
                    error={
                      touched.conversionReferenceNumber &&
                      errors.conversionReferenceNumber
                    }
                    showError={showError}
                  />
                  <CustomInput
                    label="Settlement Amount"
                    type="number"
                    name="settledAmount"
                    placeholder="Enter Amount"
                    value={values.settledAmount}
                    onChange={handleChange}
                    error={touched.settledAmount && errors.settledAmount}
                    showError={showError}
                  />
                  <CustomInput
                    label="Spot Booked"
                    name="spotBooked"
                    placeholder="Enter Spot Booked"
                    value={values.spotBooked}
                    onChange={handleChange}
                    error={touched.spotBooked && errors.spotBooked}
                    showError={showError}
                  />
                  <CustomInput
                    label="Cash Tom Spot"
                    name="cashTomSpot"
                    placeholder="Enter Cash Tom Spot"
                    value={values.cashTomSpot}
                    onChange={handleChange}
                    error={touched.cashTomSpot && errors.cashTomSpot}
                    showError={showError}
                  />
                  <CustomInput
                    label="Bank Margin"
                    name="bankMargin"
                    placeholder="Enter Bank Margin"
                    value={values.bankMargin}
                    onChange={handleChange}
                    error={touched.bankMargin && errors.bankMargin}
                    showError={showError}
                  />
                  <CustomInput
                    label="Settlement Rate"
                    name="settlementRate"
                    placeholder="Enter Settlement Rate"
                    value={values.settlementRate}
                    onChange={handleChange}
                    error={touched.settlementRate && errors.settlementRate}
                    showError={showError}
                  />
                  <CustomInput
                    label="Forward Premium"
                    name="forwardPremium"
                    placeholder="Enter Forward Premium"
                    value={values.forwardPremium}
                    onChange={handleChange}
                    error={touched.forwardPremium && errors.forwardPremium}
                    showError={showError}
                  />

                  {/* ✅ Added Missing Fields */}
                  <CustomInput
                    label="Net Rate"
                    name="netRate"
                    placeholder="Enter Net Rate"
                    value={values.netRate}
                    onChange={handleChange}
                  />
                  <CustomInput
                    label="Amount"
                    name="amount"
                    placeholder="Enter Amount"
                    type="number"
                    value={values.amount}
                    onChange={handleChange}
                  />
                  <CustomInput
                    label="Booked Rate"
                    name="bookedRate"
                    placeholder="Enter Booked Rate"
                    value={values.bookedRate}
                    onChange={handleChange}
                  />
                  <CustomInput
                    label="Outstanding Amount"
                    name="outstandingAmount"
                    placeholder="Enter Outstanding Amount"
                    type="number"
                    value={values.outstandingAmount}
                    onChange={handleChange}
                  />
                  <CustomInput
                    label="Drawdown Rate"
                    name="drawdownRate"
                    placeholder="Enter Drawdown Rate"
                    value={values.drawdownRate}
                    onChange={handleChange}
                  />
                  <CustomInput
                    label="Due Date"
                    name="dueDate"
                    type="date"
                    value={values.dueDate}
                    onChange={handleChange}
                  />
                  <CustomInput
                    label="Hedge Rate"
                    name="hedgeRate"
                    placeholder="Enter Hedge Rate"
                    value={values.hedgeRate}
                    onChange={handleChange}
                  />
                  <CustomInput
                    label="Delivery Date From"
                    name="deliveryDateFrom"
                    type="date"
                    value={values.deliveryDateFrom}
                    onChange={handleChange}
                  />
                  <CustomInput
                    label="Delivery Date To"
                    name="deliveryDateTo"
                    type="date"
                    value={values.deliveryDateTo}
                    onChange={handleChange}
                  />
                  <CustomInput
                    label="Utilization Amount"
                    name="utilizationAmount"
                    placeholder="Enter Utilization Amount"
                    type="number"
                    value={values.utilizationAmount}
                    onChange={handleChange}
                  />
                  <CustomInput
                    label="Net Settlement Rate"
                    name="netSettlementRate"
                    placeholder="Enter Net Settlement Rate"
                    value={values.netSettlementRate}
                    onChange={handleChange}
                  />
                  <CustomInput
                    label="Settled Amount in INR"
                    name="settledAmountInINR"
                    placeholder="Enter Settled Amount in INR"
                    type="number"
                    value={values.settledAmountInINR}
                    onChange={handleChange}
                  />
                </SimpleGrid>
                <Flex justify={"end"}>
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

export default DailyExposureSheetForm;
