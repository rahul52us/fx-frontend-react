"use client";
import { Box, Button, Flex, SimpleGrid, VStack } from "@chakra-ui/react";
import axios from "axios";
import { Formik, Form as FormikForm } from "formik";
import { useEffect, useState, useCallback } from "react";
import * as Yup from "yup";
import CustomInput from "../../../../config/component/CustomInput/CustomInput";
import {
  primaryButtonHoverStyle,
  primaryButtonStyle,
} from "../../../../globalStyles";
import AutoCalculation from "./AutoCalculate";
import { useStoreEdited } from "../../../../config/component/customHooks/useStoreEdited";
import { pickMatchedFields } from "../../utils/function";
import { extractFieldValue } from "../../../../config/constant/function";
import { getForwardCancellationInitialValues } from "./utils/constant";

const ForwardCancellationForm = ({ submitForm, editData,originalData,onClose }: any) => {
  const [forwardDeals, setForwardDeals] = useState<any[]>([]);
  const url = process.env.REACT_APP_FX_BASE_URL;
    const {storeEdited, editLoading} = useStoreEdited();
  const isEdit = Boolean(editData);

  // ---------------- Validation Schema ----------------
  const validationSchema = Yup.object().shape({
    transactionDate: Yup.string().required("Transaction Date is required"),
    forwardDealId: Yup.string().required("Forward Deal ID is required"),
    cancellationAmount: Yup.number().required("Cancellation Amount is required"),
    spotBooked: Yup.number().required("Spot Booked is required"),
    fwdPremium: Yup.number().required("Forward Premium is required"),
    cashTomSpot: Yup.number().required("Cash/Tom Spot is required"),
  });

  const fetchHedgeDealData = useCallback(async () => {
    try {
      const response = await axios.post(
        `${url}/forwardCancellationpcfc/dealid/`
      );

      if (response?.data?.status === "success") {
        const mappedData = response.data.data.map((item: any) => ({
          forwardDealId: item.forwardDealId,
          exposureType: item.exposureType,
          bank: item.bank,
          currency: item.currency,
          businessUnit: item.businessUnit,
          outstandingAmount: item.outstandingAmount,
          bookedRate: item.bookedRate,
          deliveryDateFrom: item.deliveryDateFrom,
          deliveryDateTo: item.deliveryDateTo,
          bankMargin: item.bankMargine, // 🔥 mapping fix
        }));

        setForwardDeals(mappedData);
      }
    } catch (error) {
      console.error("Error fetching hedge deal data:", error);
    }
  }, [url]);

  useEffect(() => {
    fetchHedgeDealData();
  }, [fetchHedgeDealData]);

  console.log('editData',editData)

  return (
    <Box bg="whiteAlpha.700">
      <Box p={5} mx="auto" px={2}>
        <Formik
          initialValues={getForwardCancellationInitialValues(editData)}
          validationSchema={validationSchema}
          enableReinitialize
                      onSubmit={async (values, actions) => {
                                          values = extractFieldValue(values)
                                          if (isEdit) {
                                            const { original, updated } = pickMatchedFields(
                                              originalData,
                                              values,
                                              editData?.rowId
                                            );
                              
                                            const payload = {
                                              register: "forwardCancellation",
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
                                          }
                                          // setShowError(true);
                                          submitForm(values, actions, "form");
                                        }}
        >
          {({
            values,
            handleChange,
            setFieldValue,
            isSubmitting,
            errors,
            touched,
          }) => (
            <FormikForm>
              <AutoCalculation />

              <VStack spacing={6} align="stretch">
                <SimpleGrid columns={[1, null, 2]} spacing={8}>
                  {/* Transaction Date */}
                  <CustomInput
                    label="Transaction Date"
                    name="transactionDate"
                    type="date"
                    value={values.transactionDate}
                    onChange={handleChange}
                    required
                    error={touched.transactionDate && errors.transactionDate}
                  />

                  {/* Forward Deal ID Dropdown */}
                  <CustomInput
                    label="Forward Deal ID"
                    name="forwardDealId"
                    type="select"
                    disabled={!forwardDeals.length}
                    placeholder={
                      forwardDeals.length ? "Select Forward Deal ID" : "Loading deals..."
                    }
                    options={forwardDeals.map((deal) => ({
                      label: deal.forwardDealId,
                      value: deal.forwardDealId,
                    }))}
                    value={
                      forwardDeals.find(
                        (d) => d.forwardDealId === values.forwardDealId
                      )
                        ? {
                          label: values.forwardDealId,
                          value: values.forwardDealId,
                        }
                        : null
                    }
                    onChange={(option: any) => {
                      const selected = forwardDeals.find(
                        (deal) => deal.forwardDealId === option.value
                      );

                      if (selected) {
                        Object.entries(selected).forEach(([key, value]) => {
                          setFieldValue(key, value);
                        });
                      }

                      setFieldValue("forwardDealId", option.value);
                    }}
                    error={touched.forwardDealId && errors.forwardDealId}
                  />


                  {/* Automated Fields */}
                  <CustomInput label="Exposure Type" name="exposureType" value={values.exposureType} disabled />
                  <CustomInput label="Bank" name="bank" value={values.bank || values.bank.value} disabled />
                  <CustomInput label="Currency" name="currency" value={values.currency} disabled />
                  <CustomInput label="Business Unit" name="businessUnit" value={values.businessUnit} disabled />
                  <CustomInput label="Outstanding Amount" name="outstandingAmount" value={values.outstandingAmount} disabled />
                  <CustomInput label="Booked Rate" name="bookedRate" value={values.bookedRate} disabled />
                  <CustomInput label="Delivery Date From" name="deliveryDateFrom" value={values.deliveryDateFrom} disabled />
                  <CustomInput label="Delivery Date To" name="deliveryDateTo" value={values.deliveryDateTo} disabled />

                  {/* Manual Fields */}
                  <CustomInput
                    label="Cancellation Amount"
                    name="cancellationAmount"
                    placeholder="Enter Cancellation Amount"
                    value={values.cancellationAmount}
                    onChange={handleChange}
                    error={touched.cancellationAmount && errors.cancellationAmount}
                  />

                  <CustomInput
                    label="Spot Booked"
                    name="spotBooked"
                    placeholder="Enter Spot Booked"
                    value={values.spotBooked}
                    onChange={handleChange}
                    error={touched.spotBooked && errors.spotBooked}
                  />

                  <CustomInput
                    label="Forward Premium"
                    name="fwdPremium"
                    placeholder="Enter Forward Premium"
                    value={values.fwdPremium}
                    onChange={handleChange}
                    error={touched.fwdPremium && errors.fwdPremium}
                  />

                  <CustomInput
                    label="Cash/Tom Spot"
                    name="cashTomSpot"
                    placeholder="Enter Cash/Tom Spot"
                    value={values.cashTomSpot}
                    onChange={handleChange}
                    error={touched.cashTomSpot && errors.cashTomSpot}
                  />

                  {/* Auto Calculated Fields */}
                  <CustomInput
                    label="Net Cancellation Rate"
                    name="netCancellationRate"
                    value={values.netCancellationRate}
                    placeholder="Auto-calculated"
                    disabled
                  />
                  <CustomInput label="Bank Margin" name="bankMargin" value={values.bankMargin} disabled />
                  {/* Conditional: Non-INR Currencies */}
                  {values.currency !== "INR" && (
                    <>
                      <CustomInput
                        label="Wash Rate"
                        name="washRate"
                        placeholder="Enter Wash Rate"
                        value={values.washRate}
                        onChange={handleChange}
                      />

                      <CustomInput
                        label="Profit & Loss on Cancellation (in FCY)"
                        name="plInFCY"
                        value={values.plInFCY}
                        placeholder="Auto-calculated"
                        disabled
                      />
                    </>
                  )}

                  {/* Always Visible */}
                  <CustomInput
                    label="Profit & Loss on Cancellation (in INR)"
                    name="plInINR"
                    value={values.plInINR}
                    placeholder="Auto-calculated"
                    disabled
                  />
                </SimpleGrid>

                {/* Submit Button */}
                <Flex justify="end">
                  <Button
                    rounded="full"
                    fontWeight={500}
                    {...primaryButtonStyle}
                    _hover={{ ...primaryButtonHoverStyle, border: "1px solid" }}
                    type="submit"
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

export default ForwardCancellationForm;