import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { Formik, Form as FormikForm } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import CustomInput from "../../../../config/component/CustomInput/CustomInput";
import Loader from "../../../../config/component/Loader/Loader";
import {
  primaryButtonHoverStyle,
  primaryButtonStyle,
} from "../../../../globalStyles";
import {
  dummyHedgeDeals,
  hedgeDealOptions,
} from "../../importsRegister/component/utils/constant";
import { banks } from "../../pcfc/components/PCFCForm/dummyData";
import {
  currencyOptions,
  dummyExporPOtData,
  exportRegisterexposureTypeOptions,
} from "./utils/constant";

const ExposureForm = ({ submitExportForm }: any) => {
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [_, setSubmitAttempted] = useState(false);
  const [poData, setPoData] = useState<any[]>([]);
  const url = process.env.REACT_APP_FX_BASE_URL;
  const [selectedExposureType, setSelectedExposureType] = useState<string>("");
  const toast = useToast();

  const validationSchema = Yup.object({
    exposureType: Yup.mixed().required("Exposure Type is required"),
    poDate: Yup.string().required("PO Date is required"),
    poNo: Yup.string().required("PO No is required"),
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
    paymentTerms: Yup.number().required("Payment terms is required"),
    currency: Yup.mixed().required("Currency is required"),
    // amount: Yup.number().required("Amount is required"),

  amount: Yup.number()
  .required("Amount is required")
  .when(["exposureType", "outStandingAmount"], {
    is: (exposureType: string, outStandingAmount: any) =>
      exposureType === "shipment" && !!outStandingAmount,
    then: (schema) =>
      schema.test(
        "max-outStandingAmount",
        function (value) {
          const { outStandingAmount } = this.parent;
          if (value && outStandingAmount && value > outStandingAmount) {
            return this.createError({
              message: `Amount must be less than or equal to Outstanding Amount (${outStandingAmount})`,
            });
          }
          return true;
        }
      ),
    otherwise: (schema) => schema,
  }),


// amount: Yup.number()
//   .required("Amount is required")
//   .when(["exposureType", "outStandingAmount"], {
//     is: (exposureType: string, outStandingAmount: number) =>
//       exposureType === "shipment" && !!outStandingAmount,
//     then: (schema) =>
//       schema.max(
//         Yup.ref("outStandingAmount"),
//         "Amount must be less than or equal to Outstanding Amount"
//       ),
//     otherwise: (schema) => schema,
//   }),




    budgetRate: Yup.string().required("Budget Rate is required"),
    // dueDate: Yup.string().required("Due Date is required"),
   dueDate: Yup.date()
  .transform((value, originalValue) => {
    return originalValue ? new Date(originalValue) : value;
  })
  .required("Due Date is required")
  .when("blDate", (blDate: any, schema: any) => {
    const dateValue = Array.isArray(blDate) ? blDate[0] : blDate;
    return dateValue
      ? schema.min(new Date(dateValue), "Due Date must be after BL Date")
      : schema;
  }),
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
        label: item.poNo,
        value: item.poNo,
        ...item,
      }));

      // ✅ Use API data if available, else dummy data
      if (exportRegOptions.length > 0) {
        setPoData(exportRegOptions);
      } else {
        setPoData(
          dummyExporPOtData.map((item: any) => ({
            ...item,
            label: item.poNo,
            value: item.poNo,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching PO details:", error);
      // ✅ Fallback to dummy data on error
      setPoData(
        dummyExporPOtData.map((item: any) => ({
          ...item,
          label: item.poNo,
          value: item.poNo,
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoDetails();
  }, []);

  const handleFormSubmit = (handleSubmit: any, errors: any) => {
    setShowError(true);
    setSubmitAttempted(true);

    // Check if there are errors
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
    <Box maxW="5xl" mx="auto" borderRadius="2xl">
      {loading && <Loader />}
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
            outstandingAmount: "",
            balanceAmount: "",
            hedgeAmount:"",
            hedgeRate:"",
            deliveryDateFrom:"",
            deliveryDateTo:""
            // outStandingAmount: "",

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
            handleSubmit,
          }: any) => (
            <FormikForm>
              <VStack spacing={6} align="stretch">
                <SimpleGrid columns={[1, null, 2]} spacing={8}>
                  <CustomInput
                    label="Exposure Type"
                    name="exposureType"
                    type="select"
                    options={exportRegisterexposureTypeOptions}
                    value={exportRegisterexposureTypeOptions.find(
                      (option) => option.value === values.exposureType
                    )}
                    onChange={(selectedOption) => {
                      handleChange({
                        target: {
                          name: "exposureType",
                          value: selectedOption.value,
                        },
                      });

                      // 👇 Moved the 'if' condition inside the function body
                      // if (selectedOption.value === "confirmed_order") {
                      //   setFieldValue("poNo", "");
                      // }
                      if (selectedOption.value === "confirmed_order") {
                        setFieldValue("poNo", "");
                        setFieldValue("poDate", "");
                        setFieldValue("partyName", "");
                        setFieldValue("bank", "");
                        setFieldValue("businessUnit", "");
                        setFieldValue("paymentTerms", "");
                        setFieldValue("currency", "");
                        setFieldValue("budgetRate", "");
                      } else {
                        // Clear fields when switching to other types
                        setFieldValue("poNo", "");
                        setFieldValue("poDate", "");
                        setFieldValue("partyName", "");
                        setFieldValue("bank", "");
                        setFieldValue("businessUnit", "");
                        setFieldValue("paymentTerms", "");
                        setFieldValue("currency", "");
                        setFieldValue("budgetRate", "");
                      }
                      setSelectedExposureType(selectedOption.value);
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
                      // map poData to { value, label } objects for the select
                      options={poData.map((po: any) => ({
                        value: po.poNo,
                        label: po.poNo,
                      }))}
                      required={true}
                      // set the value as { value, label } object
                      value={
                        values.poNo
                          ? { value: values.poNo, label: values.poNo }
                          : null
                      }
                      onChange={(selectedOption: any) => {
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
                        setFieldValue("outStandingAmount", selectedPo.outStandingAmount || 0);


                        }
                      }}
                      error={touched.poNo && errors.poNo}
                      showError={showError}
                    />
                  )}
                  <CustomInput
                    label="PO Date"
                    name="poDate"
                    type={selectedExposureType === "shipment" ? "text" : "date"}
                    placeholder="PO Date"
                    value={values.poDate}
                    onChange={handleChange}
                    error={touched.poDate && errors.poDate}
                    showError={showError}
                    required={true}
                    disabled={selectedExposureType === "shipment"}
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
                    disabled={selectedExposureType === "shipment"}
                  />
                  {selectedExposureType === "shipment" ? (
                    <CustomInput
                      label="Bank"
                      // type="select"
                      name="bank"
                      placeholder="Enter Bank Name"
                      // options={banks}
                      value={values.bank}
                      onChange={handleChange}
                      error={touched.bank && errors.bank}
                      disabled={selectedExposureType === "shipment"}
                      showError={showError}
                      required={true}
                    />
                  ) : (
                    <CustomInput
                      label="Bank"
                      type="select"
                      name="bank"
                      placeholder="Enter Bank Name"
                      options={banks}
                      value={banks.find(
                        (option) => option.value === values.bank
                      )}
                      onChange={(option) =>
                        handleChange({
                          target: { name: "bank", value: option.value },
                        })
                      }
                      error={touched.bank && errors.bank}
                      disabled={selectedExposureType === "shipment"}
                      showError={showError}
                      required={true}
                    />
                  )}
                  <CustomInput
                    label="Business Units"
                    name="businessUnit"
                    placeholder="Units"
                    value={values.businessUnit}
                    onChange={handleChange}
                    error={touched.businessUnit && errors.businessUnit}
                    showError={showError}
                    required={true}
                    disabled={selectedExposureType === "shipment"}
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
                    type="number"
                    placeholder="Terms"
                    value={values.paymentTerms}
                    onChange={handleChange}
                    error={touched.paymentTerms && errors.paymentTerms}
                    showError={showError}
                    required={true}
                    disabled={selectedExposureType === "shipment"}
                  />
                  <CustomInput
                    label="Due Date"
                    name="dueDate"
                    type="date"
                    value={values.dueDate}
                    onChange={handleChange}
                    error={touched.dueDate && errors.dueDate}
                    showError={showError}
                    required={true}
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
                    disabled={selectedExposureType === "shipment"}
                  />
                  <CustomInput
                    label="Amount"
                    name="amount"
                    placeholder="Enter Amount"
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
                    disabled={selectedExposureType === "shipment"}
                    required={true}
                  />
                  <CustomInput
                    label="Hedge Deal Ref No"
                    name="hedgeDealRefNo"
                    type="select"
                    placeholder="Select Reference No"
                    options={hedgeDealOptions}
                    value={hedgeDealOptions.find(
                      (option: any) => option.value === values.hedgeDealRefNo
                    )}
                    onChange={(selectedOption) => {
                      const selectedDeal = dummyHedgeDeals.find(
                        (item: any) =>
                          item.hedgeDealRefNumber === selectedOption.value
                      );
                      // Set selected deal ref
                      setFieldValue("hedgeDealRefNo", selectedOption.value);

                      // Auto-fill hedgeRate & hedgeAmount
                      if (selectedDeal) {
                        setFieldValue("hedgeRate", selectedDeal.hedgeRate);
                        setFieldValue("deliveryDateFrom",selectedDeal.deliveryDateFrom);
                        setFieldValue("deliveryDateTo",selectedDeal.deliveryDateTo);
                        setFieldValue("outstandingAmount",selectedDeal.outstandingAmount);
                        setFieldValue("balanceAmount",selectedDeal.balanceAmount);
                        // setFieldValue("hedgeAmount", selectedDeal.hedgeAmount);
                      }
                    }}
                    error={touched.hedgeDealRefNo && errors.hedgeDealRefNo}
                    showError={showError}
                  />

                  {values.hedgeDealRefNo && (
                    <>
                      <CustomInput
                        label="Hedge Rate"
                        name="hedgeRate"
                        placeholder="Rate (Auto-populated)"
                        value={values.hedgeRate}
                        onChange={handleChange}
                        error={touched.hedgeRate && errors.hedgeRate}
                        showError={showError}
                        disabled={true}
                      />
                      <CustomInput
                        label="Delivery Date From"
                        name="deliveryDateFrom"
                        placeholder="Delivery Date From"
                        value={values.deliveryDateFrom}
                        onChange={handleChange}
                        error={touched.deliveryDateFrom && errors.deliveryDateFrom}
                        showError={showError}
                        disabled={true}
                      />
                      <CustomInput
                        label="Delivery Date To"
                        name="deliveryDateTo"
                        placeholder="Delivery Date From"
                        value={values.deliveryDateTo}
                        onChange={handleChange}
                        error={touched.deliveryDateTo && errors.deliveryDateTo}
                        showError={showError}
                        disabled={true}
                      />

                      <CustomInput
                        label="Hedge Amount"
                        name="hedgeAmount"
                        type="number"
                        placeholder="Hedge Amount"
                        value={values.hedgeAmount}
                        onChange={handleChange}
                        error={touched.hedgeAmount && errors.hedgeAmount}
                        showError={showError}
                      />
                      <CustomInput
                        label="Outstanding Amount"
                        name="outstandingAmount"
                        type="number"
                        placeholder="Hedge Amount"
                        value={values.outstandingAmount}
                        onChange={handleChange}
                        error={touched.outstandingAmount && errors.outstandingAmount}
                        showError={showError}
                        disabled={true}
                      />
                      <CustomInput
                        label="Balance Amount"
                        name="balanceAmount"
                        type="number"
                        placeholder="Balance Amount"
                        value={values.balanceAmount}
                        onChange={handleChange}
                        error={touched.balanceAmount && errors.balanceAmount}
                        showError={showError}
                        disabled={true}
                      />
                    </>
                  )}
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
      )}
    </Box>
  );
};

export default ExposureForm;
