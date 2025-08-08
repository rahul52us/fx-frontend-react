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
  exposureTypeOptions
} from "../../../exportsRegister/component/utils/constant";

const ForwardRegisterForm = ({submitForm}:any) => {
  // const validationSchema = Yup.object({
  //   exposureType: Yup.string().required("Exposure Type is required"),//
  //   bookingDate: Yup.string().required("Booking Date is required"),//
  //   deliveryDateFrom: Yup.string().required("Delivery Date From is required"),//
  //   deliveryDateTo: Yup.string().required("Delivery Date To is required"),//
  //   bank: Yup.string().required("Bank is required"),//
  //   dealId: Yup.string().required("Deal ID is required"),//
  //   currency: Yup.string().required("Currency is required"),//
  //   originalAmount: Yup.string()//
  //     .required("Original Amount is required"),
  //   spotBooked: Yup.string()//
  //     .required("Spot Booked is required"),
  //   forwardPoints: Yup.string()//
  //     .required("Forward Points is required"),
  //   bankMargin: Yup.string()//
  //     .required("Bank Margin is required"),
  // });

  const validationSchema = Yup.object({
  bookingDate: Yup.string().required("Booking Date is required"),
  exposureType: Yup.string().required("Exposure Type is required"),
  bank: Yup.string().required("Bank is required"),
  bussinessUnit: Yup.string().required("Business Unit is required"),
  exposureRefNumber: Yup.string().required("Exposure Ref Number is required"),
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
          Forward Register
        </Heading>
        <Formik
          initialValues={{}}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={(values: any, actions : any) => {
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
                    placeholder="Enter Bank Name"
                    value={values.bussinessUnit}
                    onChange={handleChange}
                    error={touched.bussinessUnit && errors.bussinessUnit}
                  />
                  <CustomInput
                    label="Exposure Ref Number"
                    name="exposureRefNumber"
                    placeholder="Enter Bank Name"
                    value={values.exposureRefNumber}
                    onChange={handleChange}
                    error={touched.exposureRefNumber && errors.exposureRefNumber}
                  />

{/* 
                  <CustomInput
                    label="Deal ID"
                    name="dealId"
                    placeholder="Enter Deal ID"
                    value={values.dealId}
                    onChange={handleChange}
                    error={touched.dealId && errors.dealId}
                  /> */}

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
                    label="Hedge Deal Reference Number"
                    name="hedgeDealReferenceNumber"
                    placeholder="Enter Deal Reference Number"
                    value={values.hedgeDealReferenceNumber}
                    onChange={handleChange}
                    error={touched.hedgeDealReferenceNumber && errors.hedgeDealReferenceNumber}
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
                
                </SimpleGrid>
                <Flex justify={"end"}>
                 <Button
                    rounded={'full'}
                    fontWeight={500}
                    _hover={{
                      bg: 'blue.600',
                      color: 'white',
                      transform: 'translateY(-2px)',
                    }}
                    transition={'transform 0.3s ease-in-out'}
                    bg={'blue.500'}
                    shadow={'xl'}
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
