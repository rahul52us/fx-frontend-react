"use client";
import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  VStack
} from "@chakra-ui/react";
import { Formik, Form as FormikForm } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import CustomInput from "../../../../../config/component/CustomInput/CustomInput";
import {
  primaryButtonHoverStyle,
  primaryButtonStyle,
} from "../../../../../globalStyles";
import { exposureTypeOptions, settlementTypeOptions } from "../../../exportsRegister/component/utils/constant";
import ConversionTypeSelector from "./component/ConversionTypeSelector";
import EEFCExportsSection from "./component/EEFCExportsSection";
import EEFCImportsSection from "./component/EEFCImportsSection";
import ExposureAutoPopulateWatcher from "./component/ExposureAutoPopulateWatcher";
import ExposureSettlementController from "./component/ExposureSettlementController";
import ForwardContractSection from "./component/ForwardContractSection";
import PCFCRepaymentSection from "./component/PCFCRepaymentSection";
import SpotConversionSection from "./component/SpotConversionSection";
import SpotForwardCalculation from "./utils/SpotForwardCalculation";

const ExposureSettlementForm = ({ submitForm }: any) => {
  const [showError, setShowError] = useState(false);
  const [poOptions, setPoOptions] = useState<any[]>([]);
  const [invoiceOptions, setInvoiceOptions] = useState<any[]>([]);


  const validationSchema = Yup.object({
    settlementDate: Yup.string().required("Settlement Date is required"),
    settlementType: Yup.string().required("Settlement Type is required"),
    settledAmount: Yup.number().required("Settled Amount is required"),
    partyName: Yup.string().required("Party Name is required"),
    bank: Yup.string().required("Bank is required"),
    currency: Yup.string().required("Currency is required")
  });

  return (
    <Box bg="whiteAlpha.700">
      <Box p={2} borderRadius="2xl">
        <Formik
          initialValues={{
            settlementDate: "",
            settlementInputDate: new Date().toISOString().split("T")[0],
            settlementType: "",
            outstandingAmount: "",
            documentDueDate: "",
            exposureType: "",
            poNumber: "",
            invoiceBcNumber: "",
            partyName: "",
            businessUnit: "",
            bank: "",
            currency: "",
            settledAmount: "",

            // === TOGGLES ===
            isSpotEnabled: false,
            isEEFCExportsEnabled: false,
            isEEFCImportsEnabled: false,
            isPCFCEnabled: false,
            isForwardEnabled: false,

            // === LISTS (MULTIPLE ROWS) ===
            spotList: [],
            eefcExportsList: [],
            eefcImportsList: [],
            pcfcList: [],
            forwardList: [],

            // Summary fields
            settlementRate: "",
            settledAmountInINR: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            console.log("Settlement Form Submitted: ", values);
            setShowError(true);
            submitForm(values, actions, "form");
          }}
        >
          {({ values, handleChange, setFieldValue, errors, touched, isSubmitting }) => (
            <FormikForm>
              <ExposureAutoPopulateWatcher />

               <ExposureSettlementController
        setPoOptions={setPoOptions}
        setInvoiceOptions={setInvoiceOptions}
        
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
    (opt) => opt.value === values.settlementType
  )}
  onChange={(option) => {
    handleChange({
      target: { name: "settlementType", value: option.value },
    });

    // setFieldValue("poNumber", "");
    // setFieldValue("invoiceBcNumber", "");
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
    (opt) => opt.value === values.exposureType
  )}
  onChange={(option) => {
    handleChange({
      target: { name: "exposureType", value: option.value },
    });

    setFieldValue("poNumber", "");
    setFieldValue("invoiceBcNumber", "");
    setFieldValue('outstandingAmount', '');
    setFieldValue("documentDueDate", "");

  }}
  error={touched.exposureType && errors.exposureType}
  showError={showError}
/>

<CustomInput
  label="PO Number"
  name="poNumber"
  type="select"
  required
  options={poOptions}
  value={poOptions.find((opt) => opt.value === values.poNumber)}
  onChange={(option) =>
    handleChange({
      target: { name: "poNumber", value: option.value },
    })
  }
  error={touched.poNumber && errors.poNumber}
  showError={showError}
/>
<CustomInput
  label="Invoice BC Number"
  name="invoiceBcNumber"
  type="select"
  required
  options={invoiceOptions}
  value={invoiceOptions.find(
    (opt) => opt.value === values.invoiceBcNumber
  )}
  onChange={(option) =>
    handleChange({
      target: { name: "invoiceBcNumber", value: option.value },
    })
  }
  error={touched.invoiceBcNumber && errors.invoiceBcNumber}
  showError={showError}
/>

                <CustomInput
  label="Party Name"
  name="partyName"
  value={values.partyName}
  disabled
/>

<CustomInput
  label="Business Unit"
  name="businessUnit"
  value={values.businessUnit}
  disabled
/>

<CustomInput
  label="Bank"
  name="bank"
  value={values.bank}
  disabled
/>

<CustomInput
  label="Currency"
  name="currency"
  value={values.currency}
  disabled
/>
<CustomInput
  label="Outstanding Amount"
  name="outstandingAmount"
  value={values.outstandingAmount}
  disabled
/>
<CustomInput
  label="Document Due Date"
  name="documentDueDate"
  value={values.documentDueDate}
  disabled
/>

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
  <ForwardContractSection showError={showError} bank={values.bank} businessUnit={values.businessUnit} exposureType={values.exposureType} />
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
                    isLoading={isSubmitting}
                    type="submit"
                    size="lg"
                    onClick={() => setShowError(true)}
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

export default ExposureSettlementForm;