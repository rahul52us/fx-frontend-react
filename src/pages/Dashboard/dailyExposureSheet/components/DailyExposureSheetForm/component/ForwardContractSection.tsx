"use client";

import {
  Box,
  Button,
  Select as ChakraSelect,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { FieldArray, useFormikContext } from "formik";
import CustomInput from "../../../../../../config/component/CustomInput/CustomInput";
import { dummyForwardRegister } from "../utils/constent";

const ForwardContractSection = ({ showError }: any) => {
  const { values, setFieldValue, touched, errors }: any = useFormikContext();

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

  const handleSelectReference = (index: number, ref: string) => {
    const selected = dummyForwardRegister.find(
      (x) => x.hedgeDealRefNo === ref
    );
    if (!selected) return;

    setFieldValue(`forwardList.${index}`, {
      ...values.forwardList[index],
      hedgeDealRefNo: selected.hedgeDealRefNo,
      outstandingAmount: selected.outstandingAmount,
      hedgeRate: selected.hedgeRate,
      deliveryDateFrom: selected.deliveryDateFrom,
      deliveryDateTo: selected.deliveryDateTo,
    });
  };

  return (
    <Box p={5} borderWidth="1px" borderColor="pink.300" bg="pink.50" rounded="lg">
      <Flex justify="space-between" mb={4}>
        <Box fontWeight={700} fontSize="lg" color="pink.700">
          Forward Contract Settlement
        </Box>

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
      </Flex>

      <FieldArray name="forwardList">
        {({ remove }) => (
          <VStack spacing={4}>
            {values.forwardList?.map((row: any, index: number) => {
              const rowTouched = touched?.forwardList?.[index] || {};
              const rowErrors = errors?.forwardList?.[index] || {};

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
                  <SimpleGrid columns={[1, 2, 3]} spacing={4}>
                    <FormControl>
                      <FormLabel>Hedge Deal Ref No</FormLabel>
                      <ChakraSelect
                        placeholder="Select Hedge Ref"
                        value={row.hedgeDealRefNo}
                        onChange={(e) =>
                          handleSelectReference(index, e.target.value)
                        }
                      >
                        {dummyForwardRegister.map((item) => (
                          <option
                            key={item.hedgeDealRefNo}
                            value={item.hedgeDealRefNo}
                          >
                            {item.hedgeDealRefNo}
                          </option>
                        ))}
                      </ChakraSelect>
                    </FormControl>

                    <CustomInput
                      label="Outstanding Amount"
                      value={row.outstandingAmount}
                      name="outstandingAmount"
                      disabled
                    />

                    <CustomInput
                      label="Hedge Rate"
                      value={row.hedgeRate}
                      name="hedgeRate"
                      disabled
                    />

                    <CustomInput
                      label="Delivery Date From"
                      type="date"
                      name="deliveryDateFrom"
                      value={row.deliveryDateFrom}
                      disabled
                    />

                    <CustomInput
                      label="Delivery Date To"
                      type="date"
                      value={row.deliveryDateTo}
                      name="deliveryDateTo"
                      disabled
                    />

                    <CustomInput
                      label="Utilization Amount"
                      name={`forwardList.${index}.utilizationAmount`}
                      type="number"
                      value={row.utilizationAmount}
                      onChange={(e: any) =>
                        setFieldValue(
                          `forwardList.${index}.utilizationAmount`,
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
                      value={row.forwardPremium}
                      name="forwardPremium"
                      onChange={(e: any) =>
                        setFieldValue(
                          `forwardList.${index}.forwardPremium`,
                          e.target.value
                        )
                      }
                    />

                    <CustomInput
                      label="Cash/Tom Spot"
                      value={row.cashTomSpot}
                      name="cashTomSpot"
                      onChange={(e: any) =>
                        setFieldValue(
                          `forwardList.${index}.cashTomSpot`,
                          e.target.value
                        )
                      }
                    />

                    <CustomInput
                      label="Net Settlement Rate"
                      value={row.netSettlementRate}
                      disabled
                      name="netSettlementRate"
                    />
                  </SimpleGrid>

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
            })}
          </VStack>
        )}
      </FieldArray>
    </Box>
  );
};

export default ForwardContractSection;
