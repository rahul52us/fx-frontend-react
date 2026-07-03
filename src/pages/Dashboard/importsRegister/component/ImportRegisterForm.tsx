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
import { useEffect, useState, useCallback } from "react";
import { useStoreEdited } from "../../../../config/component/customHooks/useStoreEdited";
import CustomInput from "../../../../config/component/CustomInput/CustomInput";
import Loader from "../../../../config/component/Loader/Loader";
import { extractFieldValue } from "../../../../config/constant/function";
import {
  primaryButtonHoverStyle,
  primaryButtonStyle,
} from "../../../../globalStyles";
import store from "../../../../store/store";
import DueDateSync from "../../exportsRegister/component/DueDateSync";
import { MultiHedgeDealExport } from "../../exportsRegister/component/MultiHedgeDealExport";
import { calculateDueDate, normalizeDate } from "../../exportsRegister/component/utils/function";
import { pickMatchedFields } from "../../utils/function";
import { dummyPoData, importExposureTypeOptions } from "./utils/constant";
import { getImportRegisterValidationSchema } from "./utils/validationSchema";

import ForecastExposureFields from "../../exportsRegister/component/ForecastExposureFields";

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
  const [poBalance, setPoBalance] = useState<number>(0);
  // const [poBalance, setPoBalance] = useState("");
  const toast = useToast();
  const url = process.env.REACT_APP_FX_BASE_URL;
  const [selectedExposureType, setSelectedExposureType] = useState<string>("");
  const isEdit = Boolean(editData);
  const { storeEdited, editLoading } = useStoreEdited();

const fetchPoBalance = async (poNumber: string) => {
  try {
    const response: any = await axios.post(`${url}/exportregister/pobalance/`, {
      register: "import",
      exposureType: selectedExposureType,
      poNumber,
    });
    // setPoBalance(response?.data?.data?.remainingBalance || 0);
    setPoBalance(response?.data?.data?.remainingBalance || 0);
  } catch (error:any) {
    console.error("Error fetching PO balance:", error.message);
  }
};

  const fetchPoDetails = useCallback(async () => {
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
  }, [url]);

  const validationSchema = getImportRegisterValidationSchema(isEdit, poBalance);
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
  }, [fetchPoDetails]);

  return (
    <Box mx="auto" borderRadius="2xl">
      {loading && <Loader />}
      {!loading && (
        <Formik
          enableReinitialize={true}
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
          onSubmit={async (values, actions) => {
            values = extractFieldValue(values)
                      if (values.bank && typeof values.bank === "object") {
    values.bank = values.bank.value;  // "HDFC"
  }
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
              } else {
                setShowError(true);
                await submitImportForm(values, actions, "form");
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
                  </SimpleGrid>

                  {values.exposureType === "forecast" ? (
                    <ForecastExposureFields
                      values={values}
                      handleChange={handleChange}
                      touched={touched}
                      errors={errors}
                      showError={showError}
                      currenciesData={currenciesData}
                      bussinessUnitsData={bussinessUnitsData}
                      setFieldValue={setFieldValue}
                    />
                  ) : (
                    <>
                  <SimpleGrid columns={[1, null, 2]} spacing={8}>

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
                          if(values.exposureType === 'lc_bc_shifting'){
                            fetchPoBalance(selectedOption.value);
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
                       type={
                        selectedExposureType === "lc_bc_shifting"
                          ? "text"
                          : "select"
                      }
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
                        type={
                        selectedExposureType === "lc_bc_shifting"
                          ? "text"
                          : "select"
                      } 
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

                    <DueDateSync />
                    <CustomInput
                      label="BL Date"
                      name="blDate"
                      type="date"
                    />

                    <CustomInput
                      label="Payment Terms"
                      name="paymentTerms"
                      type="number"
                      value={values.paymentTerms ?? ""}
                      onChange={(e) =>
                        setFieldValue("paymentTerms", e.target.value)
                      }
                      disabled={selectedExposureType === "shipment"}
                      showError={showError}
                    />

                    <CustomInput
                      label="Due Date"
                      name="dueDate"
                      type="date"
                      disabled
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
                      placeholder="Enter Amount"
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
                  </SimpleGrid>
                  <MultiHedgeDealExport url={url} showError={showError} exposureType={'import'} />
                    </>
                  )}

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
                        {isEdit ? "Update" : "Submit"}
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