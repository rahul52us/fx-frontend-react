"use client";

import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import { Formik, Form as FormikForm } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import CustomInput from "../../../../../config/component/CustomInput/CustomInput";
import {
  exposureTypeOptions,
  modeOfConversionOptions,
  settlementTypeOptions,
} from "../../../exportsRegister/component/utils/constant";

const DailyExposureSheetForm = ({ submitForm }: any) => {
  const [showError, setShowError] = useState(false);
  const validationSchema = Yup.object({
    settlementDate: Yup.string().required("Settlement Date is required"),
    settlementInputDate: Yup.mixed().required(
      "Settlement Input Date is required"
    ),
    exposureType: Yup.mixed().required("Exposure Type is required"),
    settlementType: Yup.string().required("Settlement Type is required"),
    poNumber: Yup.string().required("PO Number is required"),
    invoiceBcNumber: Yup.string().required("Invoice BC Number is required"),
    modeOfConversion: Yup.string().required("Mode of Conversion is required"),
    conversionReferenceNumber: Yup.string().required(
      "Conversion Reference Number is required"
    ),
    settledAmount: Yup.number().required("Settled Amount is required"),
    forwardPremiumReveresed: Yup.string().required(
      "Forward Premium Reversed is required"
    ),
    spotBooked: Yup.string().required("Spot Booked is required"),
    cashTomSpot: Yup.string().required("Cash to Spot is required"),
    bankMargin: Yup.string().required("Bank Margin is required"),
  });

  return (
    <Box bg="whiteAlpha.700" py={4}>
      <Box
        maxW="5xl"
        mx="auto"
        p={6}
        borderRadius="2xl"
      >
        <Heading size="lg" mb={6} textAlign="center">
          Exposure Settlement Register
        </Heading>
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
                <Divider mb={4} />

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
                    label="Settlement Input Date"
                    name="settlementInputDate"
                    type="date"
                    value={values.settlementInputDate}
                    onChange={handleChange}
                    error={
                      touched.settlementInputDate && errors.settlementInputDate
                    }
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
                        target: { name: "modeOfConversion", value: option.value },
                      })
                    }
                    error={touched.modeOfConversion && errors.modeOfConversion}
                    showError={showError}
                    />
                  <CustomInput
                    label="Conversion Ref No"
                    name="conversionReferenceNumber"
                    placeholder="Conversion Mode"
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
                    label="Forward Presume Reversed"
                    name="forwardPremiumReveresed"
                    placeholder="Enter Benchmark Rate"
                    value={values.forwardPremiumReveresed}
                    onChange={handleChange}
                    error={
                      touched.forwardPremiumReveresed &&
                      errors.forwardPremiumReveresed
                    }
                    showError={showError}
                  />
                </SimpleGrid>

                <Flex justify={"end"}>
                  <Button
                    rounded={"full"}
                    fontWeight={500}
                    _hover={{
                      bg: "blue.600",
                      color: "white",
                      transform: "translateY(-2px)",
                    }}
                    transition={"transform 0.3s ease-in-out"}
                    bg={"blue.500"}
                    shadow={"xl"}
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
