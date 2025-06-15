"use client";

import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  VStack
} from "@chakra-ui/react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
// import BgImg from "../../../../../images/background_image.jpg";
import CustomInput from "../../../../../config/component/CustomInput/CustomInput";
import {
  conversionTypeOptions,
  exposureTypeOptions,
  monthsOptions,
  settlementTypeOptions,
} from "../../../exportsRegister/component/utils/constant";

const DailyExposureSheetForm = () => {
  const validationSchema = Yup.object({
    month: Yup.string().required("Month is required"),
    exposureType: Yup.string().required("Exposure Type is required"),
    settlementType: Yup.string().required("Settlement Type is required"),
    conversionType: Yup.string().required("Conversion Type is required"),
    transactionDate: Yup.string().required("Transaction Date is required"),
    documentDueDate: Yup.string().required("Document Due Date is required"),
    poNumber: Yup.string().required("PO Number is required"),
    invoiceLcBcNumber: Yup.string().required(
      "Invoice LC/BC Number is required"
    ),
    dealNumber: Yup.string().required("Deal Number is required"),
    bank: Yup.string().required("Bank is required"),
    currency: Yup.string().required("Currency is required"),
    amount: Yup.number()
      .required("Amount is required")
      .positive("Amount must be positive"),
    forwardPremium: Yup.number()
      .required("Forward Premium is required")
      .positive("Must be a positive number"),
    spotBooked: Yup.number()
      .required("Spot Booked is required")
      .positive("Must be a positive number"),
    cashTomSpot: Yup.number()
      .required("Cash Tom Spot is required")
      .positive("Must be a positive number"),
    bankMargin: Yup.number()
      .required("Bank Margin is required")
      .positive("Must be a positive number"),
    benchmarkRate: Yup.number()
      .required("Benchmark Rate is required")
      .positive("Must be a positive number"),
  });

  return (
    <Box bg="whiteAlpha.700" py={4}>
      {/* Background Image with Overlay */}
      {/* <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "100%",
          zIndex: -1,
          overflow: "hidden",
        }}
      >
        <Image
          src={BgImg}
          alt="Background Image"
          objectFit="cover"
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
        />
      </div> */}
      <Box
        maxW="5xl"
        mx="auto"
        p={8}
        borderRadius="2xl"
        bg="whiteAlpha.900"
        boxShadow="xl"
      >
        <Heading size="lg" mb={6} textAlign="center">
          Daily Exposure Sheet
        </Heading>
        <Formik
          initialValues={{}}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={(__, actions) => {
            // alert('Form submitted successfully!');
            actions.setSubmitting(false);
          }}
        >
          {({ values, handleChange, isSubmitting, errors, touched }: any) => (
            <FormikForm>
              <VStack spacing={6} align="stretch">
                <Divider mb={4} />

                <SimpleGrid columns={[1, null, 2]} spacing={8}>
                  <CustomInput
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
                  />

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

                  <CustomInput
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
                  />

                  <CustomInput
                    label="Transaction Date"
                    name="transactionDate"
                    type="date"
                    value={values.transactionDate}
                    onChange={handleChange}
                    error={touched.transactionDate && errors.transactionDate}
                  />

                  <CustomInput
                    label="Document Due Date"
                    name="documentDueDate"
                    type="date"
                    value={values.documentDueDate}
                    onChange={handleChange}
                    error={touched.documentDueDate && errors.documentDueDate}
                  />

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
                    name="invoiceLcBcNumber"
                    placeholder="Enter Invoice LC/BC Number"
                    value={values.invoiceLcBcNumber}
                    onChange={handleChange}
                    error={
                      touched.invoiceLcBcNumber && errors.invoiceLcBcNumber
                    }
                  />

                  <CustomInput
                    label="Deal Number"
                    name="dealNumber"
                    placeholder="Enter Deal Number"
                    value={values.dealNumber}
                    onChange={handleChange}
                    error={touched.dealNumber && errors.dealNumber}
                  />

                  <CustomInput
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
                  />

                  <CustomInput
                    label="Amount"
                    name="amount"
                    placeholder="Enter Amount"
                    value={values.amount}
                    onChange={handleChange}
                    error={touched.amount && errors.amount}
                  />

                  <CustomInput
                    label="Forward Premium"
                    name="forwardPremium"
                    placeholder="Enter Forward Premium"
                    value={values.forwardPremium}
                    onChange={handleChange}
                    error={touched.forwardPremium && errors.forwardPremium}
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
                    label="Benchmark Rate"
                    name="benchmarkRate"
                    placeholder="Enter Benchmark Rate"
                    value={values.benchmarkRate}
                    onChange={handleChange}
                    error={touched.benchmarkRate && errors.benchmarkRate}
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
