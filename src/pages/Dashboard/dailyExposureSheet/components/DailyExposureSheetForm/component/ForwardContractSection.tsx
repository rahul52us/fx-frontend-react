"use client";

import {
  Box,
  Button,
  Flex,
  IconButton,
  SimpleGrid,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { FieldArray, useFormikContext } from "formik";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import CustomInput from "../../../../../../config/component/CustomInput/CustomInput";

const ForwardContractSection = ({
  showError,
  businessUnit,
  bank,
  exposureType,
  documentDueDate
}: any) => {
  const { values, setFieldValue, touched, errors }: any =
    useFormikContext();

  const url = process.env.REACT_APP_FX_BASE_URL;
  const toast = useToast();

  const [hedgeDeals, setHedgeDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const emptyRow = {
    hedgeDealRefNo: "",
    outstandingAmount: "",
    utilizationAmount: "",
    hedgeRate: "",
    forwardPremium: "",
    cashTomSpot: "",
    deliveryDateFrom: "",
    deliveryDateTo: "",
    netSettlementRate: "",
  };

  // 🔹 Fetch Hedge Deals (POST)
  const fetchHedgeDeals = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${url}/forwardregister/hedgedealid/`,
        {
          bank,
          businessUnit,
          exposureType,
          documentDueDate
        }
      );

      if (res?.data?.status === "success") {
        setHedgeDeals(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching hedge deals:", error);
      toast({
        title: "Error",
        description: "Failed to fetch hedge deal list",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [bank, businessUnit, exposureType, documentDueDate, url, toast]);

  useEffect(() => {
    fetchHedgeDeals();
  }, [fetchHedgeDeals]);

  // 🔹 Select options
  const hedgeOptions = hedgeDeals.map((item: any) => ({
    label: item.hedgeDealRefNumber,
    value: item.hedgeDealRefNumber,
  }));

  // 🔹 Net Settlement Rate
  const calculateNetSettlementRate = (row: any) => {
    const hedgeRate = parseFloat(row.hedgeRate) || 0;
    const premium = parseFloat(row.forwardPremium) || 0;
    const cashTom = parseFloat(row.cashTomSpot) || 0;
    const net = hedgeRate + premium + cashTom;
    return net ? net.toFixed(4) : "0.0000";
  };

  // 🔹 On Hedge Ref Select
  const handleHedgeChange = (index: number, option: any) => {
    const selected = hedgeDeals.find(
      (x: any) => x.hedgeDealRefNumber === option?.value
    );
    if (!selected) return;

    const updatedRow = {
      ...values.forwardList[index],
      hedgeDealRefNo: selected.hedgeDealRefNumber,
      outstandingAmount: selected.outstandingAmount,
      hedgeRate: selected.headgerate,
      deliveryDateFrom: selected.deliveryDateFrom,
      deliveryDateTo: selected.deliveryDateTo,
    };

    updatedRow.netSettlementRate =
      calculateNetSettlementRate(updatedRow);

    setFieldValue(`forwardList.${index}`, updatedRow);
  };

  // 🔹 Generic change handler
  const handleChange = (
    index: number,
    field: string,
    value: any
  ) => {
    const updatedRow = {
      ...values.forwardList[index],
      [field]: value,
    };

    updatedRow.netSettlementRate =
      calculateNetSettlementRate(updatedRow);

    setFieldValue(`forwardList.${index}`, updatedRow);
  };

  // if(hedgeDeals.length === 0) return <Box></Box>;

  return (
    <Box
      p={5}
      borderWidth="1px"
      borderColor="pink.300"
      bg="pink.50"
      rounded="lg"
    >
      {/* Header */}
      <Flex justify="space-between" mb={4}>
        <Box fontWeight={700} fontSize="lg" color="pink.700">
          Forward Contract Settlement
        </Box>

{hedgeDeals && hedgeDeals.length > 0 && (
  
        <FieldArray name="forwardList">
          {({ push }) => (
            <Button
              leftIcon={<AddIcon />}
              variant="outline"
              colorScheme="pink"
              size="sm"
              onClick={() => push(emptyRow)}
            >
              Add Forward Row
            </Button>
          )}
        </FieldArray>
)}
      </Flex>

      {hedgeDeals.length === 0 && (
        <Box
          p={4}
          bg="white"
          shadow="sm"
          rounded="md"
          w="full"
          position="relative"
        >
          <Text textAlign={'center'} color="gray.400">
            No Hedge Deals found
          </Text>
        </Box>
      )}

      {/* Rows */}
      {hedgeDeals.length > 0 && (
        <>
      <FieldArray name="forwardList">
        {({ remove }) => (
          <VStack spacing={4}>
            {values.forwardList?.map(
              (row: any, index: number) => {
                const rowTouched =
                  touched?.forwardList?.[index] || {};
                const rowErrors =
                  errors?.forwardList?.[index] || {};

                return (
                  <Box
                    key={index}
                    p={4}
                    bg="white"
                    shadow="sm"
                    rounded="md"
                    w="full"
                    position="relative"
                  >
                    <SimpleGrid
                      columns={[1, 2, 3]}
                      spacing={4}
                    >
                      {/* Hedge Ref Select */}
                      <CustomInput
                        label="Hedge Deal Ref No"
                        name={`forwardList.${index}.hedgeDealRefNo`}
                        type="select"
                        placeholder={
                          loading
                            ? "Loading..."
                            : "Select Hedge Ref"
                        }
                        options={hedgeOptions}
                        value={hedgeOptions.find(
                          (opt) =>
                            opt.value === row.hedgeDealRefNo
                        )}
                        onChange={(selected) =>
                          handleHedgeChange(
                            index,
                            selected
                          )
                        }
                        error={
                          rowTouched.hedgeDealRefNo &&
                          rowErrors.hedgeDealRefNo
                        }
                        showError={showError}
                      />

                      {/* Auto-filled */}
                      <CustomInput
                        label="Outstanding Amount"
                        name={`forwardList.${index}.outstandingAmount`}
                        value={row.outstandingAmount}
                        disabled
                      />

                      <CustomInput
                        label="Hedge Rate"
                        name={`forwardList.${index}.hedgeRate`}
                        value={row.hedgeRate}
                        disabled
                      />

                      <CustomInput
                        label="Delivery Date From"
                        name={`forwardList.${index}.deliveryDateFrom`}
                        value={row.deliveryDateFrom}
                        disabled
                      />

                      <CustomInput
                        label="Delivery Date To"
                        name={`forwardList.${index}.deliveryDateTo`}
                        value={row.deliveryDateTo}
                        disabled
                      />

                      {/* Manual inputs */}
                      <CustomInput
                        label="Utilization Amount"
                        name={`forwardList.${index}.utilizationAmount`}
                        type="number"
                        value={row.utilizationAmount}
                        onChange={(e: any) =>
                          handleChange(
                            index,
                            "utilizationAmount",
                            e.target.value
                          )
                        }
                        error={
                          rowTouched.utilizationAmount &&
                          rowErrors.utilizationAmount
                        }
                        showError={showError}
                      />

                      <CustomInput
                        label="Forward Premium"
                        name={`forwardList.${index}.forwardPremium`}
                        value={row.forwardPremium}
                        onChange={(e: any) =>
                          handleChange(
                            index,
                            "forwardPremium",
                            e.target.value
                          )
                        }
                      />

                      <CustomInput
                        label="Cash/Tom Spot"
                        name={`forwardList.${index}.cashTomSpot`}
                        value={row.cashTomSpot}
                        onChange={(e: any) =>
                          handleChange(
                            index,
                            "cashTomSpot",
                            e.target.value
                          )
                        }
                      />

                      <CustomInput
                        label="Net Settlement Rate"
                        name={`forwardList.${index}.netSettlementRate`}
                        value={row.netSettlementRate}
                        disabled
                      />
                    </SimpleGrid>

                    {/* Delete */}
                    {values.forwardList.length > 1 && (
                      <IconButton
                        aria-label="Delete"
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
              }
            )}
          </VStack>
        )}
      </FieldArray>
        </>
      )}

      



    </Box>
  );
};

export default ForwardContractSection;
