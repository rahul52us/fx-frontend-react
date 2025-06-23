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
import CustomInput from "../../../../../config/component/CustomInput/CustomInput";
import {
  currencyOptions,
  monthsOptions,
} from "../../../exportsRegister/component/utils/constant";

const PCFCForm = ({submitForm}:any) => {
  const validationSchema = Yup.object({
    month: Yup.mixed().required("Month is required"),// remove this
    drawdownDate: Yup.string().required("Drawdown Date is required"),
    conversionBasic: Yup.string().required("Conversion Basic is required"),
    bank: Yup.string().required("Bank is required"),
    dealId: Yup.string().required("Deal ID is required"),
    currency: Yup.mixed().required("Currency is required"),
    originalAmount: Yup.string()
      .required("Original Amount is required"),
    drawdownRate: Yup.string()
      .required("Drawdown Rate is required"),
    interestRate: Yup.string()
      .required("Interest Rate is required"),
    maturity: Yup.string().required("Maturity Date is required"),
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
          src={"/img/background_image.jpg"}
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
      >
        <Heading size="lg" mb={6} textAlign="center">
          PCFC Register Form
        </Heading>

        <Formik
          initialValues={{}}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={(values, actions) => {
            submitForm(values,actions,"form");
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
                    label="Drawdown Date"
                    name="drawdownDate"
                    type="date"
                    value={values.drawdownDate}
                    onChange={handleChange}
                    error={touched.drawdownDate && errors.drawdownDate}
                  />

                  <CustomInput
                    label="Conversion Basic"
                    name="conversionBasic"
                    placeholder="Enter Conversion Basic"
                    value={values.conversionBasic}
                    onChange={handleChange}
                    error={touched.conversionBasic && errors.conversionBasic}
                  />

                  <CustomInput
                    label="Bank"
                    name="bank"
                    placeholder="Enter Bank Name"
                    value={values.bank}
                    onChange={handleChange}
                    error={touched.bank && errors.bank}
                  />

                  <CustomInput
                    label="Deal ID"
                    name="dealId"
                    placeholder="Enter Deal ID"
                    value={values.dealId}
                    onChange={handleChange}
                    error={touched.dealId && errors.dealId}
                  />

                  <CustomInput
                    label="Currency"
                    name="currency"
                    type="select"
                    options={currencyOptions}
                    value={currencyOptions.find(
                      (option) => option.value === values.currency
                    )}
                    onChange={(selectedOption) =>
                      handleChange({
                        target: {
                          name: "currency",
                          value: selectedOption.value,
                        },
                      })
                    }
                    error={touched.currency && errors.currency}
                  />

                  <CustomInput
                    label="Original Amount"
                    name="originalAmount"
                    placeholder="Enter Original Amount"
                    value={values.originalAmount}
                    onChange={handleChange}
                    error={touched.originalAmount && errors.originalAmount}
                  />

                  <CustomInput
                    label="Drawdown Rate"
                    name="drawdownRate"
                    placeholder="Enter Drawdown Rate"
                    value={values.drawdownRate}
                    onChange={handleChange}
                    error={touched.drawdownRate && errors.drawdownRate}
                  />

                  <CustomInput
                    label="Interest Rate"
                    name="interestRate"
                    placeholder="Enter Interest Rate"
                    value={values.interestRate}
                    onChange={handleChange}
                    error={touched.interestRate && errors.interestRate}
                  />

                  <CustomInput
                    label="Maturity"
                    name="maturity"
                    type="date"
                    value={values.maturity}
                    onChange={handleChange}
                    error={touched.maturity && errors.maturity}
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

export default PCFCForm;
