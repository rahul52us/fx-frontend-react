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
import { useState } from "react";
import * as Yup from "yup";
import CustomInput from "../../../../../config/component/CustomInput/CustomInput";
import { primaryButtonHoverStyle, primaryButtonStyle } from "../../../../../globalStyles";
import { currencyOptions, exportRegisterexposureTypeOptions } from "../../../exportsRegister/component/utils/constant";
import { banks } from "../../../pcfc/components/PCFCForm/dummyData";
import { importExposureTypeOptions, mainExposureTypeOptions } from "../../../importsRegister/component/utils/constant";

const ForwardRegisterForm = ({ submitForm }: any) => {
  const toast = useToast();
  const [showError, setShowError] = useState(false);
  const [exposureRefOptions, setExposureRefOptions] = useState<any[]>([]);
  const [selectedExposureData, setSelectedExposureData] = useState<any>(null);
  const [showExposureFields, setShowExposureFields] = useState(false);
  const [selectedMainExposureType, setSelectedMainExposureType] = useState('');
  const url = process.env.REACT_APP_FX_BASE_URL;
  // const url = "https://7b0fa03efa8d.ngrok-free.app";

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
    
    // Clear existing exposure data when main exposure type changes
    setSelectedExposureData(null);
    setShowExposureFields(false);
    setFieldValue("exposureRefNumber", "");
    setFieldValue("subExposureType", "");
    setFieldValue("outStandingAmount", "");
    setFieldValue("rmPolicyRate", "");
    setFieldValue("dueDate", "");
    setFieldValue("allocatedAmount", "");
    
    // Recalculate hedge rate when exposure type changes
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

  const handleExposureRefChange = (selectedOption: any, setFieldValue: any) => {
    if (selectedOption) {
      // Find the complete exposure data from the options
      const exposureData = exposureRefOptions.find(
        (option) => option.value === selectedOption.value
      );
      
      if (exposureData) {
        setSelectedExposureData(exposureData);
        setShowExposureFields(true);
        
        // Set the exposureRefNumber value
        setFieldValue("exposureRefNumber", selectedOption.value);
        // Auto-populate the fields with the exposure data
        setFieldValue("outStandingAmount", exposureData.outStandingAmount);
        setFieldValue("rmPolicyRate", exposureData.rmPolicyRate);
        setFieldValue("dueDate", exposureData.dueDate);
        setFieldValue("allocatedAmount", exposureData.allocatedAmount || "");
      }
    } else {
      // Clear the fields if no option is selected
      setSelectedExposureData(null);
      setShowExposureFields(false);
      setFieldValue("exposureRefNumber", "");
      setFieldValue("outStandingAmount", "");
      setFieldValue("rmPolicyRate", "");
      setFieldValue("dueDate", "");
      setFieldValue("allocatedAmount", "");
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

  // Function to calculate hedge rate based on exposure type
  const calculateHedgeRate = (values: any) => {
    const { exposureType, spotBooked, forwardPoints, bankMargin } = values;

    // Convert string values to numbers, handling empty strings
    const spot = parseFloat(spotBooked) || 0;
    const points = parseFloat(forwardPoints) || 0;
    const margin = parseFloat(bankMargin) || 0;

    if (exposureType && spotBooked && forwardPoints && bankMargin) {
      let calculatedRate = 0;

      if (
        exposureType.toLowerCase().includes("export") ||
        exposureType === "exports" ||
        exposureType === "export"
      ) {
        // For exports: spot booked + forward points - bank margin
        calculatedRate = spot + points - margin;
      } else if (
        exposureType.toLowerCase().includes("import") ||
        exposureType === "imports" ||
        exposureType === "import"
      ) {
        // For imports: spot booked + forward points + bank margin
        calculatedRate = spot + points + margin;
      }

      return calculatedRate.toFixed(2); // Return with precision for rates
    }

    return "";
  };

  return (
    <Box py={4}>
      <Box px={2}>
        <Formik
          initialValues={{
            exposureRefNumber: "",
            subExposureType: "",
            allocatedAmount:"",
            exposureType: "",
            rmPolicyRate: "",
            dueDate:"",
            outStandingAmount:""
          }}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={(values: any, actions: any) => {
            submitForm(values, actions, "form");
            actions.setSubmitting(false);
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
                    error={touched.exposureType && errors.exposureType}
                    showError={showError}
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
                      error={touched.subExposureType && errors.subExposureType}
                      showError={showError}
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
                    error={touched.bank && errors.bank}
                    showError={showError}
                  />

                  <CustomInput
                    label="Business Unit"
                    name="bussinessUnit"
                    placeholder="Enter Business Unit"
                    value={values.bussinessUnit}
                    onChange={handleChange}
                    error={touched.bussinessUnit && errors.bussinessUnit}
                    required={true}
                    showError={showError}
                  />

                  <CustomInput
                    label="Hedge Deal Reference Number"
                    name="hedgeDealReferenceNumber"
                    placeholder="Enter Deal Reference Number"
                    value={values.hedgeDealReferenceNumber}
                    onChange={handleChange}
                    error={
                      touched.hedgeDealReferenceNumber &&
                      errors.hedgeDealReferenceNumber
                    }
                    required={true}
                    showError={showError}
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
                    required={true}
                    showError={showError}
                  />

                  <CustomInput
                    label="Hedge Amount"
                    name="hedgeAmount"
                    type="number"
                    placeholder="Enter Amount"
                    value={values.hedgeAmount}
                    onChange={handleChange}
                    error={touched.hedgeAmount && errors.hedgeAmount}
                    required={true}
                    showError={showError}
                  />

                  <CustomInput
                    label="Spot Booked"
                    name="spotBooked"
                    placeholder="Enter Spot Booked"
                    value={values.spotBooked}
                    onChange={(e: any) => {
                      handleChange(e);
                      // Recalculate hedge rate when spot booked changes
                      const calculatedRate = calculateHedgeRate({
                        ...values,
                        spotBooked: e.target.value,
                      });
                      setFieldValue("hedgeRate", calculatedRate);
                    }}
                    error={touched.spotBooked && errors.spotBooked}
                    required={true}
                    showError={showError}
                  />

                  <CustomInput
                    label="Forward Points"
                    name="forwardPoints"
                    placeholder="Enter Forward Points"
                    value={values.forwardPoints}
                    onChange={(e: any) => {
                      handleChange(e);
                      // Recalculate hedge rate when forward points change
                      const calculatedRate = calculateHedgeRate({
                        ...values,
                        forwardPoints: e.target.value,
                      });
                      setFieldValue("hedgeRate", calculatedRate);
                    }}
                    error={touched.forwardPoints && errors.forwardPoints}
                    required={true}
                    showError={showError}
                  />

                  <CustomInput
                    label="Bank Margin"
                    name="bankMargin"
                    placeholder="Enter Bank Margin"
                    value={values.bankMargin}
                    onChange={(e: any) => {
                      handleChange(e);
                      // Recalculate hedge rate when bank margin changes
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

                  <CustomInput
                    label="Exposure Ref Number"
                    name="exposureRefNumber"
                    type="select"
                    options={exposureRefOptions}
                    placeholder="Enter Exposure Ref Number"
                    value={exposureRefOptions.find(
                      (option) => option.value === values.exposureRefNumber
                    )}
                    onChange={(selectedOption) =>
                      handleExposureRefChange(selectedOption, setFieldValue)
                    }
                    error={
                      touched.exposureRefNumber && errors.exposureRefNumber
                    }
                    showError={showError}
                  />
                </SimpleGrid>

                {/* Show exposure fields only when exposure ref number is selected */}
                {showExposureFields && selectedExposureData && (
                  <Box 
                    p={4} 
                    border="1px" 
                    borderColor="gray.200" 
                    borderRadius="md" 
                    bg="gray.50"
                  >
                    <SimpleGrid columns={[1, null, 2]} spacing={6}>
                      <CustomInput
                        label="Outstanding Amount"
                        name="outStandingAmount"
                        placeholder="Outstanding Amount"
                        value={values.outStandingAmount}
                        onChange={handleChange}
                        error={touched.outStandingAmount && errors.outStandingAmount}
                        showError={showError}
                        disabled={true}
                      />

                      <CustomInput
                        label="RM Policy Rate"
                        name="rmPolicyRate"
                        placeholder="RM Policy Rate"
                        value={values.rmPolicyRate}
                        onChange={handleChange}
                        error={touched.rmPolicyRate && errors.rmPolicyRate}
                        showError={showError}
                        disabled={true}
                      />

                      <CustomInput
                        label="Due Date"
                        name="dueDate"
                        placeholder="Due Date"
                        value={values.dueDate}
                        onChange={handleChange}
                        error={touched.dueDate && errors.dueDate}
                        showError={showError}
                        disabled={true}
                      />

                       <CustomInput
                        label="Allocated Amount"
                        name="allocatedAmount"
                        type="number"
                        placeholder="Enter Allocated Amount"
                        value={values.allocatedAmount}
                        onChange={handleChange}
                        error={touched.allocatedAmount && errors.allocatedAmount}
                        showError={showError}
                      /> 
                    </SimpleGrid>
                  </Box>
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