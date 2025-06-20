import {
  Box,
  Button,
  Divider,
  Flex,
  SimpleGrid,
  VStack
} from "@chakra-ui/react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import CustomInput from "../../../../config/component/CustomInput/CustomInput";
import {
  currencyOptions,
  exposureTypeOptions,
  priorityOptions,
} from "./utils/constant";

const ExposureForm = ({submitExportForm} : any) => {

  const validationSchema = Yup.object({
    exposureType: Yup.mixed().required("Exposure Type is required"),
    exposureInputDate: Yup.string().required("Exposure Input Date is required"),
    poDate: Yup.string().required("PO Date is required"),
    adjustmentAmount: Yup.string().required("Adjustment Amount is required"),
    blDate: Yup.string().required("BL Date is required"),
    collectionDate: Yup.string().required("Collection Date is required"),
    amount: Yup.string()
      .required("Amount is required"),
    bookedForwardRate: Yup.string()
      .required("Amount is required"),
    currency: Yup.mixed().required("Currency is required"),
    budgetRate: Yup.string().nullable(),
    hedgedAmount: Yup.string().nullable(),
    poNo: Yup.string().required("PO No is required"),
    invoiceNo: Yup.string().required("Invoice No is required"),
    partyName: Yup.string().required("Party Name is required"),
    priority: Yup.mixed().required("Priority is required"),
    paymentTerms: Yup.string().required("Payment terms is required"),
    bank: Yup.string().required("Bank is required"),
    remark: Yup.string().nullable(),
  });

  

  return (
      <Box
        maxW="5xl"
        mx="auto"
        p={8}
        borderRadius="2xl"
        bg="whiteAlpha.900"
        boxShadow="xl"
      >
        <Formik
          initialValues={{}}
          validationSchema={validationSchema}
          enableReinitialize={true}
          // onSubmit={(values, actions) => {
          //   console.log(values);
          //   // alert('Form submitted successfully!');
          //   actions.setSubmitting(false);
          // }}
          onSubmit={(values, actions) =>{
            // console.log('values',values)
            submitExportForm(values, actions,"form");
          }}
        >
          {({
            values,
            handleChange,
            isSubmitting,
            errors,
            touched,
          }: any) => (
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
                      (option) => option.value === values.exposureType
                    )}
                    // onChange={(option) => setFieldValue("exposureType", option)}
                    onChange={(selectedOption) =>
                      handleChange({
                        target: {
                          name: "exposureType",
                          value: selectedOption.value,
                        },
                      })
                    }
                    error={touched.exposureType && errors.exposureType}
                  />

                  <CustomInput
                    label="Exposure Input Date"
                    name="exposureInputDate"
                    type="date"
                    value={values.exposureInputDate}
                    onChange={handleChange}
                    error={
                      touched.exposureInputDate && errors.exposureInputDate
                    }
                  />
                  <CustomInput
                    label="PO Date"
                    name="poDate"
                    type="date"
                    value={values.poDate}
                    onChange={handleChange}
                    error={touched.poDate && errors.poDate}
                  />
                  <CustomInput
                    label="BL Date"
                    name="blDate"
                    type="date"
                    value={values.blDate}
                    onChange={handleChange}
                    error={touched.blDate && errors.blDate}
                  />
                  <CustomInput
                    label="Collection Date"
                    name="collectionDate"
                    type="date"
                    value={values.collectionDate}
                    onChange={handleChange}
                    error={touched.collectionDate && errors.collectionDate}
                  />
                  <CustomInput
                    label="Amount"
                    name="amount"
                    type="text"
                    value={values.amount}
                    onChange={handleChange}
                    error={touched.amount && errors.amount}
                  />
                  <CustomInput
                    label="Adjustment Amount"
                    name="adjustmentAmount"
                    type="text"
                    value={values.adjustmentAmount}
                    onChange={handleChange}
                    error={touched.adjustmentAmount && errors.adjustmentAmount}
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
                    label="Budget Rate"
                    name="budgetRate"
                    type="text"
                    value={values.budgetRate}
                    onChange={handleChange}
                    error={touched.budgetRate && errors.budgetRate}
                  />
                  <CustomInput
                    label="Hedged Amount"
                    name="hedgedAmount"
                    type="text"
                    value={values.hedgedAmount}
                    onChange={handleChange}
                    error={touched.hedgedAmount && errors.hedgedAmount}
                  />
                  <CustomInput
                    label="PO No"
                    name="poNo"
                    placeholder="Enter PO No"
                    value={values.poNo}
                    onChange={handleChange}
                    error={touched.poNo && errors.poNo}
                  />
                  <CustomInput
                    label="Invoice No"
                    name="invoiceNo"
                    placeholder="Enter Invoice No"
                    value={values.invoiceNo}
                    onChange={handleChange}
                    error={touched.invoiceNo && errors.invoiceNo}
                  />
                  <CustomInput
                    label="Party Name"
                    name="partyName"
                    placeholder="Enter Party Name"
                    value={values.partyName}
                    onChange={handleChange}
                    error={touched.partyName && errors.partyName}
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
                    label="Payment Terms"
                    name="paymentTerms"
                    placeholder="Terms"
                    value={values.paymentTerms}
                    onChange={handleChange}
                    error={touched.paymentTerms && errors.paymentTerms}
                  />
                  <CustomInput
                    label="Forword Contract No"
                    name="forwardContractNo"
                    placeholder="Contract No"
                    value={values.forwardContractNo}
                    onChange={handleChange}
                    error={
                      touched.forwardContractNo && errors.forwardContractNo
                    }
                  />
                  <CustomInput
                    label="Booked Forward Rate"
                    name="bookedForwardRate"
                    type="text"
                    placeholder=""
                    value={values.bookedForwardRate}
                    onChange={handleChange}
                    error={
                      touched.bookedForwardRate && errors.bookedForwardRate
                    }
                  />
                  <CustomInput
                    label="Priority"
                    name="priority"
                    type="select"
                    options={priorityOptions}
                    value={priorityOptions.find(
                      (option) => option.value === values.priority
                    )}
                    // onChange={(option) => setFieldValue("exposureType", option)}
                    onChange={(selectedOption) =>
                      handleChange({
                        target: {
                          name: "priority",
                          value: selectedOption.value,
                        },
                      })
                    }
                    error={touched.priority && errors.priority}
                  />
                </SimpleGrid>
                <CustomInput
                  label="Remark"
                  name="remark"
                  type="textarea"
                  placeholder="Enter Remarks"
                  value={values.remark}
                  onChange={handleChange}
                  error={touched.remark && errors.remark}
                />
                <Flex justify={"end"}>
                  <Button
                    rounded={"full"}
                    
                    fontWeight={500}
                    _hover={{
                      bg: "blue.600",
                      color: "white",
                      transform: "translateY(-2px)",
                    }}
                    // onClick={submitExportForm}
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
  );
};

export default ExposureForm;
