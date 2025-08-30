import {
  Box,
  Button,
  Divider,
  Flex,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import CustomInput from "../../../../config/component/CustomInput/CustomInput";
import { currencyOptions, exportRegisterexposureTypeOptions } from "./utils/constant";
import { useState } from "react";

const ExposureForm = ({ submitExportForm }: any) => {
  const [showError, setShowError] = useState(false);

  // const validationSchema = Yup.object({
  //   exposureType: Yup.mixed().required("Exposure Type is required"),
  //   exposureInputDate: Yup.string().required("Exposure Input Date is required"),
  //   poDate: Yup.string().required("PO Date is required"),
  //   poNo: Yup.string().required("PO No is required"),
  //   invoiceNo: Yup.string().required("Invoice No is required"),
  //   invoiceDate: Yup.string().required("Invoice Date is required"), 
  //   exposureModificationDate: Yup.string().required(
  //     "Exposure Modification Date is required"
  //   ),
  //   partyName: Yup.string().required("Party Name is required"),
  //   bank: Yup.string().required("Bank is required"),
  //   businessUnit: Yup.string().required("Business Unit is required"), 
  //   blDate: Yup.string().required("BL Date is required"),
  //   currency: Yup.mixed().required("Currency is required"),
  //   amount: Yup.string().required("Amount is required"),
  //   budgetRate: Yup.string().nullable(),
  //   paymentTerms: Yup.string().required("Payment terms is required"),
  //   hedgeRefNo: Yup.string().nullable(), 
  //   remark: Yup.string().nullable(),
  // });

  const validationSchema = Yup.object({
  exposureType: Yup.mixed().required("Exposure Type is required"),
  exposureInputDate: Yup.string().required("Exposure Input Date is required"),
  exposureModificationDate: Yup.string().required("Exposure Modification Date is required"),
  poDate: Yup.string().required("PO Date is required"),
  poNo: Yup.string().required("PO No is required"),
  invoiceNo: Yup.string().required("Invoice No is required"),
  invoiceDate: Yup.string().required("Invoice Date is required"),
  partyName: Yup.string().required("Party Name is required"),
  bank: Yup.string().required("Bank is required"),
  businessUnit: Yup.string().required("Business Unit is required"),
  blDate: Yup.string().required("BL Date is required"),
  paymentTerms: Yup.string().required("Payment terms is required"),
  currency: Yup.mixed().required("Currency is required"),
  amount: Yup.number().required("Amount is required"),
  budgetRate: Yup.string().required("Budget Rate is required"),
  hedgeDealRefNo: Yup.string().required("Hedge Deal Ref No is required"),
  remark: Yup.string().nullable()
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
        initialValues={{
          exposureType: "",
          exposureInputDate: "",
          poDate: "",
          poNo: "",
          invoiceNo: "",
          invoiceDate: "",
          exposureModificationDate: "",
          partyName: "",
          bank: "",
          businessUnit: "",
          blDate: "",
          currency: "",
          amount: "",
          budgetRate: "",
          paymentTerms: "",
          hedgeDealRefNo: "",
          remark: "",
        }}
        validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={(values, actions) => {
          setShowError(true);
          submitExportForm(values, actions, "form");
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
                  options={exportRegisterexposureTypeOptions}
                  value={exportRegisterexposureTypeOptions.find(
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
                  showError={showError}
                  error={touched.exposureType && errors.exposureType}
                />

                <CustomInput
                  label="Exposure Input Date"
                  name="exposureInputDate"
                  type="date"
                  value={values.exposureInputDate}
                  onChange={handleChange}
                  error={touched.exposureInputDate && errors.exposureInputDate}
                  showError={showError}
                />
                <CustomInput
                  label="PO Date"
                  name="poDate"
                  type="date"
                  placeholder="PO Date"
                  value={values.poDate}
                  onChange={handleChange}
                  error={touched.poDate && errors.poDate}
                  showError={showError}
                />
                <CustomInput
                  label="BL Date"
                  name="blDate"
                  type="date"
                  value={values.blDate}
                  onChange={handleChange}
                  error={touched.blDate && errors.blDate}
                  showError={showError}
                />

                <CustomInput
                  label="Amount"
                  name="amount"
                  type="number"
                  value={values.amount}
                  onChange={handleChange}
                  error={touched.amount && errors.amount}
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
                  showError={showError}
                />
                <CustomInput
                  label="Budget Rate"
                  name="budgetRate"
                  type="text"
                  value={values.budgetRate}
                  onChange={handleChange}
                  error={touched.budgetRate && errors.budgetRate}
                  showError={showError}
                />

                <CustomInput
                  label="PO No"
                  placeholder="Enter PO No"
                  name="poNo"
                  value={values.poNo}
                  onChange={handleChange}
                  error={touched.poNo && errors.poNo}
                  showError={showError}
                />
                <CustomInput
                  label="Invoice No"
                  name="invoiceNo"
                  placeholder="Enter Invoice No"
                  value={values.invoiceNo}
                  onChange={handleChange}
                  error={touched.invoiceNo && errors.invoiceNo}
                  showError={showError}
                />
                <CustomInput
                  label="Invoice Date"
                  name="invoiceDate"
                  type="date"
                  placeholder="Invoice Date"
                  value={values.invoiceDate}
                  onChange={handleChange}
                  error={touched.invoiceDate && errors.invoiceDate}
                  showError={showError}
                />
                <CustomInput
                  label="Exposure Modification Date"
                  name="exposureModificationDate"
                  placeholder="Exposure Modification Date"
                  type="date"
                  value={values.exposureModificationDate}
                  onChange={handleChange}
                  error={
                    touched.exposureModificationDate &&
                    errors.exposureModificationDate
                  }
                  showError={showError}
                />
                <CustomInput
                  label="Party Name"
                  name="partyName"
                  placeholder="Enter Party Name"
                  value={values.partyName}
                  onChange={handleChange}
                  error={touched.partyName && errors.partyName}
                  showError={showError}
                />
                <CustomInput
                  label="Bank"
                  name="bank"
                  placeholder="Enter Bank"
                  value={values.bank}
                  onChange={handleChange}
                  error={touched.bank && errors.bank}
                  showError={showError}
                />
                <CustomInput
                  label="Payment Terms"
                  name="paymentTerms"
                  placeholder="Terms"
                  value={values.paymentTerms}
                  onChange={handleChange}
                  error={touched.paymentTerms && errors.paymentTerms}
                  showError={showError}
                />
                <CustomInput
                  label="Business Units"
                  name="businessUnit"
                  placeholder="Units"
                  value={values.businessUnit}
                  onChange={handleChange}
                  error={touched.businessUnit && errors.businessUnit}
                  showError={showError}
                />
                <CustomInput
                  label="Hedge Reference No."
                  name="hedgeDealRefNo"
                  placeholder="Units"
                  value={values.hedgeDealRefNo}
                  onChange={handleChange}
                  error={touched.hedgeDealRefNo && errors.hedgeDealRefNo}
                  showError={showError}
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
                showError={showError}
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
                  transition={"transform 0.3s ease-in-out"}
                  bg={"blue.500"}
                  color={"white"}
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
