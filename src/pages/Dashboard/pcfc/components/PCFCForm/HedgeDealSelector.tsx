import { useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CustomInput from "../../../../../config/component/CustomInput/CustomInput";

interface HedgeDealSelectorProps {
//   url: string;
  index: number; // required for FieldArray
  values: any; // forwardList[index]
  setFieldValue: any;
  touched: any;
  errors: any;
  showError: boolean;
  bank: string;
  businessUnit: string;
}

const HedgeDealSelector: React.FC<HedgeDealSelectorProps> = ({
//   url,
  index,
  values,
  setFieldValue,
  touched,
  errors,
  showError,
  bank,
  businessUnit
}) => {
  const [hedgeDeals, setHedgeDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const url = process.env.REACT_APP_FX_BASE_URL

  const fetchHedgeDeal = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${url}/forwardregister/hedgedealid/`,{
        bank: bank,
        businessUnit: businessUnit
      });
      if (response?.data?.status === "success") {
        setHedgeDeals(response.data.data || []);
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
  };

 

  useEffect(() => {
    fetchHedgeDeal();
  }, []);

  // Drop-down options
  const hedgeDealOptions = hedgeDeals.map((item: any) => ({
    label: item.hedgeDealRefNumber,
    value: item.hedgeDealRefNumber,
  }));

  const handleHedgeChange = (option: any) => {
    const selectedDeal = hedgeDeals.find(
      (d: any) => d.hedgeDealRefNumber === option.value
    );
    

    // Set selected Hedge Deal Ref
    setFieldValue(`forwardList.${index}.hedgeDealRefNo`, option.value);

    if (selectedDeal) {
      setFieldValue(
        `forwardList.${index}.outstandingAmount`,
        selectedDeal.outstandingAmount || ""
      );
      setFieldValue(
        `forwardList.${index}.hedgeRate`,
        selectedDeal.headgerate || ""
      );
      setFieldValue(
        `forwardList.${index}.deliveryDateFrom`,
        selectedDeal.deliveryDateFrom || ""
      );
      setFieldValue(
        `forwardList.${index}.deliveryDateTo`,
        selectedDeal.deliveryDateTo || ""
      );
    }
  };

  return (
    <>
      {/* Hedge Deal Dropdown */}
      <CustomInput
        label="Hedge Deal Ref No"
        name={`forwardList.${index}.hedgeDealRefNo`}
        type="select"
        placeholder={loading ? "Loading..." : "Select Reference No"}
        options={hedgeDealOptions}
        value={hedgeDealOptions.find(
          (opt) => opt.value === values.hedgeDealRefNo
        )}
        onChange={(selected) => handleHedgeChange(selected)}
        error={touched?.hedgeDealRefNo && errors?.hedgeDealRefNo}
        showError={showError}
      />

      {/* Auto-filled fields */}
      {values.hedgeDealRefNo && (
        <>
          <CustomInput
            label="Hedge Rate"
            name={`forwardList.${index}.hedgeRate`}
            value={values.hedgeRate}
            disabled
          />

          <CustomInput
            label="Delivery Date From"
            // type="date"
            name={`forwardList.${index}.deliveryDateFrom`}
            value={values.deliveryDateFrom}
            disabled
          />

          <CustomInput
            label="Delivery Date To"
            // type="date"
            name={`forwardList.${index}.deliveryDateTo`}
            value={values.deliveryDateTo}
            disabled
          />

          <CustomInput
            label="Outstanding Amount"
            name={`forwardList.${index}.outstandingAmount`}
            value={values.outstandingAmount}
            disabled
          />
        </>
      )}
    </>
  );
};

export default HedgeDealSelector;
