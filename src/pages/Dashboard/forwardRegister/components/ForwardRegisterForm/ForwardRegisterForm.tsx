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
import CustomInput from "../../../../../config/component/CustomInput/CustomInput";
import { primaryButtonHoverStyle, primaryButtonStyle } from "../../../../../globalStyles";
import { currencyOptions, exportRegisterexposureTypeOptions } from "../../../exportsRegister/component/utils/constant";
import { importExposureTypeOptions, mainExposureTypeOptions } from "../../../importsRegister/component/utils/constant";
import { banks } from "../../../pcfc/components/PCFCForm/dummyData";
import { calculateHedgeRate, getForwardRegisterInitialValues } from "./constant";
import ExposureRefSelector from "./ExposureRefSelector";

const ForwardRegisterForm = ({ submitForm , editData, originalData}: any) => {
  const toast = useToast();
  const [showError, setShowError] = useState(false);
  const [exposureRefOptions, setExposureRefOptions] = useState<any[]>([]);
  const isEdit = Boolean(editData);

  const [selectedMainExposureType, setSelectedMainExposureType] = useState('');
  const url = process.env.REACT_APP_FX_BASE_URL;
  const validationSchema = Yup.object({
    bookingDate: Yup.string().required("Booking Date is required"),
    exposureType: Yup.string().required("Exposure Type is required"),
    subExposureType: Yup.string().when('exposureType', {
      is: (exposureType: string) => exposureType === 'import' || exposureType === 'export',
      then: (schema) => schema.required("Sub Exposure Type is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    bank: Yup.string().required("Bank is required"),
    bussinessUnit: Yup.string().required("Business Unit is required"),
    hedgeDealReferenceNumber: Yup.string().required(
      "Hedge Deal Reference Number is required"
    ),
    currency: Yup.string().required("Currency is required"),
    hedgeAmount: Yup.number().required("Hedge Amount is required"),
    spotBooked: Yup.string().required("Spot Booked is required"),
    forwardPoints: Yup.string().required("Forward Points is required"),
    bankMargin: Yup.string().required("Bank Margin is required"),
    hedgeRate: Yup.string().required("Hedge Rate is required"),
    dueDateFrom: Yup.string().required("Due Date From is required"),
    dueDateTo: Yup.string().required("Due Date To is required"),
  });

  const fetchExpoRefNos = async (mainExposureType: string, subExposureType: string) => {
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
  };

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
}, [isEdit, editData]);

  return (
    <Box py={4}>
      <Box px={2}>
        <Formik     
        initialValues={getForwardRegisterInitialValues(editData)}
          validationSchema={validationSchema}
          enableReinitialize={true}
            onSubmit={(values, actions) => {
            if (isEdit) {
              submitForm(
                {
                  original: originalData,
                  updated: values,
                  rowId: editData?.rowId,
                },
                actions,
                isEdit ? "edit" : "form",
              );
            } else {
              setShowError(true);
              submitForm(values, actions, "form");
            }
          }}
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
                    label="Bank"
                    type="select"
                    name="bank"
                    placeholder="Enter Bank Name"
                    options={banks}
                    value={banks.find((option) => option.value === values.bank)}
                    onChange={(option) =>
                      handleChange({
                        target: { name: "bank", value: option.value },
                      })
                    }
                    showError={showError}
                    error={touched.bank && errors.bank}
                  />

                  <CustomInput
                    label="Business Unit"
                    name="bussinessUnit"
                    placeholder="Enter Business Unit"
                    value={values.bussinessUnit}
                    onChange={handleChange}
                    showError={showError}
                    error={touched.bussinessUnit && errors.bussinessUnit}
                    required={true}
                  />

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
{/* {(values.exposureType === "import" || values.exposureType === "export") &&
 exposureRefOptions.length > 0 && (
  <ExposureRefSelector
    values={values}
    setFieldValue={setFieldValue}
    exposureRefOptions={exposureRefOptions}
    fetchExposureData={getExposureDataByRef}
  />
)} */}

{(values.exposureType === "import" || values.exposureType === "export") &&
 exposureRefOptions?.length > 0 && (
  <ExposureRefSelector
    values={values}
    setFieldValue={setFieldValue}
    exposureRefOptions={exposureRefOptions}
    fetchExposureData={getExposureDataByRef}
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
                    isLoading={isSubmitting}
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

export default ForwardRegisterForm;