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
import { useStoreEdited } from "../../../../../config/component/customHooks/useStoreEdited";
import CustomInput from "../../../../../config/component/CustomInput/CustomInput";
import { extractFieldValue } from "../../../../../config/constant/function";
import { primaryButtonHoverStyle, primaryButtonStyle } from "../../../../../globalStyles";
import store from "../../../../../store/store";
import { exportRegisterexposureTypeOptions } from "../../../exportsRegister/component/utils/constant";
import { importExposureTypeOptions, mainExposureTypeOptions } from "../../../importsRegister/component/utils/constant";
import { pickMatchedFields } from "../../../utils/function";
import { calculateHedgeRate, getForwardRegisterInitialValues } from "./constant";
import ExposureRefSelector from "./ExposureRefSelector";
import { getForwardRegisterValidationSchema } from "../utils/validationSchema";

const ForwardRegisterForm = ({ submitForm, editData, originalData,onClose }: any) => {
  const toast = useToast();
  const [showError, setShowError] = useState(false);
  const [exposureRefOptions, setExposureRefOptions] = useState<any[]>([]);
  const isEdit = Boolean(editData);
  const { auth: { bussinessUnitsData, currenciesData, banksData } } = store
  const [selectedMainExposureType, setSelectedMainExposureType] = useState('');
  const url = process.env.REACT_APP_FX_BASE_URL;
  const { storeEdited, editLoading } = useStoreEdited();
  const validationSchema = getForwardRegisterValidationSchema(isEdit);

  const fetchExpoRefNos = useCallback(async (mainExposureType: string, subExposureType: string) => {
    try {
      const response = await axios.post(
        `${url}/exportregister/fetchdataforforwardreg/`,
        {
          process: mainExposureType,
          exposureType: subExposureType,
        }
      );
      const result = response.data?.data || [];

      const exposureRefNodata = result.map((item: any) => ({
        label: item.exposureRefNum,
        value: item.exposureRefNum,
        ...item,
      }));

      setExposureRefOptions(exposureRefNodata);
    } catch (error) {
      console.error("Error fetching exposure details:", error);
      setExposureRefOptions([]);
    }
  }, [url]);

  const handleMainExposureTypeChange = (option: any, setFieldValue: any, currentValues: any) => {
    const mainType = option.value;
    setSelectedMainExposureType(mainType);
    setFieldValue("exposureType", mainType);
    setFieldValue("subExposureType", "");
    const calculatedRate = calculateHedgeRate({
      ...currentValues,
      exposureType: mainType,
    });
    setFieldValue("hedgeRate", calculatedRate);
  };

  const handleSubExposureTypeChange = (option: any, setFieldValue: any) => {
    setFieldValue("subExposureType", option.value);

    // Fetch exposure ref numbers based on selected main type and sub type
    if (selectedMainExposureType && option.value) {
      fetchExpoRefNos(selectedMainExposureType, option.value);
    }
  };

  const getSubExposureTypeOptions = () => {
    if (selectedMainExposureType === 'import') {
      return importExposureTypeOptions;
    } else if (selectedMainExposureType === 'export') {
      return exportRegisterexposureTypeOptions;
    }
    return [];
  };


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

  const getExposureDataByRef = (refNumber: string) => {
    return exposureRefOptions.find(
      (item) => item.value === refNumber
    );
  };

  useEffect(() => {
    if (isEdit && editData?.exposureType) {
      setSelectedMainExposureType(editData.exposureType);
    }
  }, [isEdit, editData]);

  useEffect(() => {
    if (
      isEdit &&
      editData?.exposureType &&
      editData?.subExposureType
    ) {
      fetchExpoRefNos(
        editData.exposureType,
        editData.subExposureType
      );
    }
  }, [isEdit, editData, fetchExpoRefNos]);

  return (
    <Box py={4}>
      <Box px={2}>
        <Formik
          initialValues={getForwardRegisterInitialValues(editData)}
          validationSchema={validationSchema}
          enableReinitialize={true}
onSubmit={async (values, actions) => {
  values = extractFieldValue(values);

  // ✅ Flatten select objects to plain strings
  if (values.bank && typeof values.bank === "object") {
    values.bank = values.bank.value;
  }
  if (values.bussinessUnit && typeof values.bussinessUnit === "object") {
    values.bussinessUnit = values.bussinessUnit.value;
  }
  if (values.currency && typeof values.currency === "object") {
    values.currency = values.currency.value;
  }

  if (isEdit) {
    const { original, updated } = pickMatchedFields(
      originalData,
      values,
      editData?.rowId
    );

    const payload = {
      register: "forwardRegister",
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
          //  onSubmit={async (values, actions) => {
            //           values = extractFieldValue(values)
            //           if (isEdit) {
            //             const { original, updated } = pickMatchedFields(
            //               originalData,
            //               values,
            //               editData?.rowId
            //             );
          
            //             const payload = {
            //               register: "forwardRegister",
            //               data: [
            //                 {
            //                   original,
            //                   updated,
            //                   rowId: editData?.rowId, // optional if backend still expects it here
            //                 },
            //               ],
            //             };
          
            //             try {
            //               await storeEdited(payload, onClose);
            //               actions.resetForm();
            //               actions.setSubmitting(false);
            //             } catch (error) {
            //               actions.setSubmitting(false);
            //             }
          
            //             return;
            //           }
            //           setShowError(true);
            //           submitForm(values, actions, "form");
            //         }}
        >
          {({
            values,
            handleChange,
            isSubmitting,
            errors,
            touched,
            handleSubmit,
            setFieldValue,
          }: any) => (
            <FormikForm>
              <VStack spacing={6} align="stretch">
                <SimpleGrid columns={[1, null, 2]} spacing={6}>
                  <CustomInput
                    label="Exposure Type"
                    name="exposureType"
                    type="select"
                    options={mainExposureTypeOptions}
                    value={mainExposureTypeOptions.find(
                      (opt) => opt.value === values.exposureType
                    )}
                    onChange={(option) => {
                      handleMainExposureTypeChange(option, setFieldValue, values);
                    }}
                    showError={showError}
                    error={touched.exposureType && errors.exposureType}
                  />

                  {(values.exposureType === 'import' || values.exposureType === 'export') && (
                    <CustomInput
                      label={values.exposureType === 'import' ? 'Import Type' : 'Export Type'}
                      name="subExposureType"
                      type="select"
                      options={getSubExposureTypeOptions()}
                      value={getSubExposureTypeOptions().find(
                        (opt) => opt.value === values.subExposureType
                      )}
                      onChange={(option) => {
                        handleSubExposureTypeChange(option, setFieldValue);
                      }}
                      showError={showError}
                      error={touched.subExposureType && errors.subExposureType}
                      placeholder={`Select ${values.exposureType} type`}
                    />
                  )}

                  <CustomInput
                    label="Booking Date"
                    name="bookingDate"
                    type="date"
                    value={values.bookingDate}
                    onChange={handleChange}
                    error={touched.bookingDate && errors.bookingDate}
                    required={true}
                    showError={showError}
                  />

                  <CustomInput
                    label="Business Unit"
                    name="bussinessUnit"
                    type="select"
                    placeholder="Enter Business Unit"
                    value={values.bussinessUnit}
                    options={bussinessUnitsData}
                    onChange={(e: any) => setFieldValue('bussinessUnit', e)}
                    showError={showError}
                    error={touched.bussinessUnit && errors.bussinessUnit}
                    required={true}
                  />

                  {/* <CustomInput
                    label="Bank"
                    type="select"
                    name="bank"
                    placeholder="Enter Bank Name"
                    options={banksData}
                    value={values.bank}
                    onChange={(option) =>
                      handleChange({
                        target: { name: "bank", value: option },
                      })
                    }
                    showError={showError}
                    error={touched.bank && errors.bank}
                  /> */}

                  <CustomInput
  label="Bank"
  type="select"
  name="bank"
  placeholder="Enter Bank Name"
  options={banksData}
  value={values.bank || null}   // ✅ pass full object
  onChange={(option) => {
    setFieldValue("bank", option); // ✅ store full object

    const margin = option?.bankMargin ?? "";

    setFieldValue("bankMargin", margin);

    const calculatedRate = calculateHedgeRate({
      ...values,
      bank: option,
      bankMargin: margin,
    });

    setFieldValue("hedgeRate", calculatedRate);
  }}
  showError={showError}
  error={touched.bank && errors.bank}
/>
{/* 
<CustomInput
  label="Bank"
  type="select"
  name="bank"
  placeholder="Enter Bank Name"
  options={banksData}
  value={values.bank.value}
  onChange={(option) => {
    handleChange({
      target: { name: "bank", value: option },
    });

    // ✅ Auto-populate bankMargin from selected bank's margin
    const selectedBank = banksData.find((b: any) => b.value === option?.value);
    const margin = selectedBank?.bankMargin ?? "";

    setFieldValue("bankMargin", margin);

    // ✅ Recalculate hedgeRate with new bankMargin
    const calculatedRate = calculateHedgeRate({
      ...values,
      bank: option,
      bankMargin: margin,
    });
    setFieldValue("hedgeRate", calculatedRate);
  }}
  showError={showError}
  error={touched.bank && errors.bank}
/> */}


                  <CustomInput
                    label="Hedge Deal Reference Number"
                    name="hedgeDealReferenceNumber"
                    placeholder="Enter Deal Reference Number"
                    value={values.hedgeDealReferenceNumber}
                    onChange={handleChange}
                    showError={showError}
                    error={
                      touched.hedgeDealReferenceNumber &&
                      errors.hedgeDealReferenceNumber
                    }
                    required={true}
                  />

                  <CustomInput
                    label="Currency"
                    type="select"
                    name="currency"
                    options={currenciesData}
                    value={values.currency}
                    onChange={(selectedOption) =>
                      handleChange({
                        target: {
                          name: "currency",
                          value: selectedOption
                        },
                      })
                    }
                    showError={showError}
                    error={touched.currency && errors.currency}
                    required={true}
                  />

                  <CustomInput
                    label="Hedge Amount"
                    name="hedgeAmount"
                    type="number"
                    placeholder="Enter Amount"
                    value={values.hedgeAmount}
                    onChange={handleChange}
                    showError={showError}
                    error={touched.hedgeAmount && errors.hedgeAmount}
                    required={true}
                  />

                  <CustomInput
                    label="Spot Booked"
                    name="spotBooked"
                    placeholder="Enter Spot Booked"
                    value={values.spotBooked}
                    onChange={(e: any) => {
                      handleChange(e);
                      const calculatedRate = calculateHedgeRate({
                        ...values,
                        spotBooked: e.target.value,
                      });
                      setFieldValue("hedgeRate", calculatedRate);
                    }}
                    showError={showError}
                    error={touched.spotBooked && errors.spotBooked}
                    required={true}
                  />

                  <CustomInput
                    label="Forward Points"
                    name="forwardPoints"
                    placeholder="Enter Forward Points"
                    value={values.forwardPoints}
                    onChange={(e: any) => {
                      handleChange(e);
                      const calculatedRate = calculateHedgeRate({
                        ...values,
                        forwardPoints: e.target.value,
                      });
                      setFieldValue("hedgeRate", calculatedRate);
                    }}
                    error={touched.forwardPoints && errors.forwardPoints}
                    showError={showError}
                    required={true}
                  />

                  <CustomInput
                    label="Bank Margin"
                    name="bankMargin"
                    placeholder="Enter Bank Margin"
                    value={values.bankMargin}
                    onChange={(e: any) => {
                      handleChange(e);
                      const calculatedRate = calculateHedgeRate({
                        ...values,
                        bankMargin: e.target.value,
                      });
                      setFieldValue("hedgeRate", calculatedRate);
                    }}
                    error={touched.bankMargin && errors.bankMargin}
                    required={true}
                    showError={showError}
                  />

                  <CustomInput
                    label="Hedge Rate"
                    name="hedgeRate"
                    placeholder="Rate"
                    value={values.hedgeRate}
                    onChange={handleChange}
                    error={touched.hedgeRate && errors.hedgeRate}
                    required={true}
                    showError={showError}
                    disabled={true}
                  />

                  <CustomInput
                    label="Due Date From"
                    name="dueDateFrom"
                    type="date"
                    value={values.dueDateFrom}
                    onChange={handleChange}
                    error={touched.dueDateFrom && errors.dueDateFrom}
                    required={true}
                    showError={showError}
                  />

                  <CustomInput
                    label="Due Date To"
                    name="dueDateTo"
                    type="date"
                    value={values.dueDateTo}
                    onChange={handleChange}
                    error={touched.dueDateTo && errors.dueDateTo}
                    required={true}
                    showError={showError}
                  />
                </SimpleGrid>
                {(values.exposureType === "import" || values.exposureType === "export") &&
                  exposureRefOptions?.length > 0 && (
                    <ExposureRefSelector
                      values={values}
                      setFieldValue={setFieldValue}
                      exposureRefOptions={exposureRefOptions}
                      fetchExposureData={getExposureDataByRef}
                      errors={errors}
                    />
                  )}


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
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default ForwardRegisterForm;