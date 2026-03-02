"use client";
import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Formik, Form as FormikForm } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import CustomInput from "../../../../../config/component/CustomInput/CustomInput";
import {
  primaryButtonHoverStyle,
  primaryButtonStyle,
} from "../../../../../globalStyles";
import {
  exposureTypeOptions,
  settlementTypeOptions,
} from "../../../exportsRegister/component/utils/constant";
import ConversionTypeSelector from "./component/ConversionTypeSelector";
import EEFCExportsSection from "./component/EEFCExportsSection";
import EEFCImportsSection from "./component/EEFCImportsSection";
import ExposureAutoPopulateWatcher from "./component/ExposureAutoPopulateWatcher";
import ExposureSettlementAutoCalculator from "./component/ExposureSettlementAutoCalculator";
import ExposureSettlementController from "./component/ExposureSettlementController";
import ForwardContractSection from "./component/ForwardContractSection";
import PCFCRepaymentSection from "./component/PCFCRepaymentSection";
import SpotConversionSection from "./component/SpotConversionSection";
import SpotForwardCalculation from "./utils/SpotForwardCalculation";
import { useStoreEdited } from "../../../../../config/component/customHooks/useStoreEdited";
import { pickMatchedFields } from "../../../utils/function";
import { extractFieldValue } from "../../../../../config/constant/function";
import { getExposureSettlementInitialValues } from "./utils/constent";

