"use client";
import { Box, Button, Flex, SimpleGrid, VStack } from "@chakra-ui/react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import CustomInput from "../../../../../config/component/CustomInput/CustomInput";
import {
  currencyOptions,
  exposureTypeOptions,
} from "../../../exportsRegister/component/utils/constant";
import {
  primaryButtonHoverStyle,
  primaryButtonStyle,
} from "../../../../../globalStyles";
const ForwardRegisterForm = ({ submitForm }: any) => {
  const validationSchema = Yup.object({
    bookingDate: Yup.string().required("Booking Date is required"),
    exposureType: Yup.string().required("Exposure Type is required"),
    bank: Yup.string().required("Bank is required"),
    bussinessUnit: Yup.string().required("Business Unit is required"),
    exposureRefNumber: Yup.string().required("Exposure Ref Number is required"),
    hedgeDealReferenceNumber: Yup.string().required(
      "Hedge Deal Reference Number is required"
    ),
    currency: Yup.string().required("Currency is required"),
    hedgeAmount: Yup.number().required("Hedge Amount is required"),
    spotBooked: Yup.string().required("Spot Booked is required"),
    forwardPoints: Yup.string().required("Forward Points is required"),
    bankMargin: Yup.string().required("Bank Margin is required"),
    hedgeRate: Yup.string().required("Hedge Rate is required"),
    dueDateFrom: Yup.string().required("Due Date From is required"),
    dueDateTo: Yup.string().required("Due Date To is required"),
  });
  return (
    <Box bg="whiteAlpha.700" py={4}>
      <Box maxW="5xl" mx="auto" px={2}>
        <Formik
          initialValues={{}}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={(values: any, actions: any) => {
            submitForm(values, actions, "form");
            actions.setSubmitting(false);
          }}
        >
          {({ values, handleChange, isSubmitting, errors, touched }: any) => (
            <FormikForm>
              <VStack spacing={6} align="stretch">
                <SimpleGrid columns={[1, null, 2]} spacing={6}>
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
                    label="Booking Date"
                    name="bookingDate"
                    type="date"
                    value={values.bookingDate}
                    onChange={handleChange}
                    error={touched.bookingDate && errors.bookingDate}
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
                    label="Business Unit"
                    name="bussinessUnit"
                    placeholder="Enter Business Unit"
                    value={values.bussinessUnit}
                    onChange={handleChange}
                    error={touched.bussinessUnit && errors.bussinessUnit}
                  />

                  <CustomInput
                    label="Exposure Ref Number"
                    name="exposureRefNumber"
                    placeholder="Enter Exposure Ref Number"
                    value={values.exposureRefNumber}
                    onChange={handleChange}
                    error={
                      touched.exposureRefNumber && errors.exposureRefNumber
                    }
                  />

                  <CustomInput
                    label="Hedge Deal Reference Number"
                    name="hedgeDealReferenceNumber"
                    placeholder="Enter Deal Reference Number"
                    value={values.hedgeDealReferenceNumber}
                    onChange={handleChange}
                    error={
                      touched.hedgeDealReferenceNumber &&
                      errors.hedgeDealReferenceNumber
                    }
                  />

                  <CustomInput
                    label="Currency"
                    type="select"
                    name="currency"
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
                    label="Hedge Amount"
                    name="hedgeAmount"
                    type="number"
                    placeholder="Enter Amount"
                    value={values.hedgeAmount}
                    onChange={handleChange}
                    error={touched.hedgeAmount && errors.hedgeAmount}
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
                    label="Forward Points"
                    name="forwardPoints"
                    placeholder="Enter Forward Points"
                    value={values.forwardPoints}
                    onChange={handleChange}
                    error={touched.forwardPoints && errors.forwardPoints}
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
                    label="Hedge Rate"
                    name="hedgeRate"
                    placeholder="Rate"
                    value={values.hedgeRate}
                    onChange={handleChange}
                    error={touched.hedgeRate && errors.hedgeRate}
                  />

                  <CustomInput
                    label="Delivery Date From"
                    name="dueDateFrom"
                    type="date"
                    value={values.dueDateFrom}
                    onChange={handleChange}
                    error={touched.dueDateFrom && errors.dueDateFrom}
                  />

                  <CustomInput
                    label="Delivery Date To"
                    name="dueDateTo"
                    type="date"
                    value={values.dueDateTo}
                    onChange={handleChange}
                    error={touched.dueDateTo && errors.dueDateTo}
                  />
                </SimpleGrid>

                <Flex justify={"end"}>
                  <Button
                    rounded={"full"}
                    fontWeight={500}
                    {...primaryButtonStyle}
                    _hover={{ ...primaryButtonHoverStyle, border: "1px solid" }}
                    transition={"transform 0.3s ease-in-out"}
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
export default ForwardRegisterForm;
