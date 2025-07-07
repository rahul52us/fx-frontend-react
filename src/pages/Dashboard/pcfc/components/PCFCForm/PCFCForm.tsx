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
import { currencyOptions } from "../../../exportsRegister/component/utils/constant";

const PCFCForm = ({ submitForm }: any) => {
  const [showError, setShowError] = useState(false);
  const validationSchema = Yup.object().shape({
    drawdownDate: Yup.string().required("Drawdown Date is required"),
    modeOfConversion: Yup.string().required("Mode of Conversion is required"),
    bank: Yup.string().required("Bank is required"),
    tradeReferenceNumber: Yup.string().required(
      "Trade Reference Number is required"
    ),
    currency: Yup.mixed().required("Currency is required"),
    drawdownAmount: Yup.string().required("Drawdown Amount is required"),
    drawdownRate: Yup.string().required("Drawdown Rate is required"),
    floatingInterestRate: Yup.string().required(
      "Floating Interest Rate is required"
    ),
    bankSpread: Yup.string().required("Bank Spread is required"),
    totalInterestRate: Yup.string().required("Total Interest Rate is required"),
    dueDate: Yup.string().required("Due Date is required"),
  });

  return (
    <Box bg="whiteAlpha.700" py={4}>
      <Box maxW="5xl" mx="auto" p={8}>
        <Heading size="lg" mb={6} textAlign="center">
          PCFC Register Form
        </Heading>
        <Formik
          initialValues={{}}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={(values, actions) => {
            setShowError(true);
            submitForm(values, actions, "form");
            actions.setSubmitting(false);
          }}
        >
          {({ values, handleChange, isSubmitting, errors, touched }: any) => (
            <FormikForm>
              <VStack spacing={6} align="stretch">
                <Divider mb={4} />
                <SimpleGrid columns={[1, null, 2]} spacing={8}>
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
                    placeholder="Enter Bank Name"
                    value={values.bank}
                    onChange={handleChange}
                    error={touched.bank && errors.bank}
                    showError={showError}
                  />
                  <CustomInput
                    label="Mode Of Conversion"
                    name="modeOfConversion"
                    placeholder="Conversion Mode"
                    value={values.modeOfConversion}
                    onChange={handleChange}
                    error={touched.modeOfConversion && errors.modeOfConversion}
                    showError={showError}
                  />
                  <CustomInput
                    label="Trade Ref No"
                    name="tradeReferenceNumber"
                    placeholder="Ref No"
                    value={values.tradeReferenceNumber}
                    onChange={handleChange}
                    error={
                      touched.tradeReferenceNumber &&
                      errors.tradeReferenceNumber
                    }
                    showError={showError}
                  />
                  <CustomInput
                    label="Bank Spread"
                    name="bankSpread"
                    placeholder="Bank Spread"
                    value={values.bankSpread}
                    onChange={handleChange}
                    error={touched.bankSpread && errors.bankSpread}
                    showError={showError}
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
                    showError={showError}
                  />
                  <CustomInput
                    label="Drawdown Amount"
                    name="drawdownAmount"
                    placeholder="Enter Drawdown Rate"
                    value={values.drawdownAmount}
                    onChange={handleChange}
                    error={touched.drawdownAmount && errors.drawdownAmount}
                    showError={showError}
                  />
                  <CustomInput
                    label="Drawdown Rate"
                    name="drawdownRate"
                    placeholder="Enter Drawdown Rate"
                    value={values.drawdownRate}
                    onChange={handleChange}
                    error={touched.drawdownRate && errors.drawdownRate}
                    showError={showError}
                  />

                  <CustomInput
                    label="Total Interest Rate"
                    name="totalInterestRate"
                    placeholder="Enter Interest Rate"
                    value={values.totalInterestRate}
                    onChange={handleChange}
                    error={
                      touched.totalInterestRate && errors.totalInterestRate
                    }
                    showError={showError}
                  />
                  <CustomInput
                    label="Floating Interest Rate"
                    name="floatingInterestRate"
                    placeholder="Enter Interest Rate"
                    value={values.floatingInterestRate}
                    onChange={handleChange}
                    error={
                      touched.floatingInterestRate &&
                      errors.floatingInterestRate
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

export default PCFCForm;
