import { Button, Flex, Grid, Stack, useToast } from "@chakra-ui/react";
import axios from "axios";
import { FieldArray, useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import CustomInput from "../../../../config/component/CustomInput/CustomInput";

interface MultiHedgeDealExportProps {
  url: any;
  showError: boolean;
  exposureType?: string;
}

export const MultiHedgeDealExport: React.FC<MultiHedgeDealExportProps> = ({
  url,
  showError,
  exposureType
}) => {
  const { values, setFieldValue, touched, errors }: any = useFormikContext();
  const [hedgeDealsMaster, setHedgeDealsMaster] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchHedgeDeals = async () => {
    if (hedgeDealsMaster.length > 0) return;
    try {
      setLoading(true);
      const res = await axios.post(`${url}/forwardregister/hedgedealid/`,{
        exposureType: exposureType
      });
      if (res?.data?.status === "success") {
        setHedgeDealsMaster(res.data.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch hedge deals",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = async (push: any) => {
    if (hedgeDealsMaster.length === 0) {
      await fetchHedgeDeals();
    }
    push({
      hedgeDealRefNo: "",
      hedgeRate: "",
      deliveryDateFrom: "",
      deliveryDateTo: "",
      hedgeAmount: "",
      outstandingAmount: "",
      balanceAmount: "",
    });
  };

  const hedgeDealOptions = hedgeDealsMaster.map((item) => ({
    label: item.hedgeDealRefNumber,
    value: item.hedgeDealRefNumber,
  }));

  useEffect(() => {
    if (values?.hedgeDeals?.length > 0 && hedgeDealsMaster.length === 0) {
      fetchHedgeDeals();
    }
  }, [values?.hedgeDeals]);

  return (
    <FieldArray name="hedgeDeals">
      {({ push, remove }) => (
        <Stack spacing={6}>
          {values.hedgeDeals?.map((item: any, index: number) => {
            const base = `hedgeDeals.${index}`;

            return (
              <Grid
                key={index}
                p={4}
                gap={4}
                templateColumns={"1fr 1fr"}
                border="1px solid"
                borderColor="blue.200"
                borderRadius="lg"
              >
                <CustomInput
                  label="Hedge Deal Ref No"
                  name={`${base}.hedgeDealRefNo`}
                  type="select"
                  placeholder={loading ? "Loading..." : "Select Reference No"}
                  options={hedgeDealOptions}
                  value={
                    hedgeDealOptions.find(
                      (opt: any) => opt.value === item.hedgeDealRefNo,
                    ) || null
                  }
                  // value={hedgeDealOptions.find(
                  //   (opt: any) => opt.value === item.hedgeDealRefNo
                  // )}
                  onChange={(selected: any) => {
                    const deal = hedgeDealsMaster.find(
                      (d) => d.hedgeDealRefNumber === selected.value,
                    );

                    setFieldValue(`${base}.hedgeDealRefNo`, selected.value);

                    if (deal) {
                      setFieldValue(`${base}.hedgeRate`, deal.headgerate || "");
                      setFieldValue(
                        `${base}.deliveryDateFrom`,
                        deal.deliveryDateFrom || "",
                      );
                      setFieldValue(
                        `${base}.deliveryDateTo`,
                        deal.deliveryDateTo || "",
                      );
                      setFieldValue(
                        `${base}.outstandingAmount`,
                        deal.outstandingAmount || "",
                      );
                      setFieldValue(
                        `${base}.balanceAmount`,
                        deal.balanceAmount || "",
                      );
                    }
                  }}
                  error={
                    touched?.hedgeDeals?.[index]?.hedgeDealRefNo &&
                    errors?.hedgeDeals?.[index]?.hedgeDealRefNo
                  }
                  showError={showError}
                />

                <CustomInput
                  label="Hedge Rate"
                  name={`${base}.hedgeRate`}
                  value={item.hedgeRate}
                  disabled
                />

                <CustomInput
                  label="Delivery Date From"
                  name={`${base}.deliveryDateFrom`}
                  value={item.deliveryDateFrom}
                  disabled
                />

                <CustomInput
                  label="Delivery Date To"
                  name={`${base}.deliveryDateTo`}
                  value={item.deliveryDateTo}
                  disabled
                />

                <CustomInput
                  label="Hedge Amount"
                  name={`${base}.hedgeAmount`}
                  type="number"
                  placeholder="Enter Hedge Amount"
                  value={item.hedgeAmount}
                  // ADDED: Manual onChange to update the specific index in FieldArray
                  onChange={(e: any) =>
                    setFieldValue(`${base}.hedgeAmount`, e.target.value)
                  }
                />

                <CustomInput
                  label="Outstanding Amount"
                  name={`${base}.outstandingAmount`}
                  value={item.outstandingAmount}
                  disabled
                />

                <CustomInput
                  label="Balance Amount"
                  name={`${base}.balanceAmount`}
                  value={item.balanceAmount}
                  disabled
                />

                <Flex justify="flex-end" gridColumn="span 2">
                  <Button
                    size="sm"
                    colorScheme="red"
                    variant="outline"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                </Flex>
              </Grid>
            );
          })}

          <Flex justify={"end"}>
            <Button
              size="sm"
              colorScheme="blue"
              variant="outline"
              isLoading={loading}
              onClick={() => handleAddClick(push)}
            >
              + Add Hedge Deal
            </Button>
          </Flex>
        </Stack>
      )}
    </FieldArray>
  );
};
