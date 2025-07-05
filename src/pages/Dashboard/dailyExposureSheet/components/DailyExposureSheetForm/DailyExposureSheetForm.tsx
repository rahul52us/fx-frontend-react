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
import * as Yup from "yup";
import CustomInput from "../../../../../config/component/CustomInput/CustomInput";
import {
  exposureTypeOptions,
  settlementTypeOptions
} from "../../../exportsRegister/component/utils/constant";

const DailyExposureSheetForm = ({ submitForm }: any) => {
  // const validationSchema = Yup.object({
  //   exposureType: Yup.mixed().required("Exposure Type is required"),
  //   settlementType: Yup.mixed().required("Settlement Type is required"),
  //   conversionType: Yup.mixed().required("Conversion Type is required"),
  //   transactionDate: Yup.string().required("Transaction Date is required"),
  //   documentDueDate: Yup.string().required("Document Due Date is required"),
  //   poNumber: Yup.string().required("PO Number is required"),
  //   invoiceLcBcNumber: Yup.string().required(
  //     "Invoice LC/BC Number is required"
  //   ),
  //   dealNumber: Yup.string().required("Deal Number is required"),
  //   bank: Yup.string().required("Bank is required"),
  //   currency: Yup.string().required("Currency is required"),
  //   amount: Yup.string()
  //     .required("Amount is required"),
  //   forwardPremium: Yup.string()
  //     .required("Forward Premium is required"),
  //   spotBooked: Yup.string()
  //     .required("Spot Booked is required"),
  //   cashTomSpot: Yup.string()
  //     .required("Cash Tom Spot is required"),
  //   bankMargin: Yup.string()
  //     .required("Bank Margin is required"),
  //   benchmarkRate: Yup.string()
  //     .required("Benchmark Rate is required"),
  // });

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
    settledAmount: Yup.string().required("Settled Amount is required"),
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
        // bg="whiteAlpha.900"
        // boxShadow="xl"
      >
        <Heading size="lg" mb={6} textAlign="center">
          Exposure Settlement Register
        </Heading>
        <Formik
          initialValues={{}}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={(values, actions) => {
            console.log("values", values);
            submitForm(values, actions, "form");
          }}
        >
          {({ values, handleChange, isSubmitting, errors, touched }: any) => (
            <FormikForm>
              <VStack spacing={6} align="stretch">
                <Divider mb={4} />

                <SimpleGrid columns={[1, null, 2]} spacing={8}>
                  {/* <CustomInput
                    label="Month"
                    name="month"
                    type="select"
                    options={monthsOptions}
                    placeholder="Select Month"
                    value={monthsOptions.find(
                      (option) => option.value === values.month
                    )}
                    onChange={(selectedOption) =>
                      handleChange({
                        target: { name: "month", value: selectedOption.value },
                      })
                    }
                    error={touched.month && errors.month}
                  /> */}

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
                  />

                  {/* <CustomInput
                    label="Conversion Type"
                    name="conversionType"
                    type="select"
                    options={conversionTypeOptions}
                    value={conversionTypeOptions.find(
                      (opt) => opt.value === values.conversionType
                    )}
                    onChange={(option) =>
                      handleChange({
                        target: { name: "conversionType", value: option.value },
                      })
                    }
                    error={touched.conversionType && errors.conversionType}
                  /> */}

                  <CustomInput
                    label="Settlement Input Date"
                    name="settlementInputDate"
                    type="date"
                    value={values.settlementInputDate}
                    onChange={handleChange}
                    error={touched.settlementInputDate && errors.settlementInputDate}
                  />
                  <CustomInput
                    label="Settlement Date"
                    name="settlementDate"
                    type="date"
                    value={values.settlementDate}
                    onChange={handleChange}
                    error={touched.settlementDate && errors.settlementDate}
                  />

                  {/* <CustomInput
                    label="Document Due Date"
                    name="documentDueDate"
                    type="date"
                    value={values.documentDueDate}
                    onChange={handleChange}
                    error={touched.documentDueDate && errors.documentDueDate}
                  /> */}

                  <CustomInput
                    label="PO Number"
                    name="poNumber"
                    placeholder="Enter PO Number"
                    value={values.poNumber}
                    onChange={handleChange}
                    error={touched.poNumber && errors.poNumber}
                  />

                  <CustomInput
                    label="Invoice LC/BC Number"
                    name="invoiceBcNumber"
                    placeholder="Enter Invoice LC/BC Number"
                    value={values.invoiceBcNumber}
                    onChange={handleChange}
                    error={
                      touched.invoiceBcNumber && errors.invoiceBcNumber
                    }
                  />

                  <CustomInput
                    label="Mode Of Conversion"
                    name="modeOfConversion"
                    placeholder="Conversion Mode"
                    value={values.modeOfConversion}
                    onChange={handleChange}
                    error={touched.modeOfConversion && errors.modeOfConversion}
                  />
                  <CustomInput
                    label="Conversion Ref No"
                    name="conversionReferenceNumber"
                    placeholder="Conversion Mode"
                    value={values.conversionReferenceNumber}
                    onChange={handleChange}
                    error={touched.conversionReferenceNumber && errors.conversionReferenceNumber}
                  />

                  {/* <CustomInput
                    label="Bank"
                    name="bank"
                    placeholder="Enter Bank"
                    value={values.bank}
                    onChange={handleChange}
                    error={touched.bank && errors.bank}
                  />

                  <CustomInput
                    label="Currency"
                    name="currency"
                    placeholder="Enter Currency"
                    value={values.currency}
                    onChange={handleChange}
                    error={touched.currency && errors.currency}
                  /> */}

                  <CustomInput
                    label="Settlement Amount"
                    name="settledAmount"
                    placeholder="Enter Amount"
                    value={values.settledAmount}
                    onChange={handleChange}
                    error={touched.settledAmount && errors.settledAmount}
                  />

                  {/* <CustomInput
                    label="Forward Premium"
                    name="forwardPremium"
                    placeholder="Enter Forward Premium"
                    value={values.forwardPremium}
                    onChange={handleChange}
                    error={touched.forwardPremium && errors.forwardPremium}
                  /> */}

                  <CustomInput
                    label="Spot Booked"
                    name="spotBooked"
                    placeholder="Enter Spot Booked"
                    value={values.spotBooked}
                    onChange={handleChange}
                    error={touched.spotBooked && errors.spotBooked}
                  />

                  <CustomInput
                    label="Cash Tom Spot"
                    name="cashTomSpot"
                    placeholder="Enter Cash Tom Spot"
                    value={values.cashTomSpot}
                    onChange={handleChange}
                    error={touched.cashTomSpot && errors.cashTomSpot}
                  />

                  <CustomInput
                    label="Bank Margin"
                    name="bankMargin"
                    placeholder="Enter Bank Margin"
                    value={values.bankMargin}
                    onChange={handleChange}
                    error={touched.bankMargin && errors.bankMargin}
                  />

                  <CustomInput
                    label="Forward Presume Reversed"
                    name="forwardPremiumReveresed"
                    placeholder="Enter Benchmark Rate"
                    value={values.forwardPremiumReveresed}
                    onChange={handleChange}
                    error={touched.forwardPremiumReveresed && errors.forwardPremiumReveresed}
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
