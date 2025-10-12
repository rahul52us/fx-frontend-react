"use client";

import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Select, SimpleGrid, VStack } from "@chakra-ui/react";
import axios from "axios";
import { Formik, Form as FormikForm } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import CustomInput from "../../../../../config/component/CustomInput/CustomInput";
import {
  primaryButtonHoverStyle,
  primaryButtonStyle,
} from "../../../../../globalStyles";
import {
  currencyOptions,
  pcfcModeOfConversionOptions,
} from "../../../exportsRegister/component/utils/constant";
import { banks, bankSpreadOptions, forwardRegDataAllData } from "./dummyData";


const PCFCForm = ({ submitForm }: any) => {
  const [showError, setShowError] = useState(true);
  const [modeOfConversion, setModeOfConversion] = useState("");
  const [dealId, setDealId] = useState<any[]>([]);
  const url = process.env.REACT_APP_FX_BASE_URL;
  console.log(dealId)


  // ✅ Validation Schema
  const validationSchema: any = Yup.object().shape({
    drawdownDate: Yup.string().required("Drawdown Date is required"),
    dueDate: Yup.string().required("Due Date is required"),
    bank: Yup.string().required("Bank is required"),
    tradeReferenceNumber: Yup.string().required(
      "Trade Reference Number is required"
    ),
    modeOfConversion: Yup.string().required("Mode of Conversion is required"),
    currency: Yup.mixed().required("Currency is required"),
    drawdownAmount: Yup.string().required("Drawdown Amount is required"),
    drawdownRate: Yup.string().required("Drawdown Rate is required"),
    floatingInterestRate: Yup.string().required(
      "Floating Interest Rate is required"
    ),
    bankSpread: Yup.string().required("Bank Spread is required"),
    totalInterestRate: Yup.string().required("Total Interest Rate is required"),

    // ✅ Conditional validations
    hedgeDealRefNo: Yup.string().when(
      "modeOfConversion",
      (mode: any, schema: any) =>
        mode === "forward"
          ? schema.required("Hedge Deal Ref No is required")
          : schema.notRequired()
    ),
    outstandingAmount: Yup.string().when(
      "modeOfConversion",
      (mode: any, schema: any) =>
        mode === "forward"
          ? schema.required("Outstanding Amount is required")
          : schema.notRequired()
    ),
    utilizationAmount: Yup.string().when(
      "modeOfConversion",
      (mode: any, schema: any) =>
        mode === "spot"
          ? schema.required("Utilization Amount is required")
          : schema.notRequired()
    ),
    hedgeRate: Yup.string().when("modeOfConversion", (mode: any, schema: any) =>
      mode === "forward"
        ? schema.required("Hedge Rate is required")
        : schema.notRequired()
    ),
    deliveryDateFrom: Yup.string().when(
      "modeOfConversion",
      (mode: any, schema: any) =>
        mode === "forward"
          ? schema.required("Delivery Date From is required")
          : schema.notRequired()
    ),
    deliveryDateTo: Yup.string().when(
      "modeOfConversion",
      (mode: any, schema: any) =>
        mode === "forward"
          ? schema.required("Delivery Date To is required")
          : schema.notRequired()
    ),
    forwardPremium: Yup.string().when(
      "modeOfConversion",
      (mode: any, schema: any) =>
        mode === "spot"
          ? schema.required("Forward Premium is required")
          : schema.notRequired()
    ),
    cashTomSpot: Yup.string().when(
      "modeOfConversion",
      (mode: any, schema: any) =>
        mode === "spot"
          ? schema.required("Cash/Tom Spot is required")
          : schema.notRequired()
    ),
    netSettlementRate: Yup.string().when(
      "modeOfConversion",
      (mode: any, schema: any) =>
        mode === "spot"
          ? schema.required("Net Settlement Rate is required")
          : schema.notRequired()
    ),
    amountConverted: Yup.string().when(
      "modeOfConversion",
      (mode: any, schema: any) =>
        mode === "spot"
          ? schema.required("Amount Converted is required")
          : schema.notRequired()
    ),
    spotBooked: Yup.string().when(
      "modeOfConversion",
      (mode: any, schema: any) =>
        mode === "spot"
          ? schema.required("Spot Booked is required")
          : schema.notRequired()
    ),
    bankMargin: Yup.string().when(
      "modeOfConversion",
      (mode: any, schema: any) =>
        mode === "forward"
          ? schema.required("Bank Margin is required")
          : schema.notRequired()
    ),
    netConversionRate: Yup.string().when(
      "modeOfConversion",
      (mode: any, schema: any) =>
        mode === "spot"
          ? schema.required("Net Conversion Rate is required")
          : schema.notRequired()
    ),
  });

  // ✅ Fetch Deal Ids
  const fetchDealId = async () => {
    try {
      const response = await axios.post(`${url}/pcfcregister/dealid/`);
      const result = response.data?.data || [];
      const exportRegOptions = result.map((item: any, idx: number) => ({
        label: item.poNo,
        value: item.poNo,
        sno: idx + 1,
        ...item,
      }));
      setDealId(exportRegOptions);
    } catch (err: any) {
      console.error("Error fetching deal id:", err.message);
    }
  };

  useEffect(() => {
    fetchDealId();
  }, []);

  // ✅ FORM JSX
  return (
    <Box bg="whiteAlpha.700" py={4}>
      <Box px={2}>
        <Formik
          initialValues={{}}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={(values, actions) => {
            console.log("Form Values:", values);
            setShowError(true);
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
            setFieldValue,
          }: any) => (
            <FormikForm>
              <VStack spacing={6} align="stretch">
                <SimpleGrid columns={[1, null, 2]} spacing={8}>
                  <CustomInput
                    label="Drawdown Date"
                    name="drawdownDate"
                    type="date"
                    value={values.drawdownDate}
                    onChange={handleChange}
                    error={touched.drawdownDate && errors.drawdownDate}
                    showError={showError}
                  />
                  <CustomInput
                    label="Due Date"
                    name="dueDate"
                    type="date"
                    value={values.dueDate}
                    onChange={handleChange}
                    error={touched.dueDate && errors.dueDate}
                    showError={showError}
                  />
                  <CustomInput
                    label="Bank"
                    type="select"
                    name="bank"
                    placeholder="Enter Bank Name"
                    options={banks}
                      value={banks.find(
                      (option) => option.value === values.bank
                    )}
                    onChange={(selectedOption: any) =>
                      setFieldValue("bank", selectedOption.value)
                    }
                    error={touched.bank && errors.bank}
                    showError={showError}
                  />
                  <CustomInput
                    label="Currency"
                    name="currency"
                    type="select"
                    options={currencyOptions}
                    value={currencyOptions.find(
                      (option) => option.value === values.currency
                    )}
                    onChange={(selectedOption: any) =>
                      setFieldValue("currency", selectedOption.value)
                    }
                    error={touched.currency && errors.currency}
                    showError={showError}
                  />

                  <CustomInput
                    label="Drawdown Amount"
                    name="drawdownAmount"
                    placeholder="Enter Drawdown Amount"
                    value={values.drawdownAmount}
                    onChange={handleChange}
                    error={touched.drawdownAmount && errors.drawdownAmount}
                    showError={showError}
                  />

                  <CustomInput
                    label="Mode Of Conversion"
                    name="modeOfConversion"
                    type="select"
                    placeholder="Conversion Mode"
                    options={pcfcModeOfConversionOptions}
                    value={pcfcModeOfConversionOptions.find(
                      (opt) => opt.value === values.modeOfConversion
                    )}
                    onChange={(option: any) => {
                      setFieldValue("modeOfConversion", option.value);
                      setModeOfConversion(option.value);
                    }}
                    error={touched.modeOfConversion && errors.modeOfConversion}
                    showError={showError}
                  />
                  {modeOfConversion === "forward" && (
                    <>
                      {/* <CustomInput
                        label="Hedge Deal Ref No"
                        name="hedgeDealRefNo"
                        type="select"
                        placeholder="Select Hedge Deal Ref No"
                        options={forwardRegDataAllData.map((item:any) => ({
                          label: item.hedgeDealRefNo,
                          value: item.hedgeDealRefNo,
                        }))}
                        value={forwardRegDataAllData.find(
                          (opt:any) => opt.hedgeDealRefNo === values.hedgeDealRefNo
                        )}
                        onChange={(option: any) => {
                          const selectedData = forwardRegDataAllData.find(
                            (item:any) => item.hedgeDealRefNo === option.value
                          );
                          setFieldValue("hedgeDealRefNo", option.value);
                          if (selectedData) {
                            setFieldValue(
                              "outstandingAmount",
                              selectedData.outstandingAmount
                            );
                            setFieldValue("hedgeRate", selectedData.hedgeRate);
                            setFieldValue(
                              "deliveryDateFrom",
                              selectedData.deliveryDateFrom
                            );
                            setFieldValue(
                              "deliveryDateTo",
                              selectedData.deliveryDateTo
                            );
                          }
                        }}
                        error={touched.hedgeDealRefNo && errors.hedgeDealRefNo}
                        showError={showError}
                      /> */}

  <FormControl isInvalid={touched.hedgeDealRefNo && errors.hedgeDealRefNo}>
      <FormLabel>Hedge Deal Ref No</FormLabel>
      <Select
        placeholder="Select Hedge Deal Ref No"
        value={values.hedgeDealRefNo}
        onChange={(e) => {
          const selectedValue = e.target.value;
          const selectedData = forwardRegDataAllData.find(
            (item: any) => item.hedgeDealRefNo === selectedValue
          );
          setFieldValue("hedgeDealRefNo", selectedValue);
          if (selectedData) {
            setFieldValue(
              "outstandingAmount",
              selectedData.outstandingAmount
            );
            setFieldValue("hedgeRate", selectedData.hedgeRate);
            setFieldValue(
              "deliveryDateFrom",
              selectedData.deliveryDateFrom
            );
            setFieldValue(
              "deliveryDateTo",
              selectedData.deliveryDateTo
            );
          }
        }}
      >
        {forwardRegDataAllData.map((item: any) => (
          <option key={item.hedgeDealRefNo} value={item.hedgeDealRefNo}>
            {item.hedgeDealRefNo}
          </option>
        ))}
      </Select>
      {touched.hedgeDealRefNo && errors.hedgeDealRefNo && (
        <FormErrorMessage>{errors.hedgeDealRefNo}</FormErrorMessage>
      )}
    </FormControl>


                      <CustomInput
                        label="Outstanding Amount"
                        name="outstandingAmount"
                        value={values.outstandingAmount}
                        onChange={handleChange}
                        error={
                          touched.outstandingAmount && errors.outstandingAmount
                        }
                        showError={showError}
                        disabled={true}
                        // isReadOnly
                        />

                      <CustomInput
                        label="Hedge Rate"
                        name="hedgeRate"
                        value={values.hedgeRate}
                        onChange={handleChange}
                        error={touched.hedgeRate && errors.hedgeRate}
                        showError={showError}
                        disabled={true}
                        />

                      <CustomInput
                        label="Delivery Date From"
                        name="deliveryDateFrom"
                        type="date"
                        value={values.deliveryDateFrom}
                        onChange={handleChange}
                        error={
                          touched.deliveryDateFrom && errors.deliveryDateFrom
                        }
                        showError={showError}
                        disabled={true}
                        />

                      <CustomInput
                        label="Delivery Date To"
                        name="deliveryDateTo"
                        type="date"
                        value={values.deliveryDateTo}
                        onChange={handleChange}
                        error={touched.deliveryDateTo && errors.deliveryDateTo}
                        showError={showError}
                        disabled={true}
                      />

                  
                    </>
                  )}

                  {/* ✅ Spot Mode Section */}
                  {modeOfConversion === "spot" && (
                    <>
                      <CustomInput
                        label="Utilization Amount"
                        name="utilizationAmount"
                        value={values.utilizationAmount}
                        onChange={handleChange}
                        error={
                          touched.utilizationAmount && errors.utilizationAmount
                        }
                        showError={showError}
                      />
                      <CustomInput
                        label="Forward Premium"
                        name="forwardPremium"
                        value={values.forwardPremium}
                        onChange={handleChange}
                        error={touched.forwardPremium && errors.forwardPremium}
                        showError={showError}
                      />
                      <CustomInput
                        label="Cash/Tom Spot"
                        name="cashTomSpot"
                        value={values.cashTomSpot}
                        onChange={handleChange}
                        error={touched.cashTomSpot && errors.cashTomSpot}
                        showError={showError}
                      />
                          <CustomInput
                        label="Bank Margin"
                        name="bankMargin"
                        value={values.bankMargin}
                        onChange={handleChange}
                        error={touched.bankMargin && errors.bankMargin}
                        showError={showError}
                      />
                      <CustomInput
                        label="Net Settlement Rate"
                        name="netSettlementRate"
                        value={values.netSettlementRate}
                        onChange={handleChange}
                        error={
                          touched.netSettlementRate && errors.netSettlementRate
                        }
                        showError={showError}
                      />
                      <CustomInput
                        label="Amount Converted"
                        name="amountConverted"
                        value={values.amountConverted}
                        onChange={handleChange}
                        error={
                          touched.amountConverted && errors.amountConverted
                        }
                        showError={showError}
                      />
                      <CustomInput
                        label="Spot Booked"
                        name="spotBooked"
                        value={values.spotBooked}
                        onChange={handleChange}
                        error={touched.spotBooked && errors.spotBooked}
                        showError={showError}
                      />
                      <CustomInput
                        label="Net Conversion Rate"
                        name="netConversionRate"
                        value={values.netConversionRate}
                        onChange={handleChange}
                        error={
                          touched.netConversionRate &&
                          errors.netConversionRate
                        }
                        showError={showError}
                      />
                    </>
                  )}

                  {/* Common Fields */}
                  <CustomInput
                    label="Trade Ref No"
                    name="tradeReferenceNumber"
                    placeholder="Ref No"
                    value={values.tradeReferenceNumber}
                    onChange={handleChange}
                    error={
                      touched.tradeReferenceNumber &&
                      errors.tradeReferenceNumber
                    }
                    showError={showError}
                  />
                  <CustomInput
                    label="Drawdown Rate"
                    name="drawdownRate"
                    placeholder="Enter Drawdown Rate"
                    value={values.drawdownRate}
                    onChange={handleChange}
                    error={touched.drawdownRate && errors.drawdownRate}
                    showError={showError}
                  />
                  <CustomInput
                    label="Floating Interest Rate"
                    name="floatingInterestRate"
                    placeholder="Enter Interest Rate"
                    value={values.floatingInterestRate}
                    onChange={handleChange}
                    error={
                      touched.floatingInterestRate &&
                      errors.floatingInterestRate
                    }
                    showError={showError}
                  />
                  <CustomInput
                    label="Bank Spread"
                    name="bankSpread"
                    type="select"
                    placeholder="Enter Bank Spread"
                    options={bankSpreadOptions}
                     value={bankSpreadOptions.find(
                      (option) => option.value === values.bankSpread
                    )}
                    onChange={(selectedOption: any) =>
                      setFieldValue("bankSpread", selectedOption.value)
                    }
                    error={touched.bankSpread && errors.bankSpread}
                    showError={showError}
                  />
                  <CustomInput
                    label="Total Interest Rate"
                    name="totalInterestRate"
                    placeholder="Enter Interest Rate"
                    value={values.totalInterestRate}
                    onChange={handleChange}
                    error={
                      touched.totalInterestRate && errors.totalInterestRate
                    }
                    showError={showError}
                  />
                </SimpleGrid>

                <Flex justify="end">
                  <Button
                    rounded="full"
                    fontWeight={500}
                    {...primaryButtonStyle}
                    _hover={{ ...primaryButtonHoverStyle, border: "1px solid" }}
                    transition="transform 0.3s ease-in-out"
                    type="submit"
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

export default PCFCForm;
