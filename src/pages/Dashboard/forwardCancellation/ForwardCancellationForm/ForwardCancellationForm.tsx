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
import CustomInput from "../../../../config/component/CustomInput/CustomInput";
import {
  dealTypeOptions
} from "../../exportsRegister/component/utils/constant";

const ForwardCancellationForm = ({submitForm}:any) => {
  // const validationSchema = Yup.object({
  //   dealType: Yup.string().required("Deal Type is required"),//
  //   transactionDate: Yup.string().required("Transaction Date is required"),//
  //   forwardDealId: Yup.string().required("Forward Deal ID is required"),//
  //   pcfcRefNumber: Yup.string().required("PCFC Reference Number is required"),//
  //   amount: Yup.string()//
  //     .required("Amount is required"),
  //   spotBooked: Yup.string()//
  //     .required("Spot Booked is required"),
  //   forwardPremium: Yup.string()//
  //     .required("Forward Premium is required"),
  //   cashTomSpot: Yup.string()//
  //     .required("Cash Tom Spot is required"),
  //   bankMargin: Yup.string()//
  //     .required("Bank Margin is required"),
  // });
  

  const validationSchema = Yup.object().shape({
  transactionDate: Yup.string().required("Transaction Date is required"),
  dealType: Yup.string().required("Deal Type is required"),
  forwardDealId: Yup.string().required("Forward Deal ID is required"),
  pcfcRefNumber: Yup.string().required("PCFC Reference Number is required"),
  amount: Yup.string().required("Amount is required"),
  spotBooked: Yup.string().required("Spot Booked is required"),
  forwardPremium: Yup.string().required("Forward Premium is required"),
  cashTomSpot: Yup.string().required("Cash Tom Spot is required"),
  bankMargin: Yup.string().required("Bank Margin is required"),
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
          objectFit="fill"

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
          Forward Cancellation anf PCFC
        </Heading>
        <Formik
          initialValues={{}}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={(values: any, actions : any) => {
            console.log('values',values)
            submitForm(values,actions,"form");
            actions.setSubmitting(false);
          }}
        >
          {({ values, handleChange, isSubmitting, errors, touched }: any) => (
            <FormikForm>
              <VStack spacing={6} align="stretch">
                <Divider mb={4} />
                <SimpleGrid columns={[1, null, 2]} spacing={8}>
                  {/* <CustomInput
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
                  /> */}

                  <CustomInput
                    label="Deal Type"
                    name="dealType"
                    type="select"
                    options={dealTypeOptions}
                    value={dealTypeOptions.find(
                      (opt) => opt.value === values.dealType
                    )}
                    onChange={(option) =>
                      handleChange({
                        target: { name: "dealType", value: option.value },
                      })
                    }
                    error={touched.dealType && errors.dealType}
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
                    label="Forward Deal ID"
                    name="forwardDealId"
                    placeholder="Enter Forward Deal ID"
                    value={values.forwardDealId}
                    onChange={handleChange}
                    error={touched.forwardDealId && errors.forwardDealId}
                  />

                  {/* <CustomInput
                    label="Bank"
                    name="bank"
                    placeholder="Enter Bank"
                    value={values.bank}
                    onChange={handleChange}
                    error={touched.bank && errors.bank}
                  /> */}

                  <CustomInput
                    label="PCFC Reference Number"
                    name="pcfcRefNumber"
                    placeholder="Enter PCFC Reference Number"
                    value={values.pcfcRefNumber}
                    onChange={handleChange}
                    error={touched.pcfcRefNumber && errors.pcfcRefNumber}
                  />

                  {/* <CustomInput
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
                  /> */}

                  <CustomInput
                    label="Amount"
                    name="amount"
                    placeholder="Enter Amount"
                    value={values.amount}
                    onChange={handleChange}
                    error={touched.amount && errors.amount}
                  />

                  {/* <CustomInput
                    label="Booked Rate"
                    name="bookedRate"
                    placeholder="Enter Booked Rate"
                    value={values.bookedRate}
                    onChange={handleChange}
                    error={touched.bookedRate && errors.bookedRate}
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
                    label="Forward Premium"
                    name="forwardPremium"
                    placeholder="Enter Forward Premium"
                    value={values.forwardPremium}
                    onChange={handleChange}
                    error={touched.forwardPremium && errors.forwardPremium}
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

export default ForwardCancellationForm;
