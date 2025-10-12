import { Box, Button, Flex, SimpleGrid, VStack } from "@chakra-ui/react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import CustomInput from "../../../../config/component/CustomInput/CustomInput";
import {
  primaryButtonHoverStyle,
  primaryButtonStyle,
} from "../../../../globalStyles";

const forwardDeals = [
  {
    poNumber:"PO123456",
    forwardDealId: "FDL-001",
    exposureType: "Export",
    bank: "HDFC Bank",
    currency: "USD",
    outstandingAmount: "50000",
    bookedRate: "83.25",
    deliveryDateFrom: "2025-10-10",
    deliveryDateTo: "2025-12-10",
    bankMargin: "0.5",
  },
  {
    poNumber:"PO123456",
    forwardDealId: "FDL-002",
    exposureType: "Import",
    bank: "ICICI Bank",
    currency: "EUR",
    outstandingAmount: "30000",
    bookedRate: "89.45",
    deliveryDateFrom: "2025-11-01",
    deliveryDateTo: "2025-12-20",
    bankMargin: "0.7",
  },
];

const ForwardCancellationForm = ({ submitForm }: any) => {
  const validationSchema = Yup.object().shape({
    transactionDate: Yup.string().required("Transaction Date is required"),
    forwardDealId: Yup.string().required("Forward Deal ID is required"),
    cancellationAmount: Yup.string().required("Cancellation Amount is required"),
    spotBooked: Yup.string().required("Spot Booked is required"),
    fwdPremium: Yup.string().required("Forward Premium is required"),
    cashTomSpot: Yup.string().required("Cash Tom Spot is required"),
  });

  const initialValues = {
    transactionDate: "",
    forwardDealId: "",
    exposureType: "",
    bank: "",
    currency: "",
    outstandingAmount: "",
    bookedRate: "",
    deliveryDateFrom: "",
    deliveryDateTo: "",
    bankMargin: "",
    cancellationAmount: "",
    spotBooked: "",
    fwdPremium: "",
    cashTomSpot: "",
  };

  return (
    <Box bg="whiteAlpha.700" py={4}>
      <Box maxW="5xl" mx="auto" px={2}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={(values, actions) => {
            console.log("Submitted Values:", values);
            submitForm(values, actions, "form");
            actions.setSubmitting(false);
          }}
        >
          {({ values, handleChange, setFieldValue, isSubmitting, errors, touched }) => (
            <FormikForm>
              <VStack spacing={6} align="stretch">
                <SimpleGrid columns={[1, null, 2]} spacing={8}>
                  
                  {/* Transaction Date */}
                  <CustomInput
                    label="Transaction Date"
                    name="transactionDate"
                    type="date"
                    value={values.transactionDate}
                    onChange={handleChange}
                    required
                    error={touched.transactionDate && errors.transactionDate}
                  />

                  {/* Forward Deal ID Dropdown */}
                  <CustomInput
                    label="Forward Deal ID"
                    name="forwardDealId"
                    type="select"
                    options={forwardDeals.map((deal) => ({
                      label: deal.forwardDealId,
                      value: deal.forwardDealId,
                    }))}
                    value={
                      forwardDeals.find((d) => d.forwardDealId === values.forwardDealId)
                        ? {
                            label: values.forwardDealId,
                            value: values.forwardDealId,
                          }
                        : null
                    }
                    onChange={(option: any) => {
                      const selected = forwardDeals.find(
                        (deal) => deal.forwardDealId === option.value
                      );
                      if (selected) {
                        // auto fill fields
                        Object.keys(selected).forEach((key) => {
                          setFieldValue(key, (selected as any)[key]);
                        });
                      }
                      setFieldValue("forwardDealId", option.value);
                    }}
                    error={touched.forwardDealId && errors.forwardDealId}
                  />

                  <CustomInput label="Exposure Type" name="exposureType" value={values.exposureType} disabled />
                  <CustomInput label="Bank" name="bank" value={values.bank} disabled />
                  <CustomInput label="Currency" name="currency" value={values.currency} disabled />
                  <CustomInput label="Outstanding Amount" name="outstandingAmount" value={values.outstandingAmount} disabled />
                  <CustomInput label="Booked Rate" name="bookedRate" value={values.bookedRate} disabled />
                  <CustomInput label="Delivery Date From" name="deliveryDateFrom" value={values.deliveryDateFrom} disabled />
                  <CustomInput label="Delivery Date To" name="deliveryDateTo" value={values.deliveryDateTo} disabled />
                  <CustomInput label="Bank Margin" name="bankMargin" value={values.bankMargin} disabled />

                  <CustomInput
                    label="Cancellation Amount"
                    name="cancellationAmount"
                    placeholder="Enter Cancellation Amount"
                    value={values.cancellationAmount}
                    onChange={handleChange}
                    error={touched.cancellationAmount && errors.cancellationAmount}
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
                    label="Forward Premium"
                    name="fwdPremium"
                    placeholder="Enter Forward Premium"
                    value={values.fwdPremium}
                    onChange={handleChange}
                    error={touched.fwdPremium && errors.fwdPremium}
                  />

                  <CustomInput
                    label="Cash/Tom Spot"
                    name="cashTomSpot"
                    placeholder="Enter Cash/Tom Spot"
                    value={values.cashTomSpot}
                    onChange={handleChange}
                    error={touched.cashTomSpot && errors.cashTomSpot}
                  />
                </SimpleGrid>

                <Flex justify="end">
                  <Button
                    rounded="full"
                    fontWeight={500}
                    {...primaryButtonStyle}
                    _hover={{ ...primaryButtonHoverStyle, border: "1px solid" }}
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
