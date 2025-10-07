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
import {
  currencyOptions,
  exportRegisterexposureTypeOptions,
} from "./utils/constant";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  primaryButtonHoverStyle,
  primaryButtonStyle,
} from "../../../../globalStyles";

const ExposureForm = ({ submitExportForm }: any) => {
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(true);
  // const exportRegAllDataList: any = [
  //   {
  //     poNo: "123",
  //     poDate: "08/06/2001",
  //     partyName: "first party",
  //     bank: "first bank",
  //     businessUnit: "unit 1",
  //     paymentTerms: "30 days",
  //     currency: "USD",
  //     budgetRate: "75.00",
  //   },
  //   {
  //     poNo: "123456",
  //     poDate: "08/06/2001",
  //     partyName: "Second party",
  //     bank: "Second bank",
  //     businessUnit: "unit 2",
  //     paymentTerms: "50 days",
  //     currency: "INR",
  //     budgetRate: "85.00",
  //   },
  // ];

  const [poData, setPoData] = useState<any[]>([]);
  const url = process.env.REACT_APP_FX_BASE_URL;

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
    // exposureInputDate: Yup.string().required("Exposure Input Date is required"),
    // exposureModificationDate: Yup.string().required(
    //   "Exposure Modification Date is required"
    // ),
    poDate: Yup.string().required("PO Date is required"),
    poNo: Yup.string().required("PO No is required"),
    // invoiceNo: Yup.string().required("Invoice No is required"),
    // invoiceDate: Yup.string().required("Invoice Date is required"),
    invoiceNo: Yup.string().when("exposureType", {
      is: (val: string) => val !== "confirmed_order",
      then: (schema) => schema.required("Invoice No is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    invoiceDate: Yup.date().when("exposureType", {
      is: (val: string) => val !== "confirmed_order",
      then: (schema) => schema.required("Invoice Date is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    partyName: Yup.string().required("Party Name is required"),
    bank: Yup.string().required("Bank is required"),
    businessUnit: Yup.string().required("Business Unit is required"),
    blDate: Yup.string().required("BL Date is required"),
    paymentTerms: Yup.string().required("Payment terms is required"),
    currency: Yup.mixed().required("Currency is required"),
    amount: Yup.number().required("Amount is required"),
    budgetRate: Yup.string().required("Budget Rate is required"),
    hedgeDealRefNo: Yup.string().required("Hedge Deal Ref No is required"),
    remark: Yup.string().nullable(),
    dueDate: Yup.string().required("Due Date is required"),
  });
  const fetchPoDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${url}/exportregister/polist/`);
      const result = response.data?.data || [];
      const withSerial = result.map((item: any, idx: number) => ({
        ...item,
        sno: idx + 1,
      }));
      const exportRegOptions = withSerial.map((item: any) => ({
        label: item.poNo, // 👈 choose what you want to display
        value: item.poNo, // or item.poNo if unique
        ...item,
      }));
      setLoading(false);
      setPoData(exportRegOptions);
    } catch (error) {
      setPoData([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPoDetails();
  }, []);

  return (
    <Box maxW="5xl" mx="auto" borderRadius="2xl">
      {!loading && (
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
            dueDate: "",
          }}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={(values, actions) => {
            setShowError(true);
            submitExportForm(values, actions, "form");
          }}
        >
          {({
            values,
            handleChange,
            setFieldValue,
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
                    options={exportRegisterexposureTypeOptions}
                    value={exportRegisterexposureTypeOptions.find(
                      (option) => option.value === values.exposureType
                    )}
                    // onChange={(option) => setFieldValue("exposureType", option)}
                    onChange={(selectedOption) => {
                      handleChange({
                        target: {
                          name: "exposureType",
                          value: selectedOption.value,
                        },
                      });

                      // 👇 Moved the 'if' condition inside the function body
                      if (selectedOption.value === "confirmed_order") {
                        setFieldValue("poNo", "");
                      }
                    }}
                    showError={showError}
                    error={touched.exposureType && errors.exposureType}
                    required={true}
                  />

                  {values.exposureType === "confirmed_order" ? (
                    <CustomInput
                      label="PO No"
                      placeholder="Enter PO No"
                      name="poNo"
                      type="text"
                      value={values.poNo}
                      onChange={handleChange}
                      error={touched.poNo && errors.poNo}
                      showError={showError}
                      required={true}
                    />
                  ) : (
                    <CustomInput
                      label="PO No"
                      placeholder="Select PO No"
                      name="poNo"
                      type="select"
                      options={poData}
                      required={true}
                      value={poData.find(
                        (option: any) => option.value === values.poNo
                      )}
                      onChange={(selectedOption) => {
                        const selectedPo = poData.find(
                          (item: any) => item.poNo === selectedOption.value
                        );

                        if (selectedPo) {
                          setFieldValue("poNo", selectedPo.poNo);
                          setFieldValue("poDate", selectedPo.poDate);
                          setFieldValue("partyName", selectedPo.partyName);
                          setFieldValue("bank", selectedPo.bank);
                          setFieldValue(
                            "businessUnit",
                            selectedPo.businessUnit
                          );
                          setFieldValue(
                            "paymentTerms",
                            selectedPo.paymentTerms
                          );
                          setFieldValue("currency", selectedPo.currency);
                          setFieldValue("budgetRate", selectedPo.budgetRate);
                        }
                      }}
                      error={touched.poNo && errors.poNo}
                      showError={showError}
                    />
                  )}
                  <CustomInput
                    label="PO Date"
                    name="poDate"
                    type="date"
                    placeholder="PO Date"
                    value={values.poDate}
                    onChange={handleChange}
                    error={touched.poDate && errors.poDate}
                    showError={showError}
                    required={true}
                  />
                  <CustomInput
                    label="Party Name"
                    name="partyName"
                    placeholder="Enter Party Name"
                    value={values.partyName}
                    onChange={handleChange}
                    error={touched.partyName && errors.partyName}
                    showError={showError}
                    required={true}
                  />
                  <CustomInput
                    label="Bank"
                    name="bank"
                    placeholder="Enter Bank"
                    value={values.bank}
                    onChange={handleChange}
                    error={touched.bank && errors.bank}
                    showError={showError}
                    required={true}
                  />
                  <CustomInput
                    label="Business Units"
                    name="businessUnit"
                    placeholder="Units"
                    value={values.businessUnit}
                    onChange={handleChange}
                    error={touched.businessUnit && errors.businessUnit}
                    showError={showError}
                    required={true}
                  />
                  <CustomInput
                    label="Invoice No"
                    name="invoiceNo"
                    placeholder="Enter Invoice No"
                    value={values.invoiceNo}
                    onChange={handleChange}
                    error={touched.invoiceNo && errors.invoiceNo}
                    showError={showError}
                    required={
                      values.exposureType &&
                      values.exposureType !== "confirmed_order"
                    }
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
                    required={
                      values.exposureType &&
                      values.exposureType !== "confirmed_order"
                    }
                  />
                  <CustomInput
                    label="BL Date"
                    name="blDate"
                    type="date"
                    value={values.blDate}
                    onChange={handleChange}
                    error={touched.blDate && errors.blDate}
                    showError={showError}
                    required={true}
                  />

                  <CustomInput
                    label="Payment Terms"
                    name="paymentTerms"
                    placeholder="Terms"
                    value={values.paymentTerms}
                    onChange={handleChange}
                    error={touched.paymentTerms && errors.paymentTerms}
                    showError={showError}
                    required={true}
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
                    required={true}
                  />
                  <CustomInput
                    label="Amount"
                    name="amount"
                    type="number"
                    value={values.amount}
                    onChange={handleChange}
                    error={touched.amount && errors.amount}
                    showError={showError}
                    required={true}
                  />
                  <CustomInput
                    label="Budget Rate"
                    name="budgetRate"
                    type="text"
                    value={values.budgetRate}
                    onChange={handleChange}
                    error={touched.budgetRate && errors.budgetRate}
                    showError={showError}
                    required={true}
                  />
                  <CustomInput
                    label="Hedge Reference No."
                    name="hedgeDealRefNo"
                    placeholder="Hedge Reference No."
                    value={values.hedgeDealRefNo}
                    onChange={handleChange}
                    error={touched.hedgeDealRefNo && errors.hedgeDealRefNo}
                    showError={showError}
                    required={true}
                  />

                  {/* <CustomInput
                    label="Exposure Input Date"
                    name="exposureInputDate"
                    type="date"
                    value={values.exposureInputDate}
                    onChange={handleChange}
                    error={
                      touched.exposureInputDate && errors.exposureInputDate
                    }
                    showError={showError}
                    required={true}
                  /> */}

                  {/* <CustomInput
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
                    required={true}
                  /> */}
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
      )}
    </Box>
  );
};

export default ExposureForm;
