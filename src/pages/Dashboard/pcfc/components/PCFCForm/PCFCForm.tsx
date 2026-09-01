import { Box, Button, Flex, SimpleGrid, useToast, VStack } from "@chakra-ui/react";
import { Formik, Form as FormikForm, useFormikContext } from "formik";
import { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import { useStoreEdited } from "../../../../../config/component/customHooks/useStoreEdited";
import CustomInput from "../../../../../config/component/CustomInput/CustomInput"; // Adjust path as needed
import { extractFieldValue } from "../../../../../config/constant/function";
import {
  primaryButtonHoverStyle,
  primaryButtonStyle,
} from "../../../../../globalStyles"; // Adjust path as needed
import store from "../../../../../store/store";
import { pickMatchedFields } from "../../../utils/function";
import ConversionManager from "./ConversionManager";
import FormAutoCalculator from "./FormAutoCalculator";
import ModeOfConversion from "./ModeOfConversion";
import { getPcfcInitialValues } from "./utils/constant";
import {
  computeSpotNetRate,
  getBankMarginFromForm,
  getBankSpreadFromForm,
} from "./utils/spotHelpers";

const BankSpreadAutoFiller = ({ selectedBusinessUnits }: { selectedBusinessUnits: any[] }) => {
  const { values, setFieldValue }: any = useFormikContext();

  useEffect(() => {
    const nextBankSpread = getBankSpreadFromForm(
      values?.businessUnit,
      values?.bank,
      selectedBusinessUnits
    );

    if (String(values?.bankSpread ?? "") !== String(nextBankSpread ?? "")) {
      setFieldValue("bankSpread", nextBankSpread, false);
    }
  }, [values?.businessUnit, values?.bank, values?.bankSpread, selectedBusinessUnits, setFieldValue]);

  return null;
};

const PCFCForm = ({ submitForm, editData, originalData,onClose }: any) => {
  const [showError, setShowError] = useState(false); // Initially false, true on submit
  const isEdit = Boolean(editData);
  const {storeEdited, editLoading} = useStoreEdited();
  const { auth: { bussinessUnitsData, currenciesData, banksData } } = store
  const validationSchema = useMemo(() => Yup.object().shape({
    drawdownDate: Yup.string().required("Drawdown Date is required"),
    dueDate: Yup.string().required("Due Date is required"),
    businessUnit: Yup.mixed().required("Business Unit is required"),
    bank: Yup.mixed().required("Bank is required"),
    tradeReferenceNumber: Yup.string().required("Trade Reference Number is required"),
    currency: Yup.mixed().required("Currency is required"),

    enteredDrawdownAmount: Yup.number()
      .typeError("Drawdown Amount must be a number")
      .positive("Drawdown Amount must be greater than 0")
      .required("Drawdown Amount is required")
      .test(
        "match-calculated-drawdown",
        "Entered drawdown amount must match calculated total drawdown amount",
        function (value) {
          const { drawdownAmount } = this.parent;
          if (value == null || drawdownAmount == null) return true;
          return Number(value) === Number(drawdownAmount);
        }
      ),

    floatingInterestRate: Yup.string().required("Interest Rate is required"),
    bankSpread: Yup.string().required("Bank Spread is required"),

    // ✅ At least one mode must be selected
    isSpotEnabled: Yup.boolean(),
    isForwardEnabled: Yup.boolean(),

    modeValidation: Yup.mixed().test(
      "spot-or-forward-required",
      "Please enable Spot or Forward and fill details",
      function () {
        const { isSpotEnabled, isForwardEnabled } = this.parent;
        return isSpotEnabled || isForwardEnabled;
      }
    ),

    // Spot validation
    spotList: Yup.array().when("isSpotEnabled", {
      is: true,
      then: (schema) =>
        schema
          .of(
            Yup.object().shape({
              amountConverted: Yup.string().required("Required"),
              spotBooked: Yup.string().required("Required"),
              cashTomSpot: Yup.string().required("Required"),
            })
          )
          .min(1, "At least one Spot entry is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    // Forward validation
    forwardList: Yup.array().when("isForwardEnabled", {
      is: true,
      then: (schema) =>
        schema
          .of(
            Yup.object().shape({
              hedgeDealRefNo: Yup.string().required("Required"),
              utilizationAmount: Yup.string().required("Required"),
              forwardPremium: Yup.string().required("Required"),
              cashTomSpot: Yup.string().required("Required"),
            })
          )
          .min(1, "At least one Forward entry is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  }), []);

  const toast = useToast();
  const selectedBusinessUnits = store.auth.user?.businessUnits || [];

  const handleFormSubmit = async (handleSubmit: any, validateForm: any) => {
    setShowError(true);

    const validationErrors = await validateForm();
    if (validationErrors && Object.keys(validationErrors).length > 0) {
      const firstError = Object.values(validationErrors)[0] as string;
      toast({
        title: "Validation Error",
        description: firstError || "Please fill all required fields correctly",
        status: "error",
        duration: 6000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    handleSubmit();
  };


  return (
    <Box bg="whiteAlpha.700" py={4}>
      <Box px={2}>
        <Formik
          initialValues={getPcfcInitialValues(editData)}
          validationSchema={validationSchema}
          validateOnChange={false}
          validateOnBlur={false}
          enableReinitialize
            // onSubmit={async (values, actions) => {
            //                     values = extractFieldValue(values)
            //                     if (isEdit) {
            //                       const { original, updated } = pickMatchedFields(
            //                         originalData,
            //                         values,
            //                         editData?.rowID
            //                       );
                    
            //                       const payload = {
            //                         register: "pcfc",
            //                         data: [
            //                           {
            //                             original,
            //                             updated,
            //                             rowId: editData?.rowID, // optional if backend still expects it here
            //                           },
            //                         ],
            //                       };
                    
            //                       try {
            //                         await storeEdited(payload, onClose);
            //                         actions.resetForm();
            //                         actions.setSubmitting(false);
            //                       } catch (error) {
            //                         actions.setSubmitting(false);
            //                       }
                    
            //                       return;
            //                     }
            //                     setShowError(true);
            //                     submitForm(values, actions, "form");
            //                   }}

            onSubmit={async (values, actions) => {
  values = extractFieldValue(values);

  // ✅ Flatten bank: { label, value, bankMargin } → "HDFC"
  if (values.bank && typeof values.bank === "object") {
    values.bank = values.bank.value;
  }

  // ✅ Flatten businessUnit and currency too if they're objects
  if (values.businessUnit && typeof values.businessUnit === "object") {
    values.businessUnit = values.businessUnit.value;
  }
  if (values.currency && typeof values.currency === "object") {
    values.currency = values.currency.value;
  }

  // ✅ Ensure spotList bankMargin stays as plain string
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
      editData?.rowID
    );

    const payload = {
      register: "pcfc",
      data: [
        {
          original,
          updated,
          rowId: editData?.rowID,
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
  await submitForm(values, actions, "form");
}}
        >
          {({ values, handleChange, setFieldValue, isSubmitting, errors, touched, handleSubmit, validateForm }: any) => (
            <FormikForm>
              {/* Insert the Logic Component Here */}
              <BankSpreadAutoFiller selectedBusinessUnits={selectedBusinessUnits} />
              <FormAutoCalculator />
              <VStack spacing={6} align="stretch">
                {/* --- Section 1: Universal Headers --- */}
                <SimpleGrid columns={[1, null, 3]} spacing={4}>
                  <CustomInput
                    label="Drawdown Date"
                    name="drawdownDate"
                    type="date"
                    required
                    value={values.drawdownDate}
                    onChange={handleChange}
                    error={touched.drawdownDate && errors.drawdownDate}
                    showError={showError}
                  />
                  <CustomInput
                    label="Drawdown Amount"
                    name="enteredDrawdownAmount"
                    placeholder="Enter Drawdown Amount"
                    required
                    value={values.enteredDrawdownAmount}
                    onChange={handleChange}
                    error={touched.enteredDrawdownAmount && errors.enteredDrawdownAmount}
                    showError={showError}
                  />
                  <CustomInput
                    label="Due Date"
                    name="dueDate"
                    type="date"
                    required
                    value={values.dueDate}
                    onChange={handleChange}
                    error={touched.dueDate && errors.dueDate}
                    showError={showError}
                  />
                  <CustomInput
                    label="Business Unit"
                    type="select"
                    options={bussinessUnitsData}
                    name="businessUnit"
                    placeholder="Add Business Unit"
                    value={values.businessUnit}
                    onChange={(e) => {
                      setFieldValue("businessUnit", e);
                    }}
                    error={touched.businessUnit && errors.businessUnit}
                    showError={showError}
                    required
                  />

<CustomInput
  label="Bank"
  name="bank"
  type="select"
  required
  placeholder="Select Bank"
  options={banksData}
  value={values.bank}
  onChange={(opt: any) => {
    setFieldValue("bank", opt, false);

    const margin = getBankMarginFromForm(opt, banksData);

    if (values.spotList?.length > 0) {
      const updatedSpotList = values.spotList.map((spot: any) => ({
        ...spot,
        bankMargin: margin,
        netConversionRate: computeSpotNetRate(
          spot.spotBooked,
          spot.cashTomSpot,
          margin
        ),
      }));
      setFieldValue("spotList", updatedSpotList, false);
    }
  }}
  error={touched.bank && errors.bank}
  showError={showError}
/>

               
                  <CustomInput
                    label="Currency"
                    name="currency"
                    type="select"
                    required
                    placeholder="Select Pair"
                    options={currenciesData}
                    value={values.currency}
                    onChange={(opt: any) => setFieldValue("currency", opt)}
                    error={touched.currency && errors.currency}
                    showError={showError}
                  />

                  <CustomInput
                    label="Trade Ref No"
                    type="text"
                    required
                    name="tradeReferenceNumber"
                    placeholder="Add trade ref No"
                    value={values.tradeReferenceNumber}
                    onChange={handleChange}
                    error={touched.tradeReferenceNumber && errors.tradeReferenceNumber}
                    showError={showError}
                  />
                </SimpleGrid>

                {/* --- Section 2: Dynamic Conversion Manager --- */}
                <ModeOfConversion  />
                {/* Handles Switch Logic and Dynamic Arrays */}
                <ConversionManager showError={showError} />

                {errors.modeValidation && showError && (
                  <Box color="red.500" fontSize="sm">
                    {errors.modeValidation}
                  </Box>
                )}
                {values.isSpotEnabled && typeof errors.spotList === 'string' && showError && (
                  <Box color="red.500" fontSize="sm">{errors.spotList}</Box>
                )}
                {values.isForwardEnabled && typeof errors.forwardList === 'string' && showError && (
                  <Box color="red.500" fontSize="sm">{errors.forwardList}</Box>
                )}

                {/* --- Section 3: Aggregated Results --- */}
                <Box p={5} bg="gray.50" rounded="lg" border="1px solid" borderColor="gray.200" shadow={'base'}>
                  <SimpleGrid columns={[1, 2, 4]} spacing={6}>
                    <CustomInput
                      label="Total Drawdown Amount"
                      name="drawdownAmount"
                      value={values.drawdownAmount}
                      disabled={true}
                    />
                    <CustomInput
                      label="W. Avg Drawdown Rate"
                      name="drawdownRate"
                      value={values.drawdownRate}
                      disabled={true}
                    />
                    <CustomInput
                      label="Floating Interest (%)"
                      name="floatingInterestRate"
                      type="number"
                      value={values.floatingInterestRate}
                      onChange={handleChange}
                      error={touched.floatingInterestRate && errors.floatingInterestRate}
                      showError={showError}
                    />
                    <CustomInput
                      label="Bank Spread (%)"
                      name="bankSpread"
                      type="number"
                      disabled
                      value={values.bankSpread}
                      onChange={handleChange}
                      error={touched.bankSpread && errors.bankSpread}
                      showError={showError}
                    />
                    <CustomInput
                      label="Total Interest Rate (%)"
                      name="totalInterestRate"
                      value={values.totalInterestRate}
                      disabled={true}
                    />
                  </SimpleGrid>
                </Box>

                <Flex justify="end">
                  <Button
                    rounded="full"
                    {...primaryButtonStyle}
                    _hover={{ ...primaryButtonHoverStyle, border: "1px solid" }}
                    transition="transform 0.3s ease-in-out"
                    size="lg"
                    isLoading={isSubmitting || editLoading}
                    onClick={() => handleFormSubmit(handleSubmit, validateForm)}
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

export default PCFCForm;
