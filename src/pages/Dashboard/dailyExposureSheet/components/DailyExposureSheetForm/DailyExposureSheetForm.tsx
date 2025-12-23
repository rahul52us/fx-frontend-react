"use client";

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  SimpleGrid,
  Switch,
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

import { exposureTypeOptions } from "../../../exportsRegister/component/utils/constant";
import EEFCExportsSection from "./component/EEFCExportsSection";
import EEFCImportsSection from "./component/EEFCImportsSection";
import ForwardContractSection from "./component/ForwardContractSection";
import PCFCRepaymentSection from "./component/PCFCRepaymentSection";
import SpotConversionSection from "./component/SpotConversionSection";
import { invoiceBCNumberOptions } from "./exposureSettlementConstant";
import SpotForwardCalculation from "./utils/SpotForwardCalculation";

const ExposureSettlementForm = ({ submitForm }: any) => {
  const [showError, setShowError] = useState(false);

  // Base Validation
  const validationSchema = Yup.object({
    settlementDate: Yup.string().required("Settlement Date is required"),
    settlementType: Yup.string().required("Settlement Type is required"),
    poNumber: Yup.string().required("PO Number is required"),
    invoiceBcNumber: Yup.string().required("Invoice BC Number is required"),
    settledAmount: Yup.number().required("Settled Amount is required"),
  });

  return (
    <Box bg="whiteAlpha.700">
      <Box p={2} borderRadius="2xl">
        <Formik
          initialValues={{
            settlementDate: "",
            settlementInputDate: new Date().toISOString().split("T")[0],
            settlementType: "",
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
            netRate: "",
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
              <VStack spacing={6} align="stretch">
                {/* ===================== TOP DETAILS ===================== */}

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
                    options={exposureTypeOptions}
                    value={exposureTypeOptions.find(
                      (opt) => opt.value === values.settlementType
                    )}
                    onChange={(option) =>
                      handleChange({
                        target: { name: "settlementType", value: option.value },
                      })
                    }
                    error={touched.settlementType && errors.settlementType}
                    showError={showError}
                  />

                  <CustomInput
                    label="PO Number"
                    name="poNumber"
                    value={values.poNumber}
                    onChange={handleChange}
                    error={touched.poNumber && errors.poNumber}
                    showError={showError}
                  />

                  <CustomInput
                    label="Invoice BC Number"
                    name="invoiceBcNumber"
                    type="select"
                    options={invoiceBCNumberOptions}
                    value={invoiceBCNumberOptions.find(
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

                  {/* auto-populated fields */}
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
                </SimpleGrid>

                {/* ===================== GROUPED TOGGLES ===================== */}
                <Box
                  p={4}
                  bg="gray.50"
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <Box fontWeight={700} mb={3}>
                    Select Conversion Types
                  </Box>

                  <Grid  gap={6} templateColumns={'1fr 1fr 1fr'}>
                    <FormControl display="flex" alignItems="center">
                      <FormLabel mb="0">Spot Conversion</FormLabel>
                      <Switch
                        isChecked={values.isSpotEnabled}
                        onChange={(e) => {
                          setFieldValue("isSpotEnabled", e.target.checked);
                          if (e.target.checked && values.spotList.length === 0) {
                            setFieldValue("spotList", [{}]);
                          }
                          if (!e.target.checked) setFieldValue("spotList", []);
                        }}
                        colorScheme="blue"
                      />
                    </FormControl>

                    {/* ===================== EEFC TOGGLES ===================== */}

{values.settlementType === "exports" && (
  <FormControl display="flex" alignItems="center">
    <FormLabel mb="0">EEFC – Exports</FormLabel>
    <Switch
      isChecked={values.isEEFCExportsEnabled}
      onChange={(e) => {
        setFieldValue("isEEFCExportsEnabled", e.target.checked);
        if (e.target.checked && values.eefcExportsList.length === 0) {
          setFieldValue("eefcExportsList", [{}]);
        }
        if (!e.target.checked) {
          setFieldValue("eefcExportsList", []);
        }
      }}
      colorScheme="green"
    />
  </FormControl>
)}

{values.settlementType === "imports" && (
  <FormControl display="flex" alignItems="center">
    <FormLabel mb="0">EEFC – Imports</FormLabel>
    <Switch
      isChecked={values.isEEFCImportsEnabled}
      onChange={(e) => {
        setFieldValue("isEEFCImportsEnabled", e.target.checked);
        if (e.target.checked && values.eefcImportsList.length === 0) {
          setFieldValue("eefcImportsList", [{}]);
        }
        if (!e.target.checked) {
          setFieldValue("eefcImportsList", []);
        }
      }}
      colorScheme="teal"
    />
  </FormControl>
)}


                    {/* <FormControl display="flex" alignItems="center">
                      <FormLabel mb="0">EEFC – Exports</FormLabel>
                      <Switch
                        isChecked={values.isEEFCExportsEnabled}
                        onChange={(e) => {
                          setFieldValue("isEEFCExportsEnabled", e.target.checked);
                          if (e.target.checked && values.eefcExportsList.length === 0) {
                            setFieldValue("eefcExportsList", [{}]);
                          }
                          if (!e.target.checked) setFieldValue("eefcExportsList", []);
                        }}
                        colorScheme="green"
                      />
                    </FormControl>

                    <FormControl display="flex" alignItems="center">
                      <FormLabel mb="0">EEFC – Imports</FormLabel>
                      <Switch
                        isChecked={values.isEEFCImportsEnabled}
                        onChange={(e) => {
                          setFieldValue("isEEFCImportsEnabled", e.target.checked);
                          if (e.target.checked && values.eefcImportsList.length === 0) {
                            setFieldValue("eefcImportsList", [{}]);
                          }
                          if (!e.target.checked) setFieldValue("eefcImportsList", []);
                        }}
                        colorScheme="teal"
                      />
                    </FormControl> */}

                    <FormControl display="flex" alignItems="center">
                      <FormLabel mb="0">PCFC Repayment</FormLabel>
                      <Switch
                        isChecked={values.isPCFCEnabled}
                        onChange={(e) => {
                          setFieldValue("isPCFCEnabled", e.target.checked);
                          if (e.target.checked && values.pcfcList.length === 0) {
                            setFieldValue("pcfcList", [{}]);
                          }
                          if (!e.target.checked) setFieldValue("pcfcList", []);
                        }}
                        colorScheme="orange"
                      />
                    </FormControl>

                    <FormControl display="flex" alignItems="center">
                      <FormLabel mb="0">Forward Contract</FormLabel>
                      <Switch
                        isChecked={values.isForwardEnabled}
                        onChange={(e) => {
                          setFieldValue("isForwardEnabled", e.target.checked);
                          if (e.target.checked && values.forwardList.length === 0) {
                            setFieldValue("forwardList", [{}]);
                          }
                          if (!e.target.checked) setFieldValue("forwardList", []);
                        }}
                        colorScheme="pink"
                      />
                    </FormControl>
                  </Grid>
                </Box>

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
  <ForwardContractSection showError={showError} />
)}


                {/* ===================== SUMMARY SECTION ===================== */}
                <Box p={4} bg="gray.100" borderRadius="lg">
                  <SimpleGrid columns={[1, 2, 4]} spacing={6}>
                    <CustomInput
                      label="Net Rate"
                      name="netRate"
                      value={values.netRate}
                      disabled
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
                    <CustomInput
                      label="Settled Amount"
                      name="settledAmount"
                      value={values.settledAmount}
                      onChange={handleChange}
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