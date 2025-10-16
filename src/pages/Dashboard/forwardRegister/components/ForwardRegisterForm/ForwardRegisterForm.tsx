import { Box, Button, Flex, SimpleGrid, useToast, VStack } from "@chakra-ui/react";
import { Formik, Form as FormikForm } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import CustomInput from "../../../../../config/component/CustomInput/CustomInput";
import { primaryButtonHoverStyle, primaryButtonStyle } from "../../../../../globalStyles";
import { currencyOptions, exposureTypeOptions } from "../../../exportsRegister/component/utils/constant";
import { banks } from "../../../pcfc/components/PCFCForm/dummyData";
import { exposureRefNumberOptions } from "./constant";

const ForwardRegisterForm = ({ submitForm }: any) => {
  const toast = useToast();
  const [showError, setShowError] = useState(false);
  const validationSchema = Yup.object({
    bookingDate: Yup.string().required("Booking Date is required"),
    exposureType: Yup.string().required("Exposure Type is required"),
    bank: Yup.string().required("Bank is required"),
    bussinessUnit: Yup.string().required("Business Unit is required"),
    hedgeDealReferenceNumber: Yup.string().required("Hedge Deal Reference Number is required"),
    currency: Yup.string().required("Currency is required"),
    hedgeAmount: Yup.number().required("Hedge Amount is required"),
    spotBooked: Yup.string().required("Spot Booked is required"),
    forwardPoints: Yup.string().required("Forward Points is required"),
    bankMargin: Yup.string().required("Bank Margin is required"),
    hedgeRate: Yup.string().required("Hedge Rate is required"),
    dueDateFrom: Yup.string().required("Due Date From is required"),
    dueDateTo: Yup.string().required("Due Date To is required"),
  });

    const handleFormSubmit = (handleSubmit: any, errors: any) => {
    setShowError(true);
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0] as string;
      toast({
        title: "Validation Error",
        description: firstError || "Please fill all required fields correctly",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    }
    handleSubmit();
  };

  return (
    <Box bg="whiteAlpha.700" py={4}>
      <Box px={2}>
        <Formik
          initialValues={{}}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={(values: any, actions: any) => {
            submitForm(values, actions, "form");
            actions.setSubmitting(false);
          }}
        >
          {({ values, handleChange, isSubmitting, errors, touched,handleSubmit }: any) => (
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
                    showError={showError}
                    />

                  <CustomInput
                    label="Booking Date"
                    name="bookingDate"
                    type="date"
                    value={values.bookingDate}
                    onChange={handleChange}
                    error={touched.bookingDate && errors.bookingDate}
                    required={true}
                    showError={showError}
                    />

                  <CustomInput
                    label="Bank"
                    type="select"
                    name="bank"
                    placeholder="Enter Bank Name"
                    options={banks}
                    value={banks.find((option) => option.value === values.bank)}
                    onChange={(option) =>
                      handleChange({
                        target: { name: "bank", value: option.value },
                      })
                    }
                    error={touched.bank && errors.bank}
                    showError={showError}
                    />
                  <CustomInput
                    label="Business Unit"
                    name="bussinessUnit"
                    placeholder="Enter Business Unit"
                    value={values.bussinessUnit}
                    onChange={handleChange}
                    error={touched.bussinessUnit && errors.bussinessUnit}
                    required={true}
                    showError={showError}
                    />

                  <CustomInput
                    label="Exposure Ref Number"
                    name="exposureRefNumber"
                    type="select"
                    options={exposureRefNumberOptions}
                    placeholder="Enter Exposure Ref Number"
                    value={exposureRefNumberOptions.find(
                      (option) => option.value === values.exposureRefNumber
                    )}
                    onChange={(selectedOption) =>
                      handleChange({
                        target: {
                          name: "exposureRefNumber",
                          value: selectedOption.value,
                        }
                    })}
                    error={
                      touched.exposureRefNumber && errors.exposureRefNumber
                    }
                    showError={showError}
                    />
                  <CustomInput
                    label="Hedge Deal Reference Number"
                    name="hedgeDealReferenceNumber"
                    placeholder="Enter Deal Reference Number"
                    value={values.hedgeDealReferenceNumber}
                    onChange={handleChange}
                    error={touched.hedgeDealReferenceNumber && errors.hedgeDealReferenceNumber}
                    required={true}
                    showError={showError}
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
                    required={true}
                    showError={showError}
                    />

                  <CustomInput
                    label="Hedge Amount"
                    name="hedgeAmount"
                    type="number"
                    placeholder="Enter Amount"
                    value={values.hedgeAmount}
                    onChange={handleChange}
                    error={touched.hedgeAmount && errors.hedgeAmount}
                    required={true}
                    showError={showError}
                    />

                  <CustomInput
                    label="Spot Booked"
                    name="spotBooked"
                    placeholder="Enter Spot Booked"
                    value={values.spotBooked}
                    onChange={handleChange}
                    error={touched.spotBooked && errors.spotBooked}
                    required={true}
                    showError={showError}
                    />

                  <CustomInput
                    label="Forward Points"
                    name="forwardPoints"
                    placeholder="Enter Forward Points"
                    value={values.forwardPoints}
                    onChange={handleChange}
                    error={touched.forwardPoints && errors.forwardPoints}
                    required={true}
                    showError={showError}
                    />

                  <CustomInput
                    label="Bank Margin"
                    name="bankMargin"
                    placeholder="Enter Bank Margin"
                    value={values.bankMargin}
                    onChange={handleChange}
                    error={touched.bankMargin && errors.bankMargin}
                    required={true}
                    showError={showError}
                    />

                  <CustomInput
                    label="Hedge Rate"
                    name="hedgeRate"
                    placeholder="Rate"
                    value={values.hedgeRate}
                    onChange={handleChange}
                    error={touched.hedgeRate && errors.hedgeRate}
                    required={true}
                    showError={showError}
                    />

                  <CustomInput
                    label="Due Date From"
                    name="dueDateFrom"
                    type="date"
                    value={values.dueDateFrom}
                    onChange={handleChange}
                    error={touched.dueDateFrom && errors.dueDateFrom}
                    required={true}
                    showError={showError}
                    />

                  <CustomInput
                    label="Due Date To"
                    name="dueDateTo"
                    type="date"
                    value={values.dueDateTo}
                    onChange={handleChange}
                    error={touched.dueDateTo && errors.dueDateTo}
                    required={true}
                    showError={showError}
                  />
                </SimpleGrid>

                <Flex justify={"end"}>
                  <Button
                  rounded={"full"}
                      fontWeight={500}
                      {...primaryButtonStyle}
                      _hover={{
                        ...primaryButtonHoverStyle,
                        border: "1px solid",
                      }}
                      transition={"transform 0.3s ease-in-out"}
                      onClick={() => handleFormSubmit(handleSubmit, errors)}
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
