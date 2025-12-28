"use client";

import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  SimpleGrid,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { FieldArray, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import CustomInput from "../../../../../../config/component/CustomInput/CustomInput";

const PCFCRepaymentSection = ({ showError }: any) => {
  const { values, setFieldValue, touched, errors }: any =
    useFormikContext();

  const toast = useToast();
  const url = process.env.REACT_APP_FX_BASE_URL;

  const [pcfcTradeRefs, setPcfcTradeRefs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const emptyRow = {
    tradeRefNumber: "",
    outstandingAmount: "",
    netDrawdownRate: "",
    dueDate: "",
    utilizationAmount: "",
    netSettlementRate: "",
  };

  // 🔹 Fetch PCFC Trade Ref Data (POST API)
  const fetchPCFCTradeRefs = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${url}/pcfcregister/traderefdata/`,
        {} // no payload as per current API
      );

      if (res?.data?.status === "success") {
        setPcfcTradeRefs(res.data.data || []);
      }
    } catch (error) {
      console.error("PCFC Trade Ref fetch error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch PCFC Trade Reference list",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPCFCTradeRefs();
  }, []);

  // 🔹 Dropdown options
  const tradeRefOptions = pcfcTradeRefs.map((item: any) => ({
    label: item.tradeRefNumber,
    value: item.tradeRefNumber,
  }));

  // 🔹 Net Settlement Rate (PCFC = Drawdown Rate)
  const calculateNetSettlementRate = (row: any) => {
    const rate = parseFloat(row.netDrawdownRate) || 0;
    return rate ? rate.toFixed(4) : "0.0000";
  };

  // 🔹 On Trade Ref select
  const handleTradeRefChange = (
    index: number,
    option: any
  ) => {
    const selected = pcfcTradeRefs.find(
      (x: any) => x.tradeRefNumber === option?.value
    );
    if (!selected) return;

    const updatedRow = {
      ...values.pcfcList[index],
      tradeRefNumber: selected.tradeRefNumber,
      outstandingAmount: selected.outstandingAmount,
      netDrawdownRate: selected.netDrawdownRate,
      dueDate: selected.dueDate,
    };

    updatedRow.netSettlementRate =
      calculateNetSettlementRate(updatedRow);

    setFieldValue(`pcfcList.${index}`, updatedRow);
  };

  // 🔹 Utilization change (manual)
  const handleUtilizationChange = (
    index: number,
    value: any
  ) => {
    const updatedRow = {
      ...values.pcfcList[index],
      utilizationAmount: value,
    };

    updatedRow.netSettlementRate =
      calculateNetSettlementRate(updatedRow);

    setFieldValue(`pcfcList.${index}`, updatedRow);
  };

  return (
    <Box
      p={5}
      borderWidth="1px"
      borderColor="orange.200"
      bg="orange.50"
      rounded="lg"
    >
      {/* Header */}
      <Flex justify="space-between" mb={4}>
        <Box fontWeight={700} fontSize="lg" color="orange.700">
          PCFC Repayment
        </Box>

        <FieldArray name="pcfcList">
          {({ push }) => (
            <Button
              leftIcon={<AddIcon />}
              variant="outline"
              colorScheme="orange"
              size="sm"
              onClick={() => push(emptyRow)}
            >
              Add PCFC Row
            </Button>
          )}
        </FieldArray>
      </Flex>

      {/* Rows */}
      <FieldArray name="pcfcList">
        {({ remove }) => (
          <VStack spacing={4}>
            {values.pcfcList?.map(
              (row: any, index: number) => {
                const rowTouched =
                  touched?.pcfcList?.[index] || {};
                const rowErrors =
                  errors?.pcfcList?.[index] || {};

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
                    <SimpleGrid
                      columns={[1, 2, 3]}
                      spacing={4}
                    >
                      {/* 🔹 Trade Ref Select */}
                      <CustomInput
                        label="Trade Ref No"
                        name={`pcfcList.${index}.tradeRefNumber`}
                        type="select"
                        placeholder={
                          loading
                            ? "Loading..."
                            : "Select Trade Ref No"
                        }
                        options={tradeRefOptions}
                        value={tradeRefOptions.find(
                          (opt) =>
                            opt.value === row.tradeRefNumber
                        )}
                        onChange={(selected) =>
                          handleTradeRefChange(
                            index,
                            selected
                          )
                        }
                        error={
                          rowTouched.tradeRefNumber &&
                          rowErrors.tradeRefNumber
                        }
                        showError={showError}
                      />

                      {/* 🔹 Auto-filled fields */}
                      <CustomInput
                        label="Outstanding Amount"
                        name={`pcfcList.${index}.outstandingAmount`}
                        value={row.outstandingAmount}
                        disabled
                      />

                      <CustomInput
                        label="Net Drawdown Rate"
                        name={`pcfcList.${index}.netDrawdownRate`}
                        value={row.netDrawdownRate}
                        disabled
                      />

                      <CustomInput
                        label="Due Date"
                        name={`pcfcList.${index}.dueDate`}
                        value={row.dueDate}
                        disabled
                      />

                      {/* 🔹 Manual Utilization */}
                      <CustomInput
                        label="Utilization Amount"
                        name={`pcfcList.${index}.utilizationAmount`}
                        type="number"
                        value={row.utilizationAmount}
                        onChange={(e: any) =>
                          handleUtilizationChange(
                            index,
                            e.target.value
                          )
                        }
                        error={
                          rowTouched.utilizationAmount &&
                          rowErrors.utilizationAmount
                        }
                        showError={showError}
                      />
                    </SimpleGrid>

                    {/* 🔹 Delete Row */}
                    {values.pcfcList.length > 1 && (
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
              }
            )}
          </VStack>
        )}
      </FieldArray>
    </Box>
  );
};

export default PCFCRepaymentSection;