const ExposureSettlementForm = ({ submitForm, editData, originalData,onClose }: any) => {
  const [showError, setShowError] = useState(false);
  const [poOptions, setPoOptions] = useState<any[]>([]);
  const [invoiceOptions, setInvoiceOptions] = useState<any[]>([]);
  const [isPoDisabled, setIsPoDisabled] = useState(false);
  const [isInvoiceDisabled, setIsInvoiceDisabled] = useState(false);
  const toast = useToast();

    const isEdit = Boolean(editData);
    const {storeEdited, editLoading} = useStoreEdited();

  const validationSchema = Yup.object({
    settlementDate: Yup.string().required("Settlement Date is required"),
    settlementType: Yup.string().nullable(),
    exposureType: Yup.string().nullable(),

    settledAmount: Yup.number()
      .typeError("Settled Amount is required")
      .required("Settled Amount is required"),

    partyName: Yup.string().required("Party Name is required"),
    bank: Yup.string().required("Bank is required"),
    businessUnit: Yup.string().required("Business Unit is required"),
    currency: Yup.string().required("Currency is required"),
    dueDate: Yup.string().required("Due Date is required"),
    outstandingAmount: Yup.string().required("Outstanding Amount is required"),

    // 👇 THESE ARE REQUIRED FOR FORM-LEVEL TEST
    isSpotEnabled: Yup.boolean().required(),
    isEEFCExportsEnabled: Yup.boolean().required(),
    isEEFCImportsEnabled: Yup.boolean().required(),
    isPCFCEnabled: Yup.boolean().required(),
    isForwardEnabled: Yup.boolean().required(),

    modeValidation: Yup.mixed().test(
      "spot-or-forward-required",
      "Please enable at least one mode",
      function () {
        const {
          isSpotEnabled,
          isForwardEnabled,
          isEEFCExportsEnabled,
          isEEFCImportsEnabled,
          isPCFCEnabled,
        } = this.parent;
        return (
          isSpotEnabled ||
          isForwardEnabled ||
          isEEFCExportsEnabled ||
          isEEFCImportsEnabled ||
          isPCFCEnabled
        );
      },
    ),

    settlementAmount: Yup.number()
      .typeError("Settlement Amount is required")
      .required("Settlement Amount is required")
      .test(
        "match-settled-amount",
        "Settlement Amount must match the calculated Settled Amount",
        function (value) {
          const { settledAmount } = this.parent;

          if (value === undefined || value === null || settledAmount === "") {
            return true; // let required/type errors handle this
          }

          return Number(value) === Number(settledAmount);
        },
      ),
  });


  return (
    <Box bg="whiteAlpha.700">
      <Box p={2} borderRadius="2xl">
        <Formik
        enableReinitialize
          // initialValues={{
          //   settlementDate: "",
          //   settlementInputDate: new Date().toISOString().split("T")[0],
          //   settlementType: "",
          //   outstandingAmount: "",
          //   dueDate: "",
          //   exposureType: "",
          //   poNumber: "",
          //   invoiceBcNumber: "",
          //   partyName: "",
          //   businessUnit: "",
          //   bank: "",
          //   currency: "",
          //   settledAmount: "",
          //   settlementAmount: "",

          //   // === TOGGLES ===
          //   isSpotEnabled: false,
          //   isEEFCExportsEnabled: false,
          //   isEEFCImportsEnabled: false,
          //   isPCFCEnabled: false,
          //   isForwardEnabled: false,

          //   // === LISTS (MULTIPLE ROWS) ===
          //   spotList: [],
          //   eefcExportsList: [],
          //   eefcImportsList: [],
          //   pcfcList: [],
          //   forwardList: [],

          //   // Summary fields
          //   settlementRate: "",
          //   settledAmountInINR: "",
          // }}
          validationSchema={validationSchema}
          validateOnBlur={true}
          validateOnChange={false}
        initialValues={getExposureSettlementInitialValues(editData)}

          
              //         onSubmit={async (values, actions) => {
              //                             values = extractFieldValue(values)
              //                             if (isEdit) {
              //                               const { original, updated } = pickMatchedFields(
              //                                 originalData,
              //                                 values,
              //                                 editData?.rowId
              //                               );
                              
              //                               const payload = {
              //                                 register: "exposure",
              //                                 data: [
              //                                   {
              //                                     original,
              //                                     updated,
              //                                     rowId: editData?.rowId, // optional if backend still expects it here
              //                                   },
              //                                 ],
              //                               };
                              
              //                               try {
              //                                 await storeEdited(payload, onClose);
              //                                 actions.resetForm();
              //                                 actions.setSubmitting(false);
              //                               } catch (error) {
              //                                 actions.setSubmitting(false);
              //                               }
                              
              //                               return;
              //                             }
              //                             setShowError(true);
              //                             submitForm(values, actions, "form");
              // }}

              onSubmit={async (values, actions) => {
  values = extractFieldValue(values);

  // ✅ Flatten spotList bankMargin (already strings, but safety check)
  if (values.spotList?.length > 0) {
    values.spotList = values.spotList.map((row: any) => ({
      ...row,
      bankMargin: typeof row.bankMargin === "object"
        ? row.bankMargin?.value
        : String(row.bankMargin ?? ""),
    }));
  }

  if (isEdit) {
    const { original, updated } = pickMatchedFields(
      originalData,
      values,
      editData?.rowId
    );

    const payload = {
      register: "exposure",
      data: [
        {
          original,
          updated,
          rowId: editData?.rowId,
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
  }

  setShowError(true);
  submitForm(values, actions, "form");
}}
          // onSubmit={(values, actions) => {
          //   submitForm(values, actions, "form");
          // }}
        >
          {({
            values,
            handleChange,
            setFieldValue,
            errors,
            touched,
            isSubmitting,
            validateForm,
            submitForm,
          }) => (
            <FormikForm>
              <ExposureAutoPopulateWatcher />
              <ExposureSettlementController
  setPoOptions={setPoOptions}
  setInvoiceOptions={setInvoiceOptions}
  setIsPoDisabled={setIsPoDisabled}
  setIsInvoiceDisabled={setIsInvoiceDisabled}
  isEdit={isEdit}
/>
              <VStack spacing={6} align="stretch">
                <SimpleGrid columns={[1, 2]} spacing={6}>
                  <CustomInput
                    label="Settlement Date"
                    name="settlementDate"
                    required
                    type="date"
                    value={values.settlementDate}
                    onChange={handleChange}
                    error={touched.settlementDate && errors.settlementDate}
                    showError={showError}
                  />
                  <CustomInput
                    label="Settlement Type"
                    name="settlementType"
                    type="select"
                    required
                    options={settlementTypeOptions}
                    value={settlementTypeOptions.find(
                      (opt) => opt.value === values.settlementType,
                    )}
                    onChange={(option) => {
                      handleChange({
                        target: { name: "settlementType", value: option.value },
                      });
                    }}
                    error={touched.settlementType && errors.settlementType}
                    showError={showError}
                  />

                  <CustomInput
                    label="Exposure Type"
                    name="exposureType"
                    type="select"
                    required
                    options={exposureTypeOptions}
                    value={exposureTypeOptions.find(
                      (opt) => opt.value === values.exposureType,
                    )}
                    onChange={(option) => {
                      handleChange({
                        target: { name: "exposureType", value: option.value },
                      });
                      setFieldValue("poNumber", "");
                      setFieldValue("invoiceBcNumber", "");
                      setFieldValue("outstandingAmount", "");
                      setFieldValue("dueDate", "");
                      setFieldValue("isEEFCExportsEnabled", false);
                      setFieldValue("isEEFCImportsEnabled", false);
                    }}
                    error={touched.exposureType && errors.exposureType}
                    showError={showError}
                  />
                  {values.settlementType === "advance" && (
                    <CustomInput
                      label="PO Number"
                      name="poNumber"
                      disabled={isPoDisabled}
                      type="select"
                      required
                      options={poOptions}
                      value={poOptions.find(
                        (opt) => opt.value === values.poNumber,
                      )}
       
                      onChange={(option) =>
                        handleChange({
                          target: { name: "poNumber", value: option.value },
                        })
                      }
                      error={touched.poNumber && errors.poNumber}
                      showError={showError}
                    />
                  )}
                  <CustomInput
                    label="Invoice BC Number"
                    name="invoiceBcNumber"
                    disabled={isInvoiceDisabled}
                    type="select"
                    required
                    options={invoiceOptions}
                    value={invoiceOptions.find(
                      (opt) => opt.value === values.invoiceBcNumber,
                    )}
                    onChange={(option) =>
                      handleChange({
                        target: {
                          name: "invoiceBcNumber",
                          value: option.value,
                        },
                      })
                    }
                    error={touched.invoiceBcNumber && errors.invoiceBcNumber}
                    showError={showError}
                  />
                  <CustomInput
                    label="Party Name"
                    required
                    name="partyName"
                    value={values.partyName}
                    disabled
                    // error={touched.partyName && errors.partyName}
                    showError={showError}
                  />
                  <CustomInput
                    label="Business Unit"
                    required
                    name="businessUnit"
                    value={values.businessUnit}
                    showError={showError}
                    disabled
                  />
                  <CustomInput
                    required
                    label="Bank"
                    name="bank"
                    showError={showError}
                    value={values.bank}
                    disabled
                  />
                  <CustomInput
                    label="Currency"
                    required
                    name="currency"
                    showError={showError}
                    value={values.currency}
                    disabled
                  />
                  <CustomInput
                    label="Outstanding Amount"
                    name="outstandingAmount"
                    value={values.outstandingAmount}
                    showError={showError}
                    required
                    disabled
                  />
                  <CustomInput
                    label="Document Due Date"
                    name="dueDate"
                    showError={showError}
                    // required
                    value={values.dueDate}
                    disabled
                  />

                  <CustomInput
                    label="Settlement Amount"
                    name="settlementAmount"
                    required
                    placeholder="Enter Amount To Settle"
                    value={values.settlementAmount}
                    onChange={handleChange}
                    error={touched.settlementAmount && errors.settlementAmount}
                    showError={showError}
                  />

                  <ExposureSettlementAutoCalculator />
                </SimpleGrid>
                <ConversionTypeSelector
                  values={values}
                  setFieldValue={setFieldValue}
                />
                <SpotForwardCalculation />
                {/* ===================== CONDITIONAL SECTIONS ===================== */}
                {values.isSpotEnabled && (
                  <SpotConversionSection showError={showError} />
                )}

                {values.isEEFCExportsEnabled && (
                  <EEFCExportsSection showError={showError} />
                )}

                {values.isEEFCImportsEnabled && (
                  <EEFCImportsSection showError={showError} />
                )}

                {values.isPCFCEnabled && (
                  <PCFCRepaymentSection showError={showError} />
                )}
                {values.isForwardEnabled && (
                  <ForwardContractSection
                    showError={showError}
                    bank={values.bank}
                    businessUnit={values.businessUnit}
                    exposureType={values.exposureType}
                    documentDueDate={values.dueDate}
                  />
                )}
                {/* ===================== SUMMARY SECTION ===================== */}
                <Box p={4} bg="gray.100" borderRadius="lg">
                  <SimpleGrid columns={[1, 2, 3]} spacing={6}>
                    <CustomInput
                      label="Settled Amount"
                      name="settledAmount"
                      value={values.settledAmount}
                      onChange={handleChange}
                    />
                    <CustomInput
                      label="Settlement Rate"
                      name="settlementRate"
                      value={values.settlementRate}
                      disabled
                    />
                    <CustomInput
                      label="Settled Amount in INR"
                      name="settledAmountInINR"
                      value={values.settledAmountInINR}
                      disabled
                    />
                  </SimpleGrid>
                </Box>
                {/* ===================== ACTION BUTTON ===================== */}
                <Flex justify={"end"}>
                  <Button
                    rounded="full"
                    {...primaryButtonStyle}
                    _hover={{ ...primaryButtonHoverStyle, border: "1px solid" }}
                    isLoading={isSubmitting || editLoading}
                    type="button"
                    size="lg"
                    onClick={async () => {
                      setShowError(true);
                      const errors = await validateForm();
                      if (Object.keys(errors).length > 0) {
                        // 🔹 get first error message
                        const firstError = Object.values(errors)[0];
                        toast({
                          title: "Validation Error",
                          description: String(firstError),
                          status: "error",
                          duration: 3000,
                          isClosable: true,
                          position: "top-right",
                        });
                        return;
                      }
                      submitForm();
                    }}
                  >
                    {isEdit ? "Update" : "Submit"}
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

export default ExposureSettlementForm;
