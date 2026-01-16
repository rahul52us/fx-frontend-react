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
import { banks } from "../../pcfc/components/PCFCForm/dummyData";
import { MultiHedgeDealExport } from "./MultiHedgeDealExport";
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
    invoiceNo: Yup.string().when("exposureType", {
      is: (val: string) => val !== "confirmed_order",
      then: (schema) => schema.required("Invoice No is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    partyName: Yup.string().required("Party Name is required"),
    bank: Yup.string().required("Bank is required"),
    poNo: Yup.string().required("PO No is required"),
    businessUnit: Yup.string().required("Business Unit is required"),
    paymentTerms: Yup.number().required("Payment terms is required"),
    currency: Yup.mixed().required("Currency is required"),
      exposureType: Yup.mixed().required("Exposure Type is required"),

    amount: Yup.number()
      .required("Amount is required")
      .when(["exposureType", "outStandingAmount"], {
        is: (exposureType: string, outStandingAmount: any) =>
          exposureType === "shipment" && !!outStandingAmount,
        then: (schema) =>
          schema.test("max-outStandingAmount", function (value) {
            const { outStandingAmount } = this.parent;
            if (value && outStandingAmount && value > outStandingAmount) {
              return this.createError({
                message: `Amount must be less than or equal to Outstanding Amount (${outStandingAmount})`,
              });
            }
            return true;
          }),
        otherwise: (schema) => schema,
      }),

    budgetRate: Yup.string().required("Budget Rate is required"),

    //date valitations----------------------
    poDate: Yup.string().required("PO Date is required"),
    invoiceDate: Yup.date()
      .transform((value, originalValue) => {
        return originalValue ? new Date(originalValue) : value;
      })
      .when("exposureType", {
        is: (val: string) => val !== "confirmed_order",
        then: (schema) => schema.required("Invoice Date is required"),
        otherwise: (schema) => schema.notRequired(),
      })
      .when("poDate", (poDate: any, schema: any) => {
        const dateValue = Array.isArray(poDate) ? poDate[0] : poDate;
        return dateValue
          ? schema.min(
              new Date(dateValue),
              "Invoice Date must be after PO Date"
            )
          : schema;
      })
      .when("dueDate", (dueDate: any, schema: any) => {
        const dateValue = Array.isArray(dueDate) ? dueDate[0] : dueDate;
        return dateValue
          ? schema.max(
              new Date(dateValue),
              "Invoice Date cannot be after Due Date"
            )
          : schema;
      }),
    blDate: Yup.string()
      .required("BL Date is required")
      .test(
        "bl-date-range",
        "BL Date must be between PO Date and Due Date",
        function (value) {
          const { poDate, dueDate } = this.parent;

          if (!value || !poDate || !dueDate) return true;

          const blDate = new Date(value);
          const poDateObj = new Date(poDate);
          const dueDateObj = new Date(dueDate);

          return blDate >= poDateObj && blDate <= dueDateObj;
        }
      ),
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
      })
      .when("poDate", (poDate: any, schema: any) => {
        const dateValue = Array.isArray(poDate) ? poDate[0] : poDate;
        return dateValue
          ? schema.min(new Date(dateValue), "Due Date must be after PO Date")
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
            remark: "",
            dueDate: "",
            outstandingAmount:"",
            // hedgeDealRefNo: "",
            // outstandingAmount: "",
            // balanceAmount: "",
            // hedgeAmount: "",
            // hedgeRate: "",
            // deliveryDateFrom: "",
            // deliveryDateTo: "",
 hedgeDeals: [],
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
  options={poData.map((item: any) => ({
    label: item.poNo,
    value: item.poNo
  }))}
  value={
    poData.find((option: any) => option.value === values.poNo) || null
  }
  onChange={(selectedOption) => {
    const selectedPo = poData.find(
      (item: any) => item.poNo === selectedOption.value
    );

    setFieldValue("poNo", selectedOption.value);

    if (selectedPo) {
      // convert date
      const formatDate = (d: string) => {
        if (!d) return "";
        if (d.includes(".")) {
          const [day, month, year] = d.split(".");
          return `${year}-${month}-${day}`;
        }
        return d;
      };

      setFieldValue("poDate", formatDate(selectedPo.poDate));
      setFieldValue("partyName", selectedPo.partyName);
      setFieldValue("bank", selectedPo.bank);
      setFieldValue("businessUnit", selectedPo.businessUnit);
      setFieldValue("paymentTerms", selectedPo.paymentTerms);
      setFieldValue("currency", selectedPo.currency);
      setFieldValue("budgetRate", selectedPo.budgetRate);
      setFieldValue(
        "outstandingAmount",
        selectedPo.outStandingAmount || 0
      );
    }
  }}
  required={true}
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

                </SimpleGrid>
                  <MultiHedgeDealExport
                    url={url}
                    showError={showError}
                    // values={values}
                    // setFieldValue={setFieldValue}
                    // touched={touched}
                    // errors={errors}
                  />
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