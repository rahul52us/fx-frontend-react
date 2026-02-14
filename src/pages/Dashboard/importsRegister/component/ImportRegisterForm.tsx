import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  useToast,
  VStack,
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
import { MultiHedgeDealExport } from "../../exportsRegister/component/MultiHedgeDealExport";
import { dummyPoData, importExposureTypeOptions } from "./utils/constant";
import { normalizeDate, calculateDueDate } from "../../exportsRegister/component/utils/function";
import { pickMatchedFields } from "../../utils/function";
import { useStoreEdited } from "../../../../config/component/customHooks/useStoreEdited";
import store from "../../../../store/store";
import { extractFieldValue } from "../../../../config/constant/function";

const ImportRegistrationForm = ({
  submitImportForm,
  editData,
  originalData,
  onClose,
}: any) => {
  const { auth: { banksData, bussinessUnitsData, currenciesData } } = store
  const [showError, setShowError] = useState(false);
  const [poData, setPoData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const url = process.env.REACT_APP_FX_BASE_URL;
  const [selectedExposureType, setSelectedExposureType] = useState<string>("");
  const isEdit = Boolean(editData);

  const { storeEdited, editLoading } = useStoreEdited();
  const fetchPoDetails = async () => {
    setLoading(true);
    try {
      const response: any = await axios.post(`${url}/importregister/polist/`);
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
      setLoading(false);
      // console.log("--------", response.status);
      if (response.status === "success" || response.status === 200) {
        setPoData(exportRegOptions);
      } else {
        setPoData(dummyPoData);
      }
    } catch (error) {
      setPoData([]);
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object().shape({
    exposureType: Yup.mixed().required("Exposure Type is required"),
    poDate: Yup.string().required("PO Date is required"),
    poNo: Yup.string().required("PO No is required"),
    partyName: Yup.string().required("Party Name is required"),
    bank: Yup.mixed().required("Bank is required"),
    businessUnit: Yup.mixed().required("Business Unit is required"),
    blDate: Yup.string().required("BL Date is required"),
    paymentTerms: Yup.string().required("Payment Terms is required"),
    dueDate: Yup.string().required("Due Date is required"),
    currency: Yup.mixed().required("Currency is required"),
    amount: Yup.number().required("Amount is required"),
    budgetRate: Yup.string().required("Budget Rate is required"),

    invoiceNo: Yup.string().when("exposureType", {
      is: (val: string) => val !== "da_dp",
      then: (schema) => schema.required("Invoice No is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    invoiceDate: Yup.date().when("exposureType", {
      is: (val: string) => val !== "da_dp",
      then: (schema) => schema.required("Invoice Date is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    // invoiceNo: Yup.string().nullable(),
    // invoiceDate: Yup.string().nullable(),

    // hedgeDealRefNo: Yup.string().nullable(),
    // hedgeRate: Yup.string().nullable(),
    // hedgeAmount: Yup.number().nullable(),
    // remark: Yup.string().nullable(),
  });
  const handleFormSubmit = (handleSubmit: any, errors: any) => {
    setShowError(true);

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

  useEffect(() => {
    fetchPoDetails();
  }, []);

  return (
    <Box mx="auto" borderRadius="2xl">
      {loading && <Loader />}
      {!loading && (
        <Formik
          // initialValues={{
          //   exposureType: "",
          //   poNo: "",
          //   poDate: "",
          //   partyName: "",
          //   bank: "",
          //   businessUnit: "",
          //   invoiceNo: "",
          //   invoiceDate: "",
          //   blDate: "",
          //   paymentTerms: "",
          //   dueDate: "",
          //   currency: "",
          //   amount: "",
          //   budgetRate: "",
          //   hedgeDeals: [],
          //   remark: "",
          // }}

          initialValues={{
            exposureType: editData?.exposureType || "",
            poNo: editData?.poNo || "",
            poDate: normalizeDate(editData?.poDate),
            invoiceDate: normalizeDate(editData?.invoiceDate),
            blDate: normalizeDate(editData?.blDate),
            dueDate: normalizeDate(editData?.dueDate),
            partyName: editData?.partyName || "",
            bank: banksData.find((bank: any) => bank.value === editData?.bank) || {},
            businessUnit: bussinessUnitsData.find((dt: any) => dt.value === editData?.businessUnit) || {},
            invoiceNo: editData?.invoiceNo || "",
            paymentTerms: editData?.paymentTerms || "",
            currency: currenciesData.find((dt: any) => dt.value === editData?.currency) || {},
            amount: editData?.amount || "",
            budgetRate: editData?.budgetRate || "",
            remark: editData?.remark || "",
            hedgeDeals: editData?.hedgeDeals || [],
          }}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={async (values, actions) => {
            values = extractFieldValue(values)
            if (isEdit) {
              const { original, updated } = pickMatchedFields(
                originalData,
                values,
                editData?.rowId
              );

              const payload = {
                register: "import",
                data: [
                  {
                    original,
                    updated,
                    rowId: editData?.rowId, // optional if backend still expects it here
                  },
                ],
              };

              try {
                await storeEdited(payload, onClose);
                actions.resetForm();
                actions.setSubmitting(false);
              } catch (error) {
                actions.setSubmitting(false);
              }

              return;
            } {
              setShowError(true);
              submitImportForm(values, actions, "form");
            }
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
          }: any) => {

            console.log('thee values are are', values)

            // Helper function to check if field should be readonly
            const isFieldReadOnly = (fieldName: string) => {
              if (values.exposureType !== "lc_bc_shifting") return false;
              const autoPopulatedFields = [
                "poDate",
                "partyName",
                "bank",
                "businessUnit",
                "paymentTerms",
                "currency",
                "budgetRate",
              ];
              return autoPopulatedFields.includes(fieldName) && values.poNo;
            };

            return (
              <FormikForm>
                <VStack m={4} spacing={6} align="stretch">
                  <SimpleGrid columns={[1, null, 2]} spacing={8}>
                    {/* Exposure Type */}
                    <CustomInput
                      label="Exposure Type"
                      name="exposureType"
                      type="select"
                      options={importExposureTypeOptions}
                      value={importExposureTypeOptions.find(
                        (option) => option.value === values.exposureType,
                      )}
                      onChange={(selectedOption) => {
                        // Reset form when exposure type changes
                        setFieldValue("exposureType", selectedOption.value);
                        setFieldValue("poNo", "");
                        setFieldValue("poDate", "");
                        setFieldValue("partyName", "");
                        setFieldValue("bank", "");
                        setFieldValue("businessUnit", "");
                        setFieldValue("paymentTerms", "");
                        setFieldValue("currency", "");
                        setFieldValue("budgetRate", "");
                        setSelectedExposureType(selectedOption.value);
                      }}
                      error={touched.exposureType && errors.exposureType}
                      showError={showError}
                      required={true}
                    />

                    {values.exposureType === "lc_bc_shifting" ? (
                      <CustomInput
                        label="PO No"
                        placeholder="Select PO No"
                        name="poNo"
                        type="select"
                        options={poData.map((item: any) => ({
                          label: item.poNo,
                          value: item.poNo,
                        }))}
                        value={poData.find(
                          (option: any) => option.value === values.poNo,
                        )}
                        onChange={(selectedOption) => {
                          const selectedPo = poData.find(
                            (item: any) => item.poNo === selectedOption.value,
                          );

                          setFieldValue("poNo", selectedOption.value);

                          if (selectedPo) {
                            // Auto-populate fields for LC/BC Shifting
                            setFieldValue("poDate", selectedPo.poDate);
                            setFieldValue("partyName", selectedPo.partyName);
                            setFieldValue("bank", selectedPo.bank);
                            setFieldValue(
                              "businessUnit",
                              selectedPo.businessUnit,
                            );
                            setFieldValue(
                              "paymentTerms",
                              selectedPo.paymentTerms,
                            );
                            setFieldValue("currency", selectedPo.currency);
                            setFieldValue("budgetRate", selectedPo.budgetRate);

                            if (values.blDate) {
                              const newDueDate = calculateDueDate(
                                values.blDate,
                                selectedPo.paymentTerms
                              );
                              setFieldValue("dueDate", newDueDate);
                            }
                          }
                        }}
                        required={true}
                        error={touched.poNo && errors.poNo}
                        showError={showError}
                      />
                    ) : (
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
                    )}
                    <CustomInput
                      label="PO Date"
                      name="poDate"
                      type={
                        selectedExposureType === "lc_bc_shifting"
                          ? "text"
                          : "date"
                      }
                      placeholder="PO Date"
                      value={values.poDate}
                      onChange={handleChange}
                      error={touched.poDate && errors.poDate}
                      showError={showError}
                      required={true}
                      disabled={isFieldReadOnly("poDate")}
                    />

                    {/* Party Name */}
                    <CustomInput
                      label="Party Name"
                      name="partyName"
                      placeholder="Enter Party Name"
                      value={values.partyName}
                      onChange={handleChange}
                      error={touched.partyName && errors.partyName}
                      showError={showError}
                      required={true}
                      disabled={isFieldReadOnly("partyName")}
                    />
                    <CustomInput
                      label="Business Unit"
                      name="businessUnit"
                      type="select"
                      placeholder="Unit"
                      options={bussinessUnitsData}
                      value={values.businessUnit}
                      onChange={(e: any) => setFieldValue("businessUnit", e)}
                      error={touched.businessUnit && errors.businessUnit}
                      showError={showError}
                      required={true}
                      disabled={isFieldReadOnly("businessUnit")}
                    />
                    {/* Bank */}
                    {isFieldReadOnly("bank") ? (
                      <CustomInput
                        label="Bank"
                        name="bank"
                        type="select"
                        placeholder="Bank"
                        options={banksData}
                        value={values.bank}
                        onChange={(selectedOption: any) =>
                          setFieldValue("bank", selectedOption)
                        }
                        error={touched.bank && errors.bank}
                        showError={showError}
                        required={true}
                        disabled={true}
                      />
                    ) : (
                      <CustomInput
                        label="Bank"
                        type="select"
                        name="bank"
                        placeholder="Select Bank"
                        options={banksData}
                        value={values.bank}
                        onChange={(selectedOption: any) =>
                          setFieldValue("bank", selectedOption)
                        }
                        error={touched.bank && errors.bank}
                        showError={showError}
                        required={true}
                      />
                    )}

                    {/* Business Unit */}


                    {/* Invoice No - Optional */}
                    <CustomInput
                      label="Invoice No"
                      name="invoiceNo"
                      placeholder="Enter Invoice No"
                      value={values.invoiceNo}
                      onChange={handleChange}
                      error={touched.invoiceNo && errors.invoiceNo}
                      showError={showError}
                      required={selectedExposureType !== "da_dp"}
                    />

                    {/* Invoice Date - Optional */}
                    <CustomInput
                      label="Invoice Date"
                      name="invoiceDate"
                      type="date"
                      value={values.invoiceDate}
                      onChange={handleChange}
                      error={touched.invoiceDate && errors.invoiceDate}
                      showError={showError}
                      required={selectedExposureType !== "da_dp"}
                    />

                    {/* BL Date */}
                    <CustomInput
                      label="BL Date"
                      name="blDate"
                      type="date"
                      value={values.blDate}
                      onChange={(e: any) => {
                        handleChange(e);
                        const newBlDate = e.target.value;
                        if (values.paymentTerms) {
                          const newDueDate = calculateDueDate(
                            newBlDate,
                            values.paymentTerms
                          );
                          setFieldValue("dueDate", newDueDate);
                        }
                      }}
                      error={touched.blDate && errors.blDate}
                      showError={showError}
                      required={true}
                    />

                    {/* Payment Terms */}
                    <CustomInput
                      label="Payment Terms"
                      name="paymentTerms"
                      placeholder="Terms"
                      value={values.paymentTerms}
                      onChange={(e: any) => {
                        handleChange(e);
                        const newTerms = e.target.value;
                        if (values.blDate) {
                          const newDueDate = calculateDueDate(
                            values.blDate,
                            newTerms
                          );
                          setFieldValue("dueDate", newDueDate);
                        }
                      }}
                      error={touched.paymentTerms && errors.paymentTerms}
                      showError={showError}
                      required={true}
                      disabled={isFieldReadOnly("paymentTerms")}
                    />

                    {/* Due Date */}
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

                    {/* Currency */}
                    {isFieldReadOnly("currency") ? (
                      <CustomInput
                        label="Currency"
                        name="currency"
                        value={values.currency}
                        options={currenciesData}
                        onChange={(e: any) => setFieldValue("currency", e)}
                        error={touched.currency && errors.currency}
                        showError={showError}
                        required={true}
                        disabled={true}
                      />
                    ) : (
                      <CustomInput
                        label="Currency"
                        type="select"
                        name="currency"
                        options={currenciesData}
                        value={values.currency}
                        onChange={(selectedOption) =>
                          setFieldValue("currency", selectedOption)
                        }
                        error={touched.currency && errors.currency}
                        showError={showError}
                        required={true}
                      />
                    )}

                    {/* Amount */}
                    <CustomInput
                      label="Amount"
                      type="number"
                      name="amount"
                      value={values.amount}
                      onChange={handleChange}
                      error={touched.amount && errors.amount}
                      showError={showError}
                      required={true}
                    />

                    {/* Budget Rate */}
                    <CustomInput
                      label="Budget Rate"
                      name="budgetRate"
                      value={values.budgetRate}
                      onChange={handleChange}
                      type="number"
                      error={touched.budgetRate && errors.budgetRate}
                      showError={showError}
                      required={true}
                      disabled={isFieldReadOnly("budgetRate")}
                    />

                    {/* <HedgeDealSelector
                                        url={url}
                                        values={values}
                                        setFieldValue={setFieldValue}
                                        touched={touched}
                                        errors={errors}
                                        showError={showError}
                                        /> */}
                  </SimpleGrid>
                  <MultiHedgeDealExport url={url} showError={showError} exposureType={'import'} />

                  {/* Remark */}
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
                      _hover={{
                        ...primaryButtonHoverStyle,
                        border: "1px solid",
                      }}
                      transition={"transform 0.3s ease-in-out"}
                      onClick={() => handleFormSubmit(handleSubmit, errors)}
                      size="lg"
                      isLoading={isSubmitting || editLoading}
                    >
                      Submit
                    </Button>
                  </Flex>
                </VStack>
              </FormikForm>
            );
          }}
        </Formik>
      )}
    </Box>
  );
};

export default ImportRegistrationForm;
