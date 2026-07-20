import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  SimpleGrid,
  VStack
} from "@chakra-ui/react";
import { FieldArray, useFormikContext } from "formik";
import { useEffect, useCallback } from "react";
import CustomInput from "../../../../../config/component/CustomInput/CustomInput";
import store from "../../../../../store/store";
import { forwardRegDataAllData } from "./dummyData";
import HedgeDealSelector from "./HedgeDealSelector";
import {
  computeSpotNetRate,
  createEmptySpotRow,
  getBankMarginFromForm,
} from "./utils/spotHelpers";

const ConversionManager = ({ showError }: any) => {
  // const { values, setFieldValue, errors, touched }: any = useFormikContext();
   const { values, setFieldValue, errors, touched }: any = useFormikContext();
  const { auth: { banksData } } = store;

  /* ------------ SPOT ROW CALCULATION ------------- */
  const handleSpotFieldChange = (
    index: number,
    field: string,
    value: any
  ) => {
    const currentRow = values.spotList?.[index] || {};
    const updatedRow = {
      ...currentRow,
      [field]: value,
    };

    updatedRow.netConversionRate = computeSpotNetRate(
      updatedRow.spotBooked,
      updatedRow.cashTomSpot,
      updatedRow.bankMargin
    );

    setFieldValue(`spotList.${index}`, updatedRow, false);
  };

  const getBankMargin = useCallback(
    () => getBankMarginFromForm(values.bank, banksData),
    [values.bank, banksData]
  );

  // Sync bank margin when spot is enabled, bank changes, or rows are added.
  // Intentionally omits full spotList from deps to avoid re-running on every keystroke.
  useEffect(() => {
    if (!values.isSpotEnabled || !values.spotList?.length) return;

    const margin = getBankMargin();
    if (!margin) return;

    let hasChanges = false;
    const updatedSpotList = values.spotList.map((row: any) => {
      const computedNetRate = computeSpotNetRate(
        row.spotBooked,
        row.cashTomSpot,
        margin
      );
      const normalizedMargin = String(margin);

      if (
        String(row.bankMargin ?? "") !== normalizedMargin ||
        String(row.netConversionRate ?? "") !== computedNetRate
      ) {
        hasChanges = true;
        return {
          ...row,
          bankMargin: normalizedMargin,
          netConversionRate: computedNetRate,
        };
      }

      return row;
    });

    if (hasChanges) {
      setFieldValue("spotList", updatedSpotList, false);
    }
  }, [
    values.isSpotEnabled,
    values.bank,
    values.spotList?.length,
    getBankMargin,
    setFieldValue,
  ]);

  const getEmptySpotRow = () => createEmptySpotRow(getBankMargin());

  /* ------------ FORWARD ROW CALCULATION ----------- */
  const handleForwardFieldChange = (
    index: number,
    field: string,
    value: any
  ) => {
    const currentRow = values.forwardList?.[index] || {};

    // if hedge ref changes, hydrate row from master
    if (field === "hedgeDealRefNo") {
      const selected = forwardRegDataAllData.find(
        (x: any) => x.hedgeDealRefNo === value
      );

      if (selected) {
        const updatedRow = {
          ...currentRow,
          hedgeDealRefNo: value,
          outstandingAmount: selected.outstandingAmount,
          hedgeRate: selected.hedgeRate,
          deliveryDateFrom: selected.deliveryDateFrom,
          deliveryDateTo: selected.deliveryDateTo,
        };

        const hedge = parseFloat(updatedRow.hedgeRate) || 0;
        const premium = parseFloat(updatedRow.forwardPremium) || 0;
        const cashTom = parseFloat(updatedRow.cashTomSpot) || 0;

        // Net Settlement = Hedge + Premium + Cash/Tom
        const net = hedge - premium - cashTom;
        updatedRow.netSettlementRate = net ? net.toFixed(4) : "0.0000";

        setFieldValue(`forwardList.${index}`, updatedRow);
        return;
      }
    }

    // normal field update
    const updatedRow = {
      ...currentRow,
      [field]: value,
    };

    const hedge = parseFloat(updatedRow.hedgeRate) || 0;
    const premium = parseFloat(updatedRow.forwardPremium) || 0;
    const cashTom = parseFloat(updatedRow.cashTomSpot) || 0;
    // const spotBooked = parseFloat(updatedRow.spotBooked) || 0;
    // const net = hedge + premium + cashTom;
    const net = hedge - premium - cashTom;
    updatedRow.netSettlementRate = net ? net.toFixed(4) : "0.0000";

    setFieldValue(`forwardList.${index}`, updatedRow);
  };

  return (
    <VStack spacing={6} align="stretch" w="full">
      {/* --------- SPOT SECTION --------- */}
      {values.isSpotEnabled && (
        <Box
          p={5}
          borderWidth="1px"
          borderColor="blue.200"
          bg="blue.50"
          rounded="lg"
        >
          <Flex justify="space-between" mb={4}>
            <Heading size="md" color="blue.700">
              Spot Details
            </Heading>
            <FieldArray name="spotList">
  {({ push }) => (
     <Button
      size="sm"
      leftIcon={<AddIcon />}
      colorScheme="blue"
      variant="outline"
      onClick={() => push(getEmptySpotRow())}  // ✅ always fresh margin
    >
      Add Spot Row
    </Button>
  )}
</FieldArray>
            {/* <FieldArray name="spotList">
              {({ push }) => (
                <Button
                  size="sm"
                  leftIcon={<AddIcon />}
                  colorScheme="blue"
                  variant="outline"
                  onClick={() =>
                    push({
                      amountConverted: "",
                      spotBooked: "",
                      cashTomSpot: "",
                      bankMargin: "",
                      netConversionRate: 0,
                    })
                  }
                >
                  Add Spot Row
                </Button>
              )}
            </FieldArray> */}
          </Flex>

          <FieldArray name="spotList">
            {({ remove }) => (
              <VStack spacing={4}>
                {values.spotList?.map((spot: any, index: number) => {
                  const spotTouched = (touched.spotList?.[index] as any) || {};
                  const spotErrors = (errors.spotList?.[index] as any) || {};

                  return (
                    <Box
                      key={index}
                      p={4}
                      bg="white"
                      rounded="md"
                      shadow="sm"
                      w="full"
                      position="relative"
                    >
                      <SimpleGrid columns={[1, 2, 3]} spacing={4}>
                  <CustomInput
                    label="Conversion Ref No"
                    name="conversionRefNo"
                    placeholder="Enter Conversion Ref No"
                    value={spot.conversionRefNo}
                      onChange={(e: any) =>
                            handleSpotFieldChange(
                              index,
                              "conversionRefNo",
                              e.target.value
                            )
                          }
                     error={touched.conversionRefNo && errors.conversionRefNo}
                     showError={showError}
                  />
                        <CustomInput
                          label="Amount Converted"
                          name={`spotList.${index}.amountConverted`}
                          placeholder="0"
                          value={spot.amountConverted}
                          onChange={(e: any) =>
                            handleSpotFieldChange(
                              index,
                              "amountConverted",
                              e.target.value
                            )
                          }
                          error={
                            spotTouched.amountConverted &&
                            spotErrors.amountConverted
                          }
                          showError={showError}
                        />

                        <CustomInput
                          label="Spot Booked"
                          name={`spotList.${index}.spotBooked`}
                          value={spot.spotBooked}
                          onChange={(e: any) =>
                            handleSpotFieldChange(
                              index,
                              "spotBooked",
                              e.target.value
                            )
                          }
                          error={
                            spotTouched.spotBooked && spotErrors.spotBooked
                          }
                          showError={showError}
                        />

                        <CustomInput
                          label="Cash/Tom Spot"
                          name={`spotList.${index}.cashTomSpot`}
                          value={spot.cashTomSpot}
                          onChange={(e: any) =>
                            handleSpotFieldChange(
                              index,
                              "cashTomSpot",
                              e.target.value
                            )
                          }
                          error={
                            spotTouched.cashTomSpot && spotErrors.cashTomSpot
                          }
                          showError={showError}
                        />

                        <CustomInput
                          label="Bank Margin"
                          name={`spotList.${index}.bankMargin`}
                          value={spot.bankMargin}
                          disabled
                          onChange={(e: any) =>
                            handleSpotFieldChange(
                              index,
                              "bankMargin",
                              e.target.value
                            )
                          }
                          // usually auto, but no validation for now
                          showError={showError}
                        />

                        <CustomInput
                          label="Net Conversion Rate"
                          name={`spotList.${index}.netConversionRate`}
                          value={spot.netConversionRate}
                          disabled={true}
                          showError={false}
                        />
                      </SimpleGrid>

                      {values.spotList.length > 1 && (
                        <IconButton
                          aria-label="Delete row"
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          position="absolute"
                          top={2}
                          right={2}
                          onClick={() => remove(index)}
                        />
                      )}
                    </Box>
                  );
                })}
              </VStack>
            )}
          </FieldArray>
        </Box>
      )}

      {/* --------- FORWARD SECTION --------- */}
      {values.isForwardEnabled && (
        <Box
          p={5}
          borderWidth="1px"
          borderColor="orange.200"
          bg="orange.50"
          rounded="lg"
        >
          <Flex justify="space-between" mb={4}>
            <Heading size="md" color="orange.700">
              Forward Details
            </Heading>
            <FieldArray name="forwardList">
              {({ push }) => (
                <Button
                  size="sm"
                  leftIcon={<AddIcon />}
                  colorScheme="orange"
                  variant="outline"
                  onClick={() =>
                    push({
                      hedgeDealRefNo: "",
                      outstandingAmount: "",
                      utilizationAmount: "",
                      hedgeRate: "",
                      forwardPremium: "",
                      cashTomSpot: "",
                      deliveryDateFrom: "",
                      deliveryDateTo: "",
                      netSettlementRate: 0,
                    })
                  }
                >
                  Add Forward Row
                </Button>
              )}
            </FieldArray>
          </Flex>

          <FieldArray name="forwardList">
            {({ remove }) => (
              <VStack spacing={4}>
                {values.forwardList?.map((fw: any, index: number) => {
                  return (
                    <Box
                      key={index}
                      p={4}
                      bg="white"
                      rounded="md"
                      shadow="sm"
                      w="full"
                      position="relative"
                    >
                        <SimpleGrid columns={[1, 2, 3]} spacing={4}>
  {/* New Hedge Deal Component */}
<HedgeDealSelector
  index={index}
  values={fw}
  bank={values.bank}
  businessUnit={values.businessUnit}
  // exposureType={values.exposureType}   // add this
  dueDate={values.dueDate}             // add this
  setFieldValue={setFieldValue}
  touched={touched.forwardList?.[index]}
  errors={errors.forwardList?.[index]}
  showError={showError}
/>

  <CustomInput
    label="Utilization Amount"
    name={`forwardList.${index}.utilizationAmount`}
    value={fw.utilizationAmount}
    onChange={(e: any) =>
      handleForwardFieldChange(
        index,
        "utilizationAmount",
        e.target.value
      )
    }
    error={
      touched.forwardList?.[index]?.utilizationAmount &&
      errors.forwardList?.[index]?.utilizationAmount
    }
    showError={showError}
  />
  <CustomInput
    label="Forward Premium"
    name={`forwardList.${index}.forwardPremium`}
    value={fw.forwardPremium}
    onChange={(e: any) =>
      handleForwardFieldChange(
        index,
        "forwardPremium",
        e.target.value
      )
    }
    error={
      touched.forwardList?.[index]?.forwardPremium &&
      errors.forwardList?.[index]?.forwardPremium
    }
    showError={showError}
  />

  <CustomInput
    label="Cash/Tom Spot"
    name={`forwardList.${index}.cashTomSpot`}
    value={fw.cashTomSpot}
    onChange={(e: any) =>
      handleForwardFieldChange(
        index,
        "cashTomSpot",
        e.target.value
      )
    }
    error={
      touched.forwardList?.[index]?.cashTomSpot &&
      errors.forwardList?.[index]?.cashTomSpot
    }
    showError={showError}
  />

  <CustomInput
    label="Net Settlement Rate"
    name={`forwardList.${index}.netSettlementRate`}
    value={fw.netSettlementRate}
    disabled={true}
  />
</SimpleGrid>
                      {values.forwardList.length > 1 && (
                        <IconButton
                          aria-label="Delete row"
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          position="absolute"
                          top={2}
                          right={2}
                          onClick={() => remove(index)}
                        />
                      )}
                    </Box>
                  );
                })}
              </VStack>
            )}
          </FieldArray>
        </Box>
      )}
    </VStack>
  );
};

export default ConversionManager;
