"use client";

import {
  Box,
  Button,
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
} from "../../../exportsRegister/component/utils/constant";
import store from "../../../../../store/store";
import { extractFieldValue } from "../../../../../config/constant/function";

const EEFCForm = ({ submitForm }: any) => {
  const { auth: { bussinessUnitsData, currenciesData, banksData } } = store
  const validationSchema = Yup.object().shape({
    settlementDate: Yup.string().required("Settlement Date is required"),
    exposureType: Yup.mixed().required("Exposure Type is required"),
    exposureReferenceNumber: Yup.string().required(
      "Reference Number is required"
    ),
    bussinessUnit: Yup.mixed().required("Business Unit is required"),
    bank: Yup.mixed().required("Bank is required"),
    currency: Yup.mixed().required("Currency is required"),
    amount: Yup.string().required("Amount is required"),
    referenceRate: Yup.string().required("Reference Rate is required"),
    closingBalance: Yup.string().required("Closing Balance is required"),
    weightedAverageRate: Yup.string().required(
      "Weighted Average Rate is required"
    ),
    closingBalanceInInr: Yup.string().required(
      "Closing Balance in INR is required"
    ),
  });
  return (
    <Box bg="whiteAlpha.700">
      <Box mx="auto" p={4}>
        <Heading display="none" size="lg" mb={6} textAlign="center">
          PCFC Register Form
        </Heading>

        <Formik
          initialValues={{}}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={(values, actions) => {
            values = extractFieldValue(values)
            submitForm(values, actions, "form");
            actions.setSubmitting(false);
          }}
        >
          {({ values, handleChange, isSubmitting, errors, touched, setFieldValue }: any) => (
            <FormikForm>
              <VStack spacing={6} align="stretch">
                <SimpleGrid columns={[1, null, 2]} spacing={4}>
                  <CustomInput
                    label="Business Unit"
                    name="bussinessUnit"
                    type="select"
                    options={bussinessUnitsData}
                    value={values.bussinessUnit}
                    onChange={(e: any) => setFieldValue('bussinessUnit', e)}
                    error={touched.bussinessUnit && errors.bussinessUnit}
                  />
                  <CustomInput
                    label="Exposure Reference Number"
                    name="exposureReferenceNumber"
                    value={values.exposureReferenceNumber}
                    onChange={handleChange}
                    error={
                      touched.exposureReferenceNumber &&
                      errors.exposureReferenceNumber
                    }
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
                    label="Settlement Date"
                    name="settlementDate"
                    type="date"
                    value={values.settlementDate}
                    onChange={handleChange}
                    error={touched.settlementDate && errors.settlementDate}
                  />

                  <CustomInput
                    label="Bank"
                    name="bank"
                    type="select"
                    options={banksData}
                    value={values.bank}
                    onChange={(e: any) => setFieldValue('bank', e)}
                    error={touched.bank && errors.bank}
                  />
                  <CustomInput
                    label="Reference rate"
                    name="referenceRate"
                    placeholder="Rate"
                    value={values.referenceRate}
                    onChange={handleChange}
                    error={touched.referenceRate && errors.referenceRate}
                  />
                  <CustomInput
                    label="Currency"
                    name="currency"
                    type="select"
                    options={currenciesData}
                    value={values.currency}
                    onChange={(selectedOption) =>
                      handleChange({
                        target: {
                          name: "currency",
                          value: selectedOption,
                        },
                      })
                    }
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
                    label="Closing Balance"
                    name="closingBalance"
                    placeholder="Closing Balance"
                    value={values.closingBalance}
                    onChange={handleChange}
                    error={
                      touched.closingBalance && errors.closingBalance
                    }
                  />
                  <CustomInput
                    label="Closing Balance INR"
                    name="closingBalanceInInr"
                    placeholder="In INR"
                    value={values.closingBalanceInInr}
                    onChange={handleChange}
                    error={
                      touched.closingBalanceInInr && errors.closingBalanceInInr
                    }
                  />
                  <CustomInput
                    label="Weighted Average Rate"
                    name="weightedAverageRate"
                    placeholder="Average Rate"
                    value={values.weightedAverageRate}
                    onChange={handleChange}
                    error={
                      touched.weightedAverageRate && errors.weightedAverageRate
                    }
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

export default EEFCForm;
