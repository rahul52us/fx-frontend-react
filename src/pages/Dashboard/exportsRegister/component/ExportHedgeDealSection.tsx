import axios from "axios";
import React, { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import CustomInput from "../../../../config/component/CustomInput/CustomInput";

interface HedgeDealSelectorProps {
  url: string | any;
  values: any;
  setFieldValue: (field: string, value: any) => void;
  touched: any;
  errors: any;
  showError: boolean;
  loading?: boolean;
}

export const HedgeDealSelector: React.FC<HedgeDealSelectorProps> = ({
  url,
  values,
  setFieldValue,
  touched,
  errors,
  showError,
}) => {
  const [hedgeDeals, setHedgeDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchHedgeDeal = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${url}/forwardregister/hedgedealid/`, {
        transactionDate: values?.dueDate || "",
        currency:
          typeof values?.currency === "object"
            ? values?.currency?.value ?? ""
            : values?.currency ?? "",
      });
      if (response?.data?.status === "success") {
        setHedgeDeals(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching hedge deals:", error);
      toast({
        title: "Error",
        description: "Failed to fetch hedge deals",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHedgeDeal();
  }, []);

  const hedgeDealOptions = hedgeDeals.map((item) => ({
    label: item.hedgeDealRefNumber,
    value: item.hedgeDealRefNumber,
  }));

  return (
    <>
      <CustomInput
        label="Hedge Deal Ref No"
        name="hedgeDealRefNo"
        type="select"
        placeholder={loading ? "Loading..." : "Select Reference No"}
        options={hedgeDealOptions}
        value={hedgeDealOptions.find(
          (option: any) => option.value === values.hedgeDealRefNo
        )}
        onChange={(selectedOption) => {
          const selectedDeal = hedgeDeals.find(
            (item: any) =>
              item.hedgeDealRefNumber === selectedOption.value
          );

          setFieldValue("hedgeDealRefNo", selectedOption.value);

          if (selectedDeal) {
            setFieldValue("hedgeRate", selectedDeal.headgerate || "");
            setFieldValue("deliveryDateFrom", selectedDeal.deliveryDateFrom || "");
            setFieldValue("deliveryDateTo", selectedDeal.deliveryDateTo || "");
            setFieldValue("outstandingAmount", selectedDeal.outstandingAmount || "");
            setFieldValue("balanceAmount", selectedDeal.balanceAmount || "");
          }
        }}
        error={touched.hedgeDealRefNo && errors.hedgeDealRefNo}
        showError={showError}
      />

      {values.hedgeDealRefNo && (
        <>
          <CustomInput
            label="Hedge Rate"
            name="hedgeRate"
            placeholder="Rate (Auto-populated)"
            value={values.hedgeRate}
            disabled
          />
          <CustomInput
            label="Delivery Date From"
            name="deliveryDateFrom"
            value={values.deliveryDateFrom}
            disabled
          />
          <CustomInput
            label="Delivery Date To"
            name="deliveryDateTo"
            value={values.deliveryDateTo}
            disabled
          />
          <CustomInput
            label="Hedge Amount"
            name="hedgeAmount"
            type="number"
            placeholder="Enter Hedge Amount"
            value={values.hedgeAmount}
            onChange={(e: any) => setFieldValue("hedgeAmount", e.target.value)}
          />
          <CustomInput
            label="Outstanding Amount"
            name="outstandingAmount"
            type="number"
            value={values.outstandingAmount}
            disabled
          />
          <CustomInput
            label="Balance Amount"
            name="balanceAmount"
            type="number"
            value={values.balanceAmount}
            disabled
          />
        </>
      )}
    </>
  );
};
